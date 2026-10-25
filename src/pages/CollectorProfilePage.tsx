import React, { useState, useEffect } from 'react'
import {
  ChevronDown,
  Eye,
  EyeOff,
  Check,
} from 'lucide-react'
import { Header } from '../components/layout/Header'
import { MobileBottomNav } from '../components/layout/MobileBottomNav'
import { AccountSidebar } from '../components/profile/AccountSidebar'
import { useAuth } from '../hooks/useAuth'

import { updateProfile, changePassword } from '../services/api'
import { useQueryClient } from '@tanstack/react-query'

export const CollectorProfilePage: React.FC = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // Form states
  const [displayName, setDisplayName] = useState(user?.name || '')
  const [username, setUsername] = useState(
    user?.email ? `@${user.email.split('@')[0]}` : ''
  )
  const [email, setEmail] = useState(user?.email || '')
  const [ensPrefix, setEnsPrefix] = useState('.eth')
  const [ensName, setEnsName] = useState('colecionador')
  const [walletNickname, setWalletNickname] = useState('Carteira Principal MetaMask')
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '/assets/image2.png')

  useEffect(() => {
    if (user) {
      if (user.name) setDisplayName(user.name)
      if (user.email) {
        setUsername(`@${user.email.split('@')[0]}`)
        setEmail(user.email)
      }
      if (user.avatar) setAvatarUrl(user.avatar)
    }
  }, [user])

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)

  const [isSaved, setIsSaved] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    try {
      await updateProfile({
        name: displayName,
        email,
        avatar: avatarUrl,
      })

      if (newPassword) {
        if (newPassword !== confirmNewPassword) {
          setErrorMessage('As novas senhas não coincidem.')
          return
        }
        await changePassword({ currentPassword, newPassword })
      }

      queryClient.invalidateQueries({ queryKey: ['auth', 'session'] })
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 3000)
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.error || 'Erro ao atualizar dados do perfil.')
    }
  }


  return (
    <div className="min-h-screen bg-[#140D0A] text-[#F5F1EB] font-mono flex flex-col justify-between selection:bg-[#D28A4C]/30">
      {/* Container Principal */}
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-[120px] pt-[24px] pb-[80px]">
        {/* Header com linha divisória hairline */}
        <Header initialActiveSection="inicio" />

        {/* Corpo: Sidebar + Formulário do Perfil */}
        <main className="w-full max-w-[1200px] flex flex-col md:flex-row items-start gap-[28px] mt-[32px]">
          {/* Account Sidebar (310px, fundo #241612) */}
          <AccountSidebar activeTab="perfil" />

          {/* Conteúdo Principal do Perfil (Profile Form) */}
          <section className="flex-1 w-full flex flex-col">
            {/* Título da Seção */}
            <h1 className="text-[16px] font-bold leading-[16px] text-[#F5F1EB] mb-[24px]">
              Perfil do colecionador
            </h1>

            {/* Mensagem de sucesso ao salvar */}
            {isSaved && (
              <div
                role="status"
                aria-live="polite"
                className="mb-6 p-3 bg-[#00A66C]/20 border border-[#00A66C] rounded-[4px] text-[#59C36A] text-xs flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Perfil atualizado com sucesso!</span>
              </div>
            )}

            {errorMessage && (
              <div
                role="alert"
                aria-live="assertive"
                className="mb-6 p-3 bg-red-950/40 border border-red-500/40 rounded-[4px] text-red-300 text-xs"
              >
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="flex flex-col">
              {/* Linha 1: Nome de exibição e Nome de usuário */}
              <div className="flex flex-col md:flex-row items-center gap-[28px] mb-[24px]">
                {/* Nome de exibição */}
                <div className="w-full md:w-[417px] flex flex-col gap-[10px]">
                  <label htmlFor="prof-display-name" className="flex items-center text-[15px] leading-[15px] text-[#F5F1EB]">
                    <span>Nome de exibição</span>
                    <span className="text-[22px] leading-[15px] text-[#F0805F] ml-1.5">*</span>
                  </label>
                  <input
                    id="prof-display-name"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    className="w-full h-[40px] border border-[#3F2319] focus:border-[#D28A4C] rounded-[3px] px-[16px] bg-transparent text-[14px] text-[#F5F1EB] outline-none transition-colors"
                  />
                </div>

                {/* Nome de usuário */}
                <div className="w-full md:w-[417px] flex flex-col gap-[10px]">
                  <label htmlFor="prof-username" className="flex items-center text-[15px] leading-[15px] text-[#F5F1EB]">
                    <span>Nome de usuário</span>
                    <span className="text-[22px] leading-[15px] text-[#F0805F] ml-1.5">*</span>
                  </label>
                  <input
                    id="prof-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full h-[40px] border border-[#3F2319] focus:border-[#D28A4C] rounded-[3px] px-[16px] bg-transparent text-[14px] text-[#F5F1EB] outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Linha 2: E-mail e Nome ENS */}
              <div className="flex flex-col md:flex-row items-center gap-[28px] mb-[24px]">
                {/* E-mail */}
                <div className="w-full md:w-[417px] flex flex-col gap-[10px]">
                  <label htmlFor="prof-email" className="flex items-center text-[15px] leading-[15px] text-[#F5F1EB]">
                    <span>E-mail</span>
                    <span className="text-[22px] leading-[15px] text-[#F0805F] ml-1.5">*</span>
                  </label>
                  <input
                    id="prof-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-[40px] border border-[#3F2319] focus:border-[#D28A4C] rounded-[3px] px-[16px] bg-transparent text-[14px] text-[#F5F1EB] outline-none transition-colors"
                  />
                </div>

                {/* Nome ENS com prefixo .eth */}
                <div className="w-full md:w-[417px] flex flex-col gap-[10px]">
                  <label htmlFor="prof-ens-name" className="flex items-center text-[15px] leading-[15px] text-[#F5F1EB]">
                    <span>Nome ENS</span>
                    <span className="text-[22px] leading-[15px] text-[#F0805F] ml-1.5">*</span>
                  </label>
                  <div className="w-full flex items-center">
                    {/* Select prefixo ENS (.eth, .sol, etc) */}
                    <div className="relative w-[78px] h-[40px] border border-[#3F2319] rounded-[3px] flex items-center justify-center bg-[#241612] shrink-0">
                      <label htmlFor="prof-ens-prefix" className="sr-only">Prefixo ENS</label>
                      <select
                        id="prof-ens-prefix"
                        value={ensPrefix}
                        onChange={(e) => setEnsPrefix(e.target.value)}
                        className="w-full h-full bg-transparent text-[15px] text-[#F5F1EB] px-2 appearance-none outline-none cursor-pointer text-center font-mono"
                      >
                        <option value=".eth" className="bg-[#241612] text-[#F5F1EB]">.eth</option>
                        <option value=".sol" className="bg-[#241612] text-[#F5F1EB]">.sol</option>
                        <option value=".lens" className="bg-[#241612] text-[#F5F1EB]">.lens</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-[#F5F1EB] pointer-events-none absolute right-1.5" />
                    </div>

                    {/* Campo texto ENS */}
                    <input
                      id="prof-ens-name"
                      type="text"
                      value={ensName}
                      onChange={(e) => setEnsName(e.target.value)}
                      placeholder="colecionador"
                      className="flex-1 ml-[10px] h-[40px] border border-[#3F2319] focus:border-[#D28A4C] rounded-[3px] px-[16px] bg-transparent text-[14px] text-[#F5F1EB] outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Linha 3: Apelido da carteira e Avatar */}
              <div className="flex flex-col md:flex-row items-start gap-[28px] mb-[32px]">
                {/* Apelido da carteira */}
                <div className="w-full md:w-[417px] flex flex-col gap-[10px]">
                  <label htmlFor="prof-wallet-nickname" className="flex items-center text-[15px] leading-[15px] text-[#F5F1EB]">
                    <span>Apelido da carteira</span>
                    <span className="text-[22px] leading-[15px] text-[#F0805F] ml-1.5">*</span>
                  </label>
                  <input
                    id="prof-wallet-nickname"
                    type="text"
                    value={walletNickname}
                    onChange={(e) => setWalletNickname(e.target.value)}
                    required
                    className="w-full h-[40px] border border-[#3F2319] focus:border-[#D28A4C] rounded-[3px] px-[16px] bg-transparent text-[14px] text-[#F5F1EB] outline-none transition-colors"
                  />
                </div>

                {/* Avatar */}
                <div className="w-full md:w-[417px] flex flex-col gap-[10px]">
                  <label className="text-[15px] leading-[15px] text-[#F5F1EB]">
                    Avatar
                  </label>
                  <div className="flex items-center gap-[24px] h-[50px]">
                    {/* Imagem do Avatar */}
                    <img
                      src={avatarUrl}
                      alt="Avatar do Colecionador"
                      className="w-[50px] h-[50px] rounded-full object-cover bg-[#2F1D15] border border-[#3F2319] shrink-0"
                    />

                    {/* Botão Alterar */}
                    <label className="w-[98px] h-[40px] bg-[#D28A4C] hover:bg-[#E89B55] text-[#140D0A] font-bold text-[14px] leading-[16px] rounded-[3px] flex items-center justify-center cursor-pointer transition-colors shrink-0">
                      Alterar
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setAvatarUrl(URL.createObjectURL(file))
                          }
                        }}
                      />
                    </label>

                    {/* Botão Remover */}
                    <button
                      type="button"
                      onClick={() => setAvatarUrl('/assets/image2.png')}
                      className="text-[14px] leading-[16px] text-[#F5F1EB] hover:text-[#E89B55] transition-colors cursor-pointer"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              </div>

              {/* Seção Alterar Senha */}
              <div className="w-full flex flex-col gap-[20px] pt-[8px] border-t border-[#3F2319]/40 mb-[32px]">
                <h2 className="text-[16px] font-medium leading-[16px] text-[#F5F1EB] mt-[16px]">
                  Alterar senha
                </h2>

                {/* Senha atual */}
                <div className="w-full md:w-[417px] flex flex-col gap-[10px]">
                  <label className="text-[15px] leading-[15px] text-[#F5F1EB]">
                    Senha atual
                  </label>
                  <div className="w-full h-[40px] border border-[#3F2319] focus-within:border-[#D28A4C] rounded-[3px] px-[16px] flex items-center justify-between bg-transparent transition-colors">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-transparent text-[14px] text-[#F5F1EB] outline-none font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      aria-label="Alternar exibição de senha"
                      className="text-[#B39463] hover:text-[#E89B55] p-1 cursor-pointer"
                    >
                      {showCurrentPassword ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Nova senha */}
                <div className="w-full md:w-[417px] flex flex-col gap-[10px]">
                  <label className="text-[15px] leading-[15px] text-[#F5F1EB]">
                    Nova senha
                  </label>
                  <div className="w-full h-[40px] border border-[#3F2319] focus-within:border-[#D28A4C] rounded-[3px] px-[16px] flex items-center justify-between bg-transparent transition-colors">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-transparent text-[14px] text-[#F5F1EB] outline-none font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      aria-label="Alternar exibição de senha"
                      className="text-[#B39463] hover:text-[#E89B55] p-1 cursor-pointer"
                    >
                      {showNewPassword ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirmar nova senha */}
                <div className="w-full md:w-[417px] flex flex-col gap-[10px]">
                  <label className="text-[15px] leading-[15px] text-[#F5F1EB]">
                    Confirmar nova senha
                  </label>
                  <div className="w-full h-[40px] border border-[#3F2319] focus-within:border-[#D28A4C] rounded-[3px] px-[16px] flex items-center justify-between bg-transparent transition-colors">
                    <input
                      type={showConfirmNewPassword ? 'text' : 'password'}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-transparent text-[14px] text-[#F5F1EB] outline-none font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                      aria-label="Alternar exibição de senha"
                      className="text-[#B39463] hover:text-[#E89B55] p-1 cursor-pointer"
                    >
                      {showConfirmNewPassword ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Botão Salvar (131x40px, #D28A4C, radius 3px) */}
              <div className="mt-[8px]">
                <button
                  type="submit"
                  className="w-[131px] h-[40px] bg-[#D28A4C] hover:bg-[#E89B55] active:scale-[0.99] rounded-[3px] text-[#140D0A] font-bold text-[14px] leading-[16px] flex items-center justify-center transition-all cursor-pointer"
                >
                  Salvar
                </button>
              </div>
            </form>
          </section>
        </main>
      </div>

      {/* Navegação Mobile Inferior */}
      <MobileBottomNav />
    </div>
  )
}
