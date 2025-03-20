'use client'

import { CalendarIcon } from '@radix-ui/react-icons'
import { format } from 'date-fns'
import { DateRange } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'
import { Calendar } from './ui/calendar'
import { useState, useEffect } from 'react'

import { z } from 'zod'
import { toast } from 'sonner'
import { useDateRange } from '@/hooks/date-ranger-context'

const inDates = z.object({
  start_date: z.date(),
  end_date: z.date(),
})

type InDates = z.infer<typeof inDates>

export function CalendarDateRangePicker({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const { dateRange, setDateRange } = useDateRange()
  const [selectedDates, setSelectedDates] = useState<DateRange>({
    from: dateRange.startDate,
    to: dateRange.endDate,
  })

  useEffect(() => {
    setSelectedDates({
      from: dateRange.startDate,
      to: dateRange.endDate,
    })
  }, [dateRange])

  const handleTransactionByDate = async (data: InDates) => {
    try {
      setDateRange({ startDate: data.start_date, endDate: data.end_date })
    } catch (err) {
      toast.error(`Erro ao tentar buscar transações por data: ${err}`)
    }
  }

  const handleSearch = async () => {
    if (selectedDates.from && selectedDates.to) {
      await handleTransactionByDate({
        start_date: selectedDates.from,
        end_date: selectedDates.to,
      })
    } else {
      toast.error('Por favor selecione um intervalo válido')
    }
  }

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="secondary"
            className={cn(
              'w-[260px] justify-start rounded-full text-left font-normal',
              !selectedDates.from && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDates.from ? (
              selectedDates.to ? (
                <>
                  {format(selectedDates.from, 'LLL dd, y')} -{' '}
                  {format(selectedDates.to, 'LLL dd, y')}
                </>
              ) : (
                format(selectedDates.from, 'LLL dd, y')
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
            defaultMonth={selectedDates.from}
            selected={selectedDates}
            onSelect={(range) => {
              if (range) {
                setSelectedDates(range)
              }
            }}
            numberOfMonths={2}
          />
          <Button className="my-2 ml-4" onClick={handleSearch}>
            Buscar
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  )
}
