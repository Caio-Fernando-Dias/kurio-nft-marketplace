import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
  Outlet,
  useSearch,
  useNavigate,
  useParams,
} from '@tanstack/react-router'

import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { HomePage } from './pages/HomePage'
import { NFTDetailPage } from './pages/NFTDetailPage'
import { CartPage } from './pages/CartPage'
import { PaymentPage } from './pages/PaymentPage'
import { OrderConfirmationPage } from './pages/OrderConfirmationPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { CollectorProfilePage } from './pages/CollectorProfilePage'
import { WalletsPage } from './pages/WalletsPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { AuthGuard } from './components/auth/AuthGuard'
import type { NFTFilters } from './types/nft'
import { RealtimeProvider } from './context/RealtimeContext'
import { MockDevToolbar } from './components/dev/MockDevToolbar'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function AppRootLayout() {
  return (
    <>
      <Outlet />
      <MockDevToolbar />
    </>
  )
}

// Root Route containing Providers and Layout Outlet
const rootRoute = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <RealtimeProvider>
            <AppRootLayout />
          </RealtimeProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  ),
})

// Index Route with typed Search Params validation for filters and pagination
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  validateSearch: (search: Record<string, unknown>): NFTFilters => {
    return {
      search: typeof search.search === 'string' && search.search ? search.search : undefined,
      collection: typeof search.collection === 'string' && search.collection ? search.collection : undefined,
      minPrice: search.minPrice !== undefined ? Number(search.minPrice) : undefined,
      maxPrice: search.maxPrice !== undefined ? Number(search.maxPrice) : undefined,
      network: typeof search.network === 'string' && search.network ? search.network : undefined,
      category: (search.category as any) || 'all',
      sort: (search.sort as any) || 'recent',
      page: search.page ? Math.max(1, Number(search.page)) : 1,
    }
  },
  component: HomeRouteComponent,
})

function HomeRouteComponent() {
  const search = useSearch({ from: '/' })
  const navigate = useNavigate({ from: '/' })

  const handleFilterChange = (newFilters: Partial<NFTFilters>) => {
    const updated: NFTFilters = { ...search, ...newFilters };
    const keys = Object.keys(updated) as (keyof NFTFilters)[];
    for (const key of keys) {
      if (updated[key] === undefined) {
        delete updated[key];
      }
    }

    navigate({
      search: updated as any,
    });
  };

  return <HomePage filters={search} onFilterChange={handleFilterChange} />
}

const nftDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/nft/$id',
  component: NFTDetailRouteComponent,
})

function NFTDetailRouteComponent() {
  const { id } = useParams({ from: '/nft/$id' })
  return <NFTDetailPage id={id} />
}

const detalhesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/detalhes/$id',
  component: DetalhesRouteComponent,
})

function DetalhesRouteComponent() {
  const { id } = useParams({ from: '/detalhes/$id' })
  return <NFTDetailPage id={id} />
}

const carrinhoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/carrinho',
  component: CartPage,
})

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart',
  component: CartPage,
})

const pagamentoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pagamento',
  component: PaymentPage,
})

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout',
  component: PaymentPage,
})

const confirmacaoPedidoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/confirmacao-pedido',
  component: OrderConfirmationPage,
})

const confirmacaoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/confirmacao',
  component: OrderConfirmationPage,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})

const entrarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/entrar',
  component: LoginPage,
})

const cadastroRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cadastro',
  component: RegisterPage,
})

const registroRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/registro',
  component: RegisterPage,
})

const perfilRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/perfil',
  component: () => (
    <AuthGuard fallbackTitle="Perfil do Colecionador">
      <CollectorProfilePage />
    </AuthGuard>
  ),
})

const perfilColecionadorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/perfil-colecionador',
  component: () => (
    <AuthGuard fallbackTitle="Perfil do Colecionador">
      <CollectorProfilePage />
    </AuthGuard>
  ),
})

const carteirasRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/carteiras',
  component: () => (
    <AuthGuard fallbackTitle="Gerenciamento de Carteiras">
      <WalletsPage />
    </AuthGuard>
  ),
})

const walletsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/wallets',
  component: () => (
    <AuthGuard fallbackTitle="Gerenciamento de Carteiras">
      <WalletsPage />
    </AuthGuard>
  ),
})

const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '*',
  component: NotFoundPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  nftDetailRoute,
  detalhesRoute,
  carrinhoRoute,
  cartRoute,
  pagamentoRoute,
  checkoutRoute,
  confirmacaoPedidoRoute,
  confirmacaoRoute,
  loginRoute,
  entrarRoute,
  cadastroRoute,
  registroRoute,
  perfilRoute,
  perfilColecionadorRoute,
  carteirasRoute,
  walletsRoute,
  notFoundRoute,
])


const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export default function App() {
  return <RouterProvider router={router} />
}
