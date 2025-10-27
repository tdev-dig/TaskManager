'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentProfile } from '@/lib/auth'

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const profile = await getCurrentProfile()
      if (profile) {
        // Redirection automatique selon le rôle
        if (profile.role === 'admin') {
          router.push('/dashboard/admin')
        } else if (profile.role === 'commercial') {
          router.push('/dashboard/commercial')
        } else if (profile.role === 'client') {
          router.push('/dashboard/client')
        }
      } else {
        router.push('/auth/login')
      }
    }

    checkUser()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirection en cours...</p>
      </div>
    </div>
  )
}
