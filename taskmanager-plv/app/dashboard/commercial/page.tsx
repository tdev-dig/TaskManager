import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth'
import { ShoppingCart, Users, CheckCircle, Clock } from 'lucide-react'

export default async function CommercialDashboard() {
  const supabase = await createClient()
  const user = await getUser()

  if (!user) return null

  // Récupérer les statistiques du commercial
  const [
    { count: totalCommandes },
    { count: totalClients },
    { count: commandesTerminees },
    { count: commandesEnCours },
    { data: recentCommandes },
  ] = await Promise.all([
    supabase
      .from('commandes')
      .select('*', { count: 'exact', head: true })
      .eq('commercial_id', user.id),
    supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .eq('commercial_id', user.id),
    supabase
      .from('commandes')
      .select('*', { count: 'exact', head: true })
      .eq('commercial_id', user.id)
      .eq('statut', 'termine'),
    supabase
      .from('commandes')
      .select('*', { count: 'exact', head: true })
      .eq('commercial_id', user.id)
      .eq('statut', 'en_cours'),
    supabase
      .from('commandes')
      .select('*, clients(nom, entreprise)')
      .eq('commercial_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const stats = [
    {
      title: 'Mes Commandes',
      value: totalCommandes || 0,
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Mes Clients',
      value: totalClients || 0,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'En cours',
      value: commandesEnCours || 0,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Terminées',
      value: commandesTerminees || 0,
      icon: CheckCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mon tableau de bord</h1>
        <p className="text-gray-500 mt-1">Vue d'ensemble de mon activité</p>
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
          <CardTitle>Mes dernières commandes</CardTitle>
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
