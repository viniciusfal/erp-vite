import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Switch } from "./ui/switch"
import { Separator } from "./ui/separator"

export function CardTransaction({ setVisible }: any) {
  return (
    <Card className="w-1/3">
      <CardHeader>
        <CardTitle>Registrar Transação</CardTitle>
        <CardDescription className="text-xs">Insira as informações abaixo:</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Titulo</Label>
              <Input id="title" placeholder="Dê um titulo a sua transação" />
            </div>

            <div>
              <Label htmlFor="value">Valor</Label>
              <Input id="value" type="number" placeholder="0" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="type">Tipo</Label>
              <Select>
                <SelectTrigger id="type" >
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="income" >Entrada</SelectItem>
                  <SelectItem value="outcome">Saida</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="category">Categoria</Label>
              <Select>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="despesasAdm">Despesas Administrativas</SelectItem>
                  <SelectItem value="folha">Folha de pagamento</SelectItem>
                  <SelectItem value="labore">Pro Labore</SelectItem>
                  <SelectItem value="etc1">Despesas tal</SelectItem>
                  <SelectItem value="etc2">Despesas tal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator className="my-2" />

            <div className="flex items-center space-x-2 text-sm text-muted-foreground ">
              <Switch />
              <span>Quero agendar esse pagamento</span>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <Label htmlFor="paymentDate" className="text-sm">Data de Pagamento / Agendamento</Label>
                <Input type="date" />
              </div>


              <div>
                <Label htmlFor="anex">Anexar</Label>
                <Input type="file" />
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setVisible(false)}>Cancel</Button>
        <Button>Salvar</Button>
      </CardFooter>
    </Card>
  )
}
