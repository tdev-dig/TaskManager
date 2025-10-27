import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default async function CommandesCommercialPage() {
  const supabase = await createClient()
  const user = await getUser()

  if (!user) return null

  const { data: commandes } = await supabase
    .from('commandes')
    .select(`
      *,
      clients (nom, entreprise)
    `)
    .eq('commercial_id', user.id)
    .order('created_at', { ascending: false })

  const getStatutBadge = (statut: string) => {
    const variants: any = {
      en_attente: { variant: 'secondary', label: 'En attente', className: 'bg-yellow-100 text-yellow-800' },
      en_cours: { variant: 'default', label: 'En cours', className: 'bg-blue-100 text-blue-800' },
      termine: { variant: 'outline', label: 'Terminé', className: 'bg-green-100 text-green-800' },
      livre: { variant: 'default', label: 'Livré', className: 'bg-purple-100 text-purple-800' },
    }
    return variants[statut] || { variant: 'secondary', label: statut, className: '' }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mes commandes</h1>
          <p className="text-gray-500 mt-1">Gestion de vos commandes clients</p>
        </div>
        <Link href="/dashboard/commercial/commandes/nouvelle">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle commande
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste de vos commandes</CardTitle>
        </CardHeader>
        <CardContent>
          {commandes && commandes.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Référence</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Produit</TableHead>
                    <TableHead>Quantité</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Livraison</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {commandes.map((commande: any) => {
                    const badge = getStatutBadge(commande.statut)
                    return (
                      <TableRow key={commande.id}>
                        <TableCell className="font-medium">{commande.reference}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{commande.clients?.entreprise}</p>
                            <p className="text-sm text-gray-500">{commande.clients?.nom}</p>
                          </div>
                        </TableCell>
                        <TableCell>{commande.produit}</TableCell>
                        <TableCell>{commande.quantite}</TableCell>
                        <TableCell>
                          <Badge className={badge.className}>{badge.label}</Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(commande.date_livraison).toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell>
                          <Link href={`/dashboard/commercial/commandes/${commande.id}`}>
                            <Button variant="outline" size="sm">
                              Gérer
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Aucune commande pour le moment</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
