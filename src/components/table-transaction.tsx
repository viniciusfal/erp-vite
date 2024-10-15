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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


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
import { useMutation } from '@tanstack/react-query'

import { removeTransaction } from '@/api/remove-transaction'
import { z } from 'zod'
import { toast } from 'sonner'
import { queryClient } from '@/lib/query-client'
import type { Dispatch, SetStateAction } from 'react'
import type { Transactions } from '@/services/listing-transacrions'

interface TableProps {
  setVisible: Dispatch<SetStateAction<boolean>>;
  currentTransactions: Transactions[] | undefined;
  totalPages: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  setInputType: Dispatch<SetStateAction<string>>;
  inputType: string;
  currentPage: number
}


const TransactionID = z.object({
  id: z.string().uuid()
})

type transactionID = z.infer<typeof TransactionID>

export function TableTransaction({ setVisible, setInputType, setCurrentPage, currentTransactions, inputType, totalPages, currentPage }: TableProps) {

  const { mutateAsync: transaction } = useMutation({
    mutationFn: removeTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['transactions'],
        exact: false, // Se quiser invalidar todas as consultas que começam com 'transactions'
      });
      toast.warning('Transação Deletada com sucesso.');
    },
    onError: () => {
      toast.error('Falha ao excluir transação.');
    }
  });


  async function handleConfirmRemove(data: transactionID) {
    try {
      console.log('Tentando remover a transação com ID:', data.id); // Para depuração
      await transaction({
        id: data.id
      });
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
    }
  }
  return (
    <div className="flex w-2/3 flex-col  rounded-2xl border border-muted bg-white px-4 py-5 shadow-md">
      <div className="flex justify-between">
        <strong className="text-2xl font-medium">Lista de transações</strong>
        <div className="flex gap-2">
          <Select onValueChange={setInputType}>
            <SelectTrigger className="w-[180px]" value={inputType}>
              <SelectValue placeholder="Filtrar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="full">Todas</SelectItem>
                <SelectItem value="entrada">Entrada</SelectItem>
                <SelectItem value="saida">Saídas</SelectItem>
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
              Agendado?
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
          {currentTransactions?.map((t, index) => (
            <TableRow key={t.transaction_id} className="border-muted">
              <TableCell>{index + 1}{". " + t.title}</TableCell>
              <TableCell>{t.value}</TableCell>
              <TableCell>{t.category}</TableCell>
              <TableCell>{t.scheduling ? 'Sim' : 'Não'}</TableCell>
              <TableCell>{t.payment_date ? new Date(t.payment_date).toLocaleDateString() : new Date(t.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <Link to={t.annex ? t.annex : '#'}>
                  <File className="size-4 text-muted-foreground" />
                </Link>
              </TableCell>
              <TableCell>
                <Button
                  className={t.type === 'entrada' ? 'rounded-full bg-green-100 p-3 text-xs text-green-400 hover:cursor-default hover:bg-green-100' :
                    'rounded-full bg-red-400 p-3 text-xs text-red-50 hover:cursor-default hover:bg-red-400'}
                >
                  {t.type}
                </Button>
              </TableCell>
              <TableCell>
                <Button variant="ghost" className="rounded-full">
                  <Wrench className="size-4 text-muted-foreground" />
                </Button>
              </TableCell>
              <TableCell>
                <AlertDialog>
                  <AlertDialogTrigger>
                    <Button variant='ghost' className='hover:bg-red-400  text-red-400 hover:text-white
                    '>
                      <X className='size-4' />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Tem certeza que deseja excluir essa transação?</AlertDialogTitle>
                      <AlertDialogDescription>Ao exlcuir você não tera mais acesso a essa transação.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleConfirmRemove({ id: t.transaction_id })}>Excluir</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
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
                {Array.from({ length: totalPages }, (_, index) => (
                  <PaginationLink
                    key={index}
                    href="#"
                    className={`rounded-full ${currentPage === index + 1 ? 'bg-gradient-to-tr from-slate-800 to-slate-950 text-white' : 'border bg-muted'}`}
                    onClick={
                      (e) => {
                        e.preventDefault()
                        setCurrentPage(index + 1)
                      }
                    }
                  >
                    {index + 1}
                  </PaginationLink>
                ))}
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div >
  )
}
