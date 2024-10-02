import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import { ChartNoAxesCombined } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { signIn } from '@/api/sign-in-api'
import { toast } from 'sonner'

const signInForm = z.object({
  email: z.string().email(),
  password: z.string(),
})

type SignInForm = z.infer<typeof signInForm>

export function SignIn() {
  const { register, handleSubmit } = useForm<SignInForm>()
  const navigate = useNavigate()

  const { mutateAsync: session } = useMutation({
    mutationFn: signIn,
  })

  async function handleSignIn(data: SignInForm) {
    try {
      await session({ email: data.email, password: data.password })

      toast.success('Seja bem vindo!')

      navigate('/dashboard')
    } catch (err) {
      toast.error('Credenciais incorretas', {
        description: 'Tente novamente ou clique em esqueci minha senha.',
      })
    }
  }

  return (
    <div className="flex h-screen">
      <section className="flex w-1/2 flex-col items-center justify-center max-md:w-full max-md:flex-none">
        <div className="flex flex-col items-center gap-4">
          <div className="h-[80px] w-[80px] rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-950 pl-2 pt-2">
            <ChartNoAxesCombined className="h-[60px] w-[60px] text-secondary" />
          </div>
          <div>
            <h1 className="text-2xl">Faça seu Login</h1>
            <p className="text-sm text-muted-foreground">
              Seja bem vindo ao ERP Net
            </p>
          </div>
        </div>

        <form
          className="mt-2.5 w-[450px] space-y-3"
          onSubmit={handleSubmit(handleSignIn)}
        >
          <div>
            <Label className="text-sm text-muted-foreground">Email</Label>
            <Input type="text" className="p-2" {...register('email')} />
          </div>

          <div>
            <Label className="text-sm text-muted-foreground">Senha</Label>
            <Input type="password" className="p-2" {...register('password')} />
          </div>

          <div className="flex flex-col gap-2">
            <Button
              type="submit"
              className="bg-gradient-to-tr from-slate-800 to-slate-950"
            >
              Entrar
            </Button>
            <a
              href="#"
              className="text-end text-sm text-muted-foreground underline"
            >
              Esqueci minha senha
            </a>
          </div>
        </form>
      </section>

      <section className="0 my-4 mr-4 w-1/2 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-950 font-semibold italic max-md:bg-none"></section>
    </div>
  )
}
