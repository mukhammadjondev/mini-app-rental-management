import { useState } from 'react';
import { Plus } from 'lucide-react';
import { t } from '@/lib/translations';
import { ITenant } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

import TenantNotesTab from './notes-tab';
import TenantPaymentsTab from './payments';
import TenantSummaryCard from './summary-card';
import TenantInfoTab from './info-tab';

export default function TenantsDetail({ tenant }: { tenant: ITenant }) {
  const [activeTab, setActiveTab] = useState('info');

  return (
    <div className="space-y-4 pb-4">
      <TenantSummaryCard
        tenant={tenant!}
        houseAddress={tenant?.houseId}
        roomNumber={tenant?.roomId}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="info">{t('info')}</TabsTrigger>
          <TabsTrigger value="payments">{t('payments')}</TabsTrigger>
          <TabsTrigger value="notes">{t('notes')}</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <TenantInfoTab
            tenant={tenant}
            houseAddress={tenant?.houseId}
            roomNumber={tenant?.roomId}
          />
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <TenantPaymentsTab tenant={tenant} />

          <Button className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            {t('recordPayment')}
          </Button>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <TenantNotesTab tenant={tenant} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
