import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SelectGroup } from "@radix-ui/react-select";



export function TableTransaction() {
  return (
    <div className="bg-white w-2/3 py-5 px-4 rounded-2xl border border-muted shadow-md h-[680px] flex flex-col justify-between ">
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

      <Table className="">
        <TableHeader className="">
          <TableRow className="">
            <TableHead className="text-primary font-medium">Titulo</TableHead>
            <TableHead className="text-primary font-medium">Categoria</TableHead>
            <TableHead className="text-primary font-medium">Pagamento Agendado</TableHead>
            <TableHead className="text-primary font-medium">Data de Pagamento</TableHead>
            <TableHead className="text-primary font-medium">Tipo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 12 }).map((_, index) => (
            <TableRow key={index} className="border-muted">
              <TableCell>{index + 1}.  Compra de Rebons </TableCell>
              <TableCell>Receita Administrativa</TableCell>
              <TableCell>Não</TableCell>
              <TableCell className="text-right">02/10/2024</TableCell>
              <TableCell className="text-right">Entrada</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination className="">
        <PaginationContent className="space-x-1">
          <PaginationItem>
            <PaginationLink href="#" className="bg-gradient-to-tr to-slate-950 from-slate-800 text-white rounded-full hover:text-white">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" className="border rounded-full bg-muted">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" className="border rounded-full bg-muted">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" className="border rounded-full bg-muted">4</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}