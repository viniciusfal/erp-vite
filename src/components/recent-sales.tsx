import { ArrowRightLeft } from 'lucide-react'

export function RecentSales() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <ArrowRightLeft className="size-3" />
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Arrecadação</p>
          <p className="text-xs text-muted-foreground">02/10/2024</p>
        </div>
        <div className="ml-auto font-medium">+R$1,999.00</div>
      </div>
      <div className="flex items-center">
        <ArrowRightLeft className="size-3" />
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Arrecadação</p>
          <p className="text-xs text-muted-foreground">02/10/2024</p>
        </div>
        <div className="ml-auto font-medium">+R$1,999.00</div>
      </div>
      <div className="flex items-center">
        <ArrowRightLeft className="size-3" />
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Folha de pagamento</p>
          <p className="text-xs text-muted-foreground">02/10/2024</p>
        </div>
        <div className="ml-auto font-medium">-R$2,999.00</div>
      </div>
      <div className="flex items-center">
        <ArrowRightLeft className="size-3" />
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Arrecadação</p>
          <p className="text-xs text-muted-foreground">02/10/2024</p>
        </div>
        <div className="ml-auto font-medium">+R$1,999.00</div>
      </div>
      <div className="flex items-center">
        <ArrowRightLeft className="size-3" />
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Folha de pagamento</p>
          <p className="text-xs text-muted-foreground">02/10/2024</p>
        </div>
        <div className="ml-auto font-medium">-R$2,999.00</div>
      </div>
    </div>
  )
}
