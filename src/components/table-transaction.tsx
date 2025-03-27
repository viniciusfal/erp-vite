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
import { useState, useMemo, type Dispatch, type SetStateAction } from 'react'
import { setTransaction } from '@/api/set-transactions'
import { Input } from './ui/input'
import { CardInfoTransaction } from './card-Info-transaction'
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
  status: string
  Installment: Number
  TotalInstallments: Number
  SupplierID: string
}

interface TableProps {
  setVisible: Dispatch<SetStateAction<boolean>>
  transactions?: TransactionProps[]
}

const TransactionID = z.object({
  id: z.string().uuid(),
})

type transactionID = z.infer<typeof TransactionID>

export function TableTransaction({ setVisible, transactions = [] }: TableProps) {
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionProps | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editedData, setEditedData] = useState<Partial<TransactionProps>>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [inputType, setInputType] = useState('full')
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    method: '',
    account: '',
    title: '',
    orderBy: 'recent' as 'recent' | 'old',
  })
  const safeTransactions = Array.isArray(transactions) ? transactions : []


  const listCategories = categories()

  const filteredTransactions = useMemo(() => {
    let result = [...safeTransactions]

    // Apply filters
    result = result.filter(transaction => {
      return (
        transaction.type.toLowerCase().includes(filters.type.toLowerCase()) &&
        transaction.category.toLowerCase().includes(filters.category.toLowerCase()) &&
        transaction.method.toLowerCase().includes(filters.method.toLowerCase()) &&
        transaction.account.toLowerCase().includes(filters.account.toLowerCase()) &&
        transaction.title.toLowerCase().includes(filters.title.toLowerCase()) &&
        (inputType === 'full' || transaction.type === inputType)
      )
    })

    // Sort by date
    result.sort((a, b) => {
      const dateA = a.payment_date ? new Date(a.payment_date).getTime() : 0
      const dateB = b.payment_date ? new Date(b.payment_date).getTime() : 0

      return filters.orderBy === 'recent' ? dateB - dateA : dateA - dateB
    })

    return result
  }, [transactions, filters, inputType])

  const itemsPerPage = 15
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredTransactions.slice(start, end)
  }, [filteredTransactions, currentPage])

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)

  const handleFilterChange = (filterName: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }))
    setCurrentPage(1) // Reset to first page when filtering
  }

  const { mutateAsync: updateTransaction } = useMutation({
    mutationFn: setTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactionsByDate'] })
      toast.success('Transação atualizada com sucesso')
      setEditingId(null)
    },
    onError: () => {
      toast.error('Falha ao atualizar transação')
    },
  })

  const { mutateAsync: deleteTransaction } = useMutation({
    mutationFn: removeTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactionsByDate'] })
      toast.warning('Transação deletada com sucesso')
    },
    onError: () => {
      toast.error('Falha ao deletar transação')
    },
  })

  const handleEditClick = (transaction: TransactionProps) => {
    setEditingId(transaction.transaction_id)
    setEditedData({ ...transaction })
  }

  const handleSave = async () => {
    if (!editingId) return;

    try {
      // Garanta que todos os campos obrigatórios estejam presentes
      const transactionData = {
        id: editingId,
        title: editedData.title || '', // Forneça um valor padrão
        value: editedData.value || 0,
        type: editedData.type || 'outros', // Valor padrão
        category: editedData.category || 'outros',
        scheduling: editedData.scheduling || false,
        payment_date: editedData.payment_date ? new Date(editedData.payment_date).toISOString() : null,
        details: editedData.details || null,
        annex: editedData.annex || null,
        method: editedData.method || 'outros',
        account: editedData.account || '',
        nf: editedData.nf || null,
        // Adicione outros campos obrigatórios com valores padrão
        pay: editedData.pay || false,
        created_at: new Date(),
        updated_at: new Date(),
        status: editedData.status || 'pendente',
        Installment: editedData.Installment || 1,
        TotalInstallments: editedData.TotalInstallments || 1,
        SupplierID: editedData.SupplierID || ''
      };

      await updateTransaction(transactionData);
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      toast.error('Erro ao atualizar transação');
    }
  };

  const handleConfirmRemove = async (data: transactionID) => {
    try {
      await deleteTransaction({ id: data.id })
    } catch (error) {
      console.error('Erro ao excluir transação:', error)
    }
  }

  const formatDate = (dateString: Date | null) => {
    if (!dateString) return ''

    const date = new Date(dateString)
    const day = String(date.getUTCDate()).padStart(2, '0')
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')
    const year = date.getUTCFullYear()

    return `${day}/${month}/${year}`
  }

  return (
    <div className="flex w-full flex-col rounded-2xl border border-muted bg-card px-4 py-5 shadow">
      <div className="flex justify-between mb-1">
        <strong className="flex items-baseline gap-0.5 text-xl font-medium dark:text-foreground">
          <div className='flex items-center gap-0.5'>
            <ArrowLeftRight className='text-muted-foreground size-5' />
            Lista de transações
            <Asterisk className="size-2.5 text-muted-foreground" />
          </div>
        </strong>

        <div className="flex gap-3">
          <div className="flex items-center gap-1">
            <Label className='text-sm text-muted-foreground'>Descrição:</Label>
            <div className='relative'>
              <Input
                value={filters.title}
                onChange={(e) => handleFilterChange('title', e.target.value)}
                className="w-28 h-8 rounded-full dark:border-muted-foreground"
              />
              <Search className='absolute right-3 top-[50%] -translate-y-1/2 text-muted-foreground size-4' />
            </div>
          </div>

          <div className='flex gap-1 items-center'>
            <Label className='text-sm text-muted-foreground'>Categoria:</Label>
            <div className='relative'>
              <Input
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-28 h-8 rounded-full dark:border-muted-foreground"
              />
              <Search className='absolute right-2 top-[50%] -translate-y-1/2 size-4 text-muted-foreground' />
            </div>
          </div>

          <div className='flex gap-1 items-center'>
            <Label className='text-sm text-muted-foreground'>Método:</Label>
            <div className='relative'>
              <Input
                value={filters.method}
                onChange={(e) => handleFilterChange('method', e.target.value)}
                className="w-28 h-8 rounded-full dark:border-muted-foreground"
              />
              <Search className='absolute right-2 top-[50%] -translate-y-1/2 size-4 text-muted-foreground' />
            </div>
          </div>

          <div className='flex gap-1 items-center'>
            <Label className='text-sm text-muted-foreground'>Conta:</Label>
            <div className='relative'>
              <Input
                value={filters.account}
                onChange={(e) => handleFilterChange('account', e.target.value)}
                className="w-28 h-8 rounded-full dark:border-muted-foreground"
              />
              <Search className='absolute right-2 top-[50%] -translate-y-1/2 size-4 text-muted-foreground' />
            </div>
          </div>

          <Select
            value={filters.orderBy}
            onValueChange={(value) => handleFilterChange('orderBy', value as 'recent' | 'old')}
          >
            <SelectTrigger className="w-28 ml-2 text-sm rounded-full dark:border-muted-foreground text-muted-foreground">
              <SelectValue placeholder="Ordenar" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="recent">Mais recente</SelectItem>
                <SelectItem value="old">Mais antigo</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            value={inputType}
            onValueChange={setInputType}
          >
            <SelectTrigger className="w-[180px] text-muted-foreground border-muted-foreground">
              <SelectValue placeholder="Filtrar" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="full">Todas</SelectItem>
                <SelectItem value="entrada">Receita</SelectItem>
                <SelectItem value="saida">Despesa</SelectItem>
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

      <Table className="my-6 dark:text-foreground">
        <TableHeader className="text-xs">
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
                Método
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
                C/Custo
              </div>
            </TableHead>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="text-xs">
          {paginatedData.map((transaction, index) => (
            <TableRow
              key={transaction.transaction_id}
              className={`border-muted ${editingId && editingId !== transaction.transaction_id ? 'opacity-50' : ''} ${index % 2 === 0 ? 'bg-card' : 'bg-muted'}`}
            >
              <TableCell>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="rounded-full p-2.5 text-muted-foreground"
                      onClick={() => setSelectedTransaction(transaction)}
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
                {editingId === transaction.transaction_id ? (
                  <Input
                    type="text"
                    name="title"
                    value={editedData.title || ''}
                    onChange={(e) => setEditedData({ ...editedData, title: e.target.value })}
                  />
                ) : (
                  transaction.title
                )}
              </TableCell>

              <TableCell className="text-xs text-secondary-foreground">
                {editingId === transaction.transaction_id ? (
                  <Textarea
                    name="details"
                    value={editedData.details || ''}
                    onChange={(e) => setEditedData({ ...editedData, details: e.target.value })}
                    className='resize-none'
                  />
                ) : (
                  transaction.details
                )}
              </TableCell>

              <TableCell className="text-xs text-secondary-foreground">
                {editingId === transaction.transaction_id ? (
                  <Input
                    type="text"
                    name="nf"
                    value={editedData.nf || ''}
                    onChange={(e) => setEditedData({ ...editedData, nf: e.target.value })}
                  />
                ) : (
                  transaction.nf
                )}
              </TableCell>

              <TableCell className="text-secondary-foreground">
                {editingId === transaction.transaction_id ? (
                  <Input
                    type="number"
                    name="value"
                    step="0.01"
                    min="0"
                    value={editedData.value || 0}
                    onChange={(e) => setEditedData({ ...editedData, value: Number(e.target.value) })}
                  />
                ) : (
                  new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(transaction.value)
                )}
              </TableCell>

              <TableCell className="text-secondary-foreground">
                {editingId === transaction.transaction_id ? (
                  <Select
                    value={editedData.category || ''}
                    onValueChange={(value) => setEditedData({ ...editedData, category: value })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {listCategories.map((category, index) => (
                        <SelectItem value={category} key={index}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  transaction.category
                )}
              </TableCell>

              <TableCell>
                {editingId === transaction.transaction_id ? (
                  <Input
                    type="date"
                    name="payment_date"
                    value={
                      editedData.payment_date
                        ? new Date(editedData.payment_date).toISOString().split('T')[0]
                        : ''
                    }
                    onChange={(e) => setEditedData({
                      ...editedData,
                      payment_date: e.target.value ? new Date(e.target.value) : null
                    })}
                  />
                ) : (
                  formatDate(transaction.payment_date)
                )}
              </TableCell>

              <TableCell className="text-secondary-foreground">
                {editingId === transaction.transaction_id ? (
                  <Select
                    value={editedData.method || ''}
                    onValueChange={(value) => setEditedData({ ...editedData, method: value })}
                  >
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
                  transaction.method
                )}
              </TableCell>

              <TableCell className="text-xs text-secondary-foreground">
                {editingId === transaction.transaction_id ? (
                  <Input
                    type="text"
                    name="account"
                    value={editedData.account || ''}
                    onChange={(e) => setEditedData({ ...editedData, account: e.target.value })}
                  />
                ) : (
                  transaction.account
                )}
              </TableCell>

              <TableCell>
                {editingId === transaction.transaction_id ? (
                  <Input
                    type="file"
                    name="annex"
                    onChange={(e) => {
                      if (e.target.files) {
                        setEditedData({ ...editedData, annex: e.target.files[0].name })
                      }
                    }}
                  />
                ) : (
                  <a
                    href={transaction.annex ? `https://erpnet.up.railway.app/api/${transaction.annex}` : "#"}
                    target='_blank'
                    download={false}
                    rel="noopener noreferrer"
                  >
                    <File className="size-4 text-muted-foreground" />
                  </a>
                )}
              </TableCell>

              <TableCell>
                <Button
                  className={
                    transaction.type === 'entrada'
                      ? 'text-emerald-300 cursor-default hover:text-emerald-400 hover:bg-transparent w-5'
                      : 'text-red-300 cursor-default hover:text-red-400 hover:bg-transparent w-5'
                  }
                  variant="ghost"
                >
                  {transaction.type}
                </Button>
              </TableCell>

              <TableCell>
                {editingId === transaction.transaction_id ? (
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
                    onClick={() => handleEditClick(transaction)}
                  >
                    <Wrench className="size-4 text-muted-foreground" />
                  </Button>
                )}
              </TableCell>

              <TableCell>
                {editingId === transaction.transaction_id ? (
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
                          Ao excluir você não terá mais acesso a essa transação.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className='dark:text-foreground'>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            handleConfirmRemove({ id: transaction.transaction_id })
                          }
                        >
                          Excluir
                        </AlertDialogAction>
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
          <Pagination>
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