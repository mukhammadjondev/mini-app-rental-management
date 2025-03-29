'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@telegram-apps/telegram-ui';

import { t } from '@/lib/translations';
import { RoomStatus } from '@/types';
import { houseStatusColor, houseStatusOptions } from '../constants/label';
import { mockHouses, mockRooms } from '../constants/mock-data';

export default function HousesList() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredHouses = useMemo(() => {
    return mockHouses.filter(({ address, description, status }) => {
      const matchesSearch = [address, description].some(field =>
        field?.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const matchesStatus = statusFilter === 'all' || status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const getOccupancyRate = (houseId: string) => {
    const rooms = mockRooms[houseId] || [];
    const occupied = rooms.filter(r => r.status === RoomStatus.OCCUPIED).length;
    return rooms.length ? Math.round((occupied / rooms.length) * 100) : 0;
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Toggle */}
      <div className="flex items-center space-x-2">
        <Input
          placeholder={t('searchHouses')}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowFilters(prev => !prev)}
          className={showFilters ? 'bg-muted' : ''}
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Status Filter Buttons */}
      {showFilters && (
        <div className="grid grid-cols-3 gap-2">
          {houseStatusOptions.map(({ label, value }) => (
            <Button
              key={value}
              variant={statusFilter === value ? 'default' : 'outline'}
              onClick={() => setStatusFilter(value)}
              className="w-full"
            >
              {label}
            </Button>
          ))}
        </div>
      )}

      {/* House Cards */}
      <div className="space-y-3">
        {filteredHouses.map(house => {
          const occupancy = getOccupancyRate(house._id!);

          return (
            <Card
              key={house._id}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => router.push(`/properties/house/${house._id}`)}
            >
              <CardContent className="p-4 space-y-3">
                {/* Address + Status */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{house.address}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {house.description}
                    </p>
                  </div>
                  <Badge className={houseStatusColor[house.status]}>
                    {t(house.status)}
                  </Badge>
                </div>

                {/* Base Rent & Total Rooms */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {t('baseRent')}
                    </p>
                    <p className="font-medium">${house.monthlyBaseRent}/mo</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {t('totalRooms')}
                    </p>
                    <p className="font-medium">{house.totalRooms}</p>
                  </div>
                </div>

                {/* Occupancy */}
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>{t('occupancy')}</span>
                    <span>{occupancy}%</span>
                  </div>
                  <Progress value={occupancy} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
