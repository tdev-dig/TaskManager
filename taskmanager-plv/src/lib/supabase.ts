import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Validation des URLs pour éviter les erreurs de build
const isValidUrl = (url: string) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

const finalUrl = isValidUrl(supabaseUrl) ? supabaseUrl : 'https://placeholder.supabase.co'
const finalKey = supabaseAnonKey.length > 10 ? supabaseAnonKey : 'placeholder-key'

export const supabase = createClient(finalUrl, finalKey)

// Types pour la base de données
export interface Profile {
  id: string
  role: 'admin' | 'commercial' | 'client'
  nom: string
  prenom: string
  email: string
  created_by?: string
  created_at: string
}

export interface Client {
  id: string
  nom: string
  entreprise: string
  commercial_id: string
  contact: string
  created_at: string
}

export interface Commande {
  id: string
  reference: string
  client_id: string
  commercial_id: string
  produit: string
  quantite: number
  statut: 'en_attente' | 'en_cours' | 'termine' | 'livre'
  date_livraison: string
  created_at: string
}

export interface Stock {
  id: string
  nom: string
  quantite: number
  unite: string
  updated_at: string
}
