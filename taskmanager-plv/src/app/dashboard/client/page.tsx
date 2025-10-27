'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { signOut } from '@/lib/auth'

interface DashboardStats {
  mesCommandes: number
  commandesEnAttente: number
  commandesEnCours: number
  commandesTerminees: number
}

interface Commande {
  id: string
  reference: string
  produit: string
  quantite: number
  statut: string
  date_livraison: string
  created_at: string
}

export default function ClientDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    mesCommandes: 0,
    commandesEnAttente: 0,
    commandesEnCours: 0,
    commandesTerminees: 0
  })
  const [mesCommandes, setMesCommandes] = useState<Commande[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Obtenir l'utilisateur actuel
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Trouver le client correspondant à l'utilisateur
      const { data: client } = await supabase
        .from('clients')
        .select('id')
        .eq('nom', user.user_metadata?.nom || '')
        .eq('contact', user.email)
        .single()

      if (!client) {
        setLoading(false)
        return
      }

      // Charger les commandes du client
      const { data: commandesData } = await supabase
        .from('commandes')
        .select('*')
        .eq('client_id', client.id)
        .order('created_at', { ascending: false })

      const commandes = commandesData || []

      const newStats = {
        mesCommandes: commandes.length,
        commandesEnAttente: commandes.filter(c => c.statut === 'en_attente').length,
        commandesEnCours: commandes.filter(c => c.statut === 'en_cours').length,
        commandesTerminees: commandes.filter(c => c.statut === 'termine' || c.statut === 'livre').length
      }

      setStats(newStats)
      setMesCommandes(commandes)
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatutBadge = (statut: string) => {
    const variants = {
      'en_attente': 'secondary',
      'en_cours': 'default',
      'termine': 'outline',
      'livre': 'outline'
    } as const

    return (
      <Badge variant={variants[statut as keyof typeof variants] || 'secondary'}>
        {statut.replace('_', ' ')}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mon Espace Client</h1>
              <p className="text-gray-600">Suivi de vos commandes PLV</p>
            </div>
            <Button onClick={signOut} variant="outline">
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mes Commandes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.mesCommandes}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.commandesEnAttente}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Cours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.commandesEnCours}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Terminées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.commandesTerminees}</div>
            </CardContent>
          </Card>
        </div>

        {/* Nouvelle commande */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Nouvelle Commande</CardTitle>
            <CardDescription>
              Créez une nouvelle commande PLV
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <p>Fonctionnalité de création de commande à implémenter</p>
              <Button className="mt-4" disabled>
                Créer une commande
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Mes commandes */}
        <Card>
          <CardHeader>
            <CardTitle>Mes Commandes</CardTitle>
            <CardDescription>
              Historique de toutes vos commandes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {mesCommandes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Aucune commande trouvée</p>
                <p className="text-sm mt-2">Contactez votre commercial pour créer votre première commande</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Référence</TableHead>
                    <TableHead>Produit</TableHead>
                    <TableHead>Quantité</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date Livraison</TableHead>
                    <TableHead>Date Commande</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mesCommandes.map((commande) => (
                    <TableRow key={commande.id}>
                      <TableCell className="font-medium">{commande.reference}</TableCell>
                      <TableCell>{commande.produit}</TableCell>
                      <TableCell>{commande.quantite}</TableCell>
                      <TableCell>{getStatutBadge(commande.statut)}</TableCell>
                      <TableCell>{new Date(commande.date_livraison).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell>{new Date(commande.created_at).toLocaleDateString('fr-FR')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
