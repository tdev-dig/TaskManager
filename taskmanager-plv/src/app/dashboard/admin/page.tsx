'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { signOut } from '@/lib/auth'

interface DashboardStats {
  totalCommandes: number
  commandesEnAttente: number
  commandesEnCours: number
  commandesTerminees: number
  totalClients: number
  totalStock: number
}

interface Commande {
  id: string
  reference: string
  produit: string
  quantite: number
  statut: string
  date_livraison: string
  clients: { nom: string; entreprise: string }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCommandes: 0,
    commandesEnAttente: 0,
    commandesEnCours: 0,
    commandesTerminees: 0,
    totalClients: 0,
    totalStock: 0
  })
  const [recentCommandes, setRecentCommandes] = useState<Commande[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Charger les statistiques
      const [commandesRes, clientsRes, stockRes] = await Promise.all([
        supabase.from('commandes').select('statut'),
        supabase.from('clients').select('id'),
        supabase.from('stock').select('quantite')
      ])

      const commandes = commandesRes.data || []
      const clients = clientsRes.data || []
      const stock = stockRes.data || []

      const newStats = {
        totalCommandes: commandes.length,
        commandesEnAttente: commandes.filter(c => c.statut === 'en_attente').length,
        commandesEnCours: commandes.filter(c => c.statut === 'en_cours').length,
        commandesTerminees: commandes.filter(c => c.statut === 'termine' || c.statut === 'livre').length,
        totalClients: clients.length,
        totalStock: stock.reduce((sum, item) => sum + item.quantite, 0)
      }

      setStats(newStats)

      // Charger les commandes récentes
      const { data: commandesData } = await supabase
        .from('commandes')
        .select(`
          id,
          reference,
          produit,
          quantite,
          statut,
          date_livraison,
          clients (nom, entreprise)
        `)
        .order('created_at', { ascending: false })
        .limit(10)

      if (commandesData) {
        const formattedCommandes = commandesData.map(cmd => ({
          ...cmd,
          clients: Array.isArray(cmd.clients) ? cmd.clients[0] : cmd.clients
        })) as Commande[]
        setRecentCommandes(formattedCommandes)
      }
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
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
              <p className="text-gray-600">Gestion complète de l'entreprise PLV</p>
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
              <CardTitle className="text-sm font-medium">Total Commandes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCommandes}</div>
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

        {/* Commandes récentes */}
        <Card>
          <CardHeader>
            <CardTitle>Commandes Récentes</CardTitle>
            <CardDescription>
              Dernières commandes créées dans le système
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Référence</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Produit</TableHead>
                  <TableHead>Quantité</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date Livraison</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentCommandes.map((commande) => (
                  <TableRow key={commande.id}>
                    <TableCell className="font-medium">{commande.reference}</TableCell>
                    <TableCell>
                      {commande.clients.nom} ({commande.clients.entreprise})
                    </TableCell>
                    <TableCell>{commande.produit}</TableCell>
                    <TableCell>{commande.quantite}</TableCell>
                    <TableCell>{getStatutBadge(commande.statut)}</TableCell>
                    <TableCell>{new Date(commande.date_livraison).toLocaleDateString('fr-FR')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
