import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { ShoppingCart, Users, Package, TrendingUp } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Récupérer les statistiques
  const [
    { count: totalCommandes },
    { count: totalUsers },
    { count: totalStock },
    { data: recentCommandes },
  ] = await Promise.all([
    supabase.from('commandes').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('stock').select('*', { count: 'exact', head: true }),
    supabase
      .from('commandes')
      .select('*, clients(nom, entreprise)')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const stats = [
    {
      title: 'Total Commandes',
      value: totalCommandes || 0,
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Utilisateurs',
      value: totalUsers || 0,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Articles en Stock',
      value: totalStock || 0,
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Performance',
      value: '↑ 12%',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-500 mt-1">Vue d'ensemble de l'activité</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dernières commandes</CardTitle>
        </CardHeader>
        <CardContent>
          {recentCommandes && recentCommandes.length > 0 ? (
            <div className="space-y-4">
              {recentCommandes.map((commande: any) => (
                <div
                  key={commande.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{commande.reference}</p>
                    <p className="text-sm text-gray-500">
                      {commande.clients?.entreprise || 'N/A'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{commande.produit}</p>
                    <p className="text-xs text-gray-500">
                      Qté: {commande.quantite}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Aucune commande pour le moment
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
