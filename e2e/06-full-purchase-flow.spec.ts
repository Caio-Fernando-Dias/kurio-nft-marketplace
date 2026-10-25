import { test, expect } from '@playwright/test'
import { resetBackendState } from './helpers/test-utils'

test.describe('6. Fluxo de Compra Completa: Do Catálogo ao Recibo Confirmado', () => {
  test.beforeEach(async ({ page }) => {
    await resetBackendState(page)
  })

  test('deve executar funil de conversão completo e exibir modal de confirmação de pedido', async ({ page }) => {
    // 1. Navega para o catálogo
    await page.goto('/')
    await expect(page.locator('#catalogo')).toBeVisible()

    // 2. Acessa carrinho com itens
    await page.goto('/carrinho')
    await expect(page.locator(':has-text("Resumo do pedido"), :has-text("Resumo da carteira")').first()).toBeVisible()

    // 3. Avança para checkout / pagamento
    const checkoutBtn = page.locator('button:has-text("Conectar e finalizar"), button:has-text("Ir para o pagamento")').locator('visible=true').first()
    await checkoutBtn.click()
    await page.waitForURL('**/pagamento')

    // 4. Verifica formulário de pagamento
    await expect(page.locator(':has-text("Resumo do pedido"), :has-text("Carteira conectada"), :has-text("Pagamento")').first()).toBeVisible()

    // 5. Clica em Confirmar compra
    const confirmPurchaseBtn = page.locator('button:has-text("Confirmar compra")').locator('visible=true').first()
    await expect(confirmPurchaseBtn).toBeVisible()
    await confirmPurchaseBtn.click()

    // 6. Modal de Confirmação do Pedido deve abrir com recibo
    const modalHeading = page.locator('#order-confirmed-heading, h2:has-text("Pedido Confirmado")').first()
    await expect(modalHeading).toBeVisible({ timeout: 10000 })

    // Valida dados do recibo
    await expect(page.locator(':has-text("Hash da transação"), :has-text("Transação")').first()).toBeVisible()
    await expect(page.locator(':has-text("Total pago"), :has-text("ETH")').first()).toBeVisible()

    // 7. Fecha modal de confirmação
    const closeModalBtn = page.locator('button[aria-label="Fechar confirmação"]').first()
    if (await closeModalBtn.isVisible()) {
      await closeModalBtn.click()
      await expect(modalHeading).not.toBeVisible()
    }
  })
})
