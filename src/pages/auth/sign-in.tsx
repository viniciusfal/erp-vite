import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import { ChartNoAxesCombined } from 'lucide-react'
import hero from '@/assets/hero.svg'


export function SignIn() {
  return (
    <div className="flex h-screen">
      <section className='w-1/2 flex items-center flex-col justify-center'>
        <div className='flex flex-col gap-4 items-center'>
          <div className='bg-gradient-to-tr to-slate-950  from-slate-800  rounded-2xl w-[80px] h-[80px] pl-2 pt-2'>
            <ChartNoAxesCombined className='h-[60px] w-[60px] text-secondary' />
          </div>
          <div>
            <h1 className='text-2xl'>Faça seu Login</h1>
            <p className='text-muted-foreground text-sm '>Seja bem vindo ao ERP Net</p>
          </div>
        </div>


        <form className='w-[450px] space-y-3 mt-2.5'>
          <div>
            <Label className='text-sm text-muted-foreground'>Email</Label>
            <Input type="text" className="p-2" />
          </div>

          <div>
            <Label className='text-sm text-muted-foreground'>Senha</Label>
            <Input type="password" className="p-2" />
          </div>

          <div className='flex flex-col gap-2'>
            <Button className='bg-gradient-to-tr to-slate-950  from-slate-800 '>Entrar</Button>
            <a href="#" className='text-sm underline text-muted-foreground text-end'>Esqueci minha senha</a>
          </div>
        </form>
      </section>

      <section className="bg-gradient-to-tr to-slate-950  from-slate-800 0 w-1/2 rounded-2xl my-4 mr-4 font-semibold italic">

      </section>
    </div>

  )
}