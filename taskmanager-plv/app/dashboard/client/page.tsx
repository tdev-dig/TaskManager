import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Clock, CheckCircle, Truck } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function ClientDashboard() {
  const supabase = await createClient()
  const user = await getUser()

  if (!user) return null

  // Récupérer le client lié à cet utilisateur
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single() as { data: { email: string } | null }

  // Trouver le client par email (ou créer une relation appropriée)
  const { data: client } = await supabase
    .from('clients')
    .select('*')
    .eq('contact', profile?.email || '')
    .single() as { data: { id: string } | null }

  let commandes: any[] = []
  let stats = {
    total: 0,
    enAttente: 0,
    enCours: 0,
    terminees: 0,
  }

  if (client) {
    const { data: commandesData } = await supabase
      .from('commandes')
      .select('*')
      .eq('client_id', client.id)
      .order('created_at', { ascending: false })

    commandes = commandesData || []

    stats = {
      total: commandes.length,
      enAttente: commandes.filter((c) => c.statut === 'en_attente').length,
      enCours: commandes.filter((c) => c.statut === 'en_cours').length,
      terminees: commandes.filter((c) => c.statut === 'termine' || c.statut === 'livre').length,
    }
  }

  const getStatutBadge = (statut: string) => {
    const variants: any = {
      en_attente: { variant: 'secondary', label: 'En attente' },
      en_cours: { variant: 'default', label: 'En cours' },
      termine: { variant: 'outline', label: 'Terminé' },
      livre: { variant: 'default', label: 'Livré' },
    }
    return variants[statut] || { variant: 'secondary', label: statut }
  }

  const statsCards = [
    {
      title: 'Total commandes',
      value: stats.total,
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'En attente',
      value: stats.enAttente,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'En cours',
      value: stats.enCours,
      icon: Truck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Terminées',
      value: stats.terminees,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mes commandes</h1>
          <p className="text-gray-500 mt-1">Suivi de vos commandes PLV</p>
        </div>
        <Link href="/dashboard/client/nouvelle-commande">
          <Button>Nouvelle commande</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => {
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
          <CardTitle>Historique des commandes</CardTitle>
        </CardHeader>
        <CardContent>
          {commandes.length > 0 ? (
            <div className="space-y-4">
              {commandes.map((commande) => {
                const badge = getStatutBadge(commande.statut)
                return (
                  <div
                    key={commande.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{commande.reference}</p>
                      <p className="text-sm text-gray-500">{commande.produit}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm">Quantité: {commande.quantite}</p>
                        <p className="text-xs text-gray-500">
                          Livraison: {new Date(commande.date_livraison).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <Badge variant={badge.variant as any}>{badge.label}</Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Aucune commande pour le moment</p>
              <Link href="/dashboard/client/nouvelle-commande">
                <Button>Créer ma première commande</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
