'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react'
import * as XLSX from 'xlsx'

export default function ImportExcelPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    imported?: number
    errors?: string[]
  } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setResult(null)
    }
  }

  const handleImport = async () => {
    if (!file) return

    setLoading(true)
    setResult(null)

    try {
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data)
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet)

      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Non authentifié')

      const errors: string[] = []
      let imported = 0

      for (const row of jsonData) {
        try {
          // Validation des colonnes requises
          if (!row.reference || !row.client_id || !row.produit || !row.quantite || !row.date_livraison) {
            errors.push(`Ligne ignorée: données manquantes - ${JSON.stringify(row)}`)
            continue
          }

          // Vérifier si le client existe
          const { data: client } = await supabase
            .from('clients')
            .select('id')
            .eq('id', row.client_id)
            .single()

          if (!client) {
            errors.push(`Client non trouvé: ${row.client_id}`)
            continue
          }

          // Insérer la commande
          const { error } = await (supabase.from('commandes') as any).insert({
            reference: String(row.reference),
            client_id: String(row.client_id),
            commercial_id: user.id,
            produit: String(row.produit),
            quantite: parseInt(String(row.quantite)),
            statut: (row.statut || 'en_attente') as 'en_attente' | 'en_cours' | 'termine' | 'livre',
            date_livraison: String(row.date_livraison),
          })

          if (error) {
            errors.push(`Erreur pour ${row.reference}: ${error.message}`)
          } else {
            imported++
          }
        } catch (err: any) {
          errors.push(`Erreur: ${err.message}`)
        }
      }

      setResult({
        success: imported > 0,
        message: `Import terminé: ${imported} commande(s) importée(s)`,
        imported,
        errors: errors.length > 0 ? errors : undefined,
      })
    } catch (error: any) {
      setResult({
        success: false,
        message: `Erreur lors de l'import: ${error.message}`,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Import Excel</h1>
        <p className="text-gray-500 mt-1">Importez des commandes depuis un fichier Excel</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Importer un fichier</CardTitle>
            <CardDescription>
              Sélectionnez un fichier Excel (.xlsx, .xls) contenant vos commandes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file">Fichier Excel</Label>
              <Input
                id="file"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
              />
            </div>

            {file && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <FileSpreadsheet className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium">{file.name}</span>
              </div>
            )}

            <Button
              onClick={handleImport}
              disabled={!file || loading}
              className="w-full"
            >
              {loading ? (
                'Import en cours...'
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Importer
                </>
              )}
            </Button>

            {result && (
              <div
                className={`p-4 rounded-lg ${
                  result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}
              >
                <div className="flex items-start gap-2">
                  {result.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className={`font-medium ${result.success ? 'text-green-900' : 'text-red-900'}`}>
                      {result.message}
                    </p>
                    {result.errors && result.errors.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <p className="text-sm font-medium text-gray-700">Erreurs:</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {result.errors.slice(0, 5).map((error, i) => (
                            <li key={i}>• {error}</li>
                          ))}
                          {result.errors.length > 5 && (
                            <li>... et {result.errors.length - 5} autres erreurs</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Format attendu</CardTitle>
            <CardDescription>
              Votre fichier Excel doit contenir les colonnes suivantes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-sm mb-2">Colonnes obligatoires:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <strong>reference</strong>: Référence de la commande (texte unique)</li>
                  <li>• <strong>client_id</strong>: ID du client (UUID)</li>
                  <li>• <strong>produit</strong>: Description du produit PLV</li>
                  <li>• <strong>quantite</strong>: Quantité commandée (nombre)</li>
                  <li>• <strong>date_livraison</strong>: Date de livraison (YYYY-MM-DD)</li>
                </ul>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-sm mb-2">Colonnes optionnelles:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <strong>statut</strong>: en_attente, en_cours, termine, livre (défaut: en_attente)</li>
                </ul>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900">
                  <strong>💡 Astuce:</strong> Pour obtenir les IDs clients, consultez la liste des clients
                  dans la section correspondante.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
