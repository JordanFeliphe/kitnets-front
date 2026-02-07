import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/shared/components/ui/card"
import { Button } from "@/app/shared/components/ui/button"
import { Badge } from "@/app/shared/components/ui/badge"
import { StatusBadge } from "@/app/shared/components/ui/status-badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/shared/components/ui/dropdown-menu"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/app/shared/components/ui/drawer"
import { MoreVertical, Eye } from "lucide-react"
import { cn } from "@/app/shared/utils/cn"
interface ResponsiveCardField {
  label: string
  value: any
  type?: 'text' | 'badge' | 'status' | 'currency' | 'date' | 'custom'
  className?: string
  render?: (value: any) => React.ReactNode
  icon?: React.ComponentType<any> | React.ReactNode
}

interface ResponsiveCardAction {
  label: string
  icon?: React.ComponentType<any> | React.ReactNode
  onClick: () => void
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive'
  disabled?: boolean
}

interface ResponsiveCardProps {
  title: string
  subtitle?: string
  fields: ResponsiveCardField[]
  actions?: ResponsiveCardAction[]
  status?: {
    value: string
    type?: 'payment' | 'account' | 'contract' | 'document' | 'notice'
  }
  priority?: 'high' | 'medium' | 'low'
  onClick?: () => void
  className?: string
  detailsContent?: React.ReactNode
  detailsTitle?: string
  detailsDescription?: string
}

export const ResponsiveCard: React.FC<ResponsiveCardProps> = ({
  title,
  subtitle,
  fields,
  actions = [],
  status,
  priority,
  onClick,
  className,
  detailsContent,
  detailsTitle,
  detailsDescription,
}) => {
  
  const renderIcon = (icon: React.ComponentType<any> | React.ReactNode) => {
    if (React.isValidElement(icon)) {
      return icon
    }
    if (typeof icon === 'function') {
      const IconComponent = icon as React.ComponentType<{ className?: string }>
      return <IconComponent className="h-4 w-4" />
    }
    return null
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-4 border-l-red-500 bg-red-50/30'
      case 'medium':
        return 'border-l-4 border-l-yellow-500 bg-yellow-50/30'
      case 'low':
        return 'border-l-4 border-l-custom-orange-500 bg-custom-orange-50/30'
      default:
        return ''
    }
  }

  const renderFieldValue = (field: ResponsiveCardField) => {
    if (field.render) {
      return field.render(field.value)
    }

    switch (field.type) {
      case 'badge':
        return (
          <Badge variant="secondary" className={field.className}>
            {field.value}
          </Badge>
        )
      case 'status':
        return <StatusBadge status={field.value} className={field.className} />
      case 'currency':
        return (
          <span className={cn("font-medium text-custom-orange-600", field.className)}>
            R$ {field.value}
          </span>
        )
      case 'date':
        return <span className={field.className}>{field.value}</span>
      case 'custom':
        return field.value
      default:
        return <span className={field.className}>{field.value}</span>
    }
  }

  return (
    <Card 
      className={cn(
        "hover:shadow-md transition-shadow",
        priority && getPriorityColor(priority),
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-medium leading-tight">
              {title}
            </CardTitle>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {status && (
              <StatusBadge
                status={status.value}
              />
            )}
            
            {actions.length > 0 && (
              <div className="flex items-center gap-1">
                {/* Mobile: Show dropdown for actions */}
                <div className="md:hidden">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {actions.map((action, index) => (
                        <DropdownMenuItem
                          key={index}
                          onClick={(e) => {
                            e.stopPropagation()
                            action.onClick()
                          }}
                          disabled={action.disabled}
                        >
                          {action.icon && (
                            <span className="mr-2 flex items-center">
                              {renderIcon(action.icon)}
                            </span>
                          )}
                          {action.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                {/* Desktop: Show individual action buttons */}
                <div className="hidden md:flex items-center gap-1">
                  {actions.slice(0, 3).map((action, index) => (
                    <Button
                      key={index}
                      variant={action.variant || "ghost"}
                      size="sm"
                      className="h-8 px-2"
                      onClick={(e) => {
                        e.stopPropagation()
                        action.onClick()
                      }}
                      disabled={action.disabled}
                    >
                      {action.icon && renderIcon(action.icon)}
                    </Button>
                  ))}
                  {actions.length > 3 && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {actions.slice(3).map((action, index) => (
                          <DropdownMenuItem
                            key={index + 3}
                            onClick={(e) => {
                              e.stopPropagation()
                              action.onClick()
                            }}
                            disabled={action.disabled}
                          >
                            {action.icon && (
                              <span className="mr-2">{renderIcon(action.icon)}</span>
                            )}
                            {action.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {fields.map((field, index) => (
            <div key={`${field.label}-${index}`} className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium">
                {field.label}
              </p>
              <div className="text-sm flex items-center gap-2">
                {field.icon && (
                  <span className="flex-shrink-0">
                    {renderIcon(field.icon)}
                  </span>
                )}
                <span className="flex-1">
                  {renderFieldValue(field)}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Details Drawer for Mobile */}
        {detailsContent && (
          <div className="mt-4 md:hidden">
            <Drawer>
              <DrawerTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Detalhes
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>{detailsTitle || title}</DrawerTitle>
                  {detailsDescription && (
                    <DrawerDescription>{detailsDescription}</DrawerDescription>
                  )}
                </DrawerHeader>
                <div className="px-4 pb-4">
                  {detailsContent}
                </div>
                <DrawerFooter>
                  <div className="flex gap-2">
                    {actions.map((action, index) => (
                      <Button
                        key={index}
                        variant={action.variant || "outline"}
                        onClick={action.onClick}
                        disabled={action.disabled}
                        className="flex-1"
                      >
                        {action.icon && (
                          <span className="mr-2">{renderIcon(action.icon)}</span>
                        )}
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Specialized card components for different data types
export const PaymentCard: React.FC<ResponsiveCardProps & {
  amount?: string
  dueDate?: string
  paymentMethod?: string
}> = ({ amount, dueDate, paymentMethod, ...props }) => {
  return (
    <ResponsiveCard
      {...props}
    />
  )
}

export const InvoiceCard: React.FC<ResponsiveCardProps & {
  amount?: string
  dueDate?: string
}> = ({ amount, dueDate, ...props }) => {
  return (
    <ResponsiveCard
      {...props}
    />
  )
}

export const DocumentCard: React.FC<ResponsiveCardProps & {
  fileSize?: string
  uploadDate?: string
  isRequired?: boolean
  canDownload?: boolean
  canShare?: boolean
}> = ({ fileSize, uploadDate, isRequired, canDownload, canShare, ...props }) => {
  return (
    <ResponsiveCard
      {...props}
    />
  )
}

export const NoticeCard: React.FC<ResponsiveCardProps & {
  content?: string
  category?: string
  publishedDate?: string
  readStatus?: boolean
  isPinned?: boolean
  hasAttachments?: boolean
  requiresAcknowledgment?: boolean
}> = ({ content, category, publishedDate, readStatus, isPinned, hasAttachments, requiresAcknowledgment, ...props }) => {
  return (
    <ResponsiveCard
      {...props}
      status={readStatus !== undefined ? { value: readStatus ? 'Lido' : 'Não Lido' } : props.status}
    />
  )
}