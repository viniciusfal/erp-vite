import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from 'sonner';
import "react-datepicker/dist/react-datepicker.css";

interface DateRangerSafeProps {
  startDate: Date | null;
  endDate: Date | null;
  setDateRange: React.Dispatch<React.SetStateAction<[Date | null, Date | null]>>;
}

export default function DateRangerSafe({ startDate, endDate, setDateRange }: DateRangerSafeProps) {
  const [localStartDate, setLocalStartDate] = useState<Date | null>(startDate);
  const [localEndDate, setLocalEndDate] = useState<Date | null>(endDate);

  useEffect(() => {
    setLocalStartDate(startDate);
    setLocalEndDate(endDate);
  }, [startDate, endDate]);

  const handleSearch = () => {
    if (!localStartDate || !localEndDate) {
      toast.error('Por favor, selecione ambas as datas inicial e final');
      return;
    }
    console.log("Datas selecionadas:", localStartDate, localEndDate); // Debug
    setDateRange([localStartDate, localEndDate]); // Atualize o estado no componente pai
  };

  return (
    <div className='flex items-center gap-1'>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={`justify-start text-left font-normal ${!localStartDate ? "text-muted-foreground" : ""}`}
          >
            {localStartDate && localEndDate ? (
              `${format(localStartDate, 'PP')} - ${format(localEndDate, 'PP')}`
            ) : (
              "Selecione um intervalo de datas"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <DatePicker
            selectsRange
            startDate={localStartDate} // Passar diretamente
            endDate={localEndDate} // Passar diretamente
            onChange={(dates: [Date | null, Date | null]) => {
              setLocalStartDate(dates[0]);
              setLocalEndDate(dates[1]);
            }}
            inline
          />
        </PopoverContent>
      </Popover>
      <Button onClick={handleSearch} disabled={!localStartDate || !localEndDate}>
        Buscar
      </Button>
    </div>
  );
}
