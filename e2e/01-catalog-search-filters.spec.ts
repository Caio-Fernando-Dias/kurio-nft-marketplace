import { test, expect } from '@playwright/test'
import { resetBackendState } from './helpers/test-utils'

test.describe('1. Catálogo: Busca, filtros combinados, ordenação e histórico', () => {
  test.beforeEach(async ({ page }) => {
    await resetBackendState(page)
  })

  test('deve filtrar catálogo por busca, coleções e ordenação com persistência na URL', async ({ page }) => {
    // Aguarda carregar catálogo
    const catalog = page.locator('#catalogo')
    await expect(catalog).toBeVisible()

    // 1. Busca por texto
    const searchTrigger = page.locator('button[aria-label="Buscar"]').first()
    if (await searchTrigger.isVisible()) {
      await searchTrigger.click()
    }
    const searchInput = page.locator('input[placeholder*="Buscar"], input[placeholder*="Explorar"]').first()
    await expect(searchInput).toBeVisible()
    await searchInput.fill('Emerald')
    await page.waitForTimeout(500) // debounce
    await expect(page).toHaveURL(/search=Emerald/)
    await expect(page.locator('text=Emerald Ape #042').first()).toBeVisible()

    // 2. Filtro por coleção na sidebar
    const collectionBtn = page.locator('button:has-text("Arte digital")').first()
    if (await collectionBtn.isVisible()) {
      await collectionBtn.click()
      await expect(page).toHaveURL(/collection=Arte(\+|%20)digital/)
    }

    // 3. Filtro por aba de categoria
    const newCategoryTab = page.locator('button:has-text("Novos lançamentos")').first()
    if (await newCategoryTab.isVisible()) {
      await newCategoryTab.click()
      await expect(page).toHaveURL(/category=new/)
    }

    // 4. Ordenação por menor preço
    const sortDropdown = page.locator('button:has-text("Ordenar por:"), button[aria-label="Opções de ordenação"]').first()
    if (await sortDropdown.isVisible()) {
      await sortDropdown.click()
      await page.locator('text=Menor preço').click()
      await expect(page).toHaveURL(/sort=price_asc/)
    }

    // 4. Limpeza de filtros
    const clearBtn = page.locator('button:has-text("Limpar todos"), button:has-text("Remover busca")').first()
    if (await clearBtn.isVisible()) {
      await clearBtn.click()
    }

    // 5. Histórico de navegação (Back button)
    await page.goBack()
    await page.waitForTimeout(400)
    expect(page.url()).toContain('sort=price_asc')
  })

  test('deve tratar resultados vazios quando nenhum NFT corresponder', async ({ page }) => {
    await page.goto('/?search=ItemTotalmenteInexistenteXYZ123')
    await expect(page.locator('text=Nenhum NFT encontrado')).toBeVisible()

    // Botão de limpar filtros recupera a listagem
    const clearBtn = page.locator('button:has-text("Limpar filtros"), button:has-text("Limpar busca")').first()
    if (await clearBtn.isVisible()) {
      await clearBtn.click()
      await expect(page.locator('text=Nenhum NFT encontrado')).not.toBeVisible()
    }
  })
})
