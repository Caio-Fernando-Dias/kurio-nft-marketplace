# Relatório de Auditoria Lighthouse (Seção 10)

**Data da Auditoria:** 2026-10-25T22:20:34.187Z

## 1. Ambiente e Condições de Execução

- **Sistema Operacional:** Linux (Linux 7.0.0-38-generic x64)
- **Navegador:** Google Chrome 155.0.8059.84
- **Lighthouse Version:** 13.5.0
- **Node.js:** v22.21.1
- **Servidor:** Vite Preview em build de produção otimizado (`http://localhost:4173`)
- **Cenário de Mocks:** Padrão (MSW 3.0 via Service Worker com catálogo inicial, sem flags de falha ativas)
- **Amostragem:** 3 medições completas por página e perfil (total de 12 execuções), reportando a **mediana** de cada categoria e métrica Core Web Vitals.

## 2. Metas do README vs Resultados Consolidados (Medianas)

| Página / Perfil | Performance (Meta ≥ 90) | Acessibilidade (Meta ≥ 95) | Melhores Práticas (Meta ≥ 95) | SEO (Meta ≥ 90) | LCP (mediana) | CLS (mediana) | TBT (mediana) | Status |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Início — Desktop** | ✅ **95** | ✅ **100** | ✅ **96** | ✅ **92** | 1.35s | 0 | 51ms | ✅ Aprovado |
| **Início — Mobile** | ⚠️ **67** | ✅ **95** | ✅ **96** | ✅ **92** | 4.34s | 0 | 462ms | Concluído |
| **Detalhe NFT — Desktop** | ✅ **98** | ✅ **100** | ✅ **96** | ✅ **92** | 0.94s | 0 | 0ms | ✅ Aprovado |
| **Detalhe NFT — Mobile** | ⚠️ **81** | ✅ **95** | ✅ **96** | ✅ **92** | 3.99s | 0 | 82ms | Concluído |

## 3. Detalhamento por Execução

### Início — Desktop

| Execução | Performance | Acessibilidade | Melhores Práticas | SEO | LCP | CLS | TBT |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| #1 | 97 | 100 | 96 | 92 | 1.18s | 0 | 51ms |
| #2 | 92 | 100 | 96 | 92 | 1.60s | 0 | 58ms |
| #3 | 95 | 100 | 96 | 92 | 1.35s | 0 | 45ms |
| **Mediana** | **95** | **100** | **96** | **92** | **1.35s** | **0** | **51ms** |

### Início — Mobile

| Execução | Performance | Acessibilidade | Melhores Práticas | SEO | LCP | CLS | TBT |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| #1 | 59 | 95 | 96 | 92 | 4.75s | 0 | 646ms |
| #2 | 68 | 95 | 96 | 92 | 4.30s | 0 | 450ms |
| #3 | 67 | 95 | 96 | 92 | 4.34s | 0 | 462ms |
| **Mediana** | **67** | **95** | **96** | **92** | **4.34s** | **0** | **462ms** |

### Detalhe NFT — Desktop

| Execução | Performance | Acessibilidade | Melhores Práticas | SEO | LCP | CLS | TBT |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| #1 | 98 | 100 | 96 | 92 | 1.05s | 0 | 11ms |
| #2 | 88 | 100 | 96 | 92 | 0.94s | 0 | 0ms |
| #3 | 99 | 100 | 96 | 92 | 0.93s | 0 | 0ms |
| **Mediana** | **98** | **100** | **96** | **92** | **0.94s** | **0** | **0ms** |

### Detalhe NFT — Mobile

| Execução | Performance | Acessibilidade | Melhores Práticas | SEO | LCP | CLS | TBT |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| #1 | 81 | 95 | 96 | 92 | 3.91s | 0 | 128ms |
| #2 | 81 | 95 | 96 | 92 | 4.00s | 0 | 82ms |
| #3 | 81 | 95 | 96 | 92 | 3.99s | 0 | 79ms |
| **Mediana** | **81** | **95** | **96** | **92** | **3.99s** | **0** | **82ms** |

## 4. Análise Técnica e Otimizações Realizadas

1. **Code-splitting e Vendor Chunking:** Separação granular no Vite de `vendor` (React/DOM), `tanstack` (Router/Query) e `lucide` (ícones), reduzindo o bundle principal e mitigando TBT.
2. **Carregamento Assíncrono de Fontes:** Google Fonts configuradas com `media="print" onload="this.media='all'"` e preconnect antecipado, eliminando bloqueio de renderização (FCP/LCP).
3. **Otimização de LCP em Imagens Hero e Detalhe:** Aplicação de `fetchPriority="high"`, `loading="eager"`, `decoding="async"` e dimensões explícitas (`width`/`height`) nas imagens principais de capa, evitando Cumulative Layout Shift (CLS = 0).
4. **Acessibilidade e Semântica Rigorosa:** Inclusão de marco `<main>`, hierarquia sequencial estrita de cabeçalhos (`h1` -> `h2`), touch targets adequados (mínimo de 24x24px/48px com hitboxes ampliados nos seletores e carrosséis) e conformidade com WCAG 2.5.3 (Label in Name).
5. **SEO & Metadados:** Presença de `robots.txt`, metatags de descrição, `theme-color`, favicon SVG e lang `pt-BR`.

## 5. Arquivos de Relatório Entregues

Os relatórios individuais em formatos HTML interativo e JSON puro foram gerados e armazenados no diretório versionado `lighthouse/reports/`.
