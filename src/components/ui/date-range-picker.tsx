import * as React from "react"
import { format, setMonth, setYear, isAfter, isBefore } from "date-fns"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerWithRangeProps {
  className?: string
  dateRange: DateRange | undefined
  setDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>
}

const getYears = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i)

export function DatePickerWithRange({
  className,
  dateRange,
  setDateRange,
}: DatePickerWithRangeProps) {
  const [pickerMode, setPickerMode] = React.useState<"date" | "month" | "year">("date")
  const [viewDate, setViewDate] = React.useState<Date>(new Date())
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)

  // Initialize viewDate when popover opens
  React.useEffect(() => {
    if (isPopoverOpen) {
      setPickerMode("date")
      setViewDate(dateRange?.from || new Date())
    }
  }, [isPopoverOpen])

  // Years to show in year picker
  const years = React.useMemo(() => getYears(2000, new Date().getFullYear() + 5), [])

  const handleMonthSelect = (month: number) => {
    const newDate = setMonth(viewDate, month)
    setViewDate(newDate)
    setPickerMode("date")
  }

  const handleYearSelect = (year: number) => {
    const newDate = setYear(viewDate, year)
    setViewDate(newDate)
    setPickerMode("month")
  }

  const handleBack = () => {
    if (pickerMode === "month") setPickerMode("year")
    else if (pickerMode === "year") setPickerMode("date")
  }

  const handleSelect = (newRange: DateRange | undefined) => {
    if (!newRange) {
      setDateRange(undefined)
      return
    }

    // Reset the range if user selects a date before the current "from"
    if (dateRange?.from && newRange.from && isBefore(newRange.from, dateRange.from)) {
      setDateRange({ from: newRange.from, to: undefined })
    } 
    // Complete the range if user selects a date after the current "from"
    else if (dateRange?.from && newRange.from && isAfter(newRange.from, dateRange.from)) {
      setDateRange({ from: dateRange.from, to: newRange.from })
    } 
    // Handle new selection
    else {
      setDateRange(newRange)
    }
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !dateRange?.from && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y")} -{" "}
                  {format(dateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-0" 
          align="start"
          onInteractOutside={() => setPickerMode("date")}
        >
          <div className="p-3 pointer-events-auto">
            {/* Calendar header with clickable month/year */}
            {pickerMode === "date" && (
              <div className="flex items-center justify-between mb-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewDate(setMonth(viewDate, viewDate.getMonth() - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="font-medium"
                    onClick={() => setPickerMode("month")}
                  >
                    {format(viewDate, "MMM")}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="font-medium"
                    onClick={() => setPickerMode("year")}
                  >
                    {format(viewDate, "yyyy")}
                  </Button>
                </div>
                <Button
                  variant="ghost"
                    size="icon"
                    onClick={() => setViewDate(setMonth(viewDate, viewDate.getMonth() + 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            {/* Picker body */}
            {pickerMode === "year" && (
              <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1">
                {years.map((year) => (
                  <Button
                    key={year}
                    variant={year === viewDate.getFullYear() ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleYearSelect(year)}
                  >
                    {year}
                  </Button>
                ))}
              </div>
            )}
            
            {pickerMode === "month" && (
              <div className="grid grid-cols-3 gap-2 p-1">
                {Array.from({ length: 12 }).map((_, i) => (
                  <Button
                    key={i}
                    variant={i === viewDate.getMonth() ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleMonthSelect(i)}
                  >
                    {format(setMonth(new Date(), i), "MMM")}
                  </Button>
                ))}
              </div>
            )}
            
            {pickerMode === "date" && (
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={viewDate}
                month={viewDate}
                selected={dateRange}
                onSelect={handleSelect}
                numberOfMonths={2}
                onMonthChange={setViewDate}
                className={cn("pointer-events-auto")}
              />
            )}
            
            {/* Back button for month/year pickers */}
            {(pickerMode === "month" || pickerMode === "year") && (
              <div className="flex justify-end mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBack}
                >
                  Back
                </Button>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}