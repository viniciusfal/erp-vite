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
  Search,
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
import { Label } from './ui/label'

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
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    method: '',
    account: '',
    title: '',
    orderBy: 'recent',
  })

  const listCategories = categories();
  const { dateRange } = useDateRange()
  const { startDate, endDate } = dateRange

  const { currentTransactions, isLoading } =
    useListingTransactionByDate(startDate, endDate, inputType)

  const filteredTransactions = currentTransactions.filter(transaction => {
    return (
      transaction.type.toLowerCase().includes(filters.type.toLowerCase()) &&
      transaction.category.toLowerCase().includes(filters.category.toLowerCase()) &&
      transaction.method.toLowerCase().includes(filters.method.toLowerCase()) &&
      transaction.account.toLowerCase().includes(filters.account.toLowerCase()) &&
      transaction.title.toLocaleLowerCase().includes(filters.title.toLocaleLowerCase())
    );
  });

  const sortedTransactions = filteredTransactions.sort((a, b) => {
    if (filters.orderBy === 'recent') {
      if (b.payment_date && a.payment_date) {
        return new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime()
      }
    } else {
      if (b.payment_date && a.payment_date) {
        return new Date(a.payment_date).getTime() - new Date(b.payment_date).getTime();
      }
    }
  });


  const itemsPerPage = 15

  const paginatedData = sortedTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: value,
    }));
  };

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
    <div className="flex w-full flex-col rounded-2xl border border-muted bg-card px-4 py-5 shadow ">
      <div className="flex  justify-between mb-1">
        <strong className="flex items-baseline gap-0.5 text-xl font-medium dark:text-foreground">
          <div className='flex items-center gap-0.5 '>
            <ArrowLeftRight className='text-muted-foreground size-5' />
            Lista de transações
            <Asterisk className="size-2.5 text-muted-foreground" />
          </div>
        </strong>
        <div className="flex gap-3">
          <div className=' flex items-center gap-1 '>
            <Label className='text-sm  text-muted-foreground'>Descrição:</Label>
            <div className='relative'>
              <Input
                value={filters.title}
                onChange={(e) => handleFilterChange('title', e.target.value)}
                className="w-28  h-8 rounded-full dark:border-muted-foreground"
              />
              <Search className='absolute right-3 top-[50%] -translate-y-1/2  text-muted-foreground size-4' />
            </div>
          </div>
          <div className='flex gap-1 items-center'>
            <Label className='text-sm text-muted-foreground'>Categoria:</Label>
            <div className='relative'>
              <Input
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-28 h-8 rounded-full dark:border-muted-foreground  relative"
              />
              <Search className='absolute right-2 top-[50%] -translate-y-1/2  size-4 text-muted-foreground  ' />
            </div>
          </div>
          <div className='flex gap-1 items-center'>
            <Label className='text-sm text-muted-foreground'>Metodo:</Label>
            <div className='relative'>
              <Input
                value={filters.method}
                onChange={(e) => handleFilterChange('method', e.target.value)}
                className="w-28 h-8 rounded-full dark:border-muted-foreground "
              />
              <Search className='absolute right-2 top-[50%] -translate-y-1/2  size-4 text-muted-foreground  ' />
            </div>
          </div>

          <div className='flex gap-1 items-center'>
            <Label className='text-sm text-muted-foreground'>Conta:</Label>
            <div className='relative'>
              <Input
                value={filters.account}
                onChange={(e) => handleFilterChange('account', e.target.value)}
                className="w-28 h-8 rounded-full dark:border-muted-foreground "
              />

              <Search className='absolute right-2 top-[50%] -translate-y-1/2  size-4 text-muted-foreground  ' />
            </div>
          </div>

          <Select onValueChange={(value) => handleFilterChange('orderBy', value)}>
            <SelectTrigger className="w-28 ml-2 text-sm rounded-full dark:border-muted-foreground  text-muted-foreground">
              <SelectValue placeholder="Ordenar" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="recent">Mais recente</SelectItem>
                <SelectItem value="old">Mais antigo</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select onValueChange={setInputType}>
            <SelectTrigger className="w-[180px] text-muted-foreground border-muted-foreground" value={inputType} >
              <SelectValue placeholder="Filtrar" />
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
            className="rounded-full hover:bg-primary hover:text-white dark:hover:bg-primary dark:bg-background"
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
        <Table className="my-6 dark:text-foreground table">
          <TableHeader className="text-xs">
            <>
              <TableRow className="bg-gradient-to-r from-slate-800 to-slate-950 text-muted dark:bg-gradient-to-tr dark:from-emerald-700 dark:to-emerald-500 dark:text-foreground">
                <TableHead className="w-[50px] py-6">
                  <div className="flex items-center gap-1 text-white">
                    <Eye className="size-3 text-muted-foreground" />
                    info
                  </div>
                </TableHead>
                <TableHead className="w-[300px]">
                  <div className="flex items-center gap-1 text-white">
                    <ListCollapse className="size-3 text-muted-foreground" />
                    Descrição
                  </div>
                </TableHead>
                <TableHead className="w-[300px]">
                  <div className="flex items-center gap-1 text-white">
                    <ListCollapse className="size-3 text-muted-foreground" />
                    Detalhamento
                  </div>
                </TableHead>
                <TableHead className="w-[150px]">
                  <div className="flex items-center gap-1 text-white">
                    <ListCollapse className="size-3 text-muted-foreground" />
                    NF
                  </div>
                </TableHead>
                <TableHead className="w-[180px]">
                  <div className="flex items-center gap-1 text-white">
                    <BadgeCent className="size-3 text-muted-foreground" />
                    Valor
                  </div>
                </TableHead>
                <TableHead className="w-[250px]">
                  <div className="flex items-center gap-1 text-white">
                    <Tag className="size-3 text-muted-foreground" />
                    Categoria
                  </div>
                </TableHead>

                <TableHead className="w-[180px]">
                  <div className="flex items-center gap-1 text-white">
                    <CalendarDays className="size-3 text-muted-foreground" />
                    Pagamento
                  </div>
                </TableHead>
                <TableHead className="w-[180px]">
                  <div className="flex items-center gap-1 text-white">
                    <CreditCard className='size-3 text-muted-foreground' />
                    Metodo
                  </div>
                </TableHead>
                <TableHead className="w-[180px]">
                  <div className="flex items-center gap-1 text-white">
                    <Landmark className='size-3 text-muted-foreground' />
                    C/ corrente
                  </div>
                </TableHead>
                <TableHead className="w-[180px]">
                  <div className="flex items-center gap-1 text-white">
                    <Paperclip className="size-3 text-muted-foreground" />
                    Anexo
                  </div>
                </TableHead>
                <TableHead className="w-[100px]">
                  <div className="item-center flex gap-1 text-white">
                    <ArrowLeftRight className="size-3 text-muted-foreground" />
                    Tipo
                  </div>
                </TableHead>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </>
          </TableHeader>
          <TableBody className="text-xs">
            {paginatedData?.map((t, index) => (
              <TableRow
                key={t.transaction_id}
                className={`border-muted ${editingId && editingId !== t.transaction_id ? 'opacity-50' : ''} ${index % 2 === 0 ? 'bg-card' : 'bg-muted'}`}
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
                        <DialogTitle className='text-foreground'>Detalhes da Transação</DialogTitle>
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
                      step="0.01"
                      min="0"
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
                        ? 'text-emerald-300 cursor-default hover:text-emerald-400 hover:bg-transparent w-5'
                        : 'text-red-300  cursor-default hover:text-red-400 hover:bg-transparent w-5'
                    }
                    variant="ghost"
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
                          <AlertDialogTitle className='dark:text-foreground'>
                            Tem certeza que deseja excluir essa transação?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Ao excluir você não terá mais acesso a essa
                            transação.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className='dark:text-foreground'>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
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
                    className={`rounded-full mx-0.5 ${currentPage === index + 1 ? 'bg-gradient-to-tr from-slate-800 to-slate-950 text-white dark:bg-gradient-to-tr dark:from-emerald-700 dark:to-emerald-500 dark:text-foreground' : 'border bg-muted'}`}
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
