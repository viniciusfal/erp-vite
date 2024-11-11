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

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { SelectGroup } from '@radix-ui/react-select'
import { ArrowLeftRight, Asterisk, BadgeCent, CalendarDays, Eye, File, ListCollapse, Paperclip, Plus, Tag, TrendingUp, Wrench, X } from 'lucide-react'
import { Button } from './ui/button'
import { Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'

import { removeTransaction } from '@/api/remove-transaction'
import { z } from 'zod'
import { toast } from 'sonner'
import { queryClient } from '@/lib/query-client'
import { useState, type Dispatch, type SetStateAction } from 'react'
import type { Transactions } from '@/hooks/listing-transactions'
import { setTransaction } from '@/api/set-transactions'
import { Input } from './ui/input'
import { useDateRange } from '@/hooks/date-ranger-context'
import { useListingtransactionByDate } from '@/hooks/listing-transactions-by-date'
import { CardInfoTransaction } from './card-Info-transaction'

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
  pay: boolean
}

interface TableProps {
  setVisible: Dispatch<SetStateAction<boolean>>;
}

const TransactionID = z.object({
  id: z.string().uuid()
})


type transactionID = z.infer<typeof TransactionID>

export function TableTransaction({ setVisible }: TableProps) {
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionProps | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editedData, setEditedData] = useState<Partial<Transactions>>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [inputType, setInputType] = useState('full')
  const [isOpen, setIsOpen] = useState(false)

  const { dateRange } = useDateRange()
  const { startDate, endDate } = dateRange


  const { currentTransactions, totalPages } = useListingtransactionByDate(
    startDate,
    endDate,
    currentPage,
    inputType
  );

  const { mutateAsync: updateTransaction } = useMutation({
    mutationFn: setTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactionsByDate'] })
      toast.success('transação atualizada com sucesso')
      setEditingId(null) // para sair do modo de edição
    },

    onError: () => {
      toast.error('Falha ao atualizar transação')
    }
  })

  function handleEditClick(id: string, transaction: Transactions) {
    setEditingId(id);
    setEditedData(transaction);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    if (type === 'date') {
      // Mantém o formato "YYYY-MM-DD" diretamente
      setEditedData({ ...editedData, [name]: value });
    } else {
      setEditedData({ ...editedData, [name]: value });
    }
  }

  async function handleSave() {
    if (editingId) {
      try {
        const existingTransaction = currentTransactions?.find(
          (t) => t.transaction_id === editingId
        );

        if (existingTransaction) {
          // Verifica se editedData.payment_date é uma string e converte para Date
          const paymentDate =
            editedData.payment_date && typeof editedData.payment_date === 'string'
              ? new Date(editedData.payment_date) // Converte string para Date
              : existingTransaction.payment_date ?? null; // Usa a data original se não houver edição ou null

          await updateTransaction({
            id: editingId,
            title: editedData.title ?? existingTransaction.title,
            category: editedData.category ?? existingTransaction.category,
            value: editedData.value ? parseFloat(editedData.value.toString()) : existingTransaction.value,
            type: editedData.type ?? existingTransaction.type,
            scheduling: editedData.scheduling ?? existingTransaction.scheduling,
            payment_date: paymentDate ? paymentDate.toISOString() : null, // Converte Date para ISO String
            created_at: existingTransaction.created_at,
            updated_at: new Date(),
          });

          setEditingId(null);
          setEditedData({});
        }
      } catch (err) {
        console.error('Erro ao atualizar transação:', err);
        toast.error('Erro ao atualizar a transação');
      }
    }
  }

  const { mutateAsync: transaction } = useMutation({
    mutationFn: removeTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['transactionsByDate'],
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
        <strong className="flex gap-0.5 items-baseline text-2xl font-medium">
          Lista de transações
          <Asterisk className='size-2.5 text-muted-foreground' />
        </strong>
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
            <TableHead className='w-[50px]'>
              <div className='flex items-center gap-1'>
                <Eye className='size-3 ' />
                info
              </div>
            </TableHead>
            <TableHead className="w-[300px] ">
              <div className='flex items-center gap-1'>
                <ListCollapse className='size-3' />
                Descrição
              </div>
            </TableHead>
            <TableHead className="w-[100px]">
              <div className='flex items-center gap-1'>
                <BadgeCent className='size-3' />
                Valor
              </div>
            </TableHead>
            <TableHead className="w-[250px]">
              <div className='flex items-center gap-1'>
                <Tag className='size-3' />
                Categoria
              </div>
            </TableHead>

            <TableHead className="w-[80px]">
              <div className='flex items-center gap-1'>
                <TrendingUp className='size-3' />
                Status
              </div>
            </TableHead>
            <TableHead className="w-[180px]">
              <div className='flex items-center gap-1'>
                <CalendarDays className='size-3' />
                Pagamento
              </div>
            </TableHead>
            <TableHead className="w-[60px]">
              <div className='flex items-center gap-1'>
                <Paperclip className='size-3' />
                Anexo
              </div>
            </TableHead>
            <TableHead className="w-[50px]">
              <div className='flex item-center gap-1'>
                <ArrowLeftRight className='size-3' />
                Tipo
              </div>
            </TableHead>
            <TableHead className="w-[20px]"></TableHead>
            <TableHead className="w-[20px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-sm">
          {currentTransactions?.map((t) => (
            <TableRow key={t.transaction_id} className={`border-muted ${editingId && editingId !== t.transaction_id ? 'opacity-50' : ''}`}
            >
              <TableCell>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="rounded-full p-2.5 text-muted-foreground "
                      onClick={() => setSelectedTransaction(t)} // Atualiza a transação ao clicar
                    >
                      <Eye className="size-3" />
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Detalhes da Transação</DialogTitle>
                      <DialogDescription>
                        Informações detalhadas sobre a transação selecionada.
                      </DialogDescription>
                    </DialogHeader>

                    <CardInfoTransaction transaction={selectedTransaction} />
                  </DialogContent>
                </Dialog>
              </TableCell>

              <TableCell className='text-xs text-secondary-foreground'>
                {editingId === t.transaction_id ? (
                  <Input
                    type='text'
                    name='title'
                    value={editedData.title}
                    onChange={handleChange} />
                ) : (
                  t.title
                )}
              </TableCell>
              <TableCell className='text-secondary-foreground'>
                {editingId === t.transaction_id ? (
                  <Input
                    type='number'
                    name='value'
                    value={Number(editedData.value)}
                    onChange={handleChange} />
                ) : (
                  new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(t.value)
                )}
              </TableCell>
              <TableCell className='text-secondary-foreground'>
                {editingId === t.transaction_id ? (
                  <Input
                    type='text'
                    name='category'
                    value={editedData.category}
                    onChange={handleChange} />
                ) : (
                  t.category
                )}
              </TableCell>
              <TableCell className=''>
                {editingId === t.transaction_id ? (
                  <Select onValueChange={() => handleChange} value={t.scheduling ? 'agendado' : 'pago'}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='agendado'>Sim</SelectItem>
                      <SelectItem value='pago'>Pago</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  t.scheduling ? 'agendado' : 'pago'
                )}
              </TableCell>
              <TableCell>
                {editingId === t.transaction_id ? (
                  <Input
                    type='date'
                    name='payment_date'
                    value={editedData.payment_date ? new Date(editedData.payment_date).toISOString().split('T')[0] : ''}
                    onChange={handleChange}
                  />

                ) : (
                  t.payment_date ? new Date(t.payment_date).toLocaleDateString() : new Date(t.created_at).toLocaleDateString()
                )}
              </TableCell>
              <TableCell>
                <Link to={t.annex ? t.annex : '#'}>
                  <File className="size-4 text-muted-foreground" />
                </Link>
              </TableCell>
              <TableCell>
                <Button
                  className={t.type === 'entrada' ? 'rounded-full bg-green-100 w-16 text-xs text-emerald-400 hover:cursor-default hover:bg-emerald-100' :
                    'rounded-full bg-red-400 w-16 text-xs text-red-50 hover:cursor-default hover:bg-red-400'}
                >
                  {t.type}
                </Button>
              </TableCell>
              <TableCell>
                {editingId === t.transaction_id ? (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handleSave}
                      className="text-green-500"
                    >
                      Salvar
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    className="rounded-full"
                    onClick={() => handleEditClick(t.transaction_id, t)}
                  >
                    <Wrench className="size-4 text-muted-foreground" />
                  </Button>
                )}
              </TableCell>
              <TableCell>
                {editingId === t.transaction_id ? (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setEditingId(null)}
                      className="text-red-500"
                    >
                      Cancelar
                    </Button>
                  </div>
                ) : (
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <Button variant='ghost' className='hover:bg-red-400  text-red-400 hover:text-white'>
                        <X className='size-4' />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Tem certeza que deseja excluir essa transação?</AlertDialogTitle>
                        <AlertDialogDescription>Ao excluir você não terá mais acesso a essa transação.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleConfirmRemove({ id: t.transaction_id })}>Excluir</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
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
