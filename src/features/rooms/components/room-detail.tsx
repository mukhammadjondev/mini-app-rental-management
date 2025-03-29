'use client';

import { useState } from 'react';
import {
  Users,
  DollarSign,
  Wrench,
  Plus,
  Calendar,
  CreditCard,
} from 'lucide-react';
import { t } from '@/lib/translations';
import { type IRoom } from '@/types';

import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { roomStatusColor } from '@/features/rooms/constants/label';

interface RoomDetailProps {
  room: IRoom;
  tenants: Array<{
    id: string;
    name: string;
    phone: string;
    startDate: string;
    endDate: string | null;
  }>;
  payments: Array<{
    id: string;
    tenantId: string;
    tenantName: string;
    amount: number;
    date: string;
    status: string;
    type: string;
    period: string | null;
  }>;
  maintenance: Array<{
    id: string;
    title: string;
    description: string;
    status: string;
    date: string;
    cost: number | null;
  }>;
}

export default function RoomDetail({
  room,
  tenants,
  payments,
  maintenance,
}: RoomDetailProps) {
  const [activeTab, setActiveTab] = useState('info');

  // Filter tenants for this room
  const roomTenants = tenants.filter(tenant =>
    room.currentTenants?.includes(tenant.id)
  );

  return (
    <div className="space-y-4 mb-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <CardTitle>
                {t('room')} {room.roomNumber}
              </CardTitle>
              <CardDescription>{room.houseName}</CardDescription>
            </div>
            <Badge className={roomStatusColor[room.status]}>
              {t(room.status)}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <InfoBlock
              icon={<DollarSign />}
              label={t('monthlyRent')}
              value={`$${room.monthlyRent}`}
            />
            <InfoBlock
              icon={<Users />}
              label={t('tenants')}
              value={`${room.currentTenants?.length || 0} / ${room.maxTenants}`}
            />
          </div>

          {room.description && (
            <div className="mt-2 text-sm text-muted-foreground">
              {room.description}
            </div>
          )}

          <div className="flex space-x-2 w-full mt-5">
            <Button variant="outline" className="flex-1">
              <Wrench className="h-4 w-4 mr-2" />
              {t('maintenance')}
            </Button>
            <Button className="flex-1">
              <Plus className="h-4 w-4 mr-2" />
              {t('addTenant')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="info">{t('info')}</TabsTrigger>
          <TabsTrigger value="tenants">{t('tenants')}</TabsTrigger>
          <TabsTrigger value="payments">{t('payments')}</TabsTrigger>
          <TabsTrigger value="maintenance">{t('maintenance')}</TabsTrigger>
        </TabsList>

        {/* Info Tab */}
        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardContent className="space-y-2 p-4">
              <CardTitle className="text-base">{t('roomDetails')}</CardTitle>
              <div className="flex justify-between gap-4">
                <ValueBlock label={t('roomNumber')} value={room.roomNumber} />
                <ValueBlock label={t('status')} value={t(room.status)} />
                <ValueBlock label={t('maxTenants')} value={room.maxTenants} />
              </div>

              <div>
                <span className="text-xs text-muted-foreground">
                  {t('amenities')}
                </span>
                <div className="font-medium mt-1">
                  {room.amenities?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {room.amenities.map((amenity, index) => (
                        <Badge key={index} variant="outline">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">
                      {t('noAmenities')}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tenants Tab */}
        <TabsContent value="tenants" className="space-y-4">
          <Card>
            <CardContent className="space-y-2 p-4">
              <CardTitle className="text-base">{t('tenants')}</CardTitle>
              <CardDescription>{t('currentTenants')}</CardDescription>
              {roomTenants.length > 0 ? (
                <div className="space-y-4">
                  {roomTenants.map(tenant => (
                    <div
                      key={tenant.id}
                      className="flex items-center justify-between p-3 bg-muted rounded-md"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{tenant.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {tenant.phone}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm">
                          {t('since')}: {tenant.startDate}
                        </div>
                        <Button variant="ghost" size="sm" className="h-8">
                          {t('view')}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-2 text-lg font-medium">{t('noTenants')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('roomVacant')}
                  </p>
                </div>
              )}
              <Button className="w-full mt-4">
                <Plus className="h-4 w-4 mr-2" />
                {t('addTenant')}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardContent className="space-y-2 p-4">
              <CardTitle className="text-base">{t('paymentHistory')}</CardTitle>
              {payments.length > 0 ? (
                <div className="space-y-4 mt-2">
                  {payments.map(payment => (
                    <div
                      key={payment.id}
                      className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0"
                    >
                      <div>
                        <div className="font-medium">
                          {payment.type === 'rent'
                            ? t('rentFor') + ' ' + payment.period
                            : t('securityDeposit')}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {payment.date} • {payment.tenantName}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">${payment.amount}</div>
                        <Badge
                          className={`${
                            payment.status === 'paid'
                              ? 'bg-green-500'
                              : 'bg-yellow-500'
                          }`}
                        >
                          {t(payment.status)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <CreditCard className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-2 text-lg font-medium">
                    {t('noPayments')}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t('noPaymentsRecorded')}
                  </p>
                </div>
              )}
              <Button className="w-full mt-4">
                <Plus className="h-4 w-4 mr-2" />
                {t('recordPayment')}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance Tab */}
        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardContent className="space-y-2 p-4">
              <CardTitle className="text-base">
                {t('maintenanceHistory')}
              </CardTitle>
              {maintenance.length > 0 ? (
                <div className="space-y-4 mt-2">
                  {maintenance.map(item => (
                    <div
                      key={item.id}
                      className="flex justify-between items-start border-b pb-3 last:border-0 last:pb-0"
                    >
                      <div>
                        <div className="font-medium">{item.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.description}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {item.date}
                        </div>
                      </div>
                      <div className="text-right">
                        {item.cost !== null && (
                          <div className="font-bold">${item.cost}</div>
                        )}
                        <Badge
                          className={`${
                            item.status === 'completed'
                              ? 'bg-green-500'
                              : 'bg-yellow-500'
                          }`}
                        >
                          {t(item.status)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Wrench className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-2 text-lg font-medium">
                    {t('noMaintenance')}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t('noMaintenanceRecords')}
                  </p>
                </div>
              )}
              <Button className="w-full mt-4">
                <Plus className="h-4 w-4 mr-2" />
                {t('addMaintenanceRequest')}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Reusable UI Blocks
function InfoBlock({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center space-x-2">
      <div className="text-muted-foreground">{icon}</div>
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-2xl font-bold">{value}</div>
      </div>
    </div>
  );
}

function ValueBlock({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div>
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="font-medium">{value}</div>
    </div>
  );
}
