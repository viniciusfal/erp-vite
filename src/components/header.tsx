import { BellDot, ChartNoAxesCombined, ExternalLink } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { useState } from 'react'
import { Input } from './ui/input'
import { Link, useLocation } from 'react-router-dom' // Importar Link e useLocation

export function Header() {
  const location = useLocation() // Usar useLocation para pegar a rota atual
  const [activeButton, setActiveButton] = useState(location.pathname) // Inicializar o estado com a rota atual

  // Função para lidar com a mudança de rota
  const handleButtonClick = (path: string) => {
    setActiveButton(path)
  }

  return (
    <header className="flex items-center justify-between px-8 py-6">
      <div className="flex items-end gap-1">
        <div className="rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-950 px-2 py-2">
          <ChartNoAxesCombined className="size-5 text-secondary" />
        </div>
        <strong className="font-[SUSE] text-lg text-muted-foreground">
          ERP NET
        </strong>
      </div>

      <nav className="flex items-center justify-center gap-5">
        <Link to="/dashboard">
          <Button
            className={`h-12 w-32 rounded-full text-sm ${activeButton === '/dashboard' ? 'bg-gradient-to-r from-slate-950 to-slate-800 text-muted hover:text-muted' : 'bg-transparent'}`}
            variant={'outline'}
            onClick={() => handleButtonClick('/dashboard')}
          >
            Dashboard
          </Button>
        </Link>
        <Link to="/finances">
          <Button
            className={`h-12 w-32 rounded-full text-sm ${activeButton === '/finances' ? 'bg-gradient-to-r from-slate-950 to-slate-800 text-muted hover:text-muted' : 'bg-transparent'}`}
            variant={'outline'}
            onClick={() => handleButtonClick('/finances')}
          >
            Financeiro
          </Button>
        </Link>
        <Button
          className={`h-12 w-32 rounded-full text-sm ${activeButton === '/drh' ? 'bg-gradient-to-r from-slate-950 to-slate-800 text-muted hover:text-muted' : 'bg-transparent'}`}
          variant={'outline'}
          onClick={() => handleButtonClick('/drh')}
        >
          DRH
        </Button>
        <Button
          className={`h-12 w-32 rounded-full text-sm ${activeButton === '/trafego' ? 'bg-gradient-to-r from-slate-950 to-slate-800 text-muted hover:text-muted' : 'bg-transparent'}`}
          variant={'outline'}
          onClick={() => handleButtonClick('/trafego')}
        >
          Tráfego
        </Button>

        <a
          href="https://glpiamazoniainter.com/glpi"
          target="_blank"
          rel="noreferrer"
        >
          <Button
            className={`hover:text-gradient-to-r flex h-12 w-32 items-center gap-1 text-sm hover:from-slate-950 hover:to-slate-800`}
            variant={'link'}
          >
            Suporte
            <ExternalLink className="mb-2 size-2.5" />
          </Button>
        </a>
      </nav>

      <div className="flex items-center gap-3">
        <div>
          <Input type="search" placeholder="Pesquisar..." />
        </div>

        <div className="rounded-full bg-white p-3.5">
          <BellDot className="size-5 text-muted-foreground" />
        </div>

        <Avatar className="hover:border hover:border-sky-500">
          <AvatarImage src="https://media-bsb1-1.cdn.whatsapp.net/v/t61.24694-24/429479863_429808729575871_9068563014999226526_n.jpg?stp=dst-jpg_s96x96&ccb=11-4&oh=01_Q5AaIDtNSPbNqpAaUFAvda_cKW0kG6x_-QZeDaYD_yzmzcLa&oe=67094111&_nc_sid=5e03e0&_nc_cat=106" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
