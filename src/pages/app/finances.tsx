import { CalendarDateRangePicker } from "@/components/date-ranger-picker";
import { TableTransaction } from "@/components/table-transaction";
import { Button } from "@/components/ui/button";
import { Bolt } from "lucide-react";
import { Helmet } from "react-helmet-async";

export function Finances() {
  return (
    <div className="h-screen">

      <div className="flex justify-between items-center">
        <Helmet titleTemplate="Financeiro" />

        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-4xl text-slate-900">Financeiro</h2>
            <span className="mb-4 text-sm text-muted-foreground">
              Registre as entradas e saidas financeiras.
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <CalendarDateRangePicker />
          <Button variant={'outline'} className="rounded-full">
            <Bolt className="size-5 text-muted-foreground" />
          </Button>
        </div>

      </div>

      <TableTransaction />
    </div>


  )
}