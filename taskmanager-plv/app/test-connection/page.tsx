'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function TestConnectionPage() {
  const [results, setResults] = useState<any>({
    envVars: {},
    connection: null,
    auth: null,
    profile: null,
    error: null
  })
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    const newResults: any = {
      envVars: {},
      connection: null,
      auth: null,
      profile: null,
      error: null
    }

    try {
      // 1. Vérifier les variables d'environnement
      newResults.envVars = {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'NON DÉFINI',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
          ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)}...` 
          : 'NON DÉFINI'
      }

      // 2. Tester la connexion Supabase
      const supabase = createClient()
      
      // 3. Tester l'authentification
      const { data: authData, error: authError } = await supabase.auth.getSession()
      newResults.auth = {
        hasSession: !!authData.session,
        user: authData.session?.user ? {
          id: authData.session.user.id,
          email: authData.session.user.email,
          metadata: authData.session.user.user_metadata
        } : null,
        error: authError?.message
      }

      // 4. Tester l'accès au profil si authentifié
      if (authData.session?.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.session.user.id)
          .single()

        newResults.profile = {
          data: profileData,
          error: profileError?.message
        }
      }

      // 5. Tester une simple requête
      const { data: stockData, error: stockError } = await supabase
        .from('stock')
        .select('count')
        .limit(1)

      newResults.connection = {
        success: !stockError,
        error: stockError?.message,
        canAccessStock: !!stockData
      }

    } catch (error: any) {
      newResults.error = error.message
    }

    setResults(newResults)
    setLoading(false)
  }

  useEffect(() => {
    testConnection()
  }, [])

  const testSignup = async () => {
    const supabase = createClient()
    const testEmail = `test-${Date.now()}@example.com`
    const testPassword = 'Test123456!'

    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          nom: 'Test',
          prenom: 'User'
        }
      }
    })

    alert(error ? `Erreur: ${error.message}` : `Succès! User ID: ${data.user?.id}`)
    testConnection()
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Diagnostic Supabase</CardTitle>
            <CardDescription>
              Vérification de la connexion et de l'authentification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={testConnection} disabled={loading}>
              {loading ? 'Test en cours...' : 'Retester la connexion'}
            </Button>
            <Button onClick={testSignup} variant="outline" className="ml-2">
              Tester inscription (créer un utilisateur test)
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>1. Variables d'environnement</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
              {JSON.stringify(results.envVars, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Connexion Supabase</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
              {JSON.stringify(results.connection, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Authentification</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
              {JSON.stringify(results.auth, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Profil utilisateur</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
              {JSON.stringify(results.profile, null, 2)}
            </pre>
          </CardContent>
        </Card>

        {results.error && (
          <Card className="border-red-300">
            <CardHeader>
              <CardTitle className="text-red-600">Erreur globale</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-red-50 p-4 rounded-md overflow-x-auto text-sm text-red-800">
                {results.error}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
