import React, { useState, useEffect } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

interface LoginModalDesktopProps {
  onClose: () => void
  onSuccess?: () => void
  initialTab?: 'login' | 'register'
}

export const LoginModalDesktop: React.FC<LoginModalDesktopProps> = ({
  onClose,
  onSuccess,
  initialTab = 'login',
}) => {
  const { login, register } = useAuth()
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab)

  // Login form states
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [showLoginPassword, setShowLoginPassword] = useState(false)

  // Register form states
  const [regUsername, setRegUsername] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirmPassword, setRegConfirmPassword] = useState('')
  const [showRegPassword, setShowRegPassword] = useState(false)
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    setActiveTab(initialTab)
    setErrorMessage(null)
  }, [initialTab])

  const modalRef = React.useRef<HTMLDivElement>(null)

  // Focus trap, initial focus and return focus (a11y)
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null

    const timer = setTimeout(() => {
      const focusables = modalRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusables && focusables.length > 0) {
        focusables[0].focus()
      }
    }, 50)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'Tab') {
        if (!modalRef.current) return
        const focusables = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (!focusables || focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('keydown', handleKeyDown)
      previouslyFocused?.focus?.()
    }
  }, [onClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (activeTab === 'login') {
      if (!loginEmail.trim()) {
        setErrorMessage('Por favor, informe seu e-mail.')
        return
      }

      try {
        setIsLoading(true)
        await login({ email: loginEmail, password: loginPassword })
        onSuccess?.()
        onClose()
      } catch (err: any) {
        const msg = err?.response?.data?.error || err?.message || 'Erro ao realizar login. Tente novamente.'
        setErrorMessage(msg)
      } finally {
        setIsLoading(false)
      }
    } else {
      if (!regUsername.trim()) {
        setErrorMessage('Por favor, informe seu nome de usuário.')
        return
      }
      if (!regEmail.trim()) {
        setErrorMessage('Por favor, informe seu e-mail.')
        return
      }
      if (!regPassword) {
        setErrorMessage('Por favor, crie uma senha.')
        return
      }
      if (regPassword !== regConfirmPassword) {
        setErrorMessage('As senhas não coincidem.')
        return
      }

      try {
        setIsLoading(true)
        await register({ username: regUsername, email: regEmail, password: regPassword })
        onSuccess?.()
        onClose()
      } catch (err: any) {
        const msg = err?.response?.data?.error || err?.message || 'Erro ao criar conta. Tente novamente.'
        setErrorMessage(msg)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const isLogin = activeTab === 'login'

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className={`relative w-[500px] transition-all duration-300 bg-[#241612] border border-[#3F2319] rounded-[8px] md:rounded-[12px] shadow-[0px_20px_50px_rgba(0,0,0,0.85)] flex flex-col font-mono overflow-hidden select-none animate-in fade-in zoom-in-95 ${
        isLogin ? 'h-[600px]' : 'h-[656px]'
      }`}
    >
      {/* Botão Fechar X (#D28A4C) */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar modal"
        className="absolute top-[16px] right-[16px] text-[#D28A4C] hover:opacity-75 transition-opacity p-1.5 cursor-pointer z-10"
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 1L13 13M1 13L13 1"
            stroke="#D28A4C"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Header com Tabs e Subtítulo */}
      <div className="pt-[48px] px-[48px] flex flex-col items-center">
        {/* Tabs: Entrar | Criar conta */}
        <div className="flex items-center justify-center gap-[8px] h-[20px]">
          <button
            type="button"
            id="auth-modal-title"
            onClick={() => {
              setActiveTab('login')
              setErrorMessage(null)
            }}
            className={`text-[20px] font-medium leading-[16px] transition-colors cursor-pointer ${
              isLogin
                ? 'text-[#E89B55]'
                : 'text-[#F5F1EB] hover:text-[#E89B55]'
            }`}
          >
            Entrar
          </button>

          {/* Divisor vertical 1px #F0805F */}
          <div className="w-[1px] h-[20px] bg-[#F0805F]" />

          <button
            type="button"
            onClick={() => {
              setActiveTab('register')
              setErrorMessage(null)
            }}
            className={`text-[20px] font-medium leading-[16px] transition-colors cursor-pointer ${
              !isLogin
                ? 'text-[#E89B55]'
                : 'text-[#F5F1EB] hover:text-[#E89B55]'
            }`}
          >
            Criar conta
          </button>
        </div>

        {/* Subtítulo centralizado conforme Figma */}
        <p className="w-[404px] text-[13px] leading-[16px] text-center text-[#F5F1EB] mt-[16px]">
          {isLogin
            ? 'Entre para gerenciar sua carteira, coleção e perfil de criador.'
            : 'Crie seu perfil de colecionador e conecte uma carteira quando quiser.'}
        </p>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="flex flex-col">
        {isLogin ? (
          /* FORMULÁRIO DE LOGIN (Desktop_Login.css) */
          <div className="px-[80px] pt-[24px] flex flex-col gap-[12px]">
            {/* Email Input */}
            <div className="w-[340px] h-[40px] border border-[#3F2319] focus-within:border-[#D28A4C] rounded-[5px] px-[16px] flex items-center bg-transparent transition-colors">
              <input
                id="login-email"
                type="email"
                aria-label="E-mail de acesso"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="contato@email.com"
                className="w-full bg-transparent text-[14px] leading-[16px] text-[#F5F1EB] placeholder:text-[#B39463] outline-none font-mono"
              />
            </div>

            {/* Password Input (borda padrão #3F2319, #D28A4C apenas quando selecionado/foco) */}
            <div className="w-[340px] h-[40px] border border-[#3F2319] focus-within:border-[#D28A4C] rounded-[5px] px-[16px] flex items-center justify-between bg-transparent transition-colors">
              <input
                id="login-password"
                type={showLoginPassword ? 'text' : 'password'}
                aria-label="Senha"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="***********"
                className="w-[260px] bg-transparent text-[16px] leading-[16px] text-[#F5F1EB] placeholder:text-[#B39463] tracking-wider outline-none font-mono"
              />
              <button
                type="button"
                onClick={() => setShowLoginPassword(!showLoginPassword)}
                aria-label={showLoginPassword ? 'Ocultar senha' : 'Exibir senha'}
                className="text-[#B39463] hover:text-[#E89B55] transition-colors cursor-pointer p-0.5"
              >
                {showLoginPassword ? (
                  <Eye className="w-[18px] h-[18px]" />
                ) : (
                  <EyeOff className="w-[18px] h-[18px]" />
                )}
              </button>
            </div>

            {/* Link Esqueceu a senha? */}
            <div className="w-[340px] flex justify-end">
              <a
                href="#esqueceu-senha"
                onClick={(e) => {
                  e.preventDefault()
                  alert('Instruções de recuperação foram enviadas para o seu e-mail de cadastro.')
                }}
                className="text-[14px] leading-[16px] text-[#E89B55] hover:underline font-mono"
              >
                Esqueceu a senha?
              </a>
            </div>
          </div>
        ) : (
          /* FORMULÁRIO DE CADASTRO (Desktop_Cadastro.css) */
          <div className="px-[80px] pt-[24px] flex flex-col gap-[12px]">
            {/* Nome de usuário */}
            <div className="w-[340px] h-[40px] border border-[#3F2319] focus-within:border-[#D28A4C] rounded-[5px] px-[16px] flex items-center bg-transparent transition-colors">
              <input
                id="reg-username"
                type="text"
                aria-label="Nome de usuário"
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                placeholder="Nome de usuário"
                className="w-full bg-transparent text-[14px] leading-[16px] text-[#F5F1EB] placeholder:text-[#B39463] outline-none font-mono"
              />
            </div>

            {/* Digite seu e-mail */}
            <div className="w-[340px] h-[40px] border border-[#3F2319] focus-within:border-[#D28A4C] rounded-[5px] px-[16px] flex items-center bg-transparent transition-colors">
              <input
                id="reg-email"
                type="email"
                aria-label="E-mail para cadastro"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="Digite seu e-mail"
                className="w-full bg-transparent text-[14px] leading-[16px] text-[#F5F1EB] placeholder:text-[#B39463] outline-none font-mono"
              />
            </div>

            {/* Senha */}
            <div className="w-[340px] h-[40px] border border-[#3F2319] focus-within:border-[#D28A4C] rounded-[5px] px-[16px] flex items-center justify-between bg-transparent transition-colors">
              <input
                id="reg-password"
                type={showRegPassword ? 'text' : 'password'}
                aria-label="Senha para cadastro"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="Senha"
                className="w-[260px] bg-transparent text-[14px] leading-[16px] text-[#F5F1EB] placeholder:text-[#B39463] outline-none font-mono"
              />
              <button
                type="button"
                onClick={() => setShowRegPassword(!showRegPassword)}
                aria-label={showRegPassword ? 'Ocultar senha' : 'Exibir senha'}
                className="text-[#B39463] hover:text-[#E89B55] transition-colors cursor-pointer p-0.5"
              >
                {showRegPassword ? (
                  <Eye className="w-[18px] h-[18px]" />
                ) : (
                  <EyeOff className="w-[18px] h-[18px]" />
                )}
              </button>
            </div>

            {/* Confirmar senha */}
            <div className="w-[340px] h-[40px] border border-[#3F2319] focus-within:border-[#D28A4C] rounded-[5px] px-[16px] flex items-center justify-between bg-transparent transition-colors">
              <input
                id="reg-confirm-password"
                type={showRegConfirmPassword ? 'text' : 'password'}
                aria-label="Confirmar senha"
                value={regConfirmPassword}
                onChange={(e) => setRegConfirmPassword(e.target.value)}
                placeholder="Confirmar senha"
                className="w-[260px] bg-transparent text-[14px] leading-[16px] text-[#F5F1EB] placeholder:text-[#B39463] outline-none font-mono"
              />
              <button
                type="button"
                onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                aria-label={showRegConfirmPassword ? 'Ocultar senha' : 'Exibir senha'}
                className="text-[#B39463] hover:text-[#E89B55] transition-colors cursor-pointer p-0.5"
              >
                {showRegConfirmPassword ? (
                  <Eye className="w-[18px] h-[18px]" />
                ) : (
                  <EyeOff className="w-[18px] h-[18px]" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Mensagem de Erro com role="alert" */}
        {errorMessage && (
          <div
            role="alert"
            aria-live="assertive"
            className="px-[80px] pt-[8px] text-[12px] text-[#F0805F] leading-tight"
          >
            {errorMessage}
          </div>
        )}

        {/* Botão CTA: 340x45px, background #D28A4C, border-radius 5px */}
        <div className="px-[80px] pt-[24px]">
          <button
            type="submit"
            disabled={isLoading}
            className="w-[340px] h-[45px] bg-[#D28A4C] hover:bg-[#E89B55] active:scale-[0.99] rounded-[5px] text-[#140D0A] font-bold text-[16px] leading-[16px] flex items-center justify-center transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? 'Aguarde...' : isLogin ? 'Entrar' : 'Criar conta'}
          </button>
        </div>
      </form>

      {/* Bloco Social */}
      <div className={`pt-[24px] flex flex-col ${isLogin ? 'gap-[12px]' : 'gap-[16px]'}`}>
        {/* Divisor "Ou continue com" - vai de ponta a ponta (500px) */}
        <div className="w-[500px] flex items-center">
          <div className="h-[1px] bg-[#3F2319] flex-1" />
          <span className="px-[12px] text-[13px] leading-[16px] text-[#F5F1EB] font-mono shrink-0">
            Ou continue com
          </span>
          <div className="h-[1px] bg-[#3F2319] flex-1" />
        </div>

        {/* Botões sociais: Google e Facebook (340px cada, padding 0 80px) */}
        <div className={`px-[80px] flex flex-col ${isLogin ? 'gap-[12px]' : 'gap-[16px]'}`}>
          {/* Botão Google */}
          <button
            type="button"
            onClick={async () => {
              await login({ email: isLogin ? 'usuario.google@kurio.art' : 'novo.google@kurio.art' })
              onSuccess?.()
              onClose()
            }}
            className="w-[340px] h-[40px] border border-[#3F2319] hover:border-[#D28A4C] rounded-[5px] flex items-center justify-center gap-[12px] transition-colors cursor-pointer bg-transparent group"
          >
            <svg className="w-[20px] h-[20px] shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span className="text-[13px] font-medium leading-[16px] text-[#CFB28C] group-hover:text-[#F5F1EB] transition-colors">
              Continuar com Google
            </span>
          </button>

          {/* Botão Facebook */}
          <button
            type="button"
            onClick={async () => {
              await login({ email: isLogin ? 'usuario.facebook@kurio.art' : 'novo.facebook@kurio.art' })
              onSuccess?.()
              onClose()
            }}
            className="w-[340px] h-[40px] border border-[#3F2319] hover:border-[#D28A4C] rounded-[5px] flex items-center justify-center gap-[12px] transition-colors cursor-pointer bg-transparent group"
          >
            <svg
              className="w-[20px] h-[20px] shrink-0 fill-[#3B5999]"
              viewBox="0 0 24 24"
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span className="text-[13px] font-medium leading-[16px] text-[#CFB28C] group-hover:text-[#F5F1EB] transition-colors">
              Continuar com Facebook
            </span>
          </button>
        </div>
      </div>

      {/* Rectangle 54/55: barra decorativa de 10px na base inferior com cor #D28A4C */}
      <div className="absolute bottom-0 left-0 right-0 h-[10px] bg-[#D28A4C]" />
    </div>
  )
}
