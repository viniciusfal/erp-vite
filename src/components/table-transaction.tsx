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
import { File, Plus, Wrench, X } from 'lucide-react'
import { Button } from './ui/button'
import { Link } from 'react-router-dom'

export function TableTransaction({ setVisible }: any) {


  return (
    <div className="flex w-2/3 flex-col justify-between rounded-2xl border border-muted bg-white px-4 py-5 shadow-md">
      <div className="flex justify-between">
        <strong className="text-2xl font-medium">Lista de transações</strong>
        <div className="flex gap-2">
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

          <Button
            className="rounded-full hover:bg-primary hover:text-white"
            variant="outline"
            onClick={() => setVisible(true)}
          >
            <Plus className="size-4" />
          </Button>
        </div>
      </div>

      <Table className="my-6">
        <TableHeader className="text-xs">
          <TableRow className="">
            <TableHead className="w-[300px] font-medium">Titulo</TableHead>
            <TableHead className="w-[100px]">Valor</TableHead>
            <TableHead className="w-[250px]">Categoria</TableHead>

            <TableHead className="w-[50px] font-medium">
              Pagamento Agendado
            </TableHead>
            <TableHead className="w-[180px] font-medium">
              Pagamento / Agendamento
            </TableHead>
            <TableHead className="w-[60px] font-medium">Anexo</TableHead>
            <TableHead className="w-[50px] font-medium">Tipo</TableHead>
            <TableHead className="w-[20px]"></TableHead>
            <TableHead className="w-[20px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-sm">
          {Array.from({ length: 10 }).map((_, index) => (
            <TableRow key={index} className="border-muted">
              <TableCell>{index + 1}. Arrecadação </TableCell>
              <TableCell>5.000,00</TableCell>
              <TableCell>Receita Administrativa</TableCell>
              <TableCell>Não</TableCell>
              <TableCell>02/10/2024</TableCell>
              <TableCell>
                <Link to="#">
                  <File className="size-4 text-muted-foreground" />
                </Link>
              </TableCell>
              <TableCell>
                <Button className="rounded-full bg-green-100 p-3 text-xs text-green-400 hover:cursor-default hover:bg-green-100">
                  Entrada
                </Button>
              </TableCell>
              <TableCell>
                <Button variant="ghost" className="rounded-full">
                  <Wrench className="size-4 text-muted-foreground" />
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  className="rounded-full text-red-300 hover:bg-red-300 hover:text-white"
                  variant="ghost"
                >
                  <X className="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between">
        <div></div>

        <div>
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
                <PaginationLink
                  href="#"
                  className="rounded-full border bg-muted"
                >
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  className="rounded-full border bg-muted"
                >
                  3
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  className="rounded-full border bg-muted"
                >
                  4
                </PaginationLink>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  )
}
