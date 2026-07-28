"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { useTheme } from "next-themes"
import { Sun, Moon, Church, Mail, Lock, User, Building2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { registerAction } from "@/actions/auth-actions"

export default function RegisterPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password !== confirmPassword) {
      setError("As senhas não coincidem")
      setLoading(false)
      return
    }

    const result = await registerAction({
      name: formData.get("name") as string,
      churchName: formData.get("churchName") as string,
      email: formData.get("email") as string,
      password,
    })

    if (result.success && result.user) {
      setShowSuccess(true)

      const signInResult = await signIn("credentials", {
        email: result.user.email,
        password: result.user.password,
        redirect: false,
      })

      if (signInResult?.ok) {
        setTimeout(() => {
          router.push("/dashboard")
          router.refresh()
        }, 1500)
      }
    } else {
      setError(result.error || "Erro ao criar conta")
      setLoading(false)
    }
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900 animate-fade-in">
        <div className="text-center animate-scale-in">
          <div className="w-20 h-20 rounded-3xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <CheckCircle className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2 tracking-tight">
            Conta criada com sucesso!
          </h2>
          <p className="text-sm text-neutral-500">
            Redirecionando para o dashboard...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 items-center justify-center p-12">
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 -right-20 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "-3s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative text-center animate-fade-in">
          <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <Church className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            ChurchHub
          </h1>
          <p className="text-xl text-blue-200/90 font-light">
            Gestão inteligente para igrejas.
          </p>

          <div className="mt-16 space-y-4 max-w-sm mx-auto">
            {["Cadastro rápido e seguro", "Dados na nuvem", "Suporte dedicado"].map((text, i) => (
              <div
                key={text}
                className="flex items-center gap-3 text-left animate-slide-up"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-blue-300/60 flex-shrink-0" />
                <span className="text-blue-100/80 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-8 lg:p-12 min-h-screen lg:min-h-0 relative bg-neutral-50 dark:bg-neutral-900">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="absolute top-4 right-4 p-2.5 rounded-xl text-neutral-400 hover:text-neutral-600 hover:bg-neutral-200/50 dark:hover:text-neutral-300 dark:hover:bg-neutral-800 transition-all duration-200 cursor-pointer"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <div className="w-full max-w-sm animate-scale-in">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-neutral-900 dark:bg-white flex items-center justify-center shadow-lg">
              <Church className="h-6 w-6 text-white dark:text-neutral-900" />
            </div>
            <div>
              <p className="text-xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">ChurchHub</p>
              <p className="text-xs text-neutral-500">Gestão inteligente para igrejas.</p>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 p-8 shadow-xl shadow-neutral-200/50 dark:shadow-neutral-950">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
                Criar conta
              </h2>
              <p className="text-sm text-neutral-500 mt-1.5">
                Preencha os dados para começar
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Seu nome
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <input
                    name="name"
                    placeholder="João Silva"
                    required
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-neutral-200 bg-white text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/20 focus:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:ring-white/20 dark:focus:border-neutral-600 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Nome da Igreja
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <input
                    name="churchName"
                    placeholder="Igreja Batista"
                    required
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-neutral-200 bg-white text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/20 focus:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:ring-white/20 dark:focus:border-neutral-600 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <input
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    required
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-neutral-200 bg-white text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/20 focus:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:ring-white/20 dark:focus:border-neutral-600 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-neutral-200 bg-white text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/20 focus:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:ring-white/20 dark:focus:border-neutral-600 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Confirmar senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <input
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-neutral-200 bg-white text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/20 focus:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:ring-white/20 dark:focus:border-neutral-600 transition-all"
                  />
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-4 py-2.5 rounded-xl border border-red-100 dark:border-red-900/30">
                  {error}
                </p>
              )}

              <Button type="submit" className="w-full h-11 rounded-xl" loading={loading}>
                Criar Conta
              </Button>
            </form>

            <p className="text-center text-sm text-neutral-500 mt-8">
              Já tem uma conta?{" "}
              <Link
                href="/login"
                className="text-neutral-900 dark:text-neutral-100 font-semibold hover:underline"
              >
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
