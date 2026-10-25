import { test, expect } from '@playwright/test'
import { resetBackendState } from './helpers/test-utils'

test.describe('3. Autenticação: Cadastro, login, expiração de sessão, logout e troca de usuário', () => {
  test.beforeEach(async ({ page }) => {
    await resetBackendState(page)
  })

  test('deve realizar login com sucesso e exibir menu do usuário', async ({ page }) => {
    await page.goto('/login')

    // Preenche credenciais no formulário visível do viewport ativo
    const emailInput = page.locator('#login-email, #mobile-login-email').locator('visible=true').first()
    const passwordInput = page.locator('#login-password, #mobile-login-password').locator('visible=true').first()
    await emailInput.fill('alexandre@kurio.art')
    await passwordInput.fill('kurio123')

    const submitBtn = page.locator('button[type="submit"]:has-text("Entrar")').locator('visible=true').first()
    await submitBtn.click()

    // Redireciona para home com avatar do usuário logado no Header
    const avatar = page.locator('img[alt="Alexandre Silva"]').first()
    await expect(avatar).toBeVisible({ timeout: 10000 })
  })

  test('deve cadastrar novo usuário de colecionador', async ({ page }) => {
    await page.goto('/cadastro')

    const usernameInput = page.locator('#reg-username, #mobile-reg-username').locator('visible=true').first()
    const emailInput = page.locator('#reg-email, #mobile-reg-email').locator('visible=true').first()
    const passwordInput = page.locator('#reg-password, #mobile-reg-password').locator('visible=true').first()
    const confirmInput = page.locator('#reg-confirm-password, #mobile-reg-confirm-password').locator('visible=true').first()

    const uniqueEmail = `novo.${Date.now()}@kurio.art`
    await usernameInput.fill('Novo Colecionador')
    await emailInput.fill(uniqueEmail)
    await passwordInput.fill('senhaForte123')
    await confirmInput.fill('senhaForte123')

    await page.locator('button[type="submit"]:has-text("Criar perfil"), button[type="submit"]:has-text("Criar conta")').locator('visible=true').first().click()

    // Redireciona para home autenticado
    const avatar = page.locator('img[alt="Novo Colecionador"]').first()
    await expect(avatar).toBeVisible({ timeout: 10000 })
  })

  test('deve deslogar e trocar de usuário com credenciais da Beatriz', async ({ page }) => {
    // 1. Entra como Alexandre
    await page.goto('/login')
    await page.locator('#login-email, #mobile-login-email').locator('visible=true').first().fill('alexandre@kurio.art')
    await page.locator('#login-password, #mobile-login-password').locator('visible=true').first().fill('kurio123')
    await page.locator('button[type="submit"]:has-text("Entrar")').locator('visible=true').first().click()

    const alexAvatar = page.locator('img[alt="Alexandre Silva"]').first()
    await expect(alexAvatar).toBeVisible({ timeout: 10000 })

    // 2. Realiza Logout
    await alexAvatar.click()
    const logoutBtn = page.locator('button:has-text("Sair"), button:has-text("Logout")').first()
    if (await logoutBtn.isVisible()) {
      await logoutBtn.click()
    } else {
      await page.evaluate(() => fetch('/api/auth/logout', { method: 'POST' }))
      await page.reload()
    }

    // 3. Login com Beatriz
    await page.goto('/login')
    await page.locator('#login-email, #mobile-login-email').locator('visible=true').first().fill('beatriz@kurio.art')
    await page.locator('#login-password, #mobile-login-password').locator('visible=true').first().fill('kurio123')
    await page.locator('button[type="submit"]:has-text("Entrar")').locator('visible=true').first().click()

    const beaAvatar = page.locator('img[alt="Beatriz Mendes"]').first()
    await expect(beaAvatar).toBeVisible({ timeout: 10000 })
  })

  test('deve tratar expiração de sessão simulada', async ({ page }) => {
    // Usuário autenticado
    await page.goto('/login')
    await page.locator('#login-email, #mobile-login-email').locator('visible=true').first().fill('alexandre@kurio.art')
    await page.locator('#login-password, #mobile-login-password').locator('visible=true').first().fill('kurio123')
    await page.locator('button[type="submit"]:has-text("Entrar")').locator('visible=true').first().click()

    const avatar = page.locator('img[alt="Alexandre Silva"]').first()
    await expect(avatar).toBeVisible({ timeout: 10000 })

    // Dispara expiração de sessão na API
    await page.evaluate(() => fetch('/api/auth/expire', { method: 'POST' }))

    // Tenta acessar perfil privado
    await page.goto('/perfil')
    // Deve exibir tela ou redirecionar solicitando login
    await expect(page.locator(':has-text("Esta seção exige autenticação"), :has-text("Fazer Login")').first()).toBeVisible()
  })
})
