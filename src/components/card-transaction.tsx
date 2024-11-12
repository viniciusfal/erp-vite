import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { registerTransaction } from "@/api/register-transaction";
import { toast } from "sonner";
import { queryClient } from "@/lib/query-client";
import { categories } from "@/services/categories";

const inCredits = z.object({
  title: z.string(),
  value: z.number(),
  type: z.string(),
  category: z.string(),
  scheduling: z.boolean(),
  annex: z.string().nullable(),
  payment_date: z.date().nullable(),
  pay: z.boolean()
});

type Incredits = z.infer<typeof inCredits>;

export function CardTransaction({ setVisible }: any) {
  const { control, handleSubmit, register, watch } = useForm<Incredits>();
  const type = watch('type')

  const listCategories = categories()


  const { mutateAsync: transaction } = useMutation({
    mutationFn: registerTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['transactionsByDate']
      })
      toast.success("Transação cadastrada com sucesso.");
    },
    onError: () => {
      toast.error("Erro no preenchimento das informações");

    }
  });


  const handleTransaction = async (data: Incredits) => {
    try {
      await transaction({
        title: data.title,
        type: data.type,
        category: data.category,
        value: parseFloat(data.value.toString()),
        payment_date: data.payment_date ? new Date(data.payment_date) : null,
        annex: null, // Assumindo que você não está usando anexos
        scheduling: data.scheduling,
        pay: data.pay
      });

      setVisible(false)
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Card className="w-1/3 max-lg:w-1/2 max-sm:w-full">
      <CardHeader>
        <CardTitle>Registrar Transação</CardTitle>
        <CardDescription className="text-xs">Insira as informações abaixo:</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleTransaction)}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label>Descrição</Label>
              <Input id="title" placeholder="Dê uma descrição a sua transação" {...register("title")} />
            </div>

            <div>
              <Label>Valor</Label>
              <Input id="value" type="number" step="any" placeholder="0" {...register("value")} />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label>Tipo</Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select {...field} onValueChange={field.onChange}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="entrada">Entrada</SelectItem>
                      <SelectItem value="saida">Saida</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label>Categoria</Label>
              <Controller
                // Adiciona uma key única para cada Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select {...field} onValueChange={field.onChange}>

                    <SelectTrigger id="category">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent position="popper"  >
                      {listCategories.map((c, index) => (
                        <SelectItem value={c} key={index}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

            </div>

            <Separator className="my-2" />

            <div className={type === 'saida' ? "flex items-center space-x-2 text-sm text-muted-foreground" : "invisible"}>
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

            <div className="flex justify-between items-center">
              <div>
                <Label className="text-sm">Data de Pagamento / Agendamento</Label>
                <Input type="date" {...register("payment_date")} />
              </div>

              <div>
                <Label>Anexar</Label>
                <Input type="file" {...register("annex")} />
              </div>
            </div>
          </div>
          <CardFooter className="flex justify-between pt-5">
            <Button variant="outline" onClick={() => setVisible(false)}>Cancel</Button>
            <Button type="submit">Salvar</Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card >
  );
}
