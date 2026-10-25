import React, { useState, useEffect } from 'react'
import {
  ChevronDown,
  Check,
} from 'lucide-react'
import { Header } from '../components/layout/Header'
import { MobileBottomNav } from '../components/layout/MobileBottomNav'
import { AccountSidebar } from '../components/profile/AccountSidebar'
import { useAuth } from '../hooks/useAuth'
import { saveWallets } from '../services/api'

export const WalletsPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth()

  // Form states for Main Wallet - empty when not logged in
  const [displayName, setDisplayName] = useState(isAuthenticated && user ? user.name : '')
  const [walletNickname, setWalletNickname] = useState(isAuthenticated && user ? 'Carteira Principal' : '')
  const [network, setNetwork] = useState(isAuthenticated && user ? 'Ethereum' : '')
  const [profileName, setProfileName] = useState(
    isAuthenticated && user && user.email ? user.email.split('@')[0] : ''
  )
  const [walletAddress, setWalletAddress] = useState(
    isAuthenticated && user && user.walletAddress ? user.walletAddress : ''
  )
  const [secondaryAddressInput, setSecondaryAddressInput] = useState('')
  const [walletType, setWalletType] = useState(isAuthenticated && user ? 'MetaMask' : '')
  const [referralCode, setReferralCode] = useState(isAuthenticated && user ? 'KURIO-VIP-2026' : '')
  const [email, setEmail] = useState(isAuthenticated && user && user.email ? user.email : '')
  const [ensPrefix, setEnsPrefix] = useState('.eth')
  const [ensName, setEnsName] = useState(
    isAuthenticated && user && user.email ? user.email.split('@')[0] : ''
  )

  useEffect(() => {
    if (isAuthenticated && user) {
      setDisplayName(user.name || '')
      setWalletNickname('Carteira Principal')
      setNetwork((prev) => prev || 'Ethereum')
      setProfileName(user.email ? user.email.split('@')[0] : '')
      setWalletAddress(user.walletAddress || '')
      setWalletType((prev) => prev || 'MetaMask')
      setReferralCode('KURIO-VIP-2026')
      setEmail(user.email || '')
      setEnsName(user.email ? user.email.split('@')[0] : '')
    } else {
      setDisplayName('')
      setWalletNickname('')
      setNetwork('')
      setProfileName('')
      setWalletAddress('')
      setSecondaryAddressInput('')
      setWalletType('')
      setReferralCode('')
      setEmail('')
      setEnsName('')
    }
  }, [isAuthenticated, user])

  // Secondary Wallet states
  const [sameAsMain, setSameAsMain] = useState(true)
  const [showSecondaryForm, setShowSecondaryForm] = useState(false)
  const [secondaryNetwork, setSecondaryNetwork] = useState('Polygon')
  const [secondaryType, setSecondaryType] = useState('WalletConnect')
  const [secondaryAddress, setSecondaryAddress] = useState('')

  // Feedback notifications
  const [isSaved, setIsSaved] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const handleSaveWallet = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await saveWallets({
        primary: {
          nickname: walletNickname,
          network,
          address: walletAddress,
          type: walletType,
        },
        secondary: sameAsMain ? 'same' : {
          network: secondaryNetwork,
          address: secondaryAddress,
          type: secondaryType,
        },
      })
      setSuccessMessage('Carteira salva com sucesso!')
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 3000)
    } catch {
      setSuccessMessage('Erro ao salvar carteira.')
      setIsSaved(true)
    }
  }

  const handleAddNewMainWallet = () => {
    setWalletNickname('')
    setWalletAddress('')
    setSecondaryAddressInput('')
    setSuccessMessage('Pronto para cadastrar nova carteira!')
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  const handleToggleSameAsMain = () => {
    setSameAsMain((prev) => !prev)
    if (sameAsMain) {
      setShowSecondaryForm(true)
    }
  }

  const networks = [
    { value: 'Ethereum', label: 'Ethereum (Mainnet)' },
    { value: 'Polygon', label: 'Polygon (MATIC)' },
    { value: 'Solana', label: 'Solana (SOL)' },
    { value: 'Arbitrum', label: 'Arbitrum One' },
    { value: 'Optimism', label: 'Optimism' },
  ]

  const walletTypes = [
    { value: 'MetaMask', label: 'MetaMask' },
    { value: 'WalletConnect', label: 'WalletConnect' },
    { value: 'Coinbase Wallet', label: 'Coinbase Wallet' },
    { value: 'Phantom', label: 'Phantom' },
    { value: 'Rainbow', label: 'Rainbow' },
    { value: 'Trust Wallet', label: 'Trust Wallet' },
  ]

  return (
    <div className="min-h-screen bg-[#140D0A] text-[#F5F1EB] font-mono flex flex-col justify-between selection:bg-[#D28A4C]/30">
      {/* Container Principal */}
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-[120px] pt-[24px] pb-[80px]">
        {/* Header com linha divisória hairline */}
        <Header initialActiveSection="inicio" />

        {/* Corpo: Sidebar + Formulário de Carteiras */}
        <main className="w-full max-w-[1200px] flex flex-col md:flex-row items-start gap-[28px] mt-[32px]">
          {/* Account Sidebar (310px, fundo #241612) */}
          <AccountSidebar activeTab="carteiras" />

          {/* Wallets Form (862px, gap 32px) */}
          <section className="flex-1 w-full md:max-w-[862px] flex flex-col gap-[32px]">
            {/* Mensagem de sucesso */}
            {isSaved && (
              <div role="status" aria-live="polite" className="p-3 bg-[#00A66C]/20 border border-[#00A66C] rounded-[4px] text-[#59C36A] text-xs flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* SECTION 1: Carteira Principal */}
            <div className="w-full flex flex-col gap-[8px]">
              {/* Title Row */}
              <div className="w-full flex items-center justify-between">
                <h1 className="text-[17px] font-bold leading-[16px] text-[#F5F1EB]">
                  Carteira principal
                </h1>
                <button
                  type="button"
                  onClick={handleAddNewMainWallet}
                  className="text-[16px] font-medium leading-[16px] text-[#E89B55] hover:text-[#D28A4C] cursor-pointer transition-colors"
                >
                  Adicionar
                </button>
              </div>

              {/* Subtitle */}
              <p className="text-[14px] font-normal leading-[15px] text-[#CFB28C]">
                Estas carteiras ficam disponíveis no pagamento e para receber NFTs comprados.
              </p>
            </div>

            {/* FORMULÁRIO DE CAMPOS (Fields - Gap 24px) */}
            <form onSubmit={handleSaveWallet} className="w-full flex flex-col gap-[24px]">
              {/* Field Row 1: Nome de exibição + Apelido da carteira */}
              <div className="w-full flex flex-col md:flex-row items-start justify-between gap-[20px] md:gap-[28px]">
                {/* Nome de exibição */}
                <div className="w-full md:w-[417px] flex flex-col">
                  <label htmlFor="wallet-display-name" className="flex items-center -my-1 h-[29px] cursor-pointer">
                    <span className="text-[15px] font-normal leading-[15px] text-[#F5F1EB]">
                      Nome de exibição
                    </span>
                    <span className="text-[22px] font-normal leading-[29px] text-[#F0805F] ml-1">
                      *
                    </span>
                  </label>
                  <input
                    id="wallet-display-name"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    className="w-full h-[40px] border border-[#3F2319] focus:border-[#D28A4C] rounded-[3px] px-[13px] bg-transparent text-[14px] text-[#F5F1EB] outline-none transition-colors"
                  />
                </div>

                {/* Apelido da carteira */}
                <div className="w-full md:w-[417px] flex flex-col">
                  <label htmlFor="wallet-nickname" className="flex items-center -my-1 h-[29px] cursor-pointer">
                    <span className="text-[15px] font-normal leading-[15px] text-[#F5F1EB]">
                      Apelido da carteira
                    </span>
                    <span className="text-[22px] font-normal leading-[29px] text-[#F0805F] ml-1">
                      *
                    </span>
                  </label>
                  <input
                    id="wallet-nickname"
                    type="text"
                    value={walletNickname}
                    onChange={(e) => setWalletNickname(e.target.value)}
                    required
                    className="w-full h-[40px] border border-[#3F2319] focus:border-[#D28A4C] rounded-[3px] px-[13px] bg-transparent text-[14px] text-[#F5F1EB] outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Field Row 2: Rede + Nome do perfil */}
              <div className="w-full flex flex-col md:flex-row items-start justify-between gap-[20px] md:gap-[28px]">
                {/* Rede */}
                <div className="w-full md:w-[417px] flex flex-col">
                  <label htmlFor="wallet-network" className="flex items-center gap-1 -my-1 h-[29px] cursor-pointer">
                    <span className="text-[15px] font-normal leading-[15px] text-[#F5F1EB]">
                      Rede
                    </span>
                    <span className="text-[22px] font-normal leading-[29px] text-[#F0805F]">
                      *
                    </span>
                  </label>
                  <div className="relative w-full h-[40px]">
                    <select
                      id="wallet-network"
                      value={network}
                      onChange={(e) => setNetwork(e.target.value)}
                      required
                      className="w-full h-[40px] border border-[#3F2319] focus:border-[#D28A4C] rounded-[3px] px-[13px] bg-[#140D0A] text-[14px] text-[#F5F1EB] outline-none appearance-none cursor-pointer transition-colors"
                    >
                      <option value="" disabled className="text-[#B39463]">
                        Selecione uma rede
                      </option>
                      {networks.map((net) => (
                        <option key={net.value} value={net.value} className="bg-[#241612]">
                          {net.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#B39463] absolute right-[13px] top-[12px] pointer-events-none" />
                  </div>
                </div>

                {/* Nome do perfil */}
                <div className="w-full md:w-[417px] flex flex-col">
                  <label htmlFor="wallet-profile-name" className="flex items-center -my-1 h-[29px] cursor-pointer">
                    <span className="text-[15px] font-normal leading-[15px] text-[#F5F1EB]">
                      Nome do perfil
                    </span>
                    <span className="text-[22px] font-normal leading-[29px] text-[#F0805F] ml-1">
                      *
                    </span>
                  </label>
                  <input
                    id="wallet-profile-name"
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    required
                    className="w-full h-[40px] border border-[#3F2319] focus:border-[#D28A4C] rounded-[3px] px-[13px] bg-transparent text-[14px] text-[#F5F1EB] outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Field Row 3: Endereço da carteira + Secondary Address Input */}
              <div className="w-full flex flex-col md:flex-row items-end justify-between gap-[20px] md:gap-[28px]">
                {/* Endereço da carteira */}
                <div className="w-full md:w-[417px] flex flex-col">
                  <label htmlFor="wallet-address" className="flex items-center -my-1 h-[29px] cursor-pointer">
                    <span className="text-[15px] font-normal leading-[15px] text-[#F5F1EB]">
                      Endereço da carteira
                    </span>
                    <span className="text-[22px] font-normal leading-[29px] text-[#F0805F] ml-1">
                      *
                    </span>
                  </label>
                  <input
                    id="wallet-address"
                    type="text"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    placeholder="Endereço 0x da carteira"
                    required
                    className="w-full h-[40px] border border-[#3F2319] focus:border-[#D28A4C] rounded-[3px] px-[13px] bg-transparent text-[14px] text-[#F5F1EB] placeholder:text-[#B39463] outline-none transition-colors"
                  />
                </div>

                {/* Secondary Address Input (alinhado na base com label acessível para leitor de tela) */}
                <div className="w-full md:w-[417px] flex flex-col">
                  <label htmlFor="wallet-secondary-input" className="sr-only">
                    ENS ou carteira secundária (opcional)
                  </label>
                  <input
                    id="wallet-secondary-input"
                    type="text"
                    value={secondaryAddressInput}
                    onChange={(e) => setSecondaryAddressInput(e.target.value)}
                    placeholder="ENS ou carteira secundária (opcional)"
                    className="w-full h-[40px] border border-[#3F2319] focus:border-[#D28A4C] rounded-[3px] px-[13px] bg-transparent text-[14px] text-[#F5F1EB] placeholder:text-[#B39463] outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Field Row 4: Tipo de carteira + Código de indicação */}
              <div className="w-full flex flex-col md:flex-row items-start justify-between gap-[20px] md:gap-[28px]">
                {/* Tipo de carteira */}
                <div className="w-full md:w-[417px] flex flex-col">
                  <label htmlFor="wallet-type" className="flex items-center -my-1 h-[29px] cursor-pointer">
                    <span className="text-[15px] font-normal leading-[15px] text-[#F5F1EB]">
                      Tipo de carteira
                    </span>
                    <span className="text-[22px] font-normal leading-[29px] text-[#F0805F] ml-1">
                      *
                    </span>
                  </label>
                  <div className="relative w-full h-[40px]">
                    <select
                      id="wallet-type"
                      value={walletType}
                      onChange={(e) => setWalletType(e.target.value)}
                      required
                      className="w-full h-[40px] border border-[#3F2319] focus:border-[#D28A4C] rounded-[3px] px-[13px] bg-[#140D0A] text-[14px] text-[#F5F1EB] outline-none appearance-none cursor-pointer transition-colors"
                    >
                      <option value="" disabled className="text-[#B39463]">
                        Selecione uma carteira
                      </option>
                      {walletTypes.map((type) => (
                        <option key={type.value} value={type.value} className="bg-[#241612]">
                          {type.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#B39463] absolute right-[13px] top-[12px] pointer-events-none" />
                  </div>
                </div>

                {/* Código de indicação */}
                <div className="w-full md:w-[417px] flex flex-col">
                  <label htmlFor="wallet-referral-code" className="flex items-center -my-1 h-[29px] cursor-pointer">
                    <span className="text-[15px] font-normal leading-[15px] text-[#F5F1EB]">
                      Código de indicação
                    </span>
                    <span className="text-[22px] font-normal leading-[29px] text-[#F0805F] ml-1">
                      *
                    </span>
                  </label>
                  <input
                    id="wallet-referral-code"
                    type="text"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    required
                    className="w-full h-[40px] border border-[#3F2319] focus:border-[#D28A4C] rounded-[3px] px-[13px] bg-transparent text-[14px] text-[#F5F1EB] outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Field Row 5: E-mail + Nome ENS */}
              <div className="w-full flex flex-col md:flex-row items-start justify-between gap-[20px] md:gap-[28px]">
                {/* E-mail */}
                <div className="w-full md:w-[417px] flex flex-col">
                  <label htmlFor="wallet-email" className="flex items-center -my-1 h-[29px] cursor-pointer">
                    <span className="text-[15px] font-normal leading-[15px] text-[#F5F1EB]">
                      E-mail
                    </span>
                    <span className="text-[22px] font-normal leading-[29px] text-[#F0805F] ml-1">
                      *
                    </span>
                  </label>
                  <input
                    id="wallet-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-[40px] border border-[#3F2319] focus:border-[#D28A4C] rounded-[3px] px-[13px] bg-transparent text-[14px] text-[#F5F1EB] outline-none transition-colors"
                  />
                </div>

                {/* Nome ENS */}
                <div className="w-full md:w-[417px] flex flex-col">
                  <label htmlFor="wallet-ens-name" className="flex items-center gap-1 -my-1 h-[29px] cursor-pointer">
                    <span className="text-[15px] font-normal leading-[15px] text-[#F5F1EB]">
                      Nome ENS
                    </span>
                    <span className="text-[22px] font-normal leading-[29px] text-[#F0805F]">
                      *
                    </span>
                  </label>
                  <div className="w-full flex items-center justify-between gap-[10px]">
                    {/* Prefix box (78px x 40px) */}
                    <div className="relative w-[78px] h-[40px] shrink-0">
                      <label htmlFor="wallet-ens-prefix" className="sr-only">Prefixo ENS</label>
                      <select
                        id="wallet-ens-prefix"
                        value={ensPrefix}
                        onChange={(e) => setEnsPrefix(e.target.value)}
                        className="w-full h-[40px] border border-[#3F2319] focus:border-[#D28A4C] rounded-[3px] px-[8px] bg-[#140D0A] text-[15px] text-[#F5F1EB] outline-none appearance-none cursor-pointer transition-colors"
                      >
                        <option value=".eth">.eth</option>
                        <option value=".sol">.sol</option>
                        <option value=".lens">.lens</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-[#F5F1EB] absolute right-[6px] top-[14px] pointer-events-none" />
                    </div>

                    {/* ENS text input (329px x 40px) */}
                    <input
                      id="wallet-ens-name"
                      type="text"
                      value={ensName}
                      onChange={(e) => setEnsName(e.target.value)}
                      placeholder="colecionador"
                      required
                      className="flex-1 w-full md:w-[329px] h-[40px] border border-[#3F2319] focus:border-[#D28A4C] rounded-[3px] px-[13px] bg-transparent text-[14px] text-[#F5F1EB] outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Botão Salvar Carteira (131px x 40px, #D28A4C) */}
              <button
                type="submit"
                className="w-[131px] h-[40px] bg-[#D28A4C] hover:bg-[#E89B55] text-[#140D0A] font-bold text-[14px] leading-[16px] rounded-[3px] flex items-center justify-center cursor-pointer transition-colors shadow-md mt-[8px]"
              >
                Salvar carteira
              </button>
            </form>

            {/* SECTION 2: Carteira Secundária */}
            <div className="w-full flex flex-col gap-[12px] pt-[8px]">
              {/* Title Row */}
              <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-[8px]">
                <h2 className="text-[17px] font-bold leading-[16px] text-[#F5F1EB]">
                  Carteira secundária
                </h2>

                {/* Actions: Radio toggle + Link Adicionar */}
                <div className="flex items-center gap-[16px]">
                  {/* Radio / Toggle: Igual à carteira principal */}
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={sameAsMain}
                    onClick={handleToggleSameAsMain}
                    className="flex items-center gap-[8px] cursor-pointer group"
                  >
                    <span className="w-[16px] h-[16px] rounded-full border-[1.5px] border-[#D28A4C] flex items-center justify-center transition-all">
                      {sameAsMain && (
                        <span className="w-[8px] h-[8px] rounded-full bg-[#D28A4C]" />
                      )}
                    </span>
                    <span className="text-[14px] font-normal leading-[16px] text-[#F5F1EB] group-hover:text-[#E89B55] transition-colors">
                      Igual à carteira principal
                    </span>
                  </button>

                  {/* Adicionar */}
                  <button
                    type="button"
                    onClick={() => {
                      setSameAsMain(false)
                      setShowSecondaryForm(true)
                    }}
                    className="text-[16px] font-medium leading-[16px] text-[#E89B55] hover:text-[#D28A4C] cursor-pointer transition-colors"
                  >
                    Adicionar
                  </button>
                </div>
              </div>

              {/* Subtitle / Empty State */}
              <p className="text-[14px] font-normal leading-[15px] text-[#CFB28C]">
                {sameAsMain
                  ? 'A carteira secundária está configurada para espelhar a carteira principal.'
                  : 'Você ainda não adicionou uma carteira secundária.'}
              </p>

              {/* Expanded Secondary Wallet Form when adding/customizing */}
              {(!sameAsMain || showSecondaryForm) && (
                <div className="mt-2 p-5 bg-[#241612] border border-[#3F2319] rounded-[4px] flex flex-col gap-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-[#3F2319]/60 pb-3">
                    <span className="text-[15px] font-bold text-[#E89B55]">
                      Configuração da Carteira Secundária
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowSecondaryForm(false)}
                      className="text-xs text-[#CFB28C] hover:text-[#F5F1EB]"
                    >
                      Fechar
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label htmlFor="sec-wallet-network" className="text-xs text-[#CFB28C]">Rede Secundária</label>
                      <div className="relative">
                        <select
                          id="sec-wallet-network"
                          value={secondaryNetwork}
                          onChange={(e) => setSecondaryNetwork(e.target.value)}
                          className="w-full h-[38px] border border-[#3F2319] rounded-[3px] px-3 bg-[#140D0A] text-xs text-[#F5F1EB] outline-none appearance-none"
                        >
                          {networks.map((n) => (
                            <option key={n.value} value={n.value}>
                              {n.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-[#B39463] absolute right-3 top-3 pointer-events-none" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label htmlFor="sec-wallet-type" className="text-xs text-[#CFB28C]">Tipo de Carteira</label>
                      <div className="relative">
                        <select
                          id="sec-wallet-type"
                          value={secondaryType}
                          onChange={(e) => setSecondaryType(e.target.value)}
                          className="w-full h-[38px] border border-[#3F2319] rounded-[3px] px-3 bg-[#140D0A] text-xs text-[#F5F1EB] outline-none appearance-none"
                        >
                          {walletTypes.map((t) => (
                            <option key={t.value} value={t.value}>
                              {t.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-[#B39463] absolute right-3 top-3 pointer-events-none" />
                      </div>
                    </div>

                    <div className="md:col-span-2 flex flex-col gap-1">
                      <label htmlFor="sec-wallet-address" className="text-xs text-[#CFB28C]">Endereço da Carteira Secundária</label>
                      <input
                        id="sec-wallet-address"
                        type="text"
                        value={secondaryAddress}
                        onChange={(e) => setSecondaryAddress(e.target.value)}
                        placeholder="0x... ou carteira.eth"
                        className="w-full h-[38px] border border-[#3F2319] rounded-[3px] px-3 bg-[#140D0A] text-xs text-[#F5F1EB] placeholder:text-[#B39463] outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSuccessMessage('Carteira secundária vinculada com sucesso!')
                        setIsSaved(true)
                        setTimeout(() => setIsSaved(false), 3000)
                        setShowSecondaryForm(false)
                      }}
                      className="px-4 py-2 bg-[#D28A4C] hover:bg-[#E89B55] text-[#140D0A] font-bold text-xs rounded-[3px] transition-colors"
                    >
                      Vincular carteira secundária
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>

      {/* Bottom Nav para Mobile */}
      <MobileBottomNav />
    </div>
  )
}
