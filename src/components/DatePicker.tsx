import * as React from "react";
import { useState, useEffect } from "react";
import { format, parse, isValid, getDaysInMonth } from "date-fns";
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

export function DatePicker({ date, onDateChange, placeholder = "Selecione uma data" }: DatePickerProps) {
  const [inputValue, setInputValue] = useState("");
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Sync state when date prop changes
  useEffect(() => {
    if (date && isValid(date)) {
      setInputValue(format(date, "dd/MM/yyyy"));
      setSelectedDay(date.getDate().toString());
      setSelectedMonth(date.getMonth().toString());
      setSelectedYear(date.getFullYear().toString());
    }
  }, [date]);

  // Generate years (100 years back from current year)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  // Generate days based on selected month and year
  const getDays = () => {
    const month = selectedMonth ? parseInt(selectedMonth) : 0;
    const year = selectedYear ? parseInt(selectedYear) : currentYear;
    const daysInMonth = getDaysInMonth(new Date(year, month));
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  // Handle text input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    
    // Auto-format as dd/MM/yyyy
    if (value.length >= 2) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    }
    if (value.length >= 5) {
      value = value.slice(0, 5) + "/" + value.slice(5, 9);
    }
    
    setInputValue(value);

    // Try to parse the date
    if (value.length === 10) {
      const parsedDate = parse(value, "dd/MM/yyyy", new Date());
      if (isValid(parsedDate)) {
        onDateChange(parsedDate);
        setSelectedDay(parsedDate.getDate().toString());
        setSelectedMonth(parsedDate.getMonth().toString());
        setSelectedYear(parsedDate.getFullYear().toString());
      }
    }
  };

  // Handle dropdown changes
  const handleDropdownChange = (type: "day" | "month" | "year", value: string) => {
    let newDay = type === "day" ? value : selectedDay;
    let newMonth = type === "month" ? value : selectedMonth;
    let newYear = type === "year" ? value : selectedYear;

    if (type === "day") setSelectedDay(value);
    if (type === "month") setSelectedMonth(value);
    if (type === "year") setSelectedYear(value);

    // If all fields are filled, create date
    if (newDay && newMonth && newYear) {
      const newDate = new Date(parseInt(newYear), parseInt(newMonth), parseInt(newDay));
      if (isValid(newDate)) {
        onDateChange(newDate);
        setInputValue(format(newDate, "dd/MM/yyyy"));
      }
    }
  };

  // Handle calendar selection
  const handleCalendarSelect = (newDate: Date | undefined) => {
    onDateChange(newDate);
    setIsCalendarOpen(false);
    if (newDate && isValid(newDate)) {
      setInputValue(format(newDate, "dd/MM/yyyy"));
      setSelectedDay(newDate.getDate().toString());
      setSelectedMonth(newDate.getMonth().toString());
      setSelectedYear(newDate.getFullYear().toString());
    }
  };

  return (
    <div className="space-y-3">
      {/* Text Input with Calendar Button */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="DD/MM/AAAA"
            value={inputValue}
            onChange={handleInputChange}
            maxLength={10}
            className="border-2 transition-all hover:border-primary focus:border-primary pr-10"
          />
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-primary hover:text-primary/80"
              >
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-2 border-primary/20 shadow-romantic-hover bg-card z-50" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleCalendarSelect}
                initialFocus
                locale={ptBR}
                className="pointer-events-auto rounded-lg"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Dropdown Selectors */}
      <div className="flex gap-2">
        <Select value={selectedDay} onValueChange={(v) => handleDropdownChange("day", v)}>
          <SelectTrigger className="flex-1 border-2 hover:border-primary transition-all">
            <SelectValue placeholder="Dia" />
          </SelectTrigger>
          <SelectContent className="bg-card border-2 border-primary/20 z-50 max-h-[200px]">
            {getDays().map((day) => (
              <SelectItem key={day} value={day.toString()}>
                {day.toString().padStart(2, "0")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedMonth} onValueChange={(v) => handleDropdownChange("month", v)}>
          <SelectTrigger className="flex-[2] border-2 hover:border-primary transition-all">
            <SelectValue placeholder="Mês" />
          </SelectTrigger>
          <SelectContent className="bg-card border-2 border-primary/20 z-50 max-h-[200px]">
            {months.map((month) => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedYear} onValueChange={(v) => handleDropdownChange("year", v)}>
          <SelectTrigger className="flex-1 border-2 hover:border-primary transition-all">
            <SelectValue placeholder="Ano" />
          </SelectTrigger>
          <SelectContent className="bg-card border-2 border-primary/20 z-50 max-h-[200px]">
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Display formatted date */}
      {date && isValid(date) && (
        <p className="text-sm text-muted-foreground text-center">
          {format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </p>
      )}
    </div>
  );
}
