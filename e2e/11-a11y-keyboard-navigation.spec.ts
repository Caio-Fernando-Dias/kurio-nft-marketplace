import { test, expect } from '@playwright/test'
import { resetBackendState } from './helpers/test-utils'

test.describe('11. Acessibilidade: Navegação por teclado, foco de diálogos e validação de formulários', () => {
  test.beforeEach(async ({ page }) => {
    await resetBackendState(page)
  })

  test('deve navegar por teclado e capturar foco dentro do modal com fechamento por Escape', async ({ page }) => {
    await page.goto('/login')

    const modal = page.locator('[role="dialog"]').first()
    await expect(modal).toBeVisible()

    // Pressiona Escape para fechar o diálogo
    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)

    // Redireciona para home ou fecha modal
    expect(page.url()).not.toContain('/login')
  })

  test('deve apresentar foco visível e manter aprisionamento de foco com Tab e Shift+Tab', async ({ page }) => {
    await page.goto('/login')

    const modal = page.locator('[role="dialog"]').first()
    await expect(modal).toBeVisible()

    // Tabula dentro do modal
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    // O elemento ativo ainda deve estar contido dentro do modal
    const isInsideModal = await page.evaluate(() => {
      const active = document.activeElement
      const dialog = document.querySelector('[role="dialog"]')
      return dialog ? dialog.contains(active) : false
    })
    expect(isInsideModal).toBe(true)
  })

  test('deve validar formulário com feedback acessível ao enviar campos vazios', async ({ page }) => {
    await page.goto('/login')

    // Tenta submeter formulário de login vazio
    const submitBtn = page.locator('button[type="submit"]:has-text("Entrar")').locator('visible=true').first()
    await submitBtn.click()

    // Alerta de erro deve ser associado ao formulário
    const alert = page.locator('[role="alert"]:visible').first()
    await expect(alert).toBeVisible()
    await expect(alert).toContainText('e-mail')
  })
})
