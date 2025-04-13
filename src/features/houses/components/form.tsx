import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { HouseStatus, type IHouse } from '@/types';
import { t } from '@/lib/translations';
import { SelectField, TextAreaField, TextField } from '@/components/fields';
import { houseStatusOptions } from '../constants/label';

const formSchema = z.object({
  address: z.string().min(1, { message: 'required' }),
  totalRooms: z.coerce
    .number()
    .min(1, { message: 'minValue' })
    .max(100, { message: 'maxValue' }),
  monthlyBaseRent: z.coerce.number().min(0, { message: 'minValue' }),
  description: z.string().optional(),
  status: z.nativeEnum(HouseStatus),
});

type FormValues = z.infer<typeof formSchema>;

interface HouseFormProps {
  house?: IHouse;
  onSubmit: (data: FormValues) => void;
  onCancel: () => void;
}

export default function HouseForm({
  house,
  onSubmit,
  onCancel,
}: HouseFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: house
      ? {
          address: house.address,
          totalRooms: house.totalRooms,
          monthlyBaseRent: house.monthlyBaseRent,
          description: house.description || '',
          status: house.status,
        }
      : {
          address: '',
          totalRooms: 1,
          monthlyBaseRent: 0,
          description: '',
          status: HouseStatus.ACTIVE,
        },
  });

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{house ? t('editHouse') : t('addHouse')}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-4">
            <TextField name="address" placeholder={t('address')} />

            <div className="grid grid-cols-2 gap-4">
              <TextField
                name="totalRooms"
                placeholder={t('totalRooms')}
                type="number"
              />

              <TextField
                name="monthlyBaseRent"
                placeholder={t('baseRent')}
                type="number"
                min={0}
              />
            </div>

            <SelectField
              name="status"
              placeholder={t('status')}
              label={t('status')}
              data={houseStatusOptions.slice(1)}
            />

            <TextAreaField
              name="description"
              placeholder={t('description')}
              className="resize-none"
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={onCancel}>
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('loading') : t('save')}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
