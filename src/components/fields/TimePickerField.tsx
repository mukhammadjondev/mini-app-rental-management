import { ReactNode } from "react"
import { useFormContext } from "react-hook-form"

import { TimePicker } from "@/components/TimePicker"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

interface IProps {
  name: string
  label?: ReactNode
  required?: boolean
}

export default function DatePickerField({ required, name, label }: IProps) {
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col w-full">
          {label && (
            <FormLabel>
              {label} {required && <span className="text-red-500 dark:text-red-900">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <TimePicker date={field.value || 0} setDate={field.onChange} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
