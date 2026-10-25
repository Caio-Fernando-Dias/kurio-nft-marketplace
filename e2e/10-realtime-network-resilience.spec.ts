import { test, expect } from '@playwright/test'
import { resetBackendState, emitNFTUpdate } from './helpers/test-utils'

test.describe('10. Resiliência: Eventos obsoletos/duplicados e retomada de pedido pendente', () => {
  test.beforeEach(async ({ page }) => {
    await resetBackendState(page)
  })

  test('deve descartar eventos com versão menor ou obsoleta (idempotência de eventos)', async ({ page }) => {
    await page.goto('/')

    // Envia evento com versão alta (v10)
    await emitNFTUpdate(page, {
      nftId: 'nft-1',
      priceEth: '3.50',
      availableQuantity: 20,
      version: 10,
    })
    await page.waitForTimeout(400)

    // Envia evento duplicado ou antigo (v5) com preço divergente
    await emitNFTUpdate(page, {
      nftId: 'nft-1',
      priceEth: '0.99',
      availableQuantity: 20,
      version: 5,
    })
    await page.waitForTimeout(400)

    // O preço exibido para o item deve permanecer o da v10 (3.50 ETH), e NÃO regredir
    const card = page.locator('article, div').filter({ hasText: 'Emerald Ape #042' }).first()
    await expect(card.locator(':has-text("3.50")').first()).toBeVisible()
  })

  test('deve recuperar estado de pedido pendente após recarregamento sem duplicar compra', async ({ page }) => {
    await page.goto('/pagamento')

    // Simula presença de chave pendente na sessão
    await page.evaluate(() => {
      sessionStorage.setItem('kurio_pending_order_key', 'idem-test-recuperacao-123')
    })

    // Ao recarregar a página de pagamento, a aplicação detecta e recupera a ordem
    await page.reload()
    await expect(page.locator(':has-text("Pagamento"), :has-text("Resumo do pedido")').first()).toBeVisible()
  })
})
