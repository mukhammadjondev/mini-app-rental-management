import { useState } from 'react';
import { Home, Users, DollarSign, Wrench, Plus } from 'lucide-react';
import { t } from '@/lib/translations';
import { type IHouse, RoomStatus, type IRoom } from '@/types';
import { roomStatusColor } from '@/features/rooms/constants/label';

import { Progress } from '@telegram-apps/telegram-ui';
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { houseStatusColor } from '../constants/label';

interface HouseDetailProps {
  house: IHouse;
  rooms: IRoom[];
}

export default function HouseDetail({ house, rooms }: HouseDetailProps) {
  const [activeTab, setActiveTab] = useState('rooms');

  // Calculate statistics once
  const occupiedRooms = rooms.filter(
    r => r.status === RoomStatus.OCCUPIED
  ).length;
  const occupancyRate =
    rooms.length > 0 ? Math.round((occupiedRooms / rooms.length) * 100) : 0;
  const totalTenants = rooms.reduce(
    (acc, r) => acc + (r.currentTenants?.length || 0),
    0
  );
  const totalMonthlyRent = rooms.reduce((acc, r) => acc + r.monthlyRent, 0);

  return (
    <div className="space-y-4 mb-4">
      {/* House Overview Card */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <CardTitle>{house.address}</CardTitle>
              <CardDescription>{house.description}</CardDescription>
            </div>
            <Badge className={houseStatusColor[house.status]}>
              {t(house.status)}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <InfoBlock
              icon={<Home />}
              label={t('totalRooms')}
              value={house.totalRooms}
            />
            <InfoBlock
              icon={<Users />}
              label={t('tenants')}
              value={totalTenants}
            />
            <InfoBlock
              icon={<DollarSign />}
              label={t('baseRent')}
              value={`$${house.monthlyBaseRent}`}
            />
            <InfoBlock
              icon={<DollarSign />}
              label={t('totalIncome')}
              value={`$${totalMonthlyRent}`}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{t('occupancyRate')}</span>
              <span className="text-sm">{occupancyRate}%</span>
            </div>
            <Progress value={occupancyRate} />
          </div>

          <div className="flex space-x-2 w-full mt-5">
            <Button variant="outline" className="flex-1">
              <Wrench className="h-4 w-4 mr-2" />
              {t('maintenance')}
            </Button>
            <Button className="flex-1">
              <Plus className="h-4 w-4 mr-2" />
              {t('addRoom')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="rooms">{t('rooms')}</TabsTrigger>
          <TabsTrigger value="tenants">{t('tenants')}</TabsTrigger>
          <TabsTrigger value="expenses">{t('expenses')}</TabsTrigger>
        </TabsList>

        {/* Rooms Tab */}
        <TabsContent value="rooms" className="space-y-4">
          {rooms.map(room => (
            <Card key={room._id}>
              <CardContent className="space-y-2 p-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">
                    {t('room')} {room.roomNumber}
                  </CardTitle>
                  <div className="flex items-center space-x-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        roomStatusColor[room.status]
                      }`}
                    />
                    <span className="text-xs capitalize">{t(room.status)}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <ValueBlock
                    label={t('monthlyRent')}
                    value={`$${room.monthlyRent}`}
                  />
                  <ValueBlock
                    label={t('tenants')}
                    value={`${room.currentTenants?.length || 0} / ${
                      room.maxTenants
                    }`}
                  />
                </div>
                {room.description && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    {room.description}
                  </div>
                )}
                <Button variant="outline" size="sm" className="h-8 w-full">
                  {t('view')}
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Tenants Tab */}
        <TabsContent value="tenants" className="space-y-4">
          <Card>
            <CardContent className="space-y-2 p-4">
              <CardTitle className="text-base">{t('tenants')}</CardTitle>
              <CardDescription>{t('currentTenants')}</CardDescription>
              {rooms.some(room => room.currentTenants?.length) ? (
                <div className="space-y-4">
                  {rooms
                    .filter(room => room.currentTenants?.length)
                    .map(room => (
                      <div
                        key={room._id}
                        className="border-b pb-3 last:border-0 last:pb-0"
                      >
                        <div className="font-medium mb-2">
                          {t('room')} {room.roomNumber}
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          {room.currentTenants?.map((tenantId, index) => (
                            <div
                              key={tenantId}
                              className="flex items-center justify-between bg-muted p-2 rounded-md"
                            >
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                                  <Users className="h-4 w-4" />
                                </div>
                                <div>
                                  <div className="text-sm font-medium">
                                    {t('tenant')} {index + 1}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    ID: {tenantId}
                                  </div>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm" className="h-8">
                                {t('view')}
                              </Button>
                            </div>
                          ))}
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
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                {t('addTenant')}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Expenses Tab */}
        <TabsContent value="expenses">
          <Card>
            <CardContent className="p-4">
              <CardTitle className="text-base">{t('expenses')}</CardTitle>
              <CardDescription>{t('loading')}</CardDescription>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Reusable UI Blocks - Memoize these components if they're used frequently
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
