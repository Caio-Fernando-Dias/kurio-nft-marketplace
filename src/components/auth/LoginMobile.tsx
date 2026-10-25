import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

interface LoginMobileProps {
  onSuccess?: () => void
}

export const LoginMobile: React.FC<LoginMobileProps> = ({ onSuccess }) => {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!email) {
      setErrorMessage('Por favor, informe seu e-mail.')
      return
    }

    try {
      setIsLoading(true)
      await login({ email, password })
      onSuccess?.()
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || 'Erro ao realizar login.'
      setErrorMessage(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-[414px] min-h-screen bg-[#140D0A] px-[28px] pt-[80px] pb-[32px] flex flex-col font-mono mx-auto">
      {/* Logo: KURIO Wordmark */}
      <div className="w-full flex justify-center items-center h-[42px]">
        <a
          href="/"
          className="text-[32px] font-bold leading-[42px] tracking-[0.1em] text-[#F5F1EB] uppercase hover:text-[#E89B55] transition-colors"
        >
          KURIO
        </a>
      </div>

      {/* Title: Entrar */}
      <div className="mt-[40px] w-full flex justify-center items-center h-[16px]">
        <h1 className="text-[20px] font-bold leading-[16px] text-[#F5F1EB]">
          Entrar
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mt-[40px] w-full flex flex-col gap-[12px]">
        {/* Email Input (358x50px, border #3F2319, radius 10px) */}
        <label htmlFor="mobile-login-email" className="sr-only">E-mail</label>
        <div className="w-full h-[50px] border border-[#3F2319] focus-within:border-[#D28A4C] rounded-[10px] px-[16px] flex items-center bg-transparent transition-colors">
          <input
            id="mobile-login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="contato@email.com"
            aria-label="E-mail"
            className="w-full bg-transparent text-[14px] leading-[16px] text-[#F5F1EB] placeholder:text-[#B39463] outline-none font-mono"
          />
        </div>

        {/* Password Input (358x50px, border #3F2319 com foco #D28A4C, radius 10px) */}
        <label htmlFor="mobile-login-password" className="sr-only">Senha</label>
        <div className="w-full h-[50px] border border-[#3F2319] focus-within:border-[#D28A4C] rounded-[10px] px-[16px] flex items-center justify-between bg-transparent transition-colors">
          <input
            id="mobile-login-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="***********"
            aria-label="Senha"
            className="w-[280px] bg-transparent text-[16px] leading-[16px] text-[#F5F1EB] placeholder:text-[#B39463] tracking-wider outline-none font-mono"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
            className="text-[#55321F] hover:text-[#B39463] transition-colors cursor-pointer p-1"
          >
            {showPassword ? (
              <Eye className="w-[18px] h-[18px]" />
            ) : (
              <EyeOff className="w-[18px] h-[18px]" />
            )}
          </button>
        </div>

        {/* Mensagem de Erro opcional */}
        {errorMessage && (
          <div role="alert" aria-live="assertive" className="text-[12px] text-[#F0805F] leading-tight">
            {errorMessage}
          </div>
        )}

        {/* Forgot Link */}
        <div className="w-full flex justify-end">
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

        {/* Sign In Button (358x60px, #D28A4C, radius 10px) */}
        <button
          type="submit"
          disabled={isLoading}
          className="mt-[12px] w-full h-[60px] bg-[#D28A4C] hover:bg-[#E89B55] active:scale-[0.99] rounded-[10px] text-[#140D0A] font-bold text-[16px] leading-[16px] flex items-center justify-center transition-all cursor-pointer disabled:opacity-50"
        >
          {isLoading ? 'Aguarde...' : 'Entrar'}
        </button>
      </form>

      {/* Mobile Social Block */}
      <div className="mt-[40px] w-full flex flex-col gap-[12px]">
        {/* Frame 4 Divider */}
        <div className="w-full flex items-center gap-[10px]">
          <div className="h-[1px] bg-[#3F2319] flex-1" />
          <span className="text-[13px] leading-[16px] text-[#F5F1EB] font-mono shrink-0">
            Ou continue com
          </span>
          <div className="h-[1px] bg-[#3F2319] flex-1" />
        </div>

        {/* Frame 370 Social Buttons */}
        <div className="mt-[4px] flex flex-col gap-[16px]">
          {/* Google Button */}
          <button
            type="button"
            onClick={async () => {
              await login({ email: 'usuario.google@kurio.art' })
              onSuccess?.()
            }}
            className="w-full h-[40px] border border-[#3F2319] hover:border-[#D28A4C] rounded-[5px] flex items-center justify-center gap-[12px] transition-colors cursor-pointer bg-transparent"
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
            <span className="text-[13px] font-medium leading-[16px] text-[#CFB28C]">
              Continuar com Google
            </span>
          </button>

          {/* Facebook Button */}
          <button
            type="button"
            onClick={async () => {
              await login({ email: 'usuario.facebook@kurio.art' })
              onSuccess?.()
            }}
            className="w-full h-[40px] border border-[#3F2319] hover:border-[#D28A4C] rounded-[5px] flex items-center justify-center gap-[12px] transition-colors cursor-pointer bg-transparent"
          >
            <svg
              className="w-[20px] h-[20px] shrink-0 fill-[#3B5999]"
              viewBox="0 0 24 24"
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span className="text-[13px] font-medium leading-[16px] text-[#CFB28C]">
              Continuar com Facebook
            </span>
          </button>
        </div>
      </div>

      {/* Signup Link */}
      <div className="mt-[40px] w-full flex justify-center items-center text-[15px] leading-[20px] text-[#CFB28C]">
        <span>Novo na Kurio?</span>
        <a
          href="/cadastro"
          className="text-[#E89B55] hover:underline font-medium ml-1"
        >
          Crie uma conta
        </a>
      </div>
    </div>
  )
}
