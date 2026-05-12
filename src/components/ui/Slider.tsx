import type { InputHTMLAttributes } from 'react'

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  min: number
  max: number
  step?: number
}

export function Slider({ min, max, step = 1, className, ...rest }: SliderProps) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      className={`hpanel-slider ${className ?? ''}`}
      {...rest}
    />
  )
}
