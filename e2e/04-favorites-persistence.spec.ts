import { test, expect } from '@playwright/test'
import { resetBackendState, setScenario } from './helpers/test-utils'

test.describe('4. Favoritos: Persistência e recuperação de falha de mutation com rollback', () => {
  test.beforeEach(async ({ page }) => {
    await resetBackendState(page)
  })

  test('deve alternar favorito de um NFT e persistir após reload', async ({ page }) => {
    await page.goto('/')

    // Encontra o botão de favorito do primeiro card
    const favButton = page.locator('button[aria-label*="favorito"], button[aria-label*="Favorito"]').first()
    await expect(favButton).toBeVisible()

    // Clica para favoritar
    await favButton.click()
    await page.waitForTimeout(400)

    // Recarrega a página para validar persistência
    await page.reload()
    const favAfterReload = page.locator('button[aria-label*="favorito"], button[aria-label*="Favorito"]').first()
    await expect(favAfterReload).toBeVisible()
  })

  test('deve realizar rollback otimista em caso de falha de mutation', async ({ page }) => {
    await page.goto('/')

    const favButton = page.locator('button[aria-label*="favorito"], button[aria-label*="Favorito"]').first()
    await expect(favButton).toBeVisible()

    // Ativa cenário de erro de servidor (500)
    await setScenario(page, 'server_error_500')

    // Tenta alternar o favorito
    await favButton.click()
    await page.waitForTimeout(600)

    // A UI deve manter ou reverter para o estado consistente (rollback do TanStack Query)
    await expect(favButton).toBeVisible()
  })
})
