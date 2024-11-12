'use client'

import { CalendarIcon, FileIcon, TagIcon } from "lucide-react"
import { format, isValid, parseISO } from "date-fns"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"


interface TransactionProps {
  transaction_id: string
  title: string
  value: number
  type: string
  category: string
  scheduling: boolean
  annex: string | null
  payment_date: Date | null
  created_at: Date
  updated_at: Date
  pay?: boolean
}


export function CardInfoTransaction({ transaction }: { transaction: TransactionProps | null }) {
  const formatDate = (date: Date | null): string => {
    if (!date) return 'Data não disponível'

    let parsedDate: Date | null = null

    if (typeof date === 'string') {
      parsedDate = parseISO(date)
    } else if (date instanceof Date) {
      parsedDate = date
    }

    if (parsedDate && isValid(parsedDate)) {
      return format(parsedDate, 'dd/MM/yyyy')
    }

    return 'Data inválida'
  }

  const formattedDate = transaction && formatDate(transaction.payment_date)

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span className="text-lg">{transaction?.title}</span>
          <span className={`text-xl font-bold ${transaction && transaction.type === 'saida' ? 'text-red-400' : 'text-emerald-500'}`}>
            R$ {transaction && Math.abs(transaction.value).toFixed(2)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <TagIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{transaction?.category}</span>
        </div>
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {transaction?.scheduling ? 'Agendado para: ' : 'Pago em: '}
            {formattedDate}
          </span>
        </div>
        <Badge variant={transaction?.scheduling ? "outline" : "default"}>
          {transaction?.scheduling ? 'Agendado' : 'Pago'}
        </Badge>
      </CardContent>
      <CardFooter>
        {transaction?.annex && (
          <Button variant="outline" className="w-full" asChild>
            <a href={transaction.annex} target="_blank" rel="noopener noreferrer">
              <FileIcon className="mr-2 h-4 w-4" />
              Ver anexo
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
