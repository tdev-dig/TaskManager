import { Badge } from "./badge"

interface RoleBadgeProps {
  roles: ('admin' | 'commercial' | 'client')[]
  className?: string
}

const roleColors = {
  admin: 'bg-red-100 text-red-800 hover:bg-red-200',
  commercial: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  client: 'bg-green-100 text-green-800 hover:bg-green-200'
}

const roleLabels = {
  admin: 'Admin',
  commercial: 'Commercial',
  client: 'Client'
}

export function RoleBadge({ roles, className }: RoleBadgeProps) {
  if (!roles || roles.length === 0) {
    return <Badge variant="secondary" className={className}>Aucun rôle</Badge>
  }

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {roles.map((role) => (
        <Badge
          key={role}
          variant="secondary"
          className={roleColors[role]}
        >
          {roleLabels[role]}
        </Badge>
      ))}
    </div>
  )
}