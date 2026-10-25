import { Page, expect } from '@playwright/test'

/**
 * Resets the MSW database, fixtures, and local storage state to canonical baseline
 */
export async function resetBackendState(page: Page) {
  await page.goto('/')
  await page.evaluate(async () => {
    try {
      await fetch('/api/reset', { method: 'POST' })
    } catch {}
    sessionStorage.clear()
    if ((window as any).__setKurioScenario) {
      ;(window as any).__setKurioScenario('default')
    }
  })
  await page.waitForTimeout(100)
}

/**
 * Sets an active mock scenario for the test
 */
export async function setScenario(page: Page, scenario: string) {
  await page.evaluate((sc) => {
    if ((window as any).__setKurioScenario) {
      ;(window as any).__setKurioScenario(sc)
    }
    localStorage.setItem('kurio_mock_scenario', sc)
  }, scenario)
}

/**
 * Emits a real-time NFT update event through MSW and Socket.IO
 */
export async function emitNFTUpdate(
  page: Page,
  payload: {
    nftId: string
    priceEth: string
    availableQuantity: number
    version?: number
  }
) {
  await page.evaluate((data) => {
    const event = {
      resource: 'nft' as const,
      nftId: data.nftId,
      priceEth: data.priceEth,
      availableQuantity: data.availableQuantity,
      version: data.version ?? Date.now(),
      updatedAt: new Date().toISOString(),
    }
    if ((window as any).__triggerNFTUpdated) {
      ;(window as any).__triggerNFTUpdated(event)
    }
    if ((window as any).__updateNFTRealtime) {
      ;(window as any).__updateNFTRealtime(event)
    } else if ((window as any).__emitSocketEvent) {
      ;(window as any).__emitSocketEvent('nft.updated', event)
    }
  }, payload)
}

/**
 * Emits a real-time order update event through MSW and Socket.IO
 */
export async function emitOrderUpdate(
  page: Page,
  payload: {
    orderId: string
    userId?: string
    status: 'pending' | 'confirmed' | 'rejected'
    version?: number
  }
) {
  await page.evaluate((data) => {
    const event = {
      resource: 'order' as const,
      orderId: data.orderId,
      userId: data.userId,
      status: data.status,
      version: data.version ?? Date.now(),
      updatedAt: new Date().toISOString(),
    }
    if ((window as any).__triggerOrderUpdated) {
      ;(window as any).__triggerOrderUpdated(event)
    }
    if ((window as any).__updateOrderRealtime) {
      ;(window as any).__updateOrderRealtime(event)
    } else if ((window as any).__emitSocketEvent) {
      ;(window as any).__emitSocketEvent('order.updated', event)
    }
  }, payload)
}
