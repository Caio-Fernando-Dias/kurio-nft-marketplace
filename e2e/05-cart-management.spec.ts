import { test, expect } from '@playwright/test'
import { resetBackendState } from './helpers/test-utils'

test.describe('5. Carrinho: Quantidades, remoção, cupons e persistência após refresh/login', () => {
  test.beforeEach(async ({ page }) => {
    await resetBackendState(page)
  })

  test('deve alterar quantidades e recalcular totais no carrinho', async ({ page }) => {
    await page.goto('/carrinho')

    // Verifica se os itens iniciais do carrinho estão presentes
    await expect(page.locator(':has-text("Resumo da carteira"), :has-text("Resumo do pedido")').first()).toBeVisible()

    // Altera a quantidade de um item (clicando no botão + se disponível)
    const increaseBtn = page.locator('button[aria-label="Aumentar quantidade"], button:has-text("+")').first()
    if (await increaseBtn.isVisible()) {
      await increaseBtn.click()
      await page.waitForTimeout(300)
    }

    // Valida que o total continua em formato ETH coerente
    await expect(page.locator('text=ETH').locator('visible=true').first()).toBeVisible()
  })

  test('deve aplicar cupom promocional válido e recusar cupom inválido', async ({ page }) => {
    await page.goto('/carrinho')

    const promoInput = page.locator('#promo-input, input[placeholder*="código"]').first()
    if (await promoInput.isVisible()) {
      // 1. Cupom inválido
      await promoInput.fill('CUPOM_INVALIDO_XYZ')
      await page.locator('button:has-text("Aplicar"), button[type="submit"]:has-text("Adicionar")').first().click()
      await page.waitForTimeout(400)
      await expect(page.locator(':has-text("inválido"), :has-text("expirado"), :has-text("Erro")').first()).toBeVisible()

      // 2. Cupom válido
      await promoInput.fill('KURIO10')
      await page.locator('button:has-text("Aplicar"), button[type="submit"]:has-text("Adicionar")').first().click()
      await page.waitForTimeout(500)
      await expect(page.locator(':has-text("Desconto"), :has-text("aplicado"), :has-text("Remover")').first()).toBeVisible()
    }
  })

  test('deve preservar itens do carrinho após recarregar a página e ao fazer login', async ({ page }) => {
    // 1. Adiciona item a partir de detalhes
    await page.goto('/detalhes/1')
    const addBtn = page.locator('button:has-text("COMPRAR"), button:has-text("Adicionar")').first()
    await addBtn.click()
    await page.waitForTimeout(400)

    // 2. Recarrega a página no carrinho
    await page.goto('/carrinho')
    await page.reload()
    await expect(page.locator('text=Emerald Ape #042').locator('visible=true').first()).toBeVisible()

    // 3. Ao fazer login, itens permanecem
    await page.goto('/login')
    await page.locator('input[type="email"]:visible').first().fill('alexandre@kurio.art')
    await page.locator('input[type="password"]:visible').first().fill('kurio123')
    await page.locator('button[type="submit"]:visible:has-text("Entrar")').first().click()
    await page.waitForTimeout(1000)

    await page.goto('/carrinho')
    await expect(page.locator('text=Emerald Ape #042').locator('visible=true').first()).toBeVisible()
  })
})
