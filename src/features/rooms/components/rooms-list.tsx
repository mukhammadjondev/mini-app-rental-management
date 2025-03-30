'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Home, Users, Edit, Trash2, Filter } from 'lucide-react';
import { RoomStatus } from '@/types';
import { t } from '@/lib/translations';
import { mockRooms } from '../constants/mock-data';
import { roomStatusColor } from '../constants/label';

const houses = Array.from(
  new Set(mockRooms.map(({ houseId, houseName }) => `${houseId}|${houseName}`))
).map(entry => {
  const [id, name] = entry.split('|');
  return { id, name };
});

export default function RoomsList() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [houseFilter, setHouseFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredRooms = useMemo(
    () =>
      mockRooms.filter(
        ({ roomNumber, houseName, status, houseId }) =>
          (statusFilter === 'all' || status === statusFilter) &&
          (houseFilter === 'all' || houseId === houseFilter) &&
          [roomNumber, houseName].some(field =>
            field?.toLowerCase().includes(searchTerm.toLowerCase())
          )
      ),
    [searchTerm, statusFilter, houseFilter]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center space-x-2">
          <Input
            placeholder={t('searchRooms')}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? 'bg-muted' : ''}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        {showFilters && (
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder={t('status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('all')}</SelectItem>
                {Object.values(RoomStatus).map(status => (
                  <SelectItem key={status} value={status}>
                    {t(status)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={houseFilter} onValueChange={setHouseFilter}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder={t('house')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allHouses')}</SelectItem>
                {houses.map(({ id, name }) => (
                  <SelectItem key={id} value={id}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {filteredRooms.map(
          ({
            _id,
            roomNumber,
            houseName,
            status,
            monthlyRent,
            currentTenants,
            maxTenants,
          }) => (
            <Card
              key={_id}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">
                      <Home className="h-4 w-4 mr-2 inline text-muted-foreground" />
                      {t('room')} {roomNumber}
                    </h3>
                    <p className="text-sm text-muted-foreground">{houseName}</p>
                  </div>
                  <Badge className={roomStatusColor[status]}>{t(status)}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {t('monthlyRent')}
                    </p>
                    <p className="font-medium flex items-center">
                      ${monthlyRent}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {t('tenants')}
                    </p>
                    <p className="font-medium flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {currentTenants?.length || 0} / {maxTenants}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={() => router.push(`/properties/rooms/${_id}`)}
                  >
                    {t('viewDetails')}
                  </Button>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        )}
      </div>

      {filteredRooms.length === 0 && (
        <div className="text-center py-8">
          <Home className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="mt-2 text-lg font-medium">{t('noRoomsFound')}</h3>
          <p className="text-sm text-muted-foreground">
            {t('tryAdjustingFilters')}
          </p>
        </div>
      )}
    </div>
  );
}
