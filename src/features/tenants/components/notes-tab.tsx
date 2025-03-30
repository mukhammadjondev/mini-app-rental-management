import { Card, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus } from 'lucide-react';
import { t } from '@/lib/translations';
import { type ITenant } from '@/types';

interface TenantNotesTabProps {
  tenant: ITenant;
}

export default function TenantNotesTab({ tenant }: TenantNotesTabProps) {
  return (
    <Card>
      <CardContent className="p-4 space-y-2">
        <CardTitle className="text-base">{t('notes')}</CardTitle>
        {tenant.notes ? (
          <div className="p-4 bg-muted rounded-md">{tenant.notes}</div>
        ) : (
          <EmptyNotesState />
        )}
        <Button className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          {t('addNote')}
        </Button>
      </CardContent>
    </Card>
  );
}

function EmptyNotesState() {
  return (
    <div className="text-center py-6">
      <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
      <h3 className="mt-2 text-lg font-medium">{t('noNotes')}</h3>
      <p className="text-sm text-muted-foreground">
        {t('addNotesAboutTenant')}
      </p>
    </div>
  );
}
