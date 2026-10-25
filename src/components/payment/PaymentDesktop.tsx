import React, { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import type { CartResponse } from '../../types/cart'
import { useAuth } from '../../hooks/useAuth'

interface PaymentDesktopProps {
  cart: CartResponse | undefined
  isLoading?: boolean
  isProcessing?: boolean
  isOutdatedQuote?: boolean
  paymentError?: string | null
  onConfirmPurchase: () => void
}

export const PaymentDesktop: React.FC<PaymentDesktopProps> = ({
  cart,
  isProcessing,
  isOutdatedQuote,
  paymentError,
  onConfirmPurchase,
}) => {
  const { user, isAuthenticated } = useAuth()

  // Form states matching Desktop_Pagamento.css - empty when user is not logged in
  const [displayName, setDisplayName] = useState(isAuthenticated && user ? user.name : '')
  const [username, setUsername] = useState(
    isAuthenticated && user && user.email ? `@${user.email.split('@')[0]}` : ''
  )
  const [network, setNetwork] = useState(isAuthenticated && user ? 'Ethereum' : '')
  const [profileName, setProfileName] = useState(
    isAuthenticated && user && user.name ? user.name : ''
  )
  const [walletAddress, setWalletAddress] = useState(
    isAuthenticated && user && user.walletAddress ? user.walletAddress : ''
  )
  const [secondaryWallet, setSecondaryWallet] = useState('')
  const [walletType, setWalletType] = useState(isAuthenticated && user ? 'Coinbase Wallet' : '')
  const [referralCode, setReferralCode] = useState('')
  const [email, setEmail] = useState(isAuthenticated && user ? user.email : '')
  const [ensName, setEnsName] = useState(
    isAuthenticated && user && user.email ? user.email.split('@')[0] : ''
  )
  const [useOtherWallet, setUseOtherWallet] = useState(false)
  const [collectorNote, setCollectorNote] = useState('')
  const [selectedWalletRadio, setSelectedWalletRadio] = useState<'supported' | 'metamask' | 'coinbase' | ''>(
    isAuthenticated && user ? 'coinbase' : ''
  )

  useEffect(() => {
    if (isAuthenticated && user) {
      setDisplayName(user.name || '')
      setUsername(user.email ? `@${user.email.split('@')[0]}` : '')
      setProfileName(user.name || '')
      setWalletAddress(user.walletAddress || '')
      setEmail(user.email || '')
      setEnsName(user.email ? user.email.split('@')[0] : '')
      setNetwork((prev) => prev || 'Ethereum')
      setWalletType((prev) => prev || 'Coinbase Wallet')
      setSelectedWalletRadio((prev) => prev || 'coinbase')
    } else {
      setDisplayName('')
      setUsername('')
      setProfileName('')
      setWalletAddress('')
      setEmail('')
      setEnsName('')
      setSecondaryWallet('')
      setReferralCode('')
      setCollectorNote('')
      setNetwork('')
      setWalletType('')
      setSelectedWalletRadio('')
      setUseOtherWallet(false)
    }
  }, [isAuthenticated, user])

  // Promo code in summary
  const [showPromoInput, setShowPromoInput] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)

  // Default fallback cart items matching Figma (Desktop_Pagamento.css lines 2453-2980)
  const fallbackItems = [
    {
      id: 'item-1',
      title: 'Emerald Ape #042',
      tokenId: '#0042',
      quantity: 2,
      priceEth: '1.19',
      totalEth: '2.38',
      image: '/assets/image.png',
    },
    {
      id: 'item-2',
      title: 'Violet Nomad #314',
      tokenId: '#0009',
      quantity: 6,
      priceEth: '1.39',
      totalEth: '8.34',
      image: '/assets/image2.png',
    },
    {
      id: 'item-3',
      title: 'Ivory Baron #088',
      tokenId: '#0552',
      quantity: 9,
      priceEth: '1.79',
      totalEth: '16.11',
      image: '/assets/image3.png',
    },
  ]

  const items = cart?.items && cart.items.length > 0
    ? cart.items.map((it) => ({
        id: it.id,
        title: it.nft.title,
        tokenId: it.tokenId || `#00${it.nft.id.replace('nft-', '')}`,
        quantity: it.quantity,
        priceEth: it.priceEth,
        totalEth: (parseFloat(it.priceEth) * it.quantity).toFixed(2),
        image: it.nft.image,
      }))
    : fallbackItems

  const subtotal = cart?.subtotalEth || '26.83'
  const discount = promoApplied ? '2.00' : (cart?.discountEth || '00.00')
  const networkFee = cart?.networkFeeEth || '0.016'
  const totalEth = promoApplied
    ? Math.max(0, parseFloat(subtotal) - 2.0 + parseFloat(networkFee)).toFixed(3)
    : (cart?.totalEth || '26.846')

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault()
    if (promoCode.trim().toUpperCase() === 'KURIO') {
      setPromoApplied(true)
    }
  }

  return (
    <div className="w-full flex flex-col gap-[32px] font-mono text-[#F5F1EB]">
      {/* Breadcrumb: Início / Mercado / Pagamento (Desktop_Pagamento.css line 533) */}
      <nav aria-label="Breadcrumb" className="flex items-center text-[15px] font-bold leading-[16px]">
        <a href="/" className="hover:text-[#E89B55] transition-colors">
          Início
        </a>
        <span className="mx-2 text-[#CFB28C]">/</span>
        <a href="/#catalogo" className="hover:text-[#E89B55] transition-colors">
          Mercado
        </a>
        <span className="mx-2 text-[#CFB28C]">/</span>
        <span className="text-[#F5F1EB]">Pagamento</span>
      </nav>

      {/* Frame 327: Two columns layout (1200px wide, gap 32px) */}
      <div className="w-full flex justify-between items-start gap-[32px]">
        {/* ============================================================== */}
        {/* LEFT COLUMN: Frame 292 — Perfil do colecionador (763px wide)   */}
        {/* ============================================================== */}
        <div className="w-[763px] shrink-0 flex flex-col gap-[12px]">
          {/* Section Title */}
          <h2 className="text-[17px] font-bold leading-[16px] text-[#F5F1EB]">
            Perfil do colecionador
          </h2>

          {/* Form Container (Frame 291: gap 24px) */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              onConfirmPurchase()
            }}
            className="w-full flex flex-col gap-[24px]"
          >
            {/* 
              Frame 290: 2 Columns of Form Fields (763px wide, gap 24px)
              Left Column (Frame 289, 369.5px) and Right Column (Frame 288, 369.5px)
            */}
            <div className="w-full flex items-start gap-[24px]">
              {/* LEFT COLUMN (Frame 289: 369.5px wide, gap 12px) */}
              <div className="w-[369.5px] flex flex-col gap-[12px]">
                {/* 1. Nome de exibição */}
                <div className="w-full h-[69px] flex flex-col justify-between">
                  <label htmlFor="pay-display-name" className="flex items-center gap-[4px] text-[15px] font-normal leading-[15px] text-[#F5F1EB]">
                    <span>Nome de exibição</span>
                    <span className="text-[#F0805F] text-[22px] leading-[15px]">*</span>
                  </label>
                  <input
                    id="pay-display-name"
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder=""
                    className="w-full h-[40px] px-3 bg-transparent border border-[#3F2319] rounded-[3px] text-[14px] text-[#F5F1EB] outline-none focus:border-[#D28A4C] transition-colors"
                  />
                </div>

                {/* 2. Rede */}
                <div className="w-full h-[69px] flex flex-col justify-between">
                  <label htmlFor="pay-network" className="flex items-center gap-[4px] text-[15px] font-normal leading-[15px] text-[#F5F1EB]">
                    <span>Rede</span>
                    <span className="text-[#F0805F] text-[22px] leading-[15px]">*</span>
                  </label>
                  <div className="relative w-full">
                    <select
                      id="pay-network"
                      value={network}
                      onChange={(e) => setNetwork(e.target.value)}
                      required
                      className={`w-full h-[40px] px-3 bg-transparent border border-[#3F2319] rounded-[3px] text-[14px] outline-none focus:border-[#D28A4C] transition-colors appearance-none cursor-pointer ${
                        network ? 'text-[#F5F1EB]' : 'text-[#B39463]'
                      }`}
                    >
                      <option value="" disabled className="bg-[#241612] text-[#B39463]">
                        Selecione uma rede
                      </option>
                      <option value="Ethereum" className="bg-[#241612] text-[#F5F1EB]">Ethereum</option>
                      <option value="Polygon" className="bg-[#241612] text-[#F5F1EB]">Polygon</option>
                      <option value="Solana" className="bg-[#241612] text-[#F5F1EB]">Solana</option>
                      <option value="Arbitrum" className="bg-[#241612] text-[#F5F1EB]">Arbitrum</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#B39463] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* 3. Endereço da carteira */}
                <div className="w-full h-[69px] flex flex-col justify-between">
                  <label htmlFor="pay-wallet-address" className="flex items-center gap-[4px] text-[15px] font-normal leading-[15px] text-[#F5F1EB]">
                    <span>Endereço da carteira</span>
                    <span className="text-[#F0805F] text-[22px] leading-[15px]">*</span>
                  </label>
                  <input
                    id="pay-wallet-address"
                    type="text"
                    required
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    placeholder="Endereço 0x da carteira"
                    className="w-full h-[40px] px-3 bg-transparent border border-[#3F2319] rounded-[3px] text-[14px] text-[#F5F1EB] placeholder:text-[#B39463] outline-none focus:border-[#D28A4C] transition-colors font-mono"
                  />
                </div>

                {/* 4. Tipo de carteira */}
                <div className="w-full h-[69px] flex flex-col justify-between">
                  <label htmlFor="pay-wallet-type" className="flex items-center gap-[4px] text-[15px] font-normal leading-[15px] text-[#F5F1EB]">
                    <span>Tipo de carteira</span>
                    <span className="text-[#F0805F] text-[22px] leading-[15px]">*</span>
                  </label>
                  <div className="relative w-full">
                    <select
                      id="pay-wallet-type"
                      value={walletType}
                      onChange={(e) => setWalletType(e.target.value)}
                      required
                      className={`w-full h-[40px] px-3 bg-transparent border border-[#3F2319] rounded-[3px] text-[14px] outline-none focus:border-[#D28A4C] transition-colors appearance-none cursor-pointer ${
                        walletType ? 'text-[#F5F1EB]' : 'text-[#B39463]'
                      }`}
                    >
                      <option value="" disabled className="bg-[#241612] text-[#B39463]">
                        Selecione uma carteira
                      </option>
                      <option value="Coinbase Wallet" className="bg-[#241612] text-[#F5F1EB]">Coinbase Wallet</option>
                      <option value="MetaMask" className="bg-[#241612] text-[#F5F1EB]">MetaMask</option>
                      <option value="WalletConnect" className="bg-[#241612] text-[#F5F1EB]">WalletConnect</option>
                      <option value="Phantom" className="bg-[#241612] text-[#F5F1EB]">Phantom</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#B39463] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* 5. E-mail */}
                <div className="w-full h-[69px] flex flex-col justify-between">
                  <label htmlFor="pay-email" className="flex items-center gap-[4px] text-[15px] font-normal leading-[15px] text-[#F5F1EB]">
                    <span>E-mail</span>
                    <span className="text-[#F0805F] text-[22px] leading-[15px]">*</span>
                  </label>
                  <input
                    id="pay-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder=""
                    className="w-full h-[40px] px-3 bg-transparent border border-[#3F2319] rounded-[3px] text-[14px] text-[#F5F1EB] outline-none focus:border-[#D28A4C] transition-colors"
                  />
                </div>
              </div>

              {/* RIGHT COLUMN (Frame 288: 369.5px wide, gap 12px) */}
              <div className="w-[369.5px] flex flex-col gap-[12px]">
                {/* 1. Nome de usuário (à direita de Nome de exibição) */}
                <div className="w-full h-[69px] flex flex-col justify-between">
                  <label htmlFor="pay-username" className="flex items-center gap-[4px] text-[15px] font-normal leading-[15px] text-[#F5F1EB]">
                    <span>Nome de usuário</span>
                    <span className="text-[#F0805F] text-[22px] leading-[15px]">*</span>
                  </label>
                  <input
                    id="pay-username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder=""
                    className="w-full h-[40px] px-3 bg-transparent border border-[#3F2319] rounded-[3px] text-[14px] text-[#F5F1EB] outline-none focus:border-[#D28A4C] transition-colors"
                  />
                </div>

                {/* 2. Nome do perfil (à direita de Rede) */}
                <div className="w-full h-[69px] flex flex-col justify-between">
                  <label htmlFor="pay-profile-name" className="flex items-center gap-[4px] text-[15px] font-normal leading-[15px] text-[#F5F1EB]">
                    <span>Nome do perfil</span>
                    <span className="text-[#F0805F] text-[22px] leading-[15px]">*</span>
                  </label>
                  <input
                    id="pay-profile-name"
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    placeholder=""
                    className="w-full h-[40px] px-3 bg-transparent border border-[#3F2319] rounded-[3px] text-[14px] text-[#F5F1EB] outline-none focus:border-[#D28A4C] transition-colors"
                  />
                </div>

                {/* 3. ENS ou carteira secundária (opcional) (Frame 328: à direita de Endereço da carteira) */}
                <div className="w-full h-[69px] flex flex-col justify-end">
                  <label htmlFor="pay-secondary-wallet" className="sr-only">
                    ENS ou carteira secundária
                  </label>
                  <input
                    id="pay-secondary-wallet"
                    type="text"
                    value={secondaryWallet}
                    onChange={(e) => setSecondaryWallet(e.target.value)}
                    placeholder="ENS ou carteira secundária (opcional)"
                    className="w-full h-[40px] px-3 bg-transparent border border-[#3F2319] rounded-[3px] text-[14px] text-[#F5F1EB] placeholder:text-[#B39463] outline-none focus:border-[#D28A4C] transition-colors"
                  />
                </div>

                {/* 4. Código de indicação (à direita de Tipo de carteira) */}
                <div className="w-full h-[69px] flex flex-col justify-between">
                  <label htmlFor="pay-referral-code" className="flex items-center gap-[4px] text-[15px] font-normal leading-[15px] text-[#F5F1EB]">
                    <span>Código de indicação</span>
                    <span className="text-[#F0805F] text-[22px] leading-[15px]">*</span>
                  </label>
                  <input
                    id="pay-referral-code"
                    type="text"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    placeholder=""
                    className="w-full h-[40px] px-3 bg-transparent border border-[#3F2319] rounded-[3px] text-[14px] text-[#F5F1EB] outline-none focus:border-[#D28A4C] transition-colors"
                  />
                </div>

                {/* 5. Nome ENS com sufixo .eth (à direita de E-mail) */}
                <div className="w-full h-[69px] flex flex-col justify-between">
                  <label htmlFor="pay-ens-name" className="flex items-center gap-[4px] text-[15px] font-normal leading-[15px] text-[#F5F1EB]">
                    <span>Nome ENS</span>
                    <span className="text-[#F0805F] text-[22px] leading-[15px]">*</span>
                  </label>
                  <div className="w-full flex items-center">
                    <input
                      id="pay-ens-name"
                      type="text"
                      required
                      value={ensName}
                      onChange={(e) => setEnsName(e.target.value)}
                      placeholder=""
                      className="flex-1 h-[40px] px-3 bg-transparent border border-r-0 border-[#3F2319] rounded-l-[3px] text-[14px] text-[#F5F1EB] outline-none focus:border-[#D28A4C] transition-colors"
                    />
                    <div className="w-[78px] h-[40px] bg-transparent border border-[#3F2319] rounded-r-[3px] flex items-center justify-center gap-1 cursor-pointer">
                      <span className="text-[15px] text-[#F5F1EB] font-mono">.eth</span>
                      <ChevronDown className="w-3.5 h-3.5 text-[#B39463]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Toggle / Radio: Usar outra carteira? (Frame 285) */}
            <div
              className="w-full flex items-center gap-[8px] cursor-pointer select-none"
              onClick={() => setUseOtherWallet(!useOtherWallet)}
            >
              <div className="w-[15px] h-[15px] rounded-full border-2 border-[#D28A4C] flex items-center justify-center">
                {useOtherWallet && <div className="w-[7px] h-[7px] rounded-full bg-[#D28A4C]" />}
              </div>
              <span className="text-[15px] font-normal leading-[20px] text-[#F5F1EB]">
                Usar outra carteira?
              </span>
            </div>

            {/* Textarea: Observação do colecionador (opcional) (Frame 286: 350px de largura - caixa pela metade) */}
            <div className="w-[350px] flex flex-col gap-[8px]">
              <label className="text-[15px] font-normal leading-[15px] text-[#F5F1EB]">
                Observação do colecionador (opcional)
              </label>
              <textarea
                value={collectorNote}
                onChange={(e) => setCollectorNote(e.target.value)}
                placeholder="Adicione notas ou preferências..."
                rows={5}
                className="w-[350px] h-[152px] p-3 bg-transparent border border-[#3F2319] rounded-[3px] text-[14px] text-[#F5F1EB] placeholder:text-[#B39463]/60 outline-none focus:border-[#D28A4C] transition-colors resize-none font-mono"
              />
            </div>
          </form>
        </div>

        {/* ============================================================== */}
        {/* RIGHT COLUMN: Frame 325 — Seus NFTs (405px wide)               */}
        {/* ============================================================== */}
        <div className="w-[405px] shrink-0 flex flex-col gap-[12px]">
          {/* Section Title */}
          <h2 className="text-[17px] font-bold leading-[16px] text-[#F5F1EB]">
            Seus NFTs
          </h2>

          <div className="w-full flex flex-col gap-[12px]">
            {/* Table Header: NFTs and Subtotal */}
            <div className="w-full flex justify-between items-center text-[16px] leading-[16px] h-[16px]">
              <span className="font-bold text-[#F5F1EB]">NFTs</span>
              <span className="font-medium text-[#F5F1EB]">Subtotal</span>
            </div>

            {/* Hairline divider Line 2 (0.3px solid #D28A4C) */}
            <div className="w-full border-t border-[#D28A4C] opacity-30" />

            {/* Cart Items List */}
            <div className="w-full flex flex-col gap-[12px]">
              {items.map((it) => (
                <div
                  key={it.id}
                  className="w-full h-[70px] bg-[#241612] flex items-center justify-between px-[12px] rounded-[6px]"
                >
                  <div className="flex items-center gap-[8px]">
                    <img
                      src={it.image}
                      alt={it.title}
                      className="w-[70px] h-[70px] object-cover rounded-[8px] -ml-[12px] shrink-0"
                    />
                    <div className="w-[154px] flex flex-col gap-[6px] pl-[8px] shrink-0">
                      <span className="text-[16px] font-bold leading-[16px] text-[#F5F1EB] truncate">
                        {it.title}
                      </span>
                      <span className="text-[14px] font-normal leading-[16px] text-[#B39463] truncate">
                        ID do token: {it.tokenId}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-[16px] shrink-0">
                    <span className="text-[14px] font-normal leading-[16px] text-[#CFB28C]">
                      (x {it.quantity})
                    </span>
                    <span className="text-[18px] font-bold leading-[16px] text-[#E89B55] text-right min-w-[85px]">
                      {it.totalEth} ETH
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Breakdown Frame 315 */}
            <div className="w-full flex flex-col gap-[12px] mt-[12px]">
              {/* Promo code link */}
              <div className="w-full text-center">
                <button
                  type="button"
                  onClick={() => setShowPromoInput(!showPromoInput)}
                  className="text-[14px] font-normal leading-[16px] text-[#F5F1EB] hover:text-[#E89B55] transition-colors cursor-pointer"
                >
                  Tem um código promocional? Aplique aqui
                </button>
              </div>

              {showPromoInput && (
                <form onSubmit={handleApplyPromo} className="w-full h-[40px] flex items-center border border-[#D28A4C] rounded-[3px] overflow-hidden bg-transparent">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Código (ex: KURIO)..."
                    className="flex-1 h-full bg-transparent pl-3 text-[12px] text-[#F5F1EB] placeholder:text-[#B39463] outline-none font-mono"
                  />
                  <button
                    type="submit"
                    className="w-[90px] h-full bg-[#D28A4C] text-[14px] font-bold text-[#140D0A] hover:brightness-105 cursor-pointer"
                  >
                    Aplicar
                  </button>
                </form>
              )}

              {/* Subtotal */}
              <div className="w-full flex justify-between items-center h-[20px]">
                <span className="text-[15px] font-normal leading-[20px] text-[#F5F1EB]">
                  Subtotal
                </span>
                <span className="text-[18px] font-normal leading-[16px] text-[#F5F1EB]">
                  {subtotal} ETH
                </span>
              </div>

              {/* Desconto do lançamento */}
              <div className="w-full flex justify-between items-center h-[20px]">
                <span className="text-[15px] font-normal leading-[20px] text-[#F5F1EB]">
                  Desconto do lançamento
                </span>
                <span className="text-[15px] font-normal leading-[20px] text-[#F5F1EB]">
                  (-) {discount}
                </span>
              </div>

              {/* Taxa de rede */}
              <div className="w-full flex flex-col">
                <div className="w-full flex justify-between items-center h-[20px]">
                  <span className="text-[15px] font-normal leading-[20px] text-[#F5F1EB]">
                    Taxa de rede
                  </span>
                  <span className="text-[18px] font-normal leading-[16px] text-[#F5F1EB]">
                    {networkFee} ETH
                  </span>
                </div>
                <span className="w-full text-center text-[12px] font-normal leading-[16px] text-[#E89B55] mt-[2px]">
                  Taxa estimada
                </span>
              </div>

              {/* Line 3 divider */}
              <div className="w-full border-t border-[#D28A4C] opacity-30 mt-[2px]" />

              {/* Total */}
              <div className="w-full flex justify-between items-center h-[20px] pt-[4px]">
                <span className="text-[16px] font-bold leading-[16px] text-[#F5F1EB]">
                  Total
                </span>
                <span className="text-[18px] font-bold leading-[16px] text-[#E89B55]">
                  {totalEth} ETH
                </span>
              </div>
            </div>

            {/* Carteira e rede Section (Frame 314) */}
            <div className="w-full flex flex-col gap-[20px] mt-[16px]">
              <h3 className="w-full text-center text-[17px] font-bold leading-[16px] text-[#F5F1EB]">
                Carteira e rede
              </h3>

              <div className="w-full flex flex-col gap-[16px]">
                {/* Option 1: Supported wallet brands */}
                <div
                  onClick={() => setSelectedWalletRadio('supported')}
                  className={`w-full h-[45px] border rounded-[3px] flex items-center px-3 gap-[10px] cursor-pointer transition-colors bg-transparent ${
                    selectedWalletRadio === 'supported' ? 'border-[#D28A4C]' : 'border-[#3F2319]'
                  }`}
                >
                  <div className="w-[16px] h-[16px] rounded-full border-[1.2px] border-[#D28A4C] flex items-center justify-center">
                    {selectedWalletRadio === 'supported' && (
                      <div className="w-[10px] h-[10px] rounded-full bg-[#D28A4C]" />
                    )}
                  </div>
                  <div className="w-[224px] h-[26px] bg-[#38220F] border border-[#55321F] rounded-[6px] flex items-center justify-center px-2">
                    <span className="text-[9px] font-bold leading-none tracking-[0.1px] text-[#E89B55] uppercase whitespace-nowrap">
                      METAMASK • WALLETCONNECT • COINBASE
                    </span>
                  </div>
                </div>

                {/* Option 2: MetaMask */}
                <div
                  onClick={() => setSelectedWalletRadio('metamask')}
                  className={`w-full h-[45px] border rounded-[3px] flex items-center px-3 gap-[10px] cursor-pointer transition-colors bg-transparent ${
                    selectedWalletRadio === 'metamask' ? 'border-[#D28A4C]' : 'border-[#3F2319]'
                  }`}
                >
                  <div className="w-[16px] h-[16px] rounded-full border-[1.2px] border-[#D28A4C] flex items-center justify-center">
                    {selectedWalletRadio === 'metamask' && (
                      <div className="w-[10px] h-[10px] rounded-full bg-[#D28A4C]" />
                    )}
                  </div>
                  <span className="text-[15px] font-normal leading-[20px] text-[#F5F1EB]">
                    MetaMask
                  </span>
                </div>

                {/* Option 3: Coinbase Wallet (Selected in Figma) */}
                <div
                  onClick={() => setSelectedWalletRadio('coinbase')}
                  className={`w-full h-[45px] border rounded-[3px] flex items-center px-3 gap-[12px] cursor-pointer transition-colors bg-transparent ${
                    selectedWalletRadio === 'coinbase' ? 'border-[#D28A4C]' : 'border-[#3F2319]'
                  }`}
                >
                  <div className="w-[16px] h-[16px] rounded-full border-[1.2px] border-[#D28A4C] flex items-center justify-center">
                    {selectedWalletRadio === 'coinbase' && (
                      <div className="w-[10px] h-[10px] rounded-full bg-[#D28A4C]" />
                    )}
                  </div>
                  <span className="text-[15px] font-normal leading-[20px] text-[#F5F1EB]">
                    Coinbase Wallet
                  </span>
                </div>
              </div>

              {paymentError && (
                <div role="alert" aria-live="assertive" className="p-3 bg-red-950/40 border border-red-500/40 rounded-[6px] text-red-300 text-xs">
                  {paymentError}
                </div>
              )}

              {/* Confirmar compra Button (Frame 324: 405x45px, bg #D28A4C, rounded 8px) */}
              <button
                id="confirm-purchase-btn"
                type="button"
                disabled={isProcessing || isOutdatedQuote}
                onClick={onConfirmPurchase}
                className="w-full h-[45px] bg-[#D28A4C] disabled:opacity-60 rounded-[8px] text-[15px] font-bold leading-[16px] text-[#140D0A] flex items-center justify-center hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer shadow-md mt-[8px]"
              >
                {isOutdatedQuote
                  ? 'Cotação desatualizada (confirme acima)'
                  : isProcessing
                  ? 'Processando transação...'
                  : 'Confirmar compra'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
