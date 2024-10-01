import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Bolt, Download, Ghost } from "lucide-react";

export function Dashboard() {
  return (
    <div className="bg-primary-foreground h-screen px-8">
      <Header />

      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="text-4xl text-slate-900">Dashboard</h2>
          <span className="text-sm text-muted-foreground">Veja as estaticas do financeiro</span>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <Button variant={"outline"} className="flex items-center gap-2 text-muted-foreground rounded-full">
              <Download className="size-5" />
              Exportar Dados
            </Button>

            <Button variant={"outline"} className="rounded-full">
              <Bolt className="size-5 text-muted-foreground " />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}