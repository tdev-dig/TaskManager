'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { createClient } from '@/lib/supabase/client'
import { Plus, Pencil, Trash2 } from 'lucide-react'

type StockItem = {
  id: string
  nom: string
  quantite: number
  unite: string
  updated_at: string
}

export default function StockPage() {
  const [stock, setStock] = useState<StockItem[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<StockItem | null>(null)
  const [formData, setFormData] = useState({
    nom: '',
    quantite: 0,
    unite: '',
  })

  const supabase = createClient()

  const fetchStock = async () => {
    const { data } = await supabase
      .from('stock')
      .select('*')
      .order('nom', { ascending: true })
    
    setStock(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchStock()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (editingItem) {
      // Update
      await (supabase
        .from('stock') as any)
        .update({
          nom: formData.nom,
          quantite: formData.quantite,
          unite: formData.unite,
        })
        .eq('id', editingItem.id)
    } else {
      // Insert
      await (supabase.from('stock') as any).insert({
        nom: formData.nom,
        quantite: formData.quantite,
        unite: formData.unite,
      })
    }

    setOpen(false)
    setEditingItem(null)
    setFormData({ nom: '', quantite: 0, unite: '' })
    fetchStock()
  }

  const handleEdit = (item: StockItem) => {
    setEditingItem(item)
    setFormData({
      nom: item.nom,
      quantite: item.quantite,
      unite: item.unite,
    })
    setOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      await supabase.from('stock').delete().eq('id', id)
      fetchStock()
    }
  }

  const handleOpenChange = (open: boolean) => {
    setOpen(open)
    if (!open) {
      setEditingItem(null)
      setFormData({ nom: '', quantite: 0, unite: '' })
    }
  }

  if (loading) {
    return <div>Chargement...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion du stock</h1>
          <p className="text-gray-500 mt-1">Gérez vos matériaux et fournitures</p>
        </div>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un article
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Modifier l\'article' : 'Ajouter un article'}
              </DialogTitle>
              <DialogDescription>
                {editingItem
                  ? 'Modifiez les informations de l\'article'
                  : 'Ajoutez un nouvel article au stock'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom du matériau</Label>
                  <Input
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantite">Quantité</Label>
                  <Input
                    id="quantite"
                    type="number"
                    min="0"
                    value={formData.quantite}
                    onChange={(e) => setFormData({ ...formData, quantite: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unite">Unité</Label>
                  <Input
                    id="unite"
                    placeholder="ex: m², pièce, kg..."
                    value={formData.unite}
                    onChange={(e) => setFormData({ ...formData, unite: e.target.value })}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">
                  {editingItem ? 'Modifier' : 'Ajouter'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Articles en stock</CardTitle>
        </CardHeader>
        <CardContent>
          {stock.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Quantité</TableHead>
                    <TableHead>Unité</TableHead>
                    <TableHead>Dernière mise à jour</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stock.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.nom}</TableCell>
                      <TableCell>
                        <span className={item.quantite < 10 ? 'text-red-600 font-bold' : ''}>
                          {item.quantite}
                        </span>
                      </TableCell>
                      <TableCell>{item.unite}</TableCell>
                      <TableCell>
                        {new Date(item.updated_at).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(item)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Aucun article en stock</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
