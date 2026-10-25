import { test, expect } from '@playwright/test'
import { resetBackendState, emitNFTUpdate } from './helpers/test-utils'

test.describe('9. Tempo Real com Socket.IO: Alteração de preço durante o checkout e bloqueio de cotação', () => {
  test.beforeEach(async ({ page }) => {
    await resetBackendState(page)
  })

  test('deve bloquear finalização de compra e exigir confirmação ao receber alteração de preço em tempo real', async ({ page }) => {
    await page.goto('/pagamento')

    // Verifica que a página de pagamento carregou normalmente
    const confirmBtn = page.locator('button:has-text("Confirmar compra")').locator('visible=true').first()
    await expect(confirmBtn).toBeVisible()
    await expect(confirmBtn).toBeEnabled()

    // Dispara alteração de preço em tempo real via Socket.IO para o item nft-1 presente no carrinho
    await emitNFTUpdate(page, {
      nftId: 'nft-1',
      priceEth: '4.85',
      availableQuantity: 15,
      version: 2,
    })

    // O banner de cotação desatualizada deve surgir no topo com role="alert"
    const outdatedBanner = page.locator('[role="alert"]').filter({ hasText: 'Cotação Atualizada em Tempo Real' }).first()
    await expect(outdatedBanner).toBeVisible({ timeout: 5000 })

    // O botão de finalizar compra deve ser bloqueado
    const acknowledgeBtn = page.locator('button:has-text("Confirmar nova cotação")').first()
    await expect(acknowledgeBtn).toBeVisible()

    // O usuário aceita a nova cotação
    await acknowledgeBtn.click()

    // O banner fecha e a compra é desbloqueada
    await expect(outdatedBanner).not.toBeVisible()
    await expect(confirmBtn).toBeEnabled()
  })
})
