import { http, HttpResponse, delay } from 'msw'
import { INITIAL_NFTS } from './data/nfts'
import { FIXTURE_USERS, type MockUserRecord } from './data/users'
import { getActiveScenario, MockScenario, resetActiveScenario } from './scenarios'
import { emitSocketIOEvent } from './socketMock'
import type { NFT, NFTListResponse } from '../types/nft'
import type { User, AuthSession } from '../types/auth'
import type { CartResponse } from '../types/cart'

// Persistent state with localStorage support for browser simulation
const getInitialUser = (): User | null => {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kurio_auth_user')
      if (stored) return JSON.parse(stored)
    }
  } catch (e) {
    console.error('Error reading auth from localStorage', e)
  }
  return null
}

const getInitialFavorites = (): Set<string> => {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kurio_favorites')
      if (stored) return new Set(JSON.parse(stored))
    }
  } catch (e) {
    console.error('Error reading favorites from localStorage', e)
  }
  return new Set(['nft-2'])
}

export interface StoredCartItem {
  id: string
  quantity: number
  priceEth: string
  tokenId?: string
  edition?: string
}

const getInitialCart = (): StoredCartItem[] => {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kurio_cart_items')
      if (stored) return JSON.parse(stored)
    }
  } catch (e) {
    console.error('Error reading cart from localStorage', e)
  }
  return [
    { id: 'nft-1', quantity: 2, priceEth: '1.19', tokenId: '#0042', edition: '1/50' },
    { id: 'nft-5', quantity: 6, priceEth: '1.39', tokenId: '#0009', edition: '1/20' },
    { id: 'nft-6', quantity: 9, priceEth: '1.79', tokenId: '#0552', edition: '1/10' },
  ]
}

// Persistent user registry with password storage for realistic authentication
const getInitialRegisteredUsers = (): MockUserRecord[] => {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kurio_registered_users')
      if (stored) return JSON.parse(stored)
    }
  } catch (e) {
    console.error('Error reading registered users from localStorage', e)
  }
  return [...FIXTURE_USERS]
}

let registeredUsers: MockUserRecord[] = getInitialRegisteredUsers()

const saveRegisteredUsers = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('kurio_registered_users', JSON.stringify(registeredUsers))
  }
}

let nfts: NFT[] = [...INITIAL_NFTS]
let favoriteIds = getInitialFavorites()
let currentUser: User | null = getInitialUser()
let cartItems: StoredCartItem[] = getInitialCart()
const ordersByIdempotencyKey = new Map<string, { requestBody: any; order: any; timedOutOnce?: boolean }>()

const saveCart = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('kurio_cart_items', JSON.stringify(cartItems))
  }
}

const saveFavorites = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('kurio_favorites', JSON.stringify([...favoriteIds]))
  }
}

// Scenario Resolution Helper
const resolveScenario = (request: Request): MockScenario => {
  const header = request.headers.get('X-Scenario') as MockScenario | null
  if (header) return header

  try {
    const url = new URL(request.url)
    const param = url.searchParams.get('scenario') as MockScenario | null
    if (param) return param
  } catch {}

  return getActiveScenario()
}

const applyLatency = async (scenario: MockScenario, defaultMs = 120) => {
  if (scenario === 'slow_network') {
    await delay(2000)
    return
  }
  if (scenario === 'variable_latency') {
    const randomMs = Math.floor(Math.random() * 1200) + 150
    await delay(randomMs)
    return
  }
  await delay(defaultMs)
}

const checkGenericFault = (scenario: MockScenario, isProtected = false): Response | null => {
  if (scenario === 'network_error') {
    return HttpResponse.error()
  }
  if (scenario === 'server_error_500') {
    return new HttpResponse(
      JSON.stringify({ error: 'Erro transitório interno do servidor (HTTP 500).' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
  if (scenario === 'service_unavailable_503') {
    return new HttpResponse(
      JSON.stringify({ error: 'Serviço temporariamente indisponível (HTTP 503).' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    )
  }
  if (isProtected) {
    if (scenario === 'unauthorized_401') {
      return new HttpResponse(
        JSON.stringify({ error: 'Sessão inválida ou expirada (HTTP 401).' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }
    if (scenario === 'forbidden_403') {
      return new HttpResponse(
        JSON.stringify({ error: 'Acesso não autorizado: permissão insuficiente (HTTP 403).' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      )
    }
  }
  return null
}

export const handlers = [
  // Session & Auth
  http.get('/api/auth/session', async ({ request }) => {
    const scenario = resolveScenario(request)
    const fault = checkGenericFault(scenario, false)
    if (fault) return fault

    await applyLatency(scenario, 60)
    const session: AuthSession = {
      user: currentUser,
      isAuthenticated: !!currentUser,
    }
    return HttpResponse.json(session)
  }),

  http.post('/api/auth/login', async ({ request }) => {
    const scenario = resolveScenario(request)
    const fault = checkGenericFault(scenario, false)
    if (fault) return fault

    await applyLatency(scenario, 150)
    const body = (await request.json().catch(() => ({}))) as { email?: string; password?: string }
    const emailNorm = (body.email || '').trim().toLowerCase()
    const password = body.password || ''

    if (!emailNorm) {
      return new HttpResponse(
        JSON.stringify({ error: 'Por favor, informe seu e-mail.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (!password) {
      return new HttpResponse(
        JSON.stringify({ error: 'Por favor, informe sua senha.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Match registered user or fixture user
    const userMatch = registeredUsers.find((u) => u.email.toLowerCase() === emailNorm)
    if (!userMatch) {
      return new HttpResponse(
        JSON.stringify({ error: 'Usuário não cadastrado na plataforma.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Validate password
    if (userMatch.password !== password) {
      return new HttpResponse(
        JSON.stringify({ error: 'Senha incorreta. Verifique suas credenciais.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const { password: _, ...userSafe } = userMatch
    currentUser = userSafe

    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('kurio_auth_user', JSON.stringify(currentUser))
      }
    } catch (e) {
      console.error('Error saving auth to localStorage', e)
    }
    return HttpResponse.json({ user: currentUser, isAuthenticated: true })
  }),

  http.post('/api/auth/register', async ({ request }) => {
    const scenario = resolveScenario(request)
    const fault = checkGenericFault(scenario, false)
    if (fault) return fault

    await applyLatency(scenario, 150)
    const body = (await request.json()) as { username?: string; email: string; password?: string }
    const emailNorm = (body.email || '').trim().toLowerCase()

    // Conflict handling (Section 5 & 6)
    const isAlreadyRegistered = registeredUsers.some((u) => u.email.toLowerCase() === emailNorm)
    if (
      scenario === 'register_conflict_409' ||
      body.email === 'conflict@kurio.art' ||
      isAlreadyRegistered
    ) {
      return new HttpResponse(
        JSON.stringify({ error: 'E-mail já cadastrado na plataforma.' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (!body.password || body.password.length < 6) {
      return new HttpResponse(
        JSON.stringify({ error: 'A senha deve conter no mínimo 6 caracteres.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const newUserRecord: MockUserRecord = {
      id: `user-${Date.now()}`,
      name: body.username || emailNorm.split('@')[0],
      email: body.email,
      password: body.password,
      avatar: '/assets/image2.png',
      walletAddress: '0x71C...4e89',
    }

    registeredUsers.push(newUserRecord)
    saveRegisteredUsers()

    const { password: _, ...userSafe } = newUserRecord
    currentUser = userSafe

    if (typeof window !== 'undefined') {
      localStorage.setItem('kurio_auth_user', JSON.stringify(currentUser))
    }
    return HttpResponse.json({ user: currentUser, isAuthenticated: true }, { status: 201 })
  }),

  http.post('/api/auth/logout', async ({ request }) => {
    const scenario = resolveScenario(request)
    await applyLatency(scenario, 100)
    currentUser = null
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('kurio_auth_user')
      }
    } catch (e) {
      console.error('Error removing auth from localStorage', e)
    }
    return HttpResponse.json({ success: true })
  }),

  // Expiração simulada de sessão
  http.post('/api/auth/expire', async () => {
    currentUser = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('kurio_auth_user')
    }
    return HttpResponse.json({ success: true, message: 'Sessão expirada com sucesso.' })
  }),

  // List NFTs with search, filters, sorting and pagination
  http.get('/api/nfts', async ({ request }) => {
    const scenario = resolveScenario(request)
    const fault = checkGenericFault(scenario, false)
    if (fault) return fault

    await applyLatency(scenario, 150)

    const url = new URL(request.url)
    const search = url.searchParams.get('search')?.toLowerCase() || ''
    const collection = url.searchParams.get('collection')
    const hasMinPrice = url.searchParams.has('minPrice') && url.searchParams.get('minPrice') !== ''
    const hasMaxPrice = url.searchParams.has('maxPrice') && url.searchParams.get('maxPrice') !== ''
    const minPrice = hasMinPrice ? parseFloat(url.searchParams.get('minPrice')!) : NaN
    const maxPrice = hasMaxPrice ? parseFloat(url.searchParams.get('maxPrice')!) : NaN
    const network = url.searchParams.get('network')
    const category = url.searchParams.get('category') || 'all'
    const sort = url.searchParams.get('sort') || 'recent'
    const page = parseInt(url.searchParams.get('page') || '1', 10)
    const limit = parseInt(url.searchParams.get('limit') || '9', 10)

    const collectionCounts: Record<string, number> = {
      'Arte digital': 33,
      Fotografia: 12,
      Música: 65,
      'Arte 3D': 39,
      Colecionáveis: 23,
      Generativa: 17,
      Jogos: 19,
      Assinaturas: 13,
      Utilidade: 18,
    }

    const networkCounts: Record<string, number> = {
      Ethereum: 119,
      Polygon: 78,
      Solana: 86,
    }

    // Deterministic empty result scenario
    if (scenario === 'empty_catalog') {
      const emptyResponse: NFTListResponse = {
        items: [],
        total: 0,
        page: 1,
        totalPages: 0,
        limit,
        counts: {
          collections: collectionCounts,
          networks: networkCounts,
        },
      }
      return HttpResponse.json(emptyResponse)
    }

    let filtered = nfts.map((nft) => ({
      ...nft,
      isFavorite: favoriteIds.has(nft.id),
    }))

    // Text search
    if (search) {
      filtered = filtered.filter(
        (nft) =>
          nft.title.toLowerCase().includes(search) ||
          nft.collection.toLowerCase().includes(search) ||
          nft.creator.toLowerCase().includes(search)
      )
    }

    // Category tab
    if (category && category !== 'all') {
      filtered = filtered.filter((nft) => nft.category === category)
    }

    // Collection (case-insensitive)
    if (collection) {
      filtered = filtered.filter(
        (nft) => nft.collection.toLowerCase() === collection.toLowerCase()
      )
    }

    // Network (case-insensitive)
    if (network) {
      filtered = filtered.filter(
        (nft) => nft.network.toLowerCase() === network.toLowerCase()
      )
    }

    // Price range (min and max ETH)
    if (!isNaN(minPrice)) {
      filtered = filtered.filter((nft) => parseFloat(nft.priceEth) >= minPrice)
    }
    if (!isNaN(maxPrice)) {
      filtered = filtered.filter((nft) => parseFloat(nft.priceEth) <= maxPrice)
    }

    // Sorting
    filtered.sort((a, b) => {
      if (sort === 'price_asc') {
        return parseFloat(a.priceEth) - parseFloat(b.priceEth)
      }
      if (sort === 'price_desc') {
        return parseFloat(b.priceEth) - parseFloat(a.priceEth)
      }
      const numA = parseInt(a.id.replace('nft-', ''), 10)
      const numB = parseInt(b.id.replace('nft-', ''), 10)
      return numA - numB
    })

    const total = filtered.length
    const totalPages = Math.ceil(total / limit) || 1
    const offset = (page - 1) * limit
    const items = filtered.slice(offset, offset + limit)

    const response: NFTListResponse = {
      items,
      total,
      page,
      totalPages,
      limit,
      counts: {
        collections: collectionCounts,
        networks: networkCounts,
      },
    }

    return HttpResponse.json(response)
  }),

  // Get single NFT by ID
  http.get('/api/nfts/:id', async ({ params, request }) => {
    const scenario = resolveScenario(request)
    const fault = checkGenericFault(scenario, false)
    if (fault) return fault

    await applyLatency(scenario, 100)
    const { id } = params as { id: string }
    const nft = nfts.find((n) => n.id === id || n.id === `nft-${id}` || n.id.replace('nft-', '') === id)
    if (!nft) {
      return new HttpResponse(JSON.stringify({ error: 'NFT não encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    return HttpResponse.json({
      ...nft,
      isFavorite: favoriteIds.has(nft.id),
    })
  }),

  // Favorites endpoints
  http.get('/api/favorites', async ({ request }) => {
    const scenario = resolveScenario(request)
    const fault = checkGenericFault(scenario, true)
    if (fault) return fault

    await applyLatency(scenario, 80)
    const favoriteNFTs = nfts.filter((nft) => favoriteIds.has(nft.id))
    return HttpResponse.json({
      favorites: Array.from(favoriteIds),
      count: favoriteIds.size,
      items: favoriteNFTs,
    })
  }),

  http.post('/api/favorites/:id', async ({ params, request }) => {
    const scenario = resolveScenario(request)
    const fault = checkGenericFault(scenario, true)
    if (fault) return fault

    await applyLatency(scenario, 120)
    const { id } = params as { id: string }
    const isFav = favoriteIds.has(id)
    if (isFav) {
      favoriteIds.delete(id)
    } else {
      favoriteIds.add(id)
    }
    saveFavorites()
    return HttpResponse.json({ id, isFavorite: !isFav })
  }),

  http.delete('/api/favorites/:id', async ({ params, request }) => {
    const scenario = resolveScenario(request)
    const fault = checkGenericFault(scenario, true)
    if (fault) return fault

    await applyLatency(scenario, 100)
    const { id } = params as { id: string }
    favoriteIds.delete(id)
    saveFavorites()
    return HttpResponse.json({ id, isFavorite: false })
  }),

  // Cart endpoints
  http.get('/api/cart', async ({ request }) => {
    const scenario = resolveScenario(request)
    const fault = checkGenericFault(scenario, false)
    if (fault) return fault

    await applyLatency(scenario, 80)
    const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)

    const enrichedItems = cartItems.map((cartItem) => {
      const nft = nfts.find((n) => n.id === cartItem.id) || nfts[0]
      return {
        id: cartItem.id,
        nft,
        quantity: cartItem.quantity,
        priceEth: cartItem.priceEth,
        tokenId: cartItem.tokenId || `#${cartItem.id.replace('nft-', '00')}`,
        edition: cartItem.edition || '1/50',
      }
    })

    const subtotal = cartItems.reduce(
      (acc, item) => acc + parseFloat(item.priceEth) * item.quantity,
      0
    )
    const networkFee = 0.016
    const total = subtotal + networkFee

    const response: CartResponse = {
      items: enrichedItems,
      count: totalCount,
      subtotalEth: subtotal.toFixed(2),
      discountEth: '00.00',
      networkFeeEth: networkFee.toFixed(3),
      totalEth: total.toFixed(3),
    }

    return HttpResponse.json(response)
  }),

  http.post('/api/cart', async ({ request }) => {
    const scenario = resolveScenario(request)
    const fault = checkGenericFault(scenario, false)
    if (fault) return fault

    await applyLatency(scenario, 100)
    const body = (await request.json()) as { id: string; quantity?: number }
    const existing = cartItems.find((i) => i.id === body.id)
    const nft = nfts.find((n) => n.id === body.id)
    const price = nft ? nft.priceEth : '1.00'

    if (existing) {
      existing.quantity += body.quantity || 1
    } else {
      cartItems.push({
        id: body.id,
        quantity: body.quantity || 1,
        priceEth: price,
        tokenId: `#${body.id.replace('nft-', '00')}`,
        edition: '1/50',
      })
    }
    saveCart()
    const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)
    return HttpResponse.json({ success: true, count: totalCount })
  }),

  http.put('/api/cart/:id', async ({ params, request }) => {
    const scenario = resolveScenario(request)
    const fault = checkGenericFault(scenario, false)
    if (fault) return fault

    await applyLatency(scenario, 80)
    const { id } = params as { id: string }
    const body = (await request.json()) as { quantity: number }
    const itemIndex = cartItems.findIndex((i) => i.id === id)
    if (itemIndex > -1) {
      if (body.quantity <= 0) {
        cartItems.splice(itemIndex, 1)
      } else {
        cartItems[itemIndex].quantity = body.quantity
      }
    }
    saveCart()
    const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)
    return HttpResponse.json({ success: true, count: totalCount })
  }),

  http.delete('/api/cart/:id', async ({ params, request }) => {
    const scenario = resolveScenario(request)
    const fault = checkGenericFault(scenario, false)
    if (fault) return fault

    await applyLatency(scenario, 80)
    const { id } = params as { id: string }
    cartItems = cartItems.filter((i) => i.id !== id)
    saveCart()
    const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)
    return HttpResponse.json({ success: true, count: totalCount })
  }),

  // Orders API (idempotent order mutation & receipt)
  http.post('/api/orders', async ({ request }) => {
    const scenario = resolveScenario(request)
    const fault = checkGenericFault(scenario, true)
    if (fault) return fault

    await applyLatency(scenario, 250)
    const idempotencyKey = request.headers.get('Idempotency-Key')
    const body = (await request.json()) as any

    // Timeout scenario with idempotency recovery
    if (scenario === 'order_timeout' && idempotencyKey) {
      const existing = ordersByIdempotencyKey.get(idempotencyKey)
      if (!existing || !existing.timedOutOnce) {
        // Record order snapshot in database/MSW, but trigger timeout response on first attempt
        const timeoutSnapshot = {
          orderId: `order-timeout-${Date.now()}`,
          transactionId: `0xTIMEOUT…${Math.random().toString(16).slice(2, 6).toUpperCase()}`,
          status: 'confirmed',
          items: cartItems.map((c) => ({ ...c })),
          subtotalEth: body.subtotalEth || '26.83',
          discountEth: body.discountEth || '00.00',
          networkFeeEth: body.networkFeeEth || '0.016',
          totalEth: body.totalEth || '26.846',
          date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
          walletName: body.walletName || 'Coinbase Wallet',
          createdAt: new Date().toISOString(),
        }
        ordersByIdempotencyKey.set(idempotencyKey, {
          requestBody: body,
          order: timeoutSnapshot,
          timedOutOnce: true,
        })
        return new HttpResponse(
          JSON.stringify({
            error: 'Tempo limite da rede blockchain excedido (504 Gateway Timeout). Reenvie o pedido com a mesma chave de idempotência para recuperação.',
          }),
          { status: 504, headers: { 'Content-Type': 'application/json' } }
        )
      }
      // On retry with same idempotency key: successfully recover the order!
      return HttpResponse.json(existing.order)
    }

    if (idempotencyKey && ordersByIdempotencyKey.has(idempotencyKey)) {
      const existing = ordersByIdempotencyKey.get(idempotencyKey)!
      if (JSON.stringify(existing.requestBody) !== JSON.stringify(body)) {
        return new HttpResponse(
          JSON.stringify({ error: 'Chave de idempotência reutilizada com payload divergente.' }),
          { status: 409, headers: { 'Content-Type': 'application/json' } }
        )
      }
      return HttpResponse.json(existing.order)
    }

    if (scenario === 'payment_refused' || body.simulateRefusal) {
      return new HttpResponse(
        JSON.stringify({ error: 'Transação recusada pela rede simulada.', status: 'rejected' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const orderId = `order-${Date.now()}`
    const transactionId = `0x${Math.random().toString(16).slice(2, 6).toUpperCase()}…${Math.random().toString(16).slice(2, 6).toUpperCase()}`
    const snapshot = {
      orderId,
      transactionId,
      status: 'confirmed',
      items: cartItems.map((c) => ({ ...c })),
      subtotalEth: body.subtotalEth || '26.83',
      discountEth: body.discountEth || '00.00',
      networkFeeEth: body.networkFeeEth || '0.016',
      totalEth: body.totalEth || '26.846',
      date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
      walletName: body.walletName || 'Coinbase Wallet',
      createdAt: new Date().toISOString(),
    }

    // On confirmed purchase: remove purchased items from cart
    cartItems = []
    saveCart()

    if (idempotencyKey) {
      ordersByIdempotencyKey.set(idempotencyKey, { requestBody: body, order: snapshot })
    }

    // Broadcast real-time order confirmation via Socket.IO
    emitSocketIOEvent('order.updated', {
      resource: 'order',
      orderId: snapshot.orderId,
      userId: currentUser?.id,
      status: 'confirmed',
      version: 1,
      updatedAt: new Date().toISOString(),
    })

    return HttpResponse.json(snapshot)
  }),

  http.get('/api/orders/:id', async ({ params, request }) => {
    const scenario = resolveScenario(request)
    const fault = checkGenericFault(scenario, true)
    if (fault) return fault

    await applyLatency(scenario, 100)
    const { id } = params as { id: string }
    for (const [_, entry] of ordersByIdempotencyKey.entries()) {
      if (entry.order.orderId === id || entry.order.transactionId === id) {
        return HttpResponse.json(entry.order)
      }
    }
    return HttpResponse.json({
      orderId: id,
      transactionId: '0xA91F…E82C',
      status: 'confirmed',
      items: [
        { id: 'nft-1', quantity: 2, priceEth: '1.19', tokenId: '#0042', edition: '1/50' },
        { id: 'nft-5', quantity: 6, priceEth: '1.39', tokenId: '#0009', edition: '1/20' },
        { id: 'nft-6', quantity: 9, priceEth: '1.79', tokenId: '#0552', edition: '1/10' },
      ],
      subtotalEth: '26.83',
      discountEth: '00.00',
      networkFeeEth: '0.016',
      totalEth: '26.846',
      date: '29 Jul, 2026',
      walletName: 'Coinbase Wallet',
      createdAt: '2026-07-29T14:32:00Z',
    })
  }),

  // Quote API (Coupon, Availability & Fee Validation)
  http.post('/api/quote', async ({ request }) => {
    const scenario = resolveScenario(request)
    const fault = checkGenericFault(scenario, false)
    if (fault) return fault

    await applyLatency(scenario, 80)

    const body = (await request.json().catch(() => ({}))) as { code?: string; items?: StoredCartItem[] }
    const items = body.items && body.items.length > 0 ? body.items : cartItems

    // Conflict simulation: edition sold out during checkout
    if (scenario === 'edition_sold_out') {
      return new HttpResponse(
        JSON.stringify({ error: 'Edição esgotada durante a compra. Atualize o carrinho.' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const hasUnavailable = items.some((item) => item.id === 'unavailable-nft' || item.id === 'nft-999')
    if (hasUnavailable) {
      return new HttpResponse(
        JSON.stringify({ error: 'Um ou mais NFTs selecionados estão indisponíveis no momento.' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const subtotal = items.reduce(
      (acc, item) => acc + (parseFloat(item.priceEth) || 0) * (item.quantity || 1),
      0
    )
    const networkFee = 0.016
    const code = (body.code || '').trim().toUpperCase()

    let discount = 0
    let message = ''

    if (scenario === 'invalid_coupon') {
      return new HttpResponse(
        JSON.stringify({ valid: false, error: 'Cupom inválido ou expirado.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (code) {
      if (code === 'KURIO') {
        discount = 2.00
        message = 'Cupom KURIO aplicado (-2.00 ETH)'
      } else {
        return new HttpResponse(
          JSON.stringify({ valid: false, error: 'Cupom inválido ou expirado.' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        )
      }
    }

    const total = Math.max(0, subtotal - discount + networkFee)

    return HttpResponse.json({
      valid: true,
      available: true,
      code: code || null,
      subtotalEth: subtotal.toFixed(2),
      discountEth: discount > 0 ? discount.toFixed(2) : '00.00',
      networkFeeEth: networkFee.toFixed(3),
      totalEth: total.toFixed(3),
      message,
    })
  }),

  // Profile API
  http.get('/api/profile', async ({ request }) => {
    const scenario = resolveScenario(request)
    const fault = checkGenericFault(scenario, true)
    if (fault) return fault

    await applyLatency(scenario, 60)
    return HttpResponse.json({ profile: currentUser })
  }),

  http.put('/api/profile', async ({ request }) => {
    const scenario = resolveScenario(request)
    const fault = checkGenericFault(scenario, true)
    if (fault) return fault

    await applyLatency(scenario, 120)
    const updates = (await request.json()) as Partial<User>
    currentUser = { ...currentUser, ...updates } as User
    if (typeof window !== 'undefined') {
      localStorage.setItem('kurio_auth_user', JSON.stringify(currentUser))
    }
    return HttpResponse.json({ success: true, profile: currentUser })
  }),

  http.post('/api/profile/password', async ({ request }) => {
    const scenario = resolveScenario(request)
    const fault = checkGenericFault(scenario, true)
    if (fault) return fault

    await applyLatency(scenario, 150)
    const body = (await request.json()) as { currentPassword?: string; newPassword?: string }
    if (!body.newPassword || body.newPassword.length < 6) {
      return new HttpResponse(
        JSON.stringify({ error: 'A nova senha deve ter no mínimo 6 caracteres.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (currentUser) {
      const match = registeredUsers.find(
        (u) => u.id === currentUser?.id || u.email.toLowerCase() === currentUser?.email.toLowerCase()
      )
      if (match) {
        match.password = body.newPassword
        saveRegisteredUsers()
      }
    }

    return HttpResponse.json({ success: true, message: 'Senha atualizada com sucesso!' })
  }),

  // Wallets API (Consulta, Cadastro e Atualização)
  http.get('/api/wallets', async ({ request }) => {
    const scenario = resolveScenario(request)
    const fault = checkGenericFault(scenario, true)
    if (fault) return fault

    await applyLatency(scenario, 60)
    let wallets = null
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('kurio_wallets')
        if (stored) wallets = JSON.parse(stored)
      }
    } catch (e) {
      console.error(e)
    }
    return HttpResponse.json({ wallets })
  }),

  http.post('/api/wallets', async ({ request }) => {
    const scenario = resolveScenario(request)
    const fault = checkGenericFault(scenario, true)
    if (fault) return fault

    await applyLatency(scenario, 120)
    const wallets = await request.json()
    if (typeof window !== 'undefined') {
      localStorage.setItem('kurio_wallets', JSON.stringify(wallets))
    }
    return HttpResponse.json({ success: true, wallets })
  }),

  http.put('/api/wallets', async ({ request }) => {
    const scenario = resolveScenario(request)
    const fault = checkGenericFault(scenario, true)
    if (fault) return fault

    await applyLatency(scenario, 120)
    const wallets = await request.json()
    if (typeof window !== 'undefined') {
      localStorage.setItem('kurio_wallets', JSON.stringify(wallets))
    }
    return HttpResponse.json({ success: true, wallets })
  }),

  // Reset scenario
  http.post('/api/reset', async () => {
    nfts = [...INITIAL_NFTS]
    favoriteIds = new Set<string>(['nft-2'])
    currentUser = { ...FIXTURE_USERS[0] }
    cartItems = [
      { id: 'nft-1', quantity: 2, priceEth: '1.19', tokenId: '#0042', edition: '1/50' },
      { id: 'nft-5', quantity: 6, priceEth: '1.39', tokenId: '#0009', edition: '1/20' },
      { id: 'nft-6', quantity: 9, priceEth: '1.79', tokenId: '#0552', edition: '1/10' },
    ]
    ordersByIdempotencyKey.clear()
    resetActiveScenario()

    registeredUsers = [...FIXTURE_USERS]
    saveRegisteredUsers()

    if (typeof window !== 'undefined') {
      localStorage.setItem('kurio_auth_user', JSON.stringify(currentUser))
      localStorage.setItem('kurio_favorites', JSON.stringify([...favoriteIds]))
      localStorage.setItem('kurio_cart_items', JSON.stringify(cartItems))
      localStorage.removeItem('kurio_wallets')
      localStorage.removeItem('kurio_registered_users')
    }

    return HttpResponse.json({ success: true, message: 'Estado e fixtures resetados com sucesso.' })
  }),
]

// Reconciles REST memory state with realtime event broadcasts
export const updateNFTRealtime = (event: import('../types/realtime').NFTUpdatedEvent) => {
  const nft = nfts.find((n) => n.id === event.nftId)
  if (nft) {
    event.oldPriceEth = nft.priceEth
    event.title = nft.title
    nft.priceEth = event.priceEth
    nft.availableQuantity = event.availableQuantity
  }
  const cartItem = cartItems.find((c) => c.id === event.nftId)
  if (cartItem) {
    cartItem.priceEth = event.priceEth
    saveCart()
  }
  emitSocketIOEvent('nft.updated', event)
}

export const updateOrderRealtime = (event: import('../types/realtime').OrderUpdatedEvent) => {
  for (const [_, entry] of ordersByIdempotencyKey.entries()) {
    if (entry.order.orderId === event.orderId) {
      entry.order.status = event.status
    }
  }
  emitSocketIOEvent('order.updated', event)
}

if (typeof window !== 'undefined') {
  ;(window as any).__updateNFTRealtime = updateNFTRealtime
  ;(window as any).__updateOrderRealtime = updateOrderRealtime
}


