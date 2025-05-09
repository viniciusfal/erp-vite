import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Switch } from './ui/switch'
import { Separator } from './ui/separator'
import { z } from 'zod'
import { useForm, Controller } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { registerTransaction } from '@/api/register-transaction'
import { toast } from 'sonner'
import { queryClient } from '@/lib/query-client'
import { categories } from '@/services/categories'
import { Textarea } from './ui/textarea'

const inCredits = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  value: z.number().min(0, 'Valor é obrigatório'),
  type: z.string().min(1, 'Tipo é obrigatório'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  scheduling: z.boolean(),
  annex: z.instanceof(File).nullable().optional(),
  payment_date: z.date().optional(),
  pay: z.boolean(),
  details: z.string().nullable(),
  method: z.string(),
  nf: z.string().nullable(),
  account: z.string().min(1, 'Conta é obrigatória'),
})

type Incredits = z.infer<typeof inCredits>

export function CardTransaction({ setVisible }: any) {
  const {
    control,
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm<Incredits>()
  const type = watch('type')

  const listCategories = categories()

  const { mutateAsync: transaction } = useMutation({
    mutationFn: registerTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['transactionsByDate'],
      })
      toast.success('Transação cadastrada com sucesso.')
    },
    onError: () => {
      toast.error('Erro no preenchimento das informações')
    },
  })

  const handleTransaction = async (data: Incredits) => {
    const formData = new FormData()

    // Certifique-se de converter os valores corretamente
    formData.append('Title', data.title)
    formData.append(
      'Value',
      data.value !== undefined ? data.value.toString() : '0',
    ) // Valor numérico como string
    formData.append('Type', data.type)
    formData.append('Category', data.category)
    formData.append('Scheduling', data.scheduling ? 'true' : 'false') // Booleano como string ('true' ou 'false')

    data.annex
      ? formData.append('file', data.annex)
      : formData.append('file', new Blob()) // Arquivo ou Blob vazio

    // Verifique se payment_date é válido e converta para ISO string
    if (data.payment_date) {
      const date = new Date(data.payment_date)
      if (!isNaN(date.getTime())) {
        formData.append('Payment_date', date.toISOString())
      } else {
        formData.append('Payment_date', new Date().toISOString())
      }
    } else {
      formData.append('Payment_date', '')
    }

    formData.append('Pay', data.pay ? 'true' : 'false') // Booleano como string ('true' ou 'false')
    formData.append('Details', data.details || '')
    formData.append('Method', data.method || '')
    formData.append('Nf', data.nf || '')
    formData.append('Account', data.account)

    try {
      await transaction(formData)
      setVisible(false)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Card className="w-1/2 max-lg:w-1/2 max-sm:w-full">
      <CardHeader>
        <CardTitle className="text-xl">Registrar Transação</CardTitle>
        <CardDescription className="text-xs">
          Insira as informações abaixo:
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(handleTransaction)}
          encType="multipart/form-data"
        >
          <div className="grid w-full items-center gap-4">
            <div className="flex w-full gap-4">
              <div className="w-1/2">
                <div className="flex w-1/2 flex-col space-y-1.5">
                  <Label>NF</Label>
                  <Input
                    id="nf"
                    placeholder="Número da NF"
                    {...register('nf')}
                  />
                </div>
                <div className="mt-4 flex flex-col space-y-1.5">
                  <Label>Descrição</Label>
                  <Input
                    id="title"
                    placeholder="Dê uma descrição a sua transação"
                    required
                    {...register('title')}
                  />
                </div>

                <div className="mt-3 space-y-1.5">
                  <Label>Valor</Label>
                  <Input
                    id="value"
                    type="number"
                    step="any"
                    placeholder="0"
                    {...register('value', {
                      setValueAs: (value) => parseFloat(value) || 0, // converte o valor para número ou 0 se inválido
                    })}
                  />
                </div>
              </div>
              <div className="w-1/2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label>Tipo</Label>
                  <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                      <>
                        <Select
                          {...field}
                          onValueChange={field.onChange}
                          required
                        >
                          <SelectTrigger id="type">
                            <SelectValue placeholder="Selecione..." />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            <SelectItem value="entrada">Entrada</SelectItem>
                            <SelectItem value="saida">Saida</SelectItem>
                          </SelectContent>
                        </Select>

                        {errors.type && (
                          <span className="text-sm text-red-500">
                            {errors.type.message}
                          </span>
                        )}
                      </>
                    )}
                  />
                </div>

                <div className="mt-4 flex flex-col space-y-1.5">
                  <Label>Categoria</Label>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <>
                        <Select {...field} onValueChange={field.onChange}>
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
                        {errors.category && (
                          <span className="text-sm text-red-500">
                            {errors.category.message}
                          </span>
                        )}
                      </>
                    )}
                  />
                </div>
                <div className="mt-5 flex w-1/2 flex-col space-y-1.5">
                  <Label>Metodo</Label>
                  <Controller
                    name="method"
                    control={control}
                    render={({ field }) => (
                      <>
                        <Select
                          {...field}
                          value={field.value}
                          onValueChange={field.onChange}
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
                        {errors.method && (
                          <span className="text-sm text-red-500">
                            {errors.method.message}
                          </span>
                        )}
                      </>
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="w-1/2 space-y-1.5">
              <Label>Conta destino / Conta origem</Label>
              <Input
                id="account"
                placeholder="ex: Banco do Brasil"
                {...register('account')}
              />
              {errors.account && (
                <span className="text-sm text-red-500">
                  {errors.account.message}
                </span>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Detalhes</Label>
              <Textarea
                className="resize-none text-sm"
                id="details"
                placeholder="Detalhes da transação"
                {...register('details')}
              />
            </div>

            <Separator className="my-2" />

            <div
              className={
                type === 'saida'
                  ? 'flex items-center space-x-2 text-sm text-muted-foreground'
                  : 'invisible'
              }
            >
              <Controller
                name="scheduling"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={type === 'entrada'}
                  />
                )}
              />
              <span>Quero agendar esse pagamento</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1.5">
                <Label className="text-sm">
                  Data de Pagamento / Agendamento
                </Label>
                <Input type="date" {...register('payment_date')} required />
              </div>

              <div className="w-1/2">
                <Label className="space-y-1.5">Anexar arquivo</Label>
                <Controller
                  name="annex"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="file"
                      onChange={(e) =>
                        field.onChange(e.target.files?.[0] || null)
                      }
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  )}
                />
              </div>
            </div>
          </div>
          <CardFooter className="flex justify-between pt-5">
            <Button variant="outline" onClick={() => setVisible(false)}>
              Cancel
            </Button>
            <Button type="submit">Salvar</Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  )
}
