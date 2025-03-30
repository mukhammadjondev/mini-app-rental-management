'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ITenant } from '@/types';
import { mockTenants } from '@/features/rooms/constants/mock-data';
import TenantsDetail from '@/features/tenants/components/tenants-detail';

export default function TenantDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [tenant, setTenant] = useState<ITenant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let foundTenant: ITenant | null = null;

    const tenantMatch = mockTenants.find(r => r.id === params.id);
    if (tenantMatch) {
      foundTenant = tenantMatch;
    }

    if (foundTenant) {
      setTenant(foundTenant);
    } else {
      router.push('/properties');
    }

    setLoading(false);
  }, [params.id, router]);

  if (loading && !tenant) {
    return <div>Loading...</div>;
  }

  return <TenantsDetail tenant={tenant!} />;
}
