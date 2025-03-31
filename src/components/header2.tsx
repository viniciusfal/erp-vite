"use client"

import * as React from "react"


import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Button } from "./ui/button"


export function Header2() {
  const [activeButton, setActiveButton] = React.useState(location.pathname)

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Button
            className={`h-12 w-32 rounded-full text-sm ${activeButton === '/finances'
              ? 'bg-gradient-to-r from-slate-950 to-slate-800 text-muted hover:text-white dark:bg-gradient-to-tr dark:from-emerald-700 dark:to-emerald-500 dark:text-white'
              : 'bg-transparent'
              }`}
            variant="outline"
          >
            <NavigationMenuTrigger className="bg-transparent">
              Contas a Pagar
            </NavigationMenuTrigger>
          </Button>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              <ListItem
                title="Lançamento de Titulos"
                href="/finances"
              >
                Visualize e Lance os titulos a pagar
              </ListItem>
              <ListItem
                title="Baixa de Titulos">
                Visualize e dê baixa nos titulos a pagar em aberto
              </ListItem>
              <ListItem title="Correção de Titulos">
                Faça a correção dos titulos lançados e com baixa
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu >
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
