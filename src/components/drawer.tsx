import * as  React from "react"
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons"
import { Bar, BarChart, ResponsiveContainer } from "recharts"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "./ui/input"
import { useMutation } from "@tanstack/react-query"
import { registerMeta } from "@/api/register-meta"
import { toast } from "sonner"
import { z } from "zod"
import { setUpdatedMeta } from "@/api/set-meta"
import { queryClient } from "@/lib/query-client"
import { useListMeta } from "@/hooks/list-meta"

interface DrawerMetaProps {
  setNewMeta: React.Dispatch<React.SetStateAction<number>>
}
interface Meta {
  id: string
  month: string
  metaValue: number
}

const inMeta = z.object({
  metaValue: z.number(),
})

type InMeta = z.infer<typeof inMeta>


export function DrawerMeta({ setNewMeta }: DrawerMetaProps) {
  const {mounthMeta} = useListMeta()
  const [visible, setVisible] = React.useState(false)
  const [visible2, setVisible2] = React.useState(false)
  
  const {mutateAsync: registerNewMeta} = useMutation({
    mutationFn: registerMeta,
    mutationKey: ['meta'],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getMeta']
      })
      toast.success('meta registrada com sucesso')
    }
  })

  const {mutateAsync: setNewUpdatedMeta} = useMutation({
    mutationFn: setUpdatedMeta,
    mutationKey: ['setMeta'],
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['getMeta']}),
      toast.success("Meta Atualizada com sucesso")
    },
    onError: () => {
      toast.error("Não foi possível atualizar sua meta.")
    }
  })

  const handleNewMeta = async (data: InMeta) => {
    try {
      await registerNewMeta({
        metaValue: data.metaValue
      })
      setNewMeta(metaValue)
      setVisible(false)
      console.log(data.metaValue)
    } catch(err){
      toast.error('Erro ao tentar criar meta.' + err)
    }
  }

  const handleUpdateMeta = async (data: Meta) => {
    try{
      await setNewUpdatedMeta({
        id: data.id,
        metaValue: metaValue,
        month: data.month
      })
      setVisible2(false)
    } catch(err) {
      console.log(err)
      toast.error("Erro ao tentar atualizar a meta" + err)
    }
  }
  
  const [metaValue, setMetaValue] = React.useState(0)

  function handleMeta(value: number) {
    setMetaValue(value)
  }

  return (
    <div className="flex flex-1 justify-between">
    <Drawer open={visible} onOpenChange={setVisible}>
      <div className="">
      <DrawerTrigger asChild >
      <Button>Criar Meta</Button>
      </DrawerTrigger>
      </div>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Criar Meta</DrawerTitle>
            <DrawerDescription>Insira a Meta desejada para esse mês.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => handleMeta(metaValue - 1000)}
              >
                <MinusIcon className="h-4 w-4" />
                <span className="sr-only">Decrease</span>
              </Button>
              <div className="flex-1 text-center">
                <div className="text-7xl font-bold tracking-tighter">
                  {metaValue}
                  <Input
                    className="text-sm text-muted-foreground "
                    value={metaValue}
                    type="number"
                    min={0}
                    onChange={(e) => setMetaValue(parseInt(e.target.value))}
                  />
                </div>
                <div className="text-[0.70rem] uppercase text-muted-foreground">
                  Valor
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => handleMeta(metaValue + 1000)}
              >
                <PlusIcon className="h-4 w-4" />
                <span className="sr-only">Increase</span>
              </Button>
            </div>
            <div className="mt-3 h-[120px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart >
                  <Bar
                    dataKey="meta"
                    style={
                      {
                        fill: "hsl(var(--foreground))",
                        opacity: 0.9,
                      } as React.CSSProperties
                    }
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <DrawerFooter>
            <Button onClick={() => handleNewMeta({metaValue}) }>Salvar</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>

    <Drawer open={visible2} onOpenChange={setVisible2}>
      <div className="">
      <DrawerTrigger asChild >
      <Button variant={"outline"}>Alterar Meta</Button>
      </DrawerTrigger>
      </div>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Alterar a Meta</DrawerTitle>
            <DrawerDescription>Altere a Meta desejada para esse mês.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => handleMeta(metaValue - 1000)}
              >
                <MinusIcon className="h-4 w-4" />
                <span className="sr-only">Decrease</span>
              </Button>
              <div className="flex-1 text-center">
                <div className="text-7xl font-bold tracking-tighter">
                  {metaValue}
                  <Input
                    className="text-sm text-muted-foreground "
                    value={metaValue}
                    type="number"
                    min={0}
                    onChange={(e) => setMetaValue(parseInt(e.target.value))}
                  />
                </div>
                <div className="text-[0.70rem] uppercase text-muted-foreground">
                  Valor
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => handleMeta(metaValue + 1000)}
              >
                <PlusIcon className="h-4 w-4" />
                <span className="sr-only">Increase</span>
              </Button>
            </div>
            <div className="mt-3 h-[120px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart >
                  <Bar
                    dataKey="meta"
                    style={
                      {
                        fill: "hsl(var(--foreground))",
                        opacity: 0.9,
                      } as React.CSSProperties
                    }
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <DrawerFooter>
            <Button onClick={() => mounthMeta && handleUpdateMeta(mounthMeta) }>Salvar</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
    </div>
  )
}
