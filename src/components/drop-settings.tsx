import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from '@/components/ui/separator'
import { Button } from "./ui/button"
import { Bolt, CircleHelp, LogOut, UserRound } from "lucide-react"
import { Link } from "react-router-dom"

export function DropSettings() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant={'outline'} className="rounded-full">
          <Bolt className="size-5 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className='text-muted-foreground'>Meu Perfil</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='flex gap-2 py-2'>
          <UserRound className='size-4 text-muted-foreground' />
          <p>Alterar Dados</p>
        </DropdownMenuItem>
        <DropdownMenuItem className='flex gap-2 py-2'>
          <CircleHelp className='size-4 text-muted-foreground' />
          <p className=''>Ajuda</p>
        </DropdownMenuItem>
        <Separator />
        <Link to='/' >
          <DropdownMenuItem className='flex gap-2 py-3'>
            <LogOut className='size-5 text-red-400' />
            <p>Sair</p>
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}