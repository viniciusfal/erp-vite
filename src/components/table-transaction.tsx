import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SelectGroup } from '@radix-ui/react-select'
import { Wrench } from 'lucide-react'
import { Button } from './ui/button'

export function TableTransaction() {
  return (
    <div className="flex w-2/3 flex-col justify-between rounded-2xl border border-muted bg-white px-4 py-5 shadow-md">
      <div className="flex justify-between">
        <strong className="text-2xl font-normal">Lista de transações</strong>
        <div>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="full">Todas</SelectItem>
                <SelectItem value="income">Entradas</SelectItem>
                <SelectItem value="outcome">Saídas</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table className="my-6">
        <TableHeader className="text-xs">
          <TableRow className="">
            <TableHead className="w-[280px] font-medium text-primary">
              Titulo
            </TableHead>
            <TableHead className="text-primary">Categoria</TableHead>

            <TableHead className="w-[100px] font-medium text-primary">
              Pagamento Agendado
            </TableHead>
            <TableHead className="font-medium text-primary">
              Pagamento / Agendamento
            </TableHead>
            <TableHead className="w-[80px] font-medium text-primary">
              Tipo
            </TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-sm">
          {Array.from({ length: 10 }).map((_, index) => (
            <TableRow key={index} className="border-muted">
              <TableCell>{index + 1}. Compra de Rebons </TableCell>
              <TableCell>Receita Administrativa</TableCell>
              <TableCell>Não</TableCell>
              <TableCell>02/10/2024</TableCell>
              <TableCell>
                <Button className="rounded-full bg-green-100 p-3 text-xs text-green-400 hover:bg-green-100">
                  Entrada
                </Button>
              </TableCell>
              <TableCell>
                <Button variant="ghost" className="rounded-full">
                  <Wrench className="size-4 text-muted-foreground" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination className="">
        <PaginationContent className="space-x-1">
          <PaginationItem>
            <PaginationLink
              href="#"
              className="rounded-full bg-gradient-to-tr from-slate-800 to-slate-950 text-white hover:text-white"
            >
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" className="rounded-full border bg-muted">
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" className="rounded-full border bg-muted">
              3
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" className="rounded-full border bg-muted">
              4
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
