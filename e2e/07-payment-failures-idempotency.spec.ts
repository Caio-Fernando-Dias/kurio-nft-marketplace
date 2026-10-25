import { test, expect } from '@playwright/test'
import { resetBackendState, setScenario } from './helpers/test-utils'

test.describe('7. Pagamento: Falhas simuladas, prevenção de clique repetido e timeout com idempotência', () => {
  test.beforeEach(async ({ page }) => {
    await resetBackendState(page)
  })

  test('deve tratar recusa de pagamento pela rede simulada', async ({ page }) => {
    await page.goto('/pagamento')

    // Ativa cenário de pagamento recusado
    await setScenario(page, 'payment_refused')

    const confirmBtn = page.locator('#confirm-purchase-btn, #mobile-confirm-purchase-btn').locator('visible=true').first()
    await confirmBtn.click()

    // Deve exibir mensagem de erro na interface (role="alert")
    await expect(page.locator('[role="alert"]:visible').filter({ hasText: 'recusad' }).first()).toBeVisible()

    // O modal de sucesso NÃO deve abrir
    await expect(page.locator('#order-confirmed-heading')).not.toBeVisible()
  })

  test('deve desabilitar botão durante o processamento para impedir clique repetido', async ({ page }) => {
    await page.goto('/pagamento')

    // Ativa cenário com lentidão para verificar estado disabled
    await setScenario(page, 'slow_network')

    const confirmBtn = page.locator('#confirm-purchase-btn, #mobile-confirm-purchase-btn').locator('visible=true').first()
    await confirmBtn.click()

    // Durante o processamento o botão deve ficar desabilitado
    await expect(confirmBtn).toBeDisabled()
  })

  test('deve recuperar o mesmo pedido após timeout utilizando a chave de idempotência', async ({ page }) => {
    await page.goto('/pagamento')

    // Ativa cenário order_timeout
    await setScenario(page, 'order_timeout')

    const confirmBtn = page.locator('#confirm-purchase-btn, #mobile-confirm-purchase-btn').locator('visible=true').first()
    await confirmBtn.click()

    // 1ª tentativa falha por timeout
    await expect(page.locator('[role="alert"]:visible').first()).toBeVisible({ timeout: 10000 })

    // Volta cenário para default e tenta novamente com a mesma chave
    await setScenario(page, 'default')
    await confirmBtn.click()

    // Deve obter o recibo de confirmação
    await expect(page.locator('#order-confirmed-heading, h2:has-text("Pedido Confirmado")').first()).toBeVisible()
  })
})
