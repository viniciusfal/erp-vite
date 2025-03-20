import { BellDot, ChartNoAxesCombined, ExternalLink, Menu } from 'lucide-react'
import { Button } from './ui/button'
import { useState, useEffect } from 'react'
import { Input } from './ui/input'
import { Link, useLocation } from 'react-router-dom'
import { Sheet, SheetClose, SheetContent, SheetTrigger } from './ui/sheet'
import { ThemeToggle } from './theme/theme-toggle'

export function Header() {
  const location = useLocation()
  const [activeButton, setActiveButton] = useState(location.pathname)
  const [responsive, setResponsive] = useState('desktop')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleResize = () =>
      setResponsive(window.innerWidth < 1024 ? 'tablet' : 'desktop')
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleButtonClick = (path: string) => setActiveButton(path)

  return (
    <header className="flex items-center justify-between px-6 py-6">
      <div className="flex items-end gap-1">
        <div className="rounded-xl bg-gradient-to-tr from-slate-800 to-slate-950 p-2.5 dark:bg-gradient-to-tr dark:from-emerald-700 dark:to-emerald-500">
          <ChartNoAxesCombined className="size-4 text-secondary dark:text-muted-foreground" />
        </div>
        <strong className="font-[SUSE] text-muted-foreground dark:text-muted-foreground">
          ERP NET
        </strong>
      </div>
      {responsive === 'tablet' ? (
        <nav className="flex items-center gap-5">
          <div className="flex items-center gap-3">
            <div>
              <Input type="search" placeholder="Pesquisar..." />
            </div>
            <div className="rounded-full bg-white p-3.5 dark:bg-background">
              <BellDot className="size-5 text-muted-foreground" />
            </div>
          </div>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text- hover:text-primary"
                aria-label="Abrir menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="flex h-full flex-col">
                <div className="mb-6 flex items-center justify-between">
                  <span className="text-lg font-semibold">Menu</span>
                  <SheetClose asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-primary"
                      aria-label="Fechar menu"
                    ></Button>
                  </SheetClose>
                </div>
                <nav className="flex-grow space-y-4">
                  <Link to="/">
                    <Button
                      className={`h-12 w-full rounded-full text-sm ${activeButton === '/'
                          ? 'bg-gradient-to-r from-slate-950 to-slate-800 text-muted hover:text-white dark:bg-gradient-to-tr dark:from-emerald-700 dark:to-emerald-500 dark:text-white'
                          : 'bg-transparent'
                        }`}
                      variant="outline"
                      onClick={() => handleButtonClick('/')}
                    >
                      Dashboard
                    </Button>
                  </Link>
                  <Link to="/finances">
                    <Button
                      className={`h-12 w-full rounded-full text-sm ${activeButton === '/finances'
                          ? 'bg-gradient-to-r from-slate-950 to-slate-800 text-muted hover:text-white dark:bg-gradient-to-tr dark:from-emerald-700 dark:to-emerald-500 dark:text-white'
                          : 'bg-transparent'
                        }`}
                      variant="outline"
                      onClick={() => handleButtonClick('/finances')}
                    >
                      Financeiro
                    </Button>
                  </Link>
                  <Link to="/payments">
                    <Button
                      className={`h-12 w-full rounded-full text-sm ${activeButton === '/payments'
                          ? 'bg-gradient-to-r from-slate-950 to-slate-800 text-muted hover:text-white dark:bg-gradient-to-tr dark:from-emerald-700 dark:to-emerald-500 dark:text-white'
                          : 'bg-transparent'
                        }`}
                      variant="outline"
                      onClick={() => handleButtonClick('/payments')}
                    >
                      Agendamentos
                    </Button>
                  </Link>
                  <Button
                    className={`h-12 w-full rounded-full text-sm ${activeButton === '/safe'
                        ? 'bg-gradient-to-r from-slate-950 to-slate-800 text-muted hover:text-white dark:bg-gradient-to-tr dark:from-emerald-700 dark:to-emerald-500 dark:text-white'
                        : 'bg-transparent'
                      }`}
                    variant="outline"
                    onClick={() => handleButtonClick('/safe')}
                  >
                    Cofre
                  </Button>
                  <Button
                    className={`h-12 w-full rounded-full text-sm ${activeButton === '/loan'
                        ? 'bg-gradient-to-r from-slate-950 to-slate-800 text-muted hover:text-white dark:bg-gradient-to-tr dark:from-emerald-700 dark:to-emerald-500 dark:text-white'
                        : 'bg-transparent'
                      }`}
                    variant="outline"
                    onClick={() => handleButtonClick('/loan')}
                  >
                    Emprestimos
                  </Button>
                  <Button
                    className={`h-12 w-full rounded-full text-sm ${activeButton === '/banks'
                        ? 'bg-gradient-to-r from-slate-950 to-slate-800 text-muted hover:text-white dark:bg-gradient-to-tr dark:from-emerald-700 dark:to-emerald-500 dark:text-white'
                        : 'bg-transparent'
                      }`}
                    variant="outline"
                    onClick={() => handleButtonClick('/banks')}
                  >
                    Bancos
                  </Button>
                </nav>
                <a
                  href="https://glpiamazoniainter.com/glpi"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    className="flex h-12 w-full items-center gap-1 from-slate-950 to-slate-800 text-sm hover:bg-gradient-to-r"
                    variant="link"
                  >
                    Suporte
                    <ExternalLink className="mb-2 size-2.5" />
                  </Button>
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      ) : (
        <nav className="flex items-center gap-5">
          <Link to="/">
            <Button
              className={`h-12 w-32 rounded-full text-sm ${activeButton === '/'
                  ? 'bg-gradient-to-r from-slate-950 to-slate-800 text-muted hover:text-white dark:bg-gradient-to-tr dark:from-emerald-700 dark:to-emerald-500 dark:text-white'
                  : 'bg-transparent dark:border-muted'
                }`}
              variant="outline"
              onClick={() => handleButtonClick('/')}
            >
              Dashboard
            </Button>
          </Link>
          <Link to="/finances">
            <Button
              className={`h-12 w-32 rounded-full text-sm ${activeButton === '/finances'
                  ? 'bg-gradient-to-r from-slate-950 to-slate-800 text-muted hover:text-white dark:bg-gradient-to-tr dark:from-emerald-700 dark:to-emerald-500 dark:text-white'
                  : 'bg-transparent'
                }`}
              variant="outline"
              onClick={() => handleButtonClick('/finances')}
            >
              Financeiro
            </Button>
          </Link>
          <Link to="/payments">
            <Button
              className={`h-12 w-32 rounded-full text-sm ${activeButton === '/payments'
                  ? 'bg-gradient-to-r from-slate-950 to-slate-800 text-muted hover:text-white dark:bg-gradient-to-tr dark:from-emerald-700 dark:to-emerald-500 dark:text-white'
                  : 'bg-transparent'
                }`}
              variant="outline"
              onClick={() => handleButtonClick('/payments')}
            >
              Agendamentos
            </Button>
          </Link>
          <Link to="/safe">
            <Button
              className={`h-12 w-32 rounded-full text-sm ${activeButton === '/safe'
                  ? 'bg-gradient-to-r from-slate-950 to-slate-800 text-muted hover:text-white dark:bg-gradient-to-tr dark:from-emerald-700 dark:to-emerald-500 dark:text-white'
                  : 'bg-transparent'
                }`}
              variant="outline"
              onClick={() => handleButtonClick('/safe')}
            >
              Cofre
            </Button>
          </Link>
          <Button
            className={`h-12 w-32 rounded-full text-xs ${activeButton === '/loan'
                ? 'bg-gradient-to-r from-slate-950 to-slate-800 text-muted hover:text-white dark:bg-gradient-to-tr dark:from-emerald-700 dark:to-emerald-500 dark:text-white'
                : 'bg-transparent'
              }`}
            variant="outline"
            onClick={() => handleButtonClick('/loan')}
          >
            Emprestimos
          </Button>{' '}
          <Button
            className={`h-12 w-32 rounded-full text-sm ${activeButton === '/banks'
                ? 'bg-gradient-to-r from-slate-950 to-slate-800 text-muted hover:text-white dark:bg-gradient-to-tr dark:from-emerald-700 dark:to-emerald-500 dark:text-white'
                : 'bg-transparent'
              }`}
            variant="outline"
            onClick={() => handleButtonClick('/banks')}
          >
            Bancos
          </Button>
        </nav>
      )}
      <div
        className={
          responsive != 'desktop' ? 'hidden' : 'flex items-center gap-3'
        }
      >
        <div className="text-secondary-foreground" title="Trocar o Tema">
          <ThemeToggle />
        </div>
        <div>
          <Input type="search" placeholder="Pesquisar..." />
        </div>
        <div className="rounded-full bg-white p-3.5 dark:bg-background">
          <BellDot className="size-5 text-muted-foreground" />
        </div>
      </div>
    </header>
  )
}
