'use client'

import { CalendarIcon, CreditCard, FileIcon, Landmark, ReceiptText, ScanQrCode, TagIcon } from "lucide-react"
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
  details?: string | null
  method: string
  nf: string | null
  account: string
}

const formatDate = (date: Date | null) => {
  if (!date) return '';
  const d = new Date(date);
  return `${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCMonth() + 1).padStart(2, '0')}/${d.getUTCFullYear()}`;
};

export function CardInfoTransaction({ transaction }: { transaction: TransactionProps | null }) {
  if (!transaction) return null; // Early return for null transaction

  const { title, value, type, nf, category, details, payment_date, method, account, scheduling, annex } = transaction;

  const isIncome = type === 'entrada';
  const formattedDate = formatDate(payment_date);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex flex-col gap-1">
          <span className="text-base">{title}</span>
          <span className={`text-lg font-bold ${isIncome ? 'text-emerald-500' : 'text-red-400'}`}>
            R$ {new Intl.NumberFormat('pt-BR').format(value)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <ScanQrCode className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{nf}</span>
        </div>
        <div className="flex items-center space-x-2">
          <TagIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{category}</span>
        </div>
        <div className="flex items-center space-x-2">
          <ReceiptText className="size-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{details || "sem detalhes"}</span>
        </div>
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {scheduling ? 'Agendado para: ' : 'Pago em: '}
            {formattedDate}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <CreditCard className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{method}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Landmark className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{account}</span>
        </div>
        <Badge variant={scheduling ? "outline" : "default"}>
          {scheduling ? 'Agendado' : 'Pago'}
        </Badge>
      </CardContent>
      {annex && (
        <CardFooter>
          <Button variant="outline" className="w-full" asChild>
            <a href={`https://erpnet.tech/api/${annex}`} target="_blank" rel="noopener noreferrer">
              <FileIcon className="mr-2 h-4 w-4" />
              Ver anexo
            </a>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
