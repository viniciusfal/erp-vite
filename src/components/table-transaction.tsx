/* eslint-disable prettier/prettier */
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
} from '@/components/ui/alert-dialog'

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
} from '@/components/ui/dialog'

import { SelectGroup } from '@radix-ui/react-select'
import {
  ArrowLeftRight,
  Asterisk,
  BadgeCent,
  CalendarDays,
  CreditCard,
  Eye,
  File,
  Landmark,
  ListCollapse,
  Paperclip,
  Plus,
  Tag,
  Wrench,
  X,
} from 'lucide-react'
import { Button } from './ui/button'
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
import { useListingTransactionByDate } from '@/hooks/listing-transactions-by-date'
import { CardInfoTransaction } from './card-Info-transaction'
import Spinner from './spinner'
import { Textarea } from './ui/textarea'
import { categories } from '@/services/categories'

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
  details?: string | null
  method: string
  nf: string | null
  account: string
}

interface TableProps {
  setVisible: Dispatch<SetStateAction<boolean>>
}

const TransactionID = z.object({
  id: z.string().uuid(),
})

type transactionID = z.infer<typeof TransactionID>

export function TableTransaction({ setVisible }: TableProps) {
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionProps | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editedData, setEditedData] = useState<Partial<Transactions>>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [inputType, setInputType] = useState('full')
  const [isOpen, setIsOpen] = useState(false)

  const listCategories = categories();
  const { dateRange } = useDateRange()
  const { startDate, endDate } = dateRange

  const { currentTransactions, isLoading } =
    useListingTransactionByDate(startDate, endDate, inputType)

  const { mutateAsync: updateTransaction } = useMutation({
    mutationFn: setTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactionsByDate'] })
      toast.success('transação atualizada com sucesso')
      setEditingId(null) // para sair do modo de edição
    },

    onError: () => {
      toast.error('Falha ao atualizar transação')
    },
  })

  const handleEditClick = (id: string, transaction: Transactions) => {
    setEditingId(id)
    setEditedData(transaction)
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;

    if (type === 'file') {
      // Certifique-se de que e.target é um HTMLInputElement
      const input = e.target as HTMLInputElement;
      if (input.files) {
        const file = input.files[0];
        if (file) {
          setEditedData({ ...editedData, [name]: file.name });
        }
      }
    } else if (type === 'date') {
      setEditedData({ ...editedData, [name]: value });
    } else {
      setEditedData({ ...editedData, [name]: value });
    }
  };


  const handleSave = async () => {
    if (editingId) {
      try {
        const existingTransaction = currentTransactions?.find(
          (t) => t.transaction_id === editingId,
        )

        if (existingTransaction) {
          // Verifica se editedData.payment_date é uma string e converte para Date
          const paymentDate =
            editedData.payment_date &&
              typeof editedData.payment_date === 'string'
              ? new Date(editedData.payment_date) // Converte string para Date
              : (existingTransaction.payment_date ?? null) // Usa a data original se não houver edição ou null

          await updateTransaction({
            id: editingId,
            title: editedData.title ?? existingTransaction.title,
            category: editedData.category ?? existingTransaction.category,
            value: editedData.value
              ? parseFloat(editedData.value.toString())
              : existingTransaction.value,
            type: editedData.type ?? existingTransaction.type,
            scheduling: editedData.scheduling ?? existingTransaction.scheduling,
            payment_date: paymentDate ? paymentDate.toISOString() : null, // Converte Date para ISO String
            created_at: existingTransaction.created_at,
            updated_at: new Date(),
            details: editedData.details ?? existingTransaction.details,
            annex: editedData.annex ?? existingTransaction.annex,
            method: editedData.method ?? existingTransaction.method,
            account: editedData.account ?? existingTransaction.account,
            nf: editedData.nf ?? existingTransaction.nf,
          })

          setEditingId(null)
          setEditedData({})
        }
      } catch (err) {
        console.error('Erro ao atualizar transação:', err)
        toast.error('Erro ao atualizar a transação')
      }
    }
  }

  const itemsPerPage = 10

  const paginatedData = currentTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(currentTransactions.length / itemsPerPage);



  const { mutateAsync: transaction } = useMutation({
    mutationFn: removeTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['transactionsByDate'],
        exact: false, // Se quiser invalidar todas as consultas que começam com 'transactions'
      })
      toast.warning('Transação Deletada com sucesso.')
    },
    onError: () => {
      toast.error('Falha ao excluir transação.')
    },
  })

  const handleConfirmRemove = async (data: transactionID) => {
    try {
      console.log('Tentando remover a transação com ID:', data.id) // Para depuração
      await transaction({
        id: data.id,
      })
    } catch (error) {
      console.error('Erro ao excluir transação:', error)
    }
  }

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString)

    // Extraindo dia, mês e ano da data
    const day = String(date.getUTCDate()).padStart(2, '0') // Garantir que o dia tenha dois dígitos
    const month = String(date.getUTCMonth() + 1).padStart(2, '0') // O mês começa de 0, então somamos 1
    const year = date.getUTCFullYear() // Pega o ano

    return `${day}/${month}/${year}` // Retorna a data no formato "dd/MM/yyyy"
  }
  return (
    <div className="flex w-full flex-col rounded-2xl border border-muted bg-white px-4 py-5 shadow-md">
      <div className="flex  justify-between">
        <strong className="flex items-baseline gap-0.5 text-xl font-medium">
          Lista de transações
          <Asterisk className="size-2.5 text-muted-foreground" />
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

      {isLoading ? (
        <Spinner />
      ) : (
        <Table className="my-6">
          <TableHeader className="text-xs">
            <>
              <TableRow className="">
                <TableHead className="w-[50px]">
                  <div className="flex items-center gap-1">
                    <Eye className="size-3" />
                    info
                  </div>
                </TableHead>
                <TableHead className="w-[300px]">
                  <div className="flex items-center gap-1">
                    <ListCollapse className="size-3" />
                    Descrição
                  </div>
                </TableHead>
                <TableHead className="w-[300px]">
                  <div className="flex items-center gap-1">
                    <ListCollapse className="size-3" />
                    Detalhamento
                  </div>
                </TableHead>
                <TableHead className="w-[150px]">
                  <div className="flex items-center gap-1">
                    <ListCollapse className="size-3" />
                    NF
                  </div>
                </TableHead>
                <TableHead className="w-[180px]">
                  <div className="flex items-center gap-1">
                    <BadgeCent className="size-3" />
                    Valor
                  </div>
                </TableHead>
                <TableHead className="w-[250px]">
                  <div className="flex items-center gap-1">
                    <Tag className="size-3" />
                    Categoria
                  </div>
                </TableHead>

                <TableHead className="w-[180px]">
                  <div className="flex items-center gap-1">
                    <CalendarDays className="size-3" />
                    Pagamento
                  </div>
                </TableHead>
                <TableHead className="w-[180px]">
                  <div className="flex items-center gap-1">
                    <CreditCard className='size-3' />
                    Metodo
                  </div>
                </TableHead>
                <TableHead className="w-[180px]">
                  <div className="flex items-center gap-1">
                    <Landmark className='size-3' />
                    C/ corrente
                  </div>
                </TableHead>
                <TableHead className="w-[180px]">
                  <div className="flex items-center gap-1">
                    <Paperclip className="size-3" />
                    Anexo
                  </div>
                </TableHead>
                <TableHead className="w-[100px]">
                  <div className="item-center flex gap-1">
                    <ArrowLeftRight className="size-3" />
                    Tipo
                  </div>
                </TableHead>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </>
          </TableHeader>
          <TableBody className="text-sm">
            {paginatedData?.map((t) => (
              <TableRow
                key={t.transaction_id}
                className={`border-muted ${editingId && editingId !== t.transaction_id ? 'opacity-50' : ''}`}
              >
                <TableCell>
                  <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        className="rounded-full p-2.5 text-muted-foreground"
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

                <TableCell className="text-xs text-secondary-foreground">
                  {editingId === t.transaction_id ? (
                    <Input
                      type="text"
                      name="title"
                      value={editedData.title}
                      onChange={handleChange}
                    />
                  ) : (
                    t.title
                  )}
                </TableCell>
                <TableCell className="text-xs text-secondary-foreground">
                  {editingId === t.transaction_id ? (
                    <Textarea
                      name="details"
                      value={editedData.details ? editedData.details : ""}
                      onChange={handleChange}
                      className='resize-none'
                    />
                  ) : (
                    t.details
                  )}
                </TableCell>
                <TableCell className="text-xs text-secondary-foreground">
                  {editingId === t.transaction_id ? (
                    <Input
                      type="text"
                      name="nf"
                      value={editedData.nf ? editedData.nf : ""}
                      onChange={handleChange}
                    />
                  ) : (
                    t.nf
                  )}
                </TableCell>
                <TableCell className="text-secondary-foreground">
                  {editingId === t.transaction_id ? (
                    <Input
                      type="number"
                      name="value"
                      value={Number(editedData.value)}
                      onChange={handleChange}
                    />
                  ) : (
                    new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(t.value)
                  )}
                </TableCell>
                <TableCell className="text-secondary-foreground">
                  {editingId === t.transaction_id ? (
                    <Select value={editedData.category} onValueChange={(value) => handleChange({ target: { name: 'category', value } } as React.ChangeEvent<HTMLSelectElement>)}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        {listCategories.map((c, index) => (
                          <SelectItem value={c} key={index}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    t.category
                  )}
                </TableCell>

                <TableCell>
                  {editingId === t.transaction_id ? (
                    <Input
                      type="date"
                      name="payment_date"
                      value={
                        editedData.payment_date
                          ? new Date(editedData.payment_date)
                            .toISOString()
                            .split('T')[0]
                          : ''
                      }
                      onChange={handleChange}
                    />
                  ) : t.payment_date ? (
                    formatDate(t.payment_date)
                  ) : (
                    ''
                  )}
                </TableCell>
                <TableCell className="text-secondary-foreground">
                  {editingId === t.transaction_id ? (
                    <Select value={editedData.method} onValueChange={(value) => handleChange({ target: { name: 'method', value } } as React.ChangeEvent<HTMLSelectElement>)}>
                      <SelectTrigger id="method">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="credito">Crédito</SelectItem>
                        <SelectItem value="debito">Débito</SelectItem>
                        <SelectItem value="dinheiro">Dinheiro</SelectItem>
                        <SelectItem value="pix">Pix</SelectItem>
                        <SelectItem value="ted/doc">TED / DOC</SelectItem>
                        <SelectItem value="outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    t.method
                  )}
                </TableCell>

                <TableCell className="text-xs text-secondary-foreground">
                  {editingId === t.transaction_id ? (
                    <Input
                      type="text"
                      name="account"
                      value={editedData.account}
                      onChange={handleChange}
                    />
                  ) : (
                    t.account
                  )}
                </TableCell>
                <TableCell>
                  {editingId === t.transaction_id ? (
                    <Input
                      type="file"
                      name="annex"
                      onChange={handleChange}
                    />
                  ) : <a href={t.annex ? `https://erpnet.tech/api/${t.annex}` : "#"} target='_blank' download={false} rel="noopener noreferrer">
                    <File className="size-4 text-muted-foreground" />
                  </a>
                  }

                </TableCell>
                <TableCell>
                  <Button
                    className={
                      t.type === 'entrada'
                        ? 'w-16 rounded-full bg-green-100 text-xs text-emerald-400 hover:cursor-default hover:bg-emerald-100'
                        : 'w-16 rounded-full bg-red-400 text-xs text-red-50 hover:cursor-default hover:bg-red-400'
                    }
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
                        <Button
                          variant="ghost"
                          className="text-red-400 hover:bg-red-400 hover:text-white"
                        >
                          <X className="size-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Tem certeza que deseja excluir essa transação?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Ao excluir você não terá mais acesso a essa
                            transação.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              handleConfirmRemove({ id: t.transaction_id })
                            }
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </TableCell>
                <TableRow className="hidden">
                  <TableCell>
                    {editingId === t.transaction_id ? (
                      <Textarea
                        name="details"
                        value={editedData.details?.toString()}
                        onChange={handleChange}
                        className=""
                      />
                    ) : (
                      t.details || ''
                    )}
                  </TableCell>
                </TableRow>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

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
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage(index + 1)
                    }}
                  >
                    {index + 1}
                  </PaginationLink>
                ))}
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  )
}
