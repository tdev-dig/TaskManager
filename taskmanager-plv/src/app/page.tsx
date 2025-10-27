import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            TaskManager PLV
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Solution de gestion complète pour votre entreprise de confection PLV
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-600">👨‍💼 Administrateur</CardTitle>
              <CardDescription>
                Gestion complète de l'entreprise
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Gestion des utilisateurs</li>
                <li>• Suivi des commandes</li>
                <li>• Gestion du stock</li>
                <li>• Import/Export Excel</li>
                <li>• Statistiques globales</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">💼 Commercial</CardTitle>
              <CardDescription>
                Gestion des ventes et clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Gestion des clients</li>
                <li>• Création de commandes</li>
                <li>• Suivi de production</li>
                <li>• Import Excel</li>
                <li>• Rapports de vente</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-purple-600">🛍️ Client</CardTitle>
              <CardDescription>
                Suivi de vos commandes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Création de commandes</li>
                <li>• Suivi en temps réel</li>
                <li>• Téléchargement documents</li>
                <li>• Communication commercial</li>
                <li>• Historique des commandes</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <div className="space-x-4">
            <Link href="/auth/login">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Se connecter
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="lg" variant="outline">
                S'inscrire (Client)
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
