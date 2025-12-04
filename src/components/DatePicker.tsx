import * as React from "react";
import { format, parse, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DatePickerProps {
  date?: Date;
  onDateChange: (date: Date | undefined) => void;
  placeholder?: string;
}

const months = [
  { value: "0", label: "Janeiro" },
  { value: "1", label: "Fevereiro" },
  { value: "2", label: "Março" },
  { value: "3", label: "Abril" },
  { value: "4", label: "Maio" },
  { value: "5", label: "Junho" },
  { value: "6", label: "Julho" },
  { value: "7", label: "Agosto" },
  { value: "8", label: "Setembro" },
  { value: "9", label: "Outubro" },
  { value: "10", label: "Novembro" },
  { value: "11", label: "Dezembro" },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

export function DatePicker({ date, onDateChange, placeholder = "dd/mm/aaaa" }: DatePickerProps) {
  const [inputValue, setInputValue] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);

  // Sync input value when date changes externally
  React.useEffect(() => {
    if (date && isValid(date)) {
      setInputValue(format(date, "dd/MM/yyyy"));
    } else {
      setInputValue("");
    }
  }, [date]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    
    // Auto-format as dd/mm/yyyy
    if (value.length >= 2) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    }
    if (value.length >= 5) {
      value = value.slice(0, 5) + "/" + value.slice(5, 9);
    }
    
    setInputValue(value);

    // Try to parse date when complete
    if (value.length === 10) {
      const parsed = parse(value, "dd/MM/yyyy", new Date());
      if (isValid(parsed)) {
        onDateChange(parsed);
      }
    }
  };

  const handleInputBlur = () => {
    if (inputValue.length === 10) {
      const parsed = parse(inputValue, "dd/MM/yyyy", new Date());
      if (isValid(parsed)) {
        onDateChange(parsed);
      } else {
        // Reset to previous valid date or empty
        setInputValue(date ? format(date, "dd/MM/yyyy") : "");
      }
    } else if (inputValue.length > 0 && inputValue.length < 10) {
      setInputValue(date ? format(date, "dd/MM/yyyy") : "");
    }
  };

  const handleMonthChange = (month: string) => {
    const currentDate = date || new Date();
    const newDate = new Date(currentDate.getFullYear(), parseInt(month), currentDate.getDate());
    onDateChange(newDate);
  };

  const handleYearChange = (year: string) => {
    const currentDate = date || new Date();
    const newDate = new Date(parseInt(year), currentDate.getMonth(), currentDate.getDate());
    onDateChange(newDate);
  };

  const handleCalendarSelect = (selectedDate: Date | undefined) => {
    onDateChange(selectedDate);
    if (selectedDate) {
      setIsOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Input direto para digitar a data */}
      <div className="relative">
        <Input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          maxLength={10}
          className="pr-10 border-2 transition-smooth hover:border-primary focus:border-primary"
        />
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-primary hover:bg-romantic-light"
            >
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 border-2 border-primary/20 shadow-romantic-hover bg-card" align="end">
            {/* Seletores de mês e ano */}
            <div className="flex gap-2 p-3 border-b border-border">
              <Select
                value={date ? date.getMonth().toString() : ""}
                onValueChange={handleMonthChange}
              >
                <SelectTrigger className="flex-1 h-9 border-primary/30 focus:ring-primary">
                  <SelectValue placeholder="Mês" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={date ? date.getFullYear().toString() : ""}
                onValueChange={handleYearChange}
              >
                <SelectTrigger className="w-24 h-9 border-primary/30 focus:ring-primary">
                  <SelectValue placeholder="Ano" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Calendar
              mode="single"
              selected={date}
              onSelect={handleCalendarSelect}
              month={date}
              onMonthChange={(newMonth) => {
                if (date) {
                  const newDate = new Date(newMonth.getFullYear(), newMonth.getMonth(), date.getDate());
                  onDateChange(newDate);
                }
              }}
              locale={ptBR}
              className="pointer-events-auto rounded-lg"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Texto auxiliar */}
      <p className="text-xs text-muted-foreground">
        Digite no formato dd/mm/aaaa ou clique no ícone para selecionar
      </p>
    </div>
  );
}

// Função utilitária para formatar data no padrão do backend
export function formatDateForBackend(date: Date): string {
  return format(date, "dd-MM-yyyy");
}
