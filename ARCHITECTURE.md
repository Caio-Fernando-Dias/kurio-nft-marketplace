# Arquitetura e Contratos de Integração - Kurio NFT Marketplace

Este documento detalha os contratos REST, tratamento de erros, idempotência, eventos de tempo real, política de sessão, persistência e estratégia de cache do marketplace **Kurio**, em conformidade com as seções 5, 6, 7 e 12 do `README.md`.

---

## 1. Contratos REST (Seção 5)

A API REST é consumida pelo cliente Axios (`src/services/api.ts`) e interceptada na camada de rede pelo **Mock Service Worker (MSW)** (`src/mocks/handlers.ts`), garantindo consistência estrita em desenvolvimento, testes e demonstração.

### Matriz de Recursos e Operações Mínimas

| Recurso | Método HTTP | Rota | Descrição da Operação | Payload (Corpo) | Resposta de Sucesso |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Sessão e Conta** | `POST` | `/api/auth/register` | Cadastro de novo usuário | `{ username, email, password }` | `201 Created` `{ user, isAuthenticated: true }` |
| | `POST` | `/api/auth/login` | Autenticação com credenciais | `{ email, password }` | `200 OK` `{ user, isAuthenticated: true }` |
| | `GET` | `/api/auth/session` | Consulta do estado da sessão | - | `200 OK` `{ user, isAuthenticated: boolean }` |
| | `POST` | `/api/auth/logout` | Encerramento de sessão | - | `200 OK` `{ success: true }` |
| | `POST` | `/api/auth/expire` | Expiração simulada de sessão | - | `200 OK` `{ success: true, message: string }` |
| **NFTs** | `GET` | `/api/nfts` | Listagem com busca, filtros, ordenação e paginação | Query params: `search`, `collection`, `minPrice`, `maxPrice`, `network`, `category`, `sort`, `page`, `limit` | `200 OK` `{ items, total, page, totalPages, limit, counts }` |
| | `GET` | `/api/nfts/:id` | Detalhe completo por identificador | - | `200 OK` `NFT` |
| **Favoritos** | `GET` | `/api/favorites` | Consulta de favoritos do usuário | - | `200 OK` `{ favorites: string[], count: number, items: NFT[] }` |
| | `POST` | `/api/favorites/:id` | Inclusão ou alternância de favorito | - | `200 OK` `{ id: string, isFavorite: boolean }` |
| | `DELETE` | `/api/favorites/:id` | Remoção explícita de favorito | - | `200 OK` `{ id: string, isFavorite: false }` |
| **Carrinho** | `GET` | `/api/cart` | Consulta dos itens, contagem e totais | - | `200 OK` `CartResponse` |
| | `POST` | `/api/cart` | Inclusão de item no carrinho | `{ id: string, quantity?: number }` | `200 OK` `{ success: true, count: number }` |
| | `PUT` | `/api/cart/:id` | Alteração da quantidade do item | `{ quantity: number }` | `200 OK` `{ success: true, count: number }` |
| | `DELETE` | `/api/cart/:id` | Remoção do item do carrinho | - | `200 OK` `{ success: true, count: number }` |
| **Cotação** | `POST` | `/api/quote` | Validação de cupom, disponibilidade, taxas e total | `{ code?: string, items?: StoredCartItem[] }` | `200 OK` `{ valid, available, code, subtotalEth, discountEth, networkFeeEth, totalEth, message }` |
| **Pedidos** | `POST` | `/api/orders` | Criação idempotente de pedido | `{ subtotalEth, discountEth, networkFeeEth, totalEth, walletName, simulateRefusal? }` | `200 OK` `OrderResponse` (recibo) |
| | `GET` | `/api/orders/:id` | Consulta do estado e recibo do pedido | - | `200 OK` `OrderResponse` |
| **Perfil** | `GET` | `/api/profile` | Consulta dos dados cadastrais | - | `200 OK` `{ profile: User }` |
| | `PUT` | `/api/profile` | Atualização de dados cadastrais e avatar | `Partial<User>` | `200 OK` `{ success: true, profile: User }` |
| | `POST` | `/api/profile/password`| Alteração de senha de acesso | `{ currentPassword?, newPassword }` | `200 OK` `{ success: true, message: string }` |
| **Carteiras** | `GET` | `/api/wallets` | Consulta de carteiras vinculadas | - | `200 OK` `{ wallets: any }` |
| | `POST` | `/api/wallets` | Cadastro e vinculação de carteiras | `any[]` | `200 OK` `{ success: true, wallets: any }` |
| | `PUT` | `/api/wallets` | Atualização de carteiras e status ativo | `any[]` | `200 OK` `{ success: true, wallets: any }` |
| **Reset** | `POST` | `/api/reset` | Restaura estado e fixtures iniciais | - | `200 OK` `{ success: true, message: string }` |

---

## 2. Catálogo de Respostas e Códigos de Erro HTTP

Todos os erros retornam um corpo JSON estruturado no padrão `{ error: string, [detalhes] }` e status HTTP canônico:

| Código HTTP | Cenário de Erro | Exemplos de Ocorrência | Resposta Retornada |
| :--- | :--- | :--- | :--- |
| **400 Bad Request** | Validação de entrada inválida | • Senha com menos de 6 caracteres no cadastro ou troca de senha.<br>• Cupom de desconto inválido ou expirado em `/api/quote`.<br>• Transação recusada pela rede simulada (`simulateRefusal: true`). | `{"error": "A senha deve conter no mínimo 6 caracteres."}`<br>`{"valid": false, "error": "Cupom inválido ou expirado."}` |
| **401 Unauthorized** | Sessão inválida ou expirada | • Requisição a endpoints privados após invocação de `/api/auth/expire` ou token ausente. | `{"error": "Sessão inválida ou expirada."}` |
| **403 Forbidden** | Falta de permissão de acesso | • Tentativa de mutação de recursos protegidos sem o nível de privilégio requerido. | `{"error": "Acesso negado: permissão insuficiente."}` |
| **404 Not Found** | Recurso inexistente | • Busca de NFT com ID desconhecido em `/api/nfts/:id`.<br>• Acesso a rotas diretas inexistentes. | `{"error": "NFT não encontrado"}` |
| **409 Conflict** | Conflito de unicidade, disponibilidade ou idempotência | • E-mail já cadastrado na plataforma em `/api/auth/register`.<br>• Chave de idempotência reutilizada com payload divergente em `/api/orders`.<br>• NFT selecionado indisponível ou esgotado em `/api/quote`. | `{"error": "E-mail já cadastrado na plataforma."}`<br>`{"error": "Chave de idempotência reutilizada com payload divergente."}`<br>`{"error": "Um ou mais NFTs selecionados estão indisponíveis no momento."}` |
| **500 / 503 Service Unavailable**| Falha transitória do servidor ou indisponibilidade | • Simulação configurável via cabeçalho `X-Simulate-Error: 500` ou `503`. | `{"error": "Erro transitório do servidor."}` |

---

## 3. Política de Idempotência em Pedidos

Em conformidade com a seção 5:
1. Toda requisição para `POST /api/orders` aceita o cabeçalho `Idempotency-Key` (ex: `idem-1740000000-a8f2c`).
2. **Repetição idêntica**: Ao receber a mesma chave de idempotência com o mesmo payload, o backend MSW retorna o mesmo pedido gravado anteriormente (`OrderResponse`), sem reprocessar débito ou gerar duplicidades.
3. **Detecção de Conflito (409)**: Se a mesma `Idempotency-Key` for reutilizada com um payload com valores ou itens divergentes, a API rejeita com status `409 Conflict`:
   ```json
   { "error": "Chave de idempotência reutilizada com payload divergente." }
   ```
4. **Ciclo de vida do Carrinho**: Ao confirmar o pedido com sucesso, os itens correspondentes são removidos do carrinho e o evento de recibo fica disponível para consulta por `GET /api/orders/:id`.

---

## 4. Política de Sessão e Persistência do Carrinho

1. **Sessão**:
   - Armazenada em cache TanStack Query sob a chave `['auth', 'session']` com `staleTime: 15min`.
   - Persistida no navegador sob a chave `kurio_auth_user` para sustentar refresh de página.
   - O logout invalida todo o cache privado chamando `queryClient.clear()`.
2. **Carrinho**:
   - Persistido sob a chave `kurio_cart_items`.
   - Preserva os itens adicionados pelo visitante anônimo ao realizar login ou cadastro, garantindo continuidade do funil de conversão.
   - A confirmação de compra limpa o carrinho tanto em memória quanto no `localStorage`.
3. **Favoritos**:
   - Persistidos sob a chave `kurio_favorites` sincronizados com o catálogo.

---

## 5. Estratégia de Cache e Sincronização (TanStack Query)

| Query Key | Entidade | Stale Time | Política de Invalidação / Atualização |
| :--- | :--- | :--- | :--- |
| `['nfts', filters]` | Catálogo de NFTs | 60 segundos | Revalidado após alternância de favoritos ou alteração de filtros/ordenação |
| `['nft', id]` | Detalhe de NFT | 60 segundos | Atualização em segundo plano com suporte a acesso direto |
| `['cart']` | Carrinho do usuário | 0 segundos (ativo) | Invalidado ao adicionar, atualizar quantidade, remover item ou fechar pedido |
| `['auth', 'session']`| Sessão do usuário | 15 minutos | Atualizado via `setQueryData` no login/cadastro; limpo no logout |
| `['favorites']` | Lista de favoritos | 30 segundos | Atualização otimista imediata na UI com rollback em caso de falha |
| `['wallets']` | Carteiras conectadas | 5 minutos | Atualizado ao cadastrar ou alternar carteira ativa |

---

## 6. Mocking com MSW e Simulação em Tempo Real (Seção 6)

### 6.1 Arquitetura dos Mocks na Camada de Rede
- Implementado via **Mock Service Worker (MSW v3)** (`src/mocks/browser.ts` e `src/mocks/handlers.ts`).
- Nenhum componente React, hook ou cliente Axios utiliza fallbacks ou caminhos alternativos de negócio fictícios em código.
- Ativado por configuração (`import.meta.env.VITE_ENABLE_MOCKS !== 'false'`), permanecendo ativo por padrão tanto no desenvolvimento quanto no build de demonstração e testes Playwright.

### 6.2 Transporte Socket.IO e @mswjs/socket.io-binding
- **Integração Real**: A aplicação utiliza o `@mswjs/socket.io-binding` em conjunto com a API nativa de WebSocket do MSW (`ws.link(/^wss?:\/\/.*\/socket\.io\/.*/)`).
- **Transporte**: `websocket`. O cliente oficial `socket.io-client` abre a conexão WebSocket intercepted pelo Service Worker. O pacote decodifica e emite pacotes reais do Engine.IO/Socket.IO (ex: `42["nft.updated", payload]`), exercitando o cliente real em vez de atalhos manuais.
- **Limitações Documentadas no Ambiente de Mocks**:
  1. *Ambiente em Processo Único*: Como o MSW opera no contexto do navegador através do Service Worker, conexões WebSocket simultâneas entre abas distintas compartilham a instância local do worker, mas não um barramento de rede distribuído entre instâncias remotas.
  2. *Formato de Payload*: Utiliza serialização JSON em texto estruturado; transmissões binárias brutas (Buffers/ArrayBuffers) não são transmitidas nos mocks de eventos.
  3. *Reconexão e Heartbeats*: O pacote simula o handshake do Engine.IO v4; quedas de rede simuladas disparam o ciclo de reconexão do `socket.io-client` via `reconnectionAttempts`.

### 6.3 Cenários Determinísticos Disponíveis

Todos os cenários exigidos pela Seção 6 estão implementados e são selecionáveis por:
1. **URL Query Param**: `?scenario=<nome>`
2. **LocalStorage**: Chave `kurio_mock_scenario`
3. **Header HTTP**: `X-Scenario: <nome>`
4. **UI**: Painel flutuante `MockDevToolbar` (canto inferior esquerdo)
5. **Console/Window Helper**: `window.__setKurioScenario('<nome>')`

| Identificador do Cenário | Condição Simulada | Efeito na Interface e na Rede |
| :--- | :--- | :--- |
| `default` | Sucesso padrão | Respostas rápidas (~120ms) e consistentes |
| `empty_catalog` | Resultado vazio | `/api/nfts` retorna 0 itens para validar estados vazios de busca/filtros |
| `slow_network` | Lentidão extrema | Latência fixa de 2000ms para inspecionar skeletons e spinners |
| `variable_latency` | Latência variável | Respostas entre 150ms e 1350ms para avaliar tratamento de respostas fora de ordem |
| `network_error` | Falha de conexão | `HttpResponse.error()` simula falha física de rede/queda de internet |
| `server_error_500` | Erro interno | Retorna HTTP 500 com payload estruturado de erro |
| `service_unavailable_503` | Indisponibilidade | Retorna HTTP 503 com mensagem de serviço indisponível |
| `unauthorized_401` | Sessão expirada | Retorna HTTP 401 em rotas autenticadas, testando redirecionamento |
| `forbidden_403` | Falta de permissão | Retorna HTTP 403 em operações protegidas |
| `register_conflict_409` | Conflito de cadastro | Rejeita novo cadastro com status 409 informando duplicidade de e-mail |
| `invalid_coupon` | Cupom inválido | Rejeita código de cupom em `/api/quote` com HTTP 400 |
| `edition_sold_out` | Edição esgotada | Retorna HTTP 409 durante a cotação/compra para testar bloqueio |
| `order_timeout` | Timeout com idempotência | Simula 504 Gateway Timeout na 1ª tentativa; reenvio com mesma chave recupera pedido |
| `payment_refused` | Pagamento recusado | Retorna HTTP 400 simulando recusa pela operadora/rede blockchain |

### 6.4 Fixtures de Usuários de Teste

| Nome | E-mail | Senha Mock | Carteira Padrão |
| :--- | :--- | :--- | :--- |
| **Alexandre Silva** (Padrão) | `alexandre@kurio.art` | `kurio123` | `0x71C...4e89` (Ethereum) |
| **Beatriz Mendes** | `beatriz@kurio.art` | `kurio123` | `0x3F8...2b10` (Polygon) |
| *Cenário de Conflito* | `conflict@kurio.art` | - | Sempre dispara 409 Conflict |

---

## 7. Tempo Real com Socket.IO (Seção 7)

### 7.1 Eventos Mínimos Implementados

| Evento | Recurso Afetado | Identidade Estável | Propósito e Comportamento na UI |
| :--- | :--- | :--- | :--- |
| `nft.updated` | `'nft'` | `nftId` | Atualiza em tempo real o preço e disponibilidade no **Catálogo** (sem re-render total), no **Detalhe do NFT** e no **Carrinho** |
| `order.updated` | `'order'` | `orderId` | Atualiza o estado do pedido em tempo real (pendente, confirmado ou recusado) |

Ambos os eventos trafegam pelo protocolo Socket.IO no padrão:
```ts
export interface NFTUpdatedEvent {
  resource: 'nft'
  nftId: string
  priceEth: string
  oldPriceEth?: string
  title?: string
  availableQuantity: number
  version: number
  updatedAt: string
}

export interface OrderUpdatedEvent {
  resource: 'order'
  orderId: string
  userId?: string
  status: 'pending' | 'confirmed' | 'rejected'
  version: number
  updatedAt: string
}
```

### 7.2 Tratamento de Duplicatas e Eventos Obsoletos
- O hook [`RealtimeProvider`](src/context/RealtimeContext.tsx) mantém um registro em memória (`versionsRef`) das versões de eventos recebidas por entidade.
- Eventos com `version <= currentVersion` são imediatamente descartados, impedindo regressão de estado ou efeitos colaterais duplicados.

### 7.3 Reconciliação com REST e Reconexão
- Ao detectar reconexão (`connect` ou `reconnect`), o cliente dispara a invalidação e revalidação de recursos ativos (`['nfts']`, `['cart']`, `['orders']`, `['profile']`), garantindo que alterações ocorridas durante quedas transitórias sejam sincronizadas com o estado do servidor.

### 7.4 Isolamento por Usuário
- Eventos de pedido carregam `userId`. Caso pertençam a outro usuário ou a uma sessão anterior, são ignorados pelo cliente ativo, prevenindo vazamento de dados privados.

### 7.5 Cenário de Preço Alterado no Carrinho e Bloqueio de Checkout
1. Um NFT está no carrinho (ex.: `Emerald Ape #042`).
2. Seu preço é alterado em tempo real (via emissão de `nft.updated`).
3. O carrinho exibe um banner de aviso (`⚠️ Atualização em tempo real detectada`) e recalcula os totais em ETH automaticamente.
4. No Checkout ([`PaymentPage.tsx`](src/pages/PaymentPage.tsx)), a finalização da compra é bloqueada (`isOutdatedQuote: true`) com um alerta no topo exigindo que o usuário clique em **"Confirmar nova cotação"** antes de concluir a transação.

### 7.6 Interrupção de Conexão com Pedido Pendente
- Ao iniciar a compra, a chave de idempotência é persistida em `sessionStorage` (`kurio_pending_order_key`).
- Se a conexão cair ou a página for recarregada enquanto a transação estiver em processamento, a página recupera o estado terminal via `fetchOrderById` utilizando a mesma chave, apresentando o recibo de confirmação sem duplicar o pedido.
- Pedidos com status `confirmed` ou `rejected` são tratados como terminais.

---

## 8. Procedimento de Reset de Cenário

Para restabelecer todas as fixtures determinísticas e limpar dados de teste:
- Requisição `POST /api/reset` (ou botão no `MockDevToolbar`).
- O estado de usuários, senhas, carrinho inicial (3 itens padrão do protótipo), favoritos e pedidos armazenados é restaurado integralmente aos valores padrão do Figma.

---

## 9. Interface, Responsividade e Acessibilidade (Seção 8)

### 9.1 Responsividade em Viewports Canônicos (390px, 768px e 1440px)
A interface foi projetada com arquitetura fluida e adaptativa, com renderizações especializadas e consistentes com os arquivos de referência do Figma:
- **Desktop (1440px)**:
  - **Catálogo**: Barra lateral de filtros fixa (310px) e grid de 3 colunas (842px) com cards de 258px (`gap-x: 32px`, `gap-y: 72px`).
  - **Hero**: Carrossel com obra principal em destaque (450x450px) e especificações.
  - **Carrinho**: Tabela de itens com dimensões fixas (782px) e resumo do pedido (332px).
  - **Pagamento**: Duas colunas independentes (formulário cadastral e carteiras de 586px à esquerda; resumo de pedidos e itens de 440px à direita).
- **Tablet (768px)**:
  - Header adaptativo, grid de catálogo reorganizado em 2 colunas e transições suaves de preenchimento.
- **Mobile (390px - 414px)**:
  - **Catálogo**: Hero compacto estilizado conforme `Mobile_Inicio.css` (366x190px com gradientes e elipses), distribuição em 2 colunas escalonadas (`gap: 16px`, coluna direita com `pt-[32px]`), gaveta lateral de filtros móvel (`MobileFilterDrawer`) e navegação inferior fixa (`MobileBottomNav`).
  - **Carrinho**: Cards verticais de 100px com miniaturas dedicadas.
  - **Pagamento**: Cartões de carteira interativos (`role="radio"` com suporte a toque e teclado), opções de rede e resumo recolhível.
  - **Zoom e Ausência de Overflow**: Regra global `body { overflow-x: hidden; }` e tags meta viewport impedem corte indevido de conteúdo ou scroll horizontal mesmo sob zoom de 200%.

### 9.2 Skeletons com Shimmer Effect e Prevenção de CLS
- Implementados com a classe utilitária `.animate-shimmer` em gradiente linear (`#241612` → `#38220F` → `#241612`):
  1. **Catálogo**: [`NFTCardSkeleton.tsx`](src/components/home/NFTCardSkeleton.tsx) mantém exatamente as dimensões externas e proporções dos cards (3 colunas no desktop e 2 colunas escalonadas no mobile).
  2. **Detalhe**: [`NFTDetailSkeleton.tsx`](src/components/detail/NFTDetailSkeleton.tsx) preserva o bloco de artwork de 444x444px, miniaturas e coluna de dados no desktop, e o bloco de 358x370px no mobile.
  3. **Resumo do Carrinho**: [`CartSkeleton.tsx`](src/components/cart/CartSkeleton.tsx) espelha a tabela de 782px e a caixa de resumo de 332px.
- **Respeito ao `prefers-reduced-motion` (WCAG 2.3.3)**:
  - Declarado no `src/index.css`: sob preferência por redução de movimento, a animação `.animate-shimmer` é suspensa (`animation: none !important`), mantendo uma tonalidade sólida estável (`#241612`), além de zerar durações de transições.

### 9.3 Acessibilidade (a11y) e Conformidade WCAG
- **Navegação por Teclado e Foco Visível (WCAG 2.4.7)**:
  - Indicador global de foco `:focus-visible { outline: 2px solid #E89B55 !important; outline-offset: 2px !important; }` com contraste de destaque perceptível.
  - Elementos customizados interativos possuem `tabIndex={0}` e interceptam `Enter` e `Space` (`onKeyDown`).
- **Controle de Foco em Diálogos e Drawers (WCAG 2.4.3)**:
  - `OrderConfirmationModal`, `LoginModalDesktop` e `MobileFilterDrawer`:
    - Possuem semântica `role="dialog"`, `aria-modal="true"` e rótulos `aria-labelledby`.
    - Foco inicial automatizado no primeiro elemento interativo ao abrir.
    - Captura circular de foco (*focus trapping* com `Tab` / `Shift+Tab`).
    - Fechamento imediato com a tecla `Escape`.
    - Restauração de foco ao fechar para o elemento que originou a abertura.
- **Formulários e Semântica de Campos (WCAG 3.3.2 e 4.1.2)**:
  - Todos os formulários possuem vinculação estrita entre `<label htmlFor="id">` e `<input id="id">` / `<select id="id">`.
  - Campos sem rótulo textual visível (ex.: prefixo ENS, busca rápida) utilizam rótulos acessíveis com a classe `.sr-only` ou `aria-label`.
  - Mensagens de validação e erro são anunciadas a tecnologias assistivas via `role="alert"` e `aria-live="assertive"`.
- **Alternativas Textuais (WCAG 1.1.1)**:
  - Todas as tags `<img>` em catálogo, detalhes, miniaturas, perfil e resumo contêm atributo `alt` descritivo contextual (e `loading="lazy"` nas listagens de catálogo).
- **Contraste de Cores (WCAG 1.4.3)**:
  - Cores textuais principais (`#F5F1EB` e `#CFB28C`) sobre fundo escuro (`#140D0A`) atingem contraste superior a 7:1 (nível AAA).
  - Estados ativos/inativos são representados não apenas por cor, mas também por ícones gráficos (ex.: `Check`), badges de texto, espessura de borda e variações tipográficas.
- **Feedback em Tempo Real (WCAG 4.1.3)**:
  - Alertas de cotação atualizada em tempo real no carrinho e no checkout utilizam live regions acessíveis (`role="status"` ou `role="alert"` com `aria-live="polite"`).

---

## 10. Performance, Auditoria Lighthouse e Otimizações

A aplicação foi auditada rigorosamente via CLI do Lighthouse (v13.5.0) com Google Chrome 155 em ambiente de produção otimizado (`vite preview --port 4173`), seguindo todas as diretrizes da **Seção 10 do README.md**.

### Metas vs Resultados Consolidados (Medianas de 3 Execuções por Página/Perfil)

| Página / Perfil | Performance (Meta ≥ 90) | Acessibilidade (Meta ≥ 95) | Melhores Práticas (Meta ≥ 95) | SEO (Meta ≥ 90) | LCP (mediana) | CLS (mediana) | TBT (mediana) | Status |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Início — Desktop** | **95** | **100** | **96** | **92** | 1.35s | 0.000 | 51ms | Aprovado |
| **Início — Mobile** | **67** | **95** | **96** | **92** | 4.34s | 0.000 | 462ms | Concluído com justificativa |
| **Detalhe NFT — Desktop** | **98** | **100** | **96** | **92** | 0.94s | 0.000 | 0ms | Aprovado |
| **Detalhe NFT — Mobile** | **81** | **95** | **96** | **92** | 3.99s | 0.000 | 82ms | Concluído com justificativa |

### Análise das Métricas Core Web Vitals e Decisões de Engenharia

1. **Largest Contentful Paint (LCP < 1.4s no Desktop, 0.94s no Detalhe)**:
   - Imagens de capa de Hero e Detalhe carregadas com `loading="eager"`, `fetchPriority="high"`, `decoding="async"` e dimensões fixas no HTML (`width` e `height`), eliminando saltos de layout e forçando o Chrome preload scanner a baixá-las imediatamente.
2. **Cumulative Layout Shift (CLS = 0.000 em todos os testes)**:
   - Todas as imagens de artwork, carrosséis e avatares possuem contêineres rígidos com aspect-ratio reservado e dimensões explícitas.
   - Skeletons de carregamento replicam com fidelidade nanométrica as dimensões dos cards de catálogo e dos blocos de detalhe.
3. **Total Blocking Time (TBT = 0ms a 51ms no Desktop)**:
   - Configuração de `rollupOptions.output.manualChunks` dividindo as dependências em `vendor` (React/ReactDOM), `tanstack` (Router/Query) e `lucide` (ícones), evitando a execução de um megachunk no thread principal.
4. **Justificativa de Performance Mobile sob Emulação Lantern**:
   - O perfil mobile do Lighthouse simula CPU 4x mais lenta com throttling artificial de rede móvel (1.6 Mbps download / 150ms RTT) sobre o Service Worker do MSW e animações visuais ricas do layout Figma. Como determinado pelo README, a auditoria preserva todas as imagens e fontes reais sem simplificações artificiais. Em Detalhe Mobile, o resultado atinge 81 de Performance, enquanto Acessibilidade (≥95), Best Practices (≥96) e SEO (≥92) superam todas as metas estabelecidas em todos os perfis.
5. **Artefatos e Reprodutibilidade**:
   - Configuração versionada em `lighthouse/lighthouserc.json`.
   - Script executável: `npm run lighthouse` ou `npm run audit:lighthouse`.
   - 24 relatórios detalhados (12 HTMLs + 12 JSONs) arquivados em `lighthouse/reports/`.
   - Relatório sintético completo em `lighthouse/LIGHTHOUSE_REPORT.md`.

---

## 11. Testes Automatizados End-to-End com Playwright (Seção 9)

A suíte de testes ponta a ponta (E2E) foi construída com **Playwright**, assegurando que todas as regras de negócio, fluxos de conversão, resiliência de rede e acessibilidade funcionem de forma integrada.

### 11.1 Matriz de Cobertura dos 12 Fluxos Obrigatórios + Regressão Visual

A suíte contempla 13 especificações modulares:
1. **01 - Catálogo, Busca e Filtros Combinados**: Teste de busca textual com debounce, filtros de coleções, categorias e faixas de preço, ordenação e sincronização com a URL e histórico de navegação.
2. **02 - Detalhes do NFT e Tratamento 404**: Acesso direto a URL canônica `/detalhes/1`, validação de metadados, seleção de edições e recuperação graciosa em IDs inexistentes.
3. **03 - Fluxo Completo de Autenticação e Sessão**: Cadastro de novo usuário, login com validações de credenciais, exibição de avatar no Header, expiração de sessão com redirecionamento, logout e alternância de contas sem vazamento de estado.
4. **04 - Persistência de Favoritos e Rollback Otimista**: Alternância de favorito com persistência pós-refresh e teste de rollback do TanStack Query em caso de erro 500 da API.
5. **05 - Gerenciamento do Carrinho de Compras**: Alteração de quantidades, remoção de itens, aplicação de cupom de desconto válido (`KURIO10`), rejeição de código inválido e persistência entre sessões.
6. **06 - Funil de Compra Completa**: Conversão do início ao fim (catálogo ➔ carrinho ➔ checkout de pagamento ➔ confirmação com hash de blockchain no recibo e esvaziamento do carrinho).
7. **07 - Falhas de Pagamento e Idempotência**: Simulação de recusa de transação pela rede, mensagens de erro não bloqueantes, reenvio e envio estrito do cabeçalho `Idempotency-Key`.
8. **08 - Perfil do Colecionador e Carteiras**: Atualização de dados cadastrais, alteração de senha de acesso e vinculação/alternância de carteiras Web3 (Metamask, Coinbase, Phantom).
9. **09 - Atualizações em Tempo Real durante o Checkout**: Recepção de evento `nft.updated` via Socket.IO com item no carrinho, exibição do alerta de cotação desatualizada e recalcular totais.
10. **10 - Resiliência e Desconexão de Rede**: Desconexão temporária simulada, persistência de pedido pendente no `sessionStorage` e sincronização automática ao reconectar.
11. **11 - Acessibilidade por Teclado e Foco**: Navegação por `Tab`/`Shift+Tab`, contorno visível de foco (`:focus-visible`), acionamento por teclado e foco circular em modais/drawers com fechamento por `Escape`.
12. **12 - Skeletons e Recuperação de Erro**: Validação de skeletons com animação shimmer e botões de re-tentativa (`Tentar novamente`) em falhas 503.
13. **13 - Regressão Visual Responsiva**: Comparação automatizada de capturas de tela nos viewports canônicos de 1440px e 390px.

### 11.2 Isolamento Determinístico de Estado

- O helper [e2e/helpers/test-utils.ts](file:///home/caio-fernando-dias/%C3%81rea%20de%20trabalho/Marketplace%20de%20NFTs/e2e/helpers/test-utils.ts) implementa `resetBackendState(page)` acionado em cada `beforeEach`.
- Como o MSW intercepta o tráfego no navegador via Service Worker, o reset executa `fetch('/api/reset', { method: 'POST' })` no contexto do browser, garantindo que todo teste inicie a partir do estado idêntico e determinístico do protótipo Figma.
- O guia detalhado de testes está documentado em [e2e/README.md](file:///home/caio-fernando-dias/%C3%81rea%20de%20trabalho/Marketplace%20de%20NFTs/e2e/README.md).

