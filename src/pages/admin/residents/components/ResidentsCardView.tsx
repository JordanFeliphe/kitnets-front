import React from 'react';
import { MoreHorizontal, Edit, Trash2, Shield, ShieldOff, RotateCcw, Phone, Mail } from 'lucide-react';
import { Button } from '@/app/shared/components/ui/button';
import { Avatar, AvatarFallback } from '@/app/shared/components/ui/avatar';
import { Card, CardContent } from '@/app/shared/components/ui/card';
import { Skeleton } from '@/app/shared/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/shared/components/ui/dropdown-menu';
import StatusBadge from './StatusBadge';
import { ResidentsCardViewProps } from '../types/residents.types';
import { formatDate } from '@/app/shared/utils/formatters';

const ResidentsCardView: React.FC<ResidentsCardViewProps> = ({
  data,
  loading = false,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-28" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!data?.data?.length) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-muted-foreground">No residents found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search filters or add a new resident.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {data.data.map((user) => {
        const initials = user.name
          .split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);

        return (
          <Card
            key={user._id}
            className="transition-all hover:shadow-md hover:border-primary/20"
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="text-sm font-medium">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{user.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{user.email}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-3">
                  <StatusBadge status={user.status} />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => onEdit(user)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Resident
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      {user.status === 'BLOCKED' ? (
                        <DropdownMenuItem>
                          <ShieldOff className="h-4 w-4 mr-2" />
                          Unblock User
                        </DropdownMenuItem>
                      ) : user.status === 'ACTIVE' ? (
                        <DropdownMenuItem>
                          <Shield className="h-4 w-4 mr-2" />
                          Block User
                        </DropdownMenuItem>
                      ) : null}

                      <DropdownMenuItem>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset Password
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        onClick={() => onDelete(user)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Resident
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">CPF:</span>
                  <span className="font-mono text-xs">{user.cpf}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  <span className="font-mono text-xs">{user.phone}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    {user.mfaEnabled ? (
                      <>
                        <Shield className="h-3 w-3 text-green-600" />
                        <span className="text-green-600">2FA On</span>
                      </>
                    ) : (
                      <>
                        <ShieldOff className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-400">2FA Off</span>
                      </>
                    )}
                  </div>
                  {user.requirePasswordReset && (
                    <div className="flex items-center gap-1">
                      <RotateCcw className="h-3 w-3 text-orange-600" />
                      <span className="text-orange-600">Reset Required</span>
                    </div>
                  )}
                </div>

                <div className="text-xs text-muted-foreground">
                  Created {formatDate(user.createdAt)}
                </div>
              </div>

              {user.blockedAt && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                  <div className="flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    <span>
                      Blocked since {formatDate(user.blockedAt)}
                      {user.blockedUntil && ` until ${formatDate(user.blockedUntil)}`}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ResidentsCardView;