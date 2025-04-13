import { ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';

import { Checkbox } from '@/components/ui/checkbox';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface IProps {
  name: string;
  label?: ReactNode;
  required?: boolean;
}

export default function CheckboxField({ name, label, required }: IProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center space-x-3">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            {label && <FormLabel required={required}>{label}</FormLabel>}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
