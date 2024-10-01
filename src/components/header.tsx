import { BellDot, ChartNoAxesCombined } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { useState } from "react"; // Importar useState
import { Input } from "./ui/input";

export function Header() {
  const [activeButton, setActiveButton] = useState("dashboard"); // Estado para o botão ativo

  return (
    <header className="flex justify-between py-8 items-center">
      <div className="flex items-end gap-1">
        <div className='bg-gradient-to-tr to-slate-950 from-slate-800 rounded-2xl px-2 py-2'>
          <ChartNoAxesCombined className='size-5 text-secondary' />
        </div>
        <strong className="text-lg text-muted-foreground font-[SUSE]">ERP NET</strong>
      </div>

      <nav className="flex gap-5 items-center justify-center">
        <Button
          className={`rounded-full h-12 w-32 text-sm ${activeButton === 'dashboard' ? 'bg-gradient-to-r text-muted from-slate-950 to-slate-800 hover:text-muted' : 'bg-transparent'}  `}
          variant={"outline"}
          onClick={() => setActiveButton('dashboard')}
        >
          Dashboard
        </Button>
        <Button
          className={`rounded-full h-12 w-32 text-sm ${activeButton === 'financeiro' ? 'bg-gradient-to-r text-muted from-slate-950 to-slate-800 hover:text-muted' : 'bg-transparent'}`}
          variant={"outline"}
          onClick={() => setActiveButton('financeiro')}
        >
          Financeiro
        </Button>
        <Button
          className={`rounded-full h-12 w-32 text-sm ${activeButton === 'drh' ? 'bg-gradient-to-r text-muted from-slate-950 to-slate-800 hover:text-muted' : 'bg-transparent'}`}
          variant={"outline"}
          onClick={() => setActiveButton('drh')}
        >
          DRH
        </Button>
        <Button
          className={`rounded-full h-12 w-32 text-sm ${activeButton === 'trafego' ? 'bg-gradient-to-r text-muted from-slate-950 to-slate-800 hover:text-muted' : 'bg-transparent'}`}
          variant={"outline"}
          onClick={() => setActiveButton('trafego')}
        >
          Tráfego
        </Button>
      </nav>

      <div className="flex gap-3 items-center">
        <div className="">
          <Input type="search" placeholder="Pesquisar..." />
        </div>

        <div className="bg-white rounded-full p-3.5">
          <BellDot className="size-5 text-muted-foreground" />
        </div>

        <Avatar className="hover:border hover:border-cyan-500">
          <AvatarImage src="https://media-bsb1-1.cdn.whatsapp.net/v/t61.24694-24/429479863_429808729575871_9068563014999226526_n.jpg?stp=dst-jpg_s96x96&ccb=11-4&oh=01_Q5AaIDtNSPbNqpAaUFAvda_cKW0kG6x_-QZeDaYD_yzmzcLa&oe=67094111&_nc_sid=5e03e0&_nc_cat=106" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
