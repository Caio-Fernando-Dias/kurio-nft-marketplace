import { test, expect } from '@playwright/test'
import { resetBackendState } from './helpers/test-utils'

test.describe('2. Detalhe: Acesso direto e tratamento de recurso inexistente (404)', () => {
  test.beforeEach(async ({ page }) => {
    await resetBackendState(page)
  })

  test('deve acessar diretamente a página de detalhes de um NFT existente', async ({ page }) => {
    await page.goto('/detalhes/1')

    // Título do NFT e preço
    await expect(page.locator('h1, h2').filter({ hasText: 'Emerald Ape #042' }).first()).toBeVisible()
    await expect(page.locator('text=1.19 ETH').first()).toBeVisible()

    // Botão de compra / adicionar ao carrinho
    const buyButton = page.locator('button:has-text("COMPRAR"), button:has-text("Comprar agora")').first()
    await expect(buyButton).toBeVisible()
  })

  test('deve tratar adequadamente o acesso direto a um NFT inexistente (404)', async ({ page }) => {
    await page.goto('/detalhes/id-completamente-inexistente-99999')

    // Mensagem de erro amigável na tela
    await expect(page.locator('text=Erro ao carregar detalhes do NFT').first()).toBeVisible()

    // Botão para tentar novamente
    const retryBtn = page.locator('button:has-text("Tentar novamente")').first()
    await expect(retryBtn).toBeVisible()
  })
})
