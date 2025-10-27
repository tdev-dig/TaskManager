'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'

export default function NouvelleCommandePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    produit: '',
    quantite: 1,
    date_livraison: '',
    description: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Récupérer le profil du client
    const { data: profile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', user.id)
      .single() as { data: { email: string } | null }

    if (!profile?.email) {
      alert('Profil introuvable.')
      setLoading(false)
      return
    }

    // Trouver le client correspondant
    const { data: client } = await supabase
      .from('clients')
      .select('id, commercial_id')
      .eq('contact', profile.email)
      .single() as { data: { id: string; commercial_id: string } | null }

    if (!client) {
      alert('Aucun client trouvé. Contactez votre commercial.')
      setLoading(false)
      return
    }

    // Générer une référence unique
    const reference = `CMD-${Date.now()}`

    // Créer la commande
    const { error } = await (supabase.from('commandes') as any).insert({
      reference,
      client_id: client.id,
      commercial_id: client.commercial_id,
      produit: formData.produit + (formData.description ? ` - ${formData.description}` : ''),
      quantite: formData.quantite,
      date_livraison: formData.date_livraison,
      statut: 'en_attente',
    })

    if (error) {
      alert('Erreur lors de la création: ' + error.message)
      setLoading(false)
      return
    }

    alert('Commande créée avec succès!')
    router.push('/dashboard/client')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Nouvelle commande</h1>
        <p className="text-gray-500 mt-1">Créez une nouvelle commande PLV</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Informations de la commande</CardTitle>
          <CardDescription>
            Remplissez les détails de votre commande
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="produit">Produit PLV *</Label>
              <Input
                id="produit"
                placeholder="Ex: Présentoir de comptoir, PLV vitrine..."
                value={formData.produit}
                onChange={(e) => setFormData({ ...formData, produit: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description détaillée</Label>
              <Textarea
                id="description"
                placeholder="Détails supplémentaires sur le produit..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantite">Quantité *</Label>
                <Input
                  id="quantite"
                  type="number"
                  min="1"
                  value={formData.quantite}
                  onChange={(e) => setFormData({ ...formData, quantite: parseInt(e.target.value) })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_livraison">Date de livraison souhaitée *</Label>
                <Input
                  id="date_livraison"
                  type="date"
                  value={formData.date_livraison}
                  onChange={(e) => setFormData({ ...formData, date_livraison: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Création...' : 'Créer la commande'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard/client')}
              >
                Annuler
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
