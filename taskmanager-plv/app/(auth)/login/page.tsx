'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    console.log('🔐 Tentative de connexion pour:', email)

    try {
      const supabase = createClient()
      
      // Vérifier la configuration Supabase
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        throw new Error('Configuration Supabase manquante. Vérifiez votre fichier .env.local')
      }

      console.log('✅ Client Supabase créé')
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('❌ Erreur de connexion:', error)
        setError(`Erreur de connexion: ${error.message}`)
        setLoading(false)
        return
      }

      console.log('✅ Connexion réussie, utilisateur:', data.user?.id)

      if (data.user) {
        // Récupérer le profil pour rediriger selon le rôle
        console.log('🔍 Récupération du profil...')
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single() as { data: { role: 'admin' | 'commercial' | 'client' } | null, error: any }

        if (profileError) {
          console.error('❌ Erreur lors de la récupération du profil:', profileError)
          setError(`Profil introuvable. Erreur: ${profileError.message}. Contactez un administrateur.`)
          setLoading(false)
          return
        }

        if (profile) {
          console.log('✅ Profil trouvé, rôle:', profile.role)
          const dashboardUrl = `/dashboard/${profile.role}`
          console.log('🔄 Redirection vers:', dashboardUrl)
          
          router.push(dashboardUrl)
          router.refresh()
        } else {
          console.error('❌ Profil null')
          setError('Aucun profil trouvé pour cet utilisateur. Contactez un administrateur.')
        }
      }
    } catch (err: any) {
      console.error('❌ Erreur inattendue:', err)
      setError(`Erreur: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">TaskManager PLV</CardTitle>
          <CardDescription className="text-center">
            Connectez-vous à votre compte
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="exemple@entreprise.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
            <p className="text-sm text-center text-gray-600">
              Pas encore de compte ?{' '}
              <Link href="/signup" className="text-blue-600 hover:underline font-medium">
                S'inscrire
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
