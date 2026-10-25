# Guia e Relatório de Testes End-to-End (E2E) — Playwright (Seção 9)

Este documento descreve a suíte completa de testes automatizados End-to-End (E2E) desenvolvida com **Playwright**, cobrindo os 12 fluxos obrigatórios de usuário, falhas simuladas, acessibilidade, tempo real e regressão visual exigidos pela **Seção 9 do README.md**.

---

## 1. Configuração e Ambiente de Execução

- **Framework:** `@playwright/test` (v1.64+)
- **Navegador Base:** Chromium
- **Perfis de Viewport Suportados:**
  - **Desktop:** `1440 x 900` px (perfil canônico de desktop do Figma)
  - **Mobile:** `390 x 844` px (perfil de viewport móvel moderno)
- **Servidor Integrado:** `http://localhost:5173` (iniciado automaticamente via `webServer` no [playwright.config.ts](file:///home/caio-fernando-dias/%C3%81rea%20de%20trabalho/Marketplace%20de%20NFTs/playwright.config.ts))
- **Camada de Dados / Mocking:** **Mock Service Worker (MSW 3.0)** executado no contexto do Service Worker do navegador, garantindo fidelidade de rede e comportamento idêntico ao ambiente de produção.
- **Relatórios e Evidências:** Relatório HTML interativo gerado em `playwright-report/` com gravação de *traces*, screenshots e vídeos em caso de falha.

---

## 2. Matriz de Cobertura dos 12 Fluxos Obrigatórios

A suíte está estruturada em 13 arquivos de especificação numerados cronologicamente:

| Nº | Arquivo de Teste | Fluxo Coberto | Descrição e Validações Principais |
| :---: | :--- | :--- | :--- |
| **01** | [`01-catalog-search-filters.spec.ts`](file:///home/caio-fernando-dias/%C3%81rea%20de%20trabalho/Marketplace%20de%20NFTs/e2e/01-catalog-search-filters.spec.ts) | **Catálogo e Busca** | Valida digitação no campo de busca com debounce, filtros combinados na barra lateral (coleções, faixas de preço, redes), abas de categoria, ordenação e sincronização bidirecional com a URL (query params) e navegação pelo histórico (`Voltar`/`Avançar`). |
| **02** | [`02-detail-direct-access.spec.ts`](file:///home/caio-fernando-dias/%C3%81rea%20de%20trabalho/Marketplace%20de%20NFTs/e2e/02-detail-direct-access.spec.ts) | **Detalhes e 404** | Acesso direto a URL profunda (`/detalhes/:id`), carregamento de metadados, seleção de edições, galeria e tratamento amigável de recurso inexistente (404) com botão de recuperação. |
| **03** | [`03-auth-session-flow.spec.ts`](file:///home/caio-fernando-dias/%C3%81rea%20de%20trabalho/Marketplace%20de%20NFTs/e2e/03-auth-session-flow.spec.ts) | **Autenticação e Sessão** | Cadastro de novo colecionador, login com validações de credenciais, exibição de avatar no Header, expiração simulada de sessão com redirecionamento, logout e alternância de usuário sem vazamento de estado. |
| **04** | [`04-favorites-persistence.spec.ts`](file:///home/caio-fernando-dias/%C3%81rea%20de%20trabalho/Marketplace%20de%20NFTs/e2e/04-favorites-persistence.spec.ts) | **Favoritos e Rollback** | Inclusão e remoção de favoritos com persistência após reload da página e teste de rollback otimista no TanStack Query quando a API retorna erro 500. |
| **05** | [`05-cart-management.spec.ts`](file:///home/caio-fernando-dias/%C3%81rea%20de%20trabalho/Marketplace%20de%20NFTs/e2e/05-cart-management.spec.ts) | **Gestão do Carrinho** | Alteração de quantidade de itens, remoção de itens, aplicação de cupom promocional válido (`KURIO10`), rejeição de cupom inválido, cálculo de taxas de rede e persistência do carrinho após refresh e login. |
| **06** | [`06-full-purchase-flow.spec.ts`](file:///home/caio-fernando-dias/%C3%81rea%20de%20trabalho/Marketplace%20de%20NFTs/e2e/06-full-purchase-flow.spec.ts) | **Funil de Compra Completo** | Jornada completa: catálogo ➔ carrinho ➔ tela de pagamento ➔ confirmação de transação ➔ abertura do modal de recibo com hash da transação, dados do pedido e esvaziamento do carrinho. |
| **07** | [`07-payment-failures-idempotency.spec.ts`](file:///home/caio-fernando-dias/%C3%81rea%20de%20trabalho/Marketplace%20de%20NFTs/e2e/07-payment-failures-idempotency.spec.ts) | **Falhas de Pagamento e Idempotência** | Simulação de recusa de transação na blockchain (`simulateRefusal: true`), mensagem clara de erro sem perda do carrinho, reenvio da tentativa e envio obrigatório do cabeçalho `Idempotency-Key`. |
| **08** | [`08-profile-wallets.spec.ts`](file:///home/caio-fernando-dias/%C3%81rea%20de%20trabalho/Marketplace%20de%20NFTs/e2e/08-profile-wallets.spec.ts) | **Perfil e Carteiras** | Atualização cadastral (nome, bio, avatar), troca de senha de acesso com validação de senha atual e vinculação de carteiras (Metamask, Coinbase, Phantom) com alternância de carteira ativa. |
| **09** | [`09-realtime-checkout.spec.ts`](file:///home/caio-fernando-dias/%C3%81rea%20de%20trabalho/Marketplace%20de%20NFTs/e2e/09-realtime-checkout.spec.ts) | **Tempo Real no Checkout** | Disparo do evento `nft.updated` via Socket.IO alterando o preço de um item presente no carrinho durante o checkout; validação do banner de alerta e atualização da cotação. |
| **10** | [`10-realtime-network-resilience.spec.ts`](file:///home/caio-fernando-dias/%C3%81rea%20de%20trabalho/Marketplace%20de%20NFTs/e2e/10-realtime-network-resilience.spec.ts) | **Resiliência e Desconexão** | Simulação de perda de conectividade com Socket.IO, persistência do pedido pendente no sessionStorage e reconciliação automática com a API REST ao reconectar. |
| **11** | [`11-a11y-keyboard-navigation.spec.ts`](file:///home/caio-fernando-dias/%C3%81rea%20de%20trabalho/Marketplace%20de%20NFTs/e2e/11-a11y-keyboard-navigation.spec.ts) | **Acessibilidade por Teclado** | Navegação por `Tab` e `Shift+Tab`, anel de foco visível (`:focus-visible`), acionamento por `Enter`/`Space`, captura de foco (*focus trapping*) e fechamento por `Escape` em modais e gavetas. |
| **12** | [`12-skeletons-and-error-recovery.spec.ts`](file:///home/caio-fernando-dias/%C3%81rea%20de%20trabalho/Marketplace%20de%20NFTs/e2e/12-skeletons-and-error-recovery.spec.ts) | **Skeletons e Recuperação** | Exibição de skeletons com efeito shimmer durante carregamento e telas de erro com botão de repetição (`Tentar novamente`) em caso de resposta 503 da API. |
| **13** | [`13-visual-regression.spec.ts`](file:///home/caio-fernando-dias/%C3%81rea%20de%20trabalho/Marketplace%20de%20NFTs/e2e/13-visual-regression.spec.ts) | **Regressão Visual** | Comparação de capturas de tela (*snapshots*) do layout responsivo em 1440px e 390px, garantindo fidelidade contínua contra alterações não intencionais no CSS. |

---

## 3. Isolamento e Reset Determinístico de Estado

Para garantir que cada teste execute em um ambiente limpo e previsível, foi criado o utilitário [e2e/helpers/test-utils.ts](file:///home/caio-fernando-dias/%C3%81rea%20de%20trabalho/Marketplace%20de%20NFTs/e2e/helpers/test-utils.ts):

- **Reset de Estado no `beforeEach`:**
  ```typescript
  test.beforeEach(async ({ page }) => {
    await resetBackendState(page)
  })
  ```
  O método `resetBackendState` dispara um `fetch('/api/reset', { method: 'POST' })` diretamente de dentro da página controlada pelo Playwright. Como o MSW intercepta o tráfego no navegador via Service Worker, todas as fixtures (usuários, sessões, pedidos e catálogo) retornam ao estado padrão do Figma.
- **Seleção de Cenários de Falha:**
  A função auxiliar `setScenario(page, 'server_error_500' | 'payment_declined' | 'empty_catalog')` permite configurar dinamicamente o comportamento de erro do backend simulado para testar recuperação e resiliência da UI.
- **Emissão de Eventos de Tempo Real:**
  As funções `emitNFTUpdate(page, { id, priceEth })` e `emitOrderUpdate(page, { orderId, status })` injetam mensagens simuladas de WebSocket no runtime do navegador para validar a reação imediata da interface.

---

## 4. Instruções e Comandos de Execução

Todos os comandos de teste estão integrados no `package.json`:

```bash
# Executa todos os testes E2E em modo headless (Chromium Desktop e Mobile)
npm run test:e2e

# Executa apenas uma suíte específica (ex.: Catálogo)
npx playwright test e2e/01-catalog-search-filters.spec.ts

# Executa apenas no perfil de Desktop (1440x900)
npx playwright test --project=chromium-desktop

# Executa apenas no perfil Mobile (390x844)
npx playwright test --project=chromium-mobile

# Executa com interface visual interativa (Playwright UI Mode)
npx playwright test --ui

# Abre o relatório HTML detalhado da última execução
npx playwright show-report
```
