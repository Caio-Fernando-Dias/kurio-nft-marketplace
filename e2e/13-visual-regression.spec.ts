import { test, expect } from '@playwright/test'
import { resetBackendState } from './helpers/test-utils'

test.describe('13. Regressão Visual: Início, Detalhe, Carrinho e Pagamento', () => {
  test.beforeEach(async ({ page }) => {
    await resetBackendState(page)
  })

  test('regressão visual da tela de início', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#catalogo')).toBeVisible()
    await page.waitForTimeout(500)
    // Tira screenshot de snapshot da página de início
    await expect(page).toHaveScreenshot('inicio.png', {
      maxDiffPixelRatio: 0.1,
      animations: 'disabled',
      fullPage: false,
    })
  })

  test('regressão visual da tela de detalhe', async ({ page }) => {
    await page.goto('/detalhes/1')
    await expect(page.locator('h1, h2').filter({ hasText: 'Emerald Ape #042' }).first()).toBeVisible()
    await page.waitForTimeout(500)
    await expect(page).toHaveScreenshot('detalhe.png', {
      maxDiffPixelRatio: 0.1,
      animations: 'disabled',
      fullPage: false,
    })
  })

  test('regressão visual da tela de carrinho', async ({ page }) => {
    await page.goto('/carrinho')
    await expect(page.locator(':has-text("Resumo do pedido"), :has-text("Resumo da carteira")').first()).toBeVisible()
    await page.waitForTimeout(500)
    await expect(page).toHaveScreenshot('carrinho.png', {
      maxDiffPixelRatio: 0.1,
      animations: 'disabled',
      fullPage: false,
    })
  })

  test('regressão visual da tela de pagamento', async ({ page }) => {
    await page.goto('/pagamento')
    await expect(page.locator('button:has-text("Confirmar compra"):visible').first()).toBeVisible()
    await page.waitForTimeout(500)
    await expect(page).toHaveScreenshot('pagamento.png', {
      maxDiffPixelRatio: 0.1,
      animations: 'disabled',
      fullPage: false,
    })
  })
})
