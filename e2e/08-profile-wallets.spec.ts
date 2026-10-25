import { test, expect } from '@playwright/test'
import { resetBackendState } from './helpers/test-utils'

test.describe('8. Conta: Edição de perfil, senha e gerenciamento de carteiras', () => {
  test.beforeEach(async ({ page }) => {
    await resetBackendState(page)
    // Autentica como Alexandre Silva
    await page.goto('/login')
    await page.locator('#login-email, #mobile-login-email').locator('visible=true').first().fill('alexandre@kurio.art')
    await page.locator('#login-password, #mobile-login-password').locator('visible=true').first().fill('kurio123')
    await page.locator('button[type="submit"]:has-text("Entrar")').locator('visible=true').first().click()
    await page.waitForTimeout(1000)
  })

  test('deve editar dados do perfil e salvar com sucesso', async ({ page }) => {
    await page.goto('/perfil')

    // Altera nome de usuário
    const usernameInput = page.locator('#prof-username, input[placeholder*="usuário"]').first()
    await usernameInput.clear()
    await usernameInput.fill('Alexandre_NFT_Pro')

    // Salva perfil
    const saveBtn = page.locator('button:has-text("Salvar")').locator('visible=true').first()
    await saveBtn.click()

    // Valida mensagem de sucesso
    await expect(page.locator(':has-text("Perfil atualizado com sucesso!")').first()).toBeVisible()
  })

  test('deve validar tamanho mínimo de senha e confirmação', async ({ page }) => {
    await page.goto('/perfil')

    // Tenta trocar senha para uma curta (< 6 caracteres)
    const newPassInput = page.locator('#prof-new-password, input[placeholder*="Nova senha"]').first()
    const confirmPassInput = page.locator('#prof-confirm-password, input[placeholder*="Confirmar nova senha"]').first()
    const changePassBtn = page.locator('button:has-text("Alterar senha")').first()

    if (await newPassInput.isVisible() && await changePassBtn.isVisible()) {
      await newPassInput.fill('123')
      await confirmPassInput.fill('123')
      await changePassBtn.click()

      // Validação de erro exibida
      await expect(page.locator(':has-text("no mínimo 6 caracteres"), :has-text("Erro")').first()).toBeVisible()
    }
  })

  test('deve gerenciar carteira principal e secundária na página de carteiras', async ({ page }) => {
    await page.goto('/carteiras')

    // Valida campos da carteira principal
    const walletNickname = page.locator('#wallet-nickname').first()
    await expect(walletNickname).toBeVisible()
    await walletNickname.clear()
    await walletNickname.fill('Minha Ledger Principal')

    // Salva carteira
    const saveWalletBtn = page.locator('button:has-text("Salvar carteira")').first()
    await saveWalletBtn.click()

    // Feedback de sucesso
    await expect(page.locator('text=Carteira salva com sucesso!').first()).toBeVisible()

    // Alterna toggle de carteira secundária
    const toggleSameAsMain = page.locator('button[role="checkbox"]').first()
    if (await toggleSameAsMain.isVisible()) {
      await toggleSameAsMain.click()
      await expect(page.locator(':has-text("Configuração da Carteira Secundária")').first()).toBeVisible()
    }
  })
})
