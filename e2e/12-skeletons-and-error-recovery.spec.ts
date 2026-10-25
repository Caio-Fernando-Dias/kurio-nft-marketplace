import { test, expect } from '@playwright/test'
import { resetBackendState, setScenario } from './helpers/test-utils'

test.describe('12. Skeletons e Resiliência: Carregamento lento, feedback de falha e recuperação', () => {
  test.beforeEach(async ({ page }) => {
    await resetBackendState(page)
  })

  test('deve renderizar skeletons com shimmer durante carregamento lento no catálogo e detalhe', async ({ page }) => {
    // 1. Acessa catálogo com cenário slow_network
    await page.goto('/?scenario=slow_network')

    // Deve exibir skeletons com animação shimmer
    const skeleton = page.locator('.animate-shimmer').first()
    await expect(skeleton).toBeVisible()

    // Aguarda carregar dados reais
    await expect(page.locator('text=Emerald Ape #042').first()).toBeVisible({ timeout: 10000 })
  })

  test('deve exibir feedback de falha e recuperar dados com sucesso ao clicar em Tentar novamente', async ({ page }) => {
    // 1. Acessa página de detalhes com simulação de erro de servidor
    await page.goto('/detalhes/1?scenario=server_error_500')

    // Deve exibir mensagem de erro amigável
    await expect(page.locator(':has-text("Erro ao carregar detalhes do NFT"), :has-text("Não foi possível obter as informações")').first()).toBeVisible({ timeout: 10000 })

    // Encontra botão "Tentar novamente"
    const retryBtn = page.locator('button:has-text("Tentar novamente")').first()
    await expect(retryBtn).toBeVisible()

    // 2. Restaura o cenário para default
    await setScenario(page, 'default')

    // 3. Clica para tentar novamente (refetch sem reload)
    await retryBtn.click()

    // O NFT deve ser carregado com sucesso
    await expect(page.locator('h1, h2').filter({ hasText: 'Emerald Ape #042' }).first()).toBeVisible({ timeout: 10000 })
  })
})
