import { useState, type Dispatch } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Plus, ShieldCheck, Wrench, X } from 'lucide-react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog'
import DateRangerSafe from './date-ranger-safes'
import { Label } from './ui/label'
import { useListingSafesByDate } from '@/hooks/listing-safes-by-date'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { registerSafe } from '@/api/register-safe'
import { queryClient } from '@/lib/query-client'
import { toast } from 'sonner'

interface SafeProps {
  setVisibleSafe: Dispatch<React.SetStateAction<boolean>>
}

const inSafes = z.object({
  send_date: z.date(),
  send_amount: z.number()
})

type InSafes = z.infer<typeof inSafes>

export default function Safe({ setVisibleSafe }: SafeProps) {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null])
  const [startDate, endDate] = dateRange
  const safes = useListingSafesByDate(startDate, endDate).data
  const [editingId, setEditingId] = useState<number | null>(null)
  const { handleSubmit, register } = useForm<InSafes>()

  const { mutateAsync: safe } = useMutation({
    mutationFn: registerSafe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['safesByDate'] })
      toast.success("Informação Registrada no cofre")
    },
    onError: () => {
      toast.error("Erro no preenchimento das informações")
    }
  })

  const handleSafe = async (data: InSafes) => {
    try {
      await safe({
        send_date: new Date(data.send_date),
        send_amount: parseFloat(data.send_amount.toString()),
      })
    } catch (err) {
      toast.error("Erro ao tentar salvar: " + err)
    }
  }

  const handleEdit = (id: number) => {
    setEditingId(id)
  }

  const handleSave = (id: number) => {
    setEditingId(null)
  }

  const handleChange = (id: string, field: 'dataSent' | 'amount', value: number) => {
    setEntries(safes?.map(safe =>
      safe.id === id ? { ...safe, [field]: field === 'amount' ? parseFloat(value) : value } : safe
    ))
  }

  return (
    <div className='container mx-auto p-4'>
      <Card>
        <CardHeader className='mb-2'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-0.5'>
              <ShieldCheck className='text-muted-foreground' />
              <CardTitle className="text-2xl font-bold">Cofre</CardTitle>
            </div>
            <div className='flex gap-2'>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button>
                    <Plus className='size-4' />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="w-1/5 max-lg:w-1/2 max-sm:w-full">
                  <CardContent>
                    <form onSubmit={handleSubmit(handleSafe)}>
                      <CardHeader>
                        <CardTitle>Registrar Cofre</CardTitle>
                        <CardDescription>Insira os dados do recolhimento ao cofre.</CardDescription>
                      </CardHeader>

                      <div>
                        <Label>Data de envio:</Label>
                        <Input type="date" {...register("send_date")} />
                      </div>
                      <div>
                        <Label>Valor Enviado:</Label>
                        <Input type="number" {...register("send_amount")} />
                      </div>

                      <CardFooter className="flex justify-between mt-8">
                        <AlertDialogCancel asChild>
                          <Button variant="outline">Cancelar</Button>
                        </AlertDialogCancel>
                        <Button type="submit">Salvar</Button>
                      </CardFooter>
                    </form>
                  </CardContent>
                </AlertDialogContent>
              </AlertDialog>
              <DateRangerSafe startDate={startDate} endDate={endDate} setDateRange={setDateRange} />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data de envio</TableHead>
                <TableHead>Valor enviado</TableHead>
                <TableHead>Usuário responsável</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(safes) && safes.map(safe => (
                <TableRow key={safe.id}>
                  <TableCell>
                    {editingId === safe.id ? (
                      <Input
                        type="date"
                        value={safe.send_date}
                        onChange={(e) => handleChange(safe.send_date, 'dataSent', e.target.value)}
                      />
                    ) : (
                      safe.send_date ? new Date(safe.send_date).toLocaleDateString() : 'Sem data'
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === safe.id ? (
                      <Input
                        type="number"
                        value={safe.send_amount}
                        onChange={(e) => handleChange(safe.id, 'amount', e.target.value)}
                      />
                    ) : (
                      `R$ ${safe.send_amount.toFixed(2)}`
                    )}
                  </TableCell>
                  <TableCell>{safe.user_resp}</TableCell>
                  <TableCell>
                    {editingId === safe.id ? (
                      <Button onClick={() => handleSave(safe.id)}>Salvar</Button>
                    ) : (
                      <div className='flex items-center gap-4'>
                        <Button onClick={() => handleEdit(safe.id)} variant="ghost">
                          <Wrench className='size-4 text-muted-foreground' />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger>
                            <Button variant='ghost' className='hover:bg-red-400 text-red-400 hover:text-white'>
                              <X className='size-4' />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Tem certeza que deseja desativar esta informação do cofre?</AlertDialogTitle>
                              <AlertDialogDescription>Esta ação irá desativar a informação, removendo-a da visualização.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction>Desativar</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className='flex justify-between'>
          <div className='invisible'></div>
          <Button onClick={() => setVisibleSafe(false)}>Fechar</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
