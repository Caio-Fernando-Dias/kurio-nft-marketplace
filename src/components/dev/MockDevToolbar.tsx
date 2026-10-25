import React, { useState, useEffect } from 'react'
import {
  getActiveScenario,
  setActiveScenario,
  resetActiveScenario,
  MockScenario,
} from '../../mocks/scenarios'
import { FIXTURE_USERS } from '../../mocks/data/users'
import { useAuth } from '../../hooks/useAuth'
import { simulateNFTUpdate, simulateOrderUpdate } from '../../services/socket'
import { resetScenario } from '../../services/api'

export const MockDevToolbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentScenario, setCurrentScenario] = useState<MockScenario>(getActiveScenario())
  const { user, login } = useAuth()
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  useEffect(() => {
    setCurrentScenario(getActiveScenario())
  }, [])

  const handleScenarioChange = (scenario: MockScenario) => {
    setActiveScenario(scenario)
    setCurrentScenario(scenario)
    setStatusMessage(`Cenário alterado para: ${scenario}`)
    setTimeout(() => setStatusMessage(null), 3000)
  }

  const handleSwitchUser = async (email: string) => {
    try {
      await login({ email, password: 'kurio123' })
      setStatusMessage(`Logado como: ${email}`)
      setTimeout(() => setStatusMessage(null), 3000)
    } catch (err: any) {
      setStatusMessage(`Erro ao trocar usuário: ${err.message}`)
    }
  }

  const handleTriggerRealtime = () => {
    // Simulates price increase of nft-1 (which is in default cart)
    const newPrice = (1.19 + (Math.floor(Math.random() * 20) + 1) / 100).toFixed(2)
    simulateNFTUpdate({
      nftId: 'nft-1',
      title: 'Emerald Ape #042',
      priceEth: newPrice,
      availableQuantity: 4,
      version: Date.now(),
      updatedAt: new Date().toISOString(),
    })
    setStatusMessage(`Socket.IO nft.updated emitido! Novo preço: ${newPrice} ETH`)
    setTimeout(() => setStatusMessage(null), 4000)
  }

  const handleTriggerDuplicateRealtime = () => {
    // Emits outdated/duplicate event with version 0 (must be ignored per Section 7)
    simulateNFTUpdate({
      nftId: 'nft-1',
      title: 'Emerald Ape #042',
      priceEth: '0.01',
      availableQuantity: 99,
      version: 0,
      updatedAt: '2020-01-01T00:00:00Z',
    })
    setStatusMessage('Socket.IO nft.updated antigo (v0) emitido! Deve ser descartado sem regressão.')
    setTimeout(() => setStatusMessage(null), 4000)
  }

  const handleTriggerOrderConfirmed = () => {
    simulateOrderUpdate({
      orderId: 'order-sample-realtime',
      userId: user?.id,
      status: 'confirmed',
      version: Date.now(),
    })
    setStatusMessage('Socket.IO order.updated emitido (Pedido confirmado)!')
    setTimeout(() => setStatusMessage(null), 4000)
  }

  const handleTriggerOrderRejected = () => {
    simulateOrderUpdate({
      orderId: 'order-sample-realtime',
      userId: user?.id,
      status: 'rejected',
      version: Date.now(),
    })
    setStatusMessage('Socket.IO order.updated emitido (Pedido recusado)!')
    setTimeout(() => setStatusMessage(null), 4000)
  }

  const handleTriggerOtherUserOrder = () => {
    // Emits order event with different userId (must be ignored by active user)
    simulateOrderUpdate({
      orderId: 'order-other-user',
      userId: 'user-isolated-999',
      status: 'confirmed',
      version: Date.now(),
    })
    setStatusMessage('Socket.IO order.updated emitido para outro usuário (isolado com sucesso)!')
    setTimeout(() => setStatusMessage(null), 4000)
  }

  const handleReset = async () => {
    try {
      await resetScenario()
      resetActiveScenario()
      setCurrentScenario('default')
      setStatusMessage('Estado restaurado para as fixtures originais!')
      setTimeout(() => {
        window.location.reload()
      }, 800)
    } catch (err: any) {
      setStatusMessage(`Erro no reset: ${err.message}`)
    }
  }

  return (
    <aside
      aria-label="Controle de Cenários MSW"
      className="fixed bottom-4 left-4 z-50 font-mono text-[12px] select-none"
    >
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="bg-[#241612] hover:bg-[#2F1D15] text-[#E89B55] border border-[#3F2319] hover:border-[#D28A4C] px-3 py-1.5 rounded-[8px] shadow-lg flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          title="Abrir painel de controle de mocks MSW"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>MSW & Cenários</span>
          {currentScenario !== 'default' && (
            <span className="bg-[#D28A4C] text-[#140D0A] font-bold px-1.5 py-0.5 rounded text-[10px]">
              {currentScenario}
            </span>
          )}
        </button>
      ) : (
        <div className="bg-[#1C120E] border border-[#3F2319] text-[#F5F1EB] rounded-[10px] p-4 shadow-2xl w-[320px] max-h-[85vh] overflow-y-auto flex flex-col gap-3">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#3F2319] pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="font-bold text-[#E89B55] text-[13px]">Controle MSW Seção 6</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-[#CFB28C] hover:text-[#F5F1EB] p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div className="bg-[#241612] border border-[#D28A4C]/50 text-[#E89B55] px-2.5 py-1.5 rounded text-[11px]">
              {statusMessage}
            </div>
          )}

          {/* Scenario Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[#CFB28C] font-semibold text-[11px] uppercase tracking-wider">
              Cenário Determinístico:
            </label>
            <select
              value={currentScenario}
              onChange={(e) => handleScenarioChange(e.target.value as MockScenario)}
              className="bg-[#241612] border border-[#3F2319] text-[#F5F1EB] rounded px-2 py-1.5 outline-none focus:border-[#D28A4C] cursor-pointer"
            >
              <option value="default">Normal (120ms)</option>
              <option value="empty_catalog">Resultado Vazio (Catálogo)</option>
              <option value="slow_network">Lentidão (2000ms)</option>
              <option value="variable_latency">Latência Variável (Fora de ordem)</option>
              <option value="network_error">Falha de Conexão (Network Error)</option>
              <option value="server_error_500">Erro 500 (Servidor)</option>
              <option value="service_unavailable_503">Erro 503 (Indisponível)</option>
              <option value="unauthorized_401">Sessão Expirada (401)</option>
              <option value="forbidden_403">Acesso Proibido (403)</option>
              <option value="register_conflict_409">Conflito de Cadastro (409)</option>
              <option value="invalid_coupon">Cupom Inválido (400)</option>
              <option value="edition_sold_out">Edição Esgotada (409)</option>
              <option value="order_timeout">Timeout com Recuperação Idempotente</option>
              <option value="payment_refused">Pagamento Recusado (400)</option>
            </select>
          </div>

          {/* User Switcher (pelo menos 2 usuários) */}
          <div className="flex flex-col gap-1.5 border-t border-[#3F2319] pt-2">
            <label className="text-[#CFB28C] font-semibold text-[11px] uppercase tracking-wider">
              Alternar Usuário:
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {FIXTURE_USERS.map((u) => {
                const isActive = user?.email === u.email
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleSwitchUser(u.email)}
                    className={`px-2 py-1.5 rounded text-[11px] border text-left truncate cursor-pointer transition-colors ${
                      isActive
                        ? 'border-[#D28A4C] bg-[#3F2319] text-[#E89B55] font-bold'
                        : 'border-[#3F2319] bg-[#241612] text-[#F5F1EB] hover:border-[#CFB28C]'
                    }`}
                  >
                    {u.name.split(' ')[0]}
                  </button>
                )
              })}
            </div>
            <div className="text-[10px] text-[#B39463]">
              Atual: {user ? `${user.name} (${user.email})` : 'Visitante'}
            </div>
          </div>

          {/* Real-time Socket.IO Trigger */}
          <div className="flex flex-col gap-1.5 border-t border-[#3F2319] pt-2">
            <label className="text-[#CFB28C] font-semibold text-[11px] uppercase tracking-wider">
              Tempo Real Socket.IO:
            </label>
            <div className="flex flex-col gap-1.5">
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={handleTriggerRealtime}
                  className="bg-[#241612] hover:bg-[#3F2319] text-[#E89B55] border border-[#3F2319] hover:border-[#D28A4C] px-2 py-1.5 rounded text-center cursor-pointer transition-colors active:scale-95 text-[11px]"
                  title="Altera preço do NFT #042 no carrinho"
                >
                  nft.updated (Preço)
                </button>
                <button
                  type="button"
                  onClick={handleTriggerDuplicateRealtime}
                  className="bg-[#241612] hover:bg-[#3F2319] text-[#CFB28C] border border-[#3F2319] hover:border-[#D28A4C] px-2 py-1.5 rounded text-center cursor-pointer transition-colors active:scale-95 text-[11px]"
                  title="Emite evento antigo com version: 0"
                >
                  nft.v0 (Descartar)
                </button>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={handleTriggerOrderConfirmed}
                  className="bg-[#241612] hover:bg-[#3F2319] text-emerald-400 border border-[#3F2319] hover:border-emerald-500 px-2 py-1.5 rounded text-center cursor-pointer transition-colors active:scale-95 text-[11px]"
                  title="Emite order.updated confirmando pedido"
                >
                  order (Confirmado)
                </button>
                <button
                  type="button"
                  onClick={handleTriggerOrderRejected}
                  className="bg-[#241612] hover:bg-[#3F2319] text-rose-400 border border-[#3F2319] hover:border-rose-500 px-2 py-1.5 rounded text-center cursor-pointer transition-colors active:scale-95 text-[11px]"
                  title="Emite order.updated recusando pedido"
                >
                  order (Recusado)
                </button>
              </div>
              <button
                type="button"
                onClick={handleTriggerOtherUserOrder}
                className="w-full bg-[#241612] hover:bg-[#3F2319] text-[#CFB28C] border border-[#3F2319] hover:border-[#D28A4C] px-2 py-1.5 rounded text-center cursor-pointer transition-colors active:scale-95 text-[11px]"
                title="Emite order.updated para outro usuário (isolamento de sessão)"
              >
                order (Isolamento de Outro Usuário)
              </button>
            </div>
          </div>

          {/* Reset button */}
          <div className="flex gap-2 border-t border-[#3F2319] pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="w-full bg-[#3F2319] hover:bg-[#D28A4C] hover:text-[#140D0A] text-[#F5F1EB] font-bold py-1.5 rounded text-center cursor-pointer transition-colors"
            >
              Resetar Estado & Mocks
            </button>
          </div>
        </div>
      )}
    </aside>
  )
}
