'use client'

import { CalendarIcon } from '@radix-ui/react-icons'
import { format } from 'date-fns'
import { DateRange } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { Popover, PopoverContent } from './ui/popover'
import { PopoverTrigger } from '@radix-ui/react-popover'
import { Button } from './ui/button'
import { Calendar } from './ui/calendar'
import { useState } from 'react'

import { z } from 'zod'
import { toast } from 'sonner'
import { useDateRange } from '@/hooks/date-ranger-context'

const inDates = z.object({
  start_date: z.date(),
  end_date: z.date()
})

type InDates = z.infer<typeof inDates>

export function CalendarDateRangePicker({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const { dateRange, setDateRange } = useDateRange()
  const { startDate, endDate } = dateRange

  const [date, setDate] = useState<DateRange | undefined>({
    from: startDate,
    to: endDate
  })

  async function handleTransactionByDate(data: InDates) {
    try {

      setDateRange({ startDate: data.start_date, endDate: data.end_date })
      setDate({ from: data.start_date, to: data.end_date })
      setDate({ from: data.start_date, to: data.end_date })


    } catch (err) {
      toast.error(`Erro ao tentar buscar transações por data: ${err}`)
    }
  }

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'secondary'}
            className={cn(
              'w-[260px] justify-start rounded-full text-left font-normal',
              !date && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} -{' '}
                  {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(range) => range?.from && range.to && handleTransactionByDate({ start_date: range?.from, end_date: range?.to })}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
