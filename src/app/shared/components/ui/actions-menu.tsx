import React from 'react'
import { Button } from '@/app/shared/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/shared/components/ui/dropdown-menu'
import { ConfirmDialog } from '@/app/shared/components/ui/confirm-dialog'
import { MoreVertical } from 'lucide-react'

export interface ActionItem {
  label: string
  icon?: React.ComponentType<{ className?: string }>
  onClick: () => void
  variant?: 'default' | 'destructive'
  disabled?: boolean
  separator?: boolean
  requiresConfirmation?: boolean
  confirmTitle?: string
  confirmDescription?: string
}

interface ActionsMenuProps {
  actions: ActionItem[]
  className?: string
  triggerClassName?: string
  contentAlign?: 'start' | 'center' | 'end'
}

export const ActionsMenu: React.FC<ActionsMenuProps> = ({
  actions,
  className,
  triggerClassName,
  contentAlign = 'end'
}) => {
  if (!actions || actions.length === 0) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={`h-8 w-8 ${triggerClassName || ''}`}
        >
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Abrir menu de ações</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={contentAlign} className={className}>
        {actions.map((action, index) => (
          <React.Fragment key={index}>
            {action.requiresConfirmation ? (
              <ConfirmDialog
                title={action.confirmTitle || action.label}
                description={action.confirmDescription || `Tem certeza que deseja ${action.label.toLowerCase()}?`}
                variant={action.variant}
                onConfirm={action.onClick}
                disabled={action.disabled}
              >
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  disabled={action.disabled}
                  className={
                    action.variant === 'destructive'
                      ? 'text-destructive focus:text-destructive'
                      : ''
                  }
                >
                  {action.icon && (
                    <action.icon className="mr-2 h-4 w-4" />
                  )}
                  {action.label}
                </DropdownMenuItem>
              </ConfirmDialog>
            ) : (
              <DropdownMenuItem
                onClick={action.onClick}
                disabled={action.disabled}
                className={
                  action.variant === 'destructive'
                    ? 'text-destructive focus:text-destructive'
                    : ''
                }
              >
                {action.icon && (
                  <action.icon className="mr-2 h-4 w-4" />
                )}
                {action.label}
              </DropdownMenuItem>
            )}
            {action.separator && index < actions.length - 1 && (
              <DropdownMenuSeparator />
            )}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}