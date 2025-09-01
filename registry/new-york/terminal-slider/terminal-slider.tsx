"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "../../../lib/utils"

interface TerminalSliderProps extends React.ComponentProps<typeof SliderPrimitive.Root> {
  label?: string
  showValue?: boolean
  unit?: string
  ascii?: boolean
  width?: number
}

function TerminalSlider({
  className,
  label,
  showValue = true,
  unit = "",
  ascii = false,
  width = 20,
  value,
  defaultValue,
  min = 0,
  max = 100,
  ...props
}: TerminalSliderProps) {
  const [internalValue, setInternalValue] = React.useState(value || defaultValue || [min])

  const currentValue = value || internalValue
  const displayValue = Array.isArray(currentValue) ? currentValue[0] : currentValue

  const createAsciiBar = (val: number, total: number, barWidth: number) => {
    const filled = Math.round((val / total) * barWidth)
    const empty = barWidth - filled
    return "█".repeat(filled) + "░".repeat(empty)
  }

  const handleValueChange = (newValue: number[]) => {
    setInternalValue(newValue)
    props.onValueChange?.(newValue)
  }

  return (
    <div className={cn("space-y-2 font-mono", className)}>
      {label && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-green-400">{label}</span>
          {showValue && (
            <span className="text-muted-foreground">
              {displayValue}
              {unit}
            </span>
          )}
        </div>
      )}

      {ascii ? (
        <div className="space-y-1">
          <div className="text-xs text-green-400 font-mono">
            [{createAsciiBar(displayValue, max, width)}] {displayValue}
            {unit}
          </div>
          <SliderPrimitive.Root
            value={currentValue}
            defaultValue={defaultValue}
            min={min}
            max={max}
            onValueChange={handleValueChange}
            className="relative flex w-full touch-none items-center select-none opacity-0 absolute inset-0"
            {...props}
          >
            <SliderPrimitive.Track className="bg-transparent relative grow overflow-hidden h-4 w-full">
              <SliderPrimitive.Range className="bg-transparent absolute h-full" />
            </SliderPrimitive.Track>
            <SliderPrimitive.Thumb className="bg-transparent border-transparent block size-4 shrink-0" />
          </SliderPrimitive.Root>
        </div>
      ) : (
        <SliderPrimitive.Root
          value={currentValue}
          defaultValue={defaultValue}
          min={min}
          max={max}
          onValueChange={handleValueChange}
          className={cn("relative flex w-full touch-none items-center select-none", "data-[disabled]:opacity-50")}
          {...props}
        >
          <SliderPrimitive.Track className="bg-muted/30 border border-green-400/20 relative grow overflow-hidden rounded-none h-2 w-full">
            <SliderPrimitive.Range className="bg-green-400 absolute h-full" />
          </SliderPrimitive.Track>
          <SliderPrimitive.Thumb className="border-green-400 bg-green-400 ring-green-400/50 block size-3 shrink-0 rounded-none border shadow-sm transition-[color,box-shadow] hover:ring-2 focus-visible:ring-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50" />
        </SliderPrimitive.Root>
      )}

      <div className="flex justify-between text-xs text-muted-foreground font-mono">
        <span>
          {min}
          {unit}
        </span>
        <span>
          {max}
          {unit}
        </span>
      </div>
    </div>
  )
}

export { TerminalSlider }