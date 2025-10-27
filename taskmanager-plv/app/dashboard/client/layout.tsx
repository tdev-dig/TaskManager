import { redirect } from 'next/navigation'
import { getUserProfile } from '@/lib/auth'
import { DashboardHeader } from '@/components/dashboard/header'
import { DashboardSidebar } from '@/components/dashboard/sidebar'

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const profile = await getUserProfile()

  if (!profile || profile.role !== 'client') {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={profile} />
      <div className="flex">
        <DashboardSidebar role="client" />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
