export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: 'admin' | 'commercial' | 'client'
          nom: string
          prenom: string
          email: string
          created_by: string | null
          created_at: string
        }
        Insert: {
          id: string
          role: 'admin' | 'commercial' | 'client'
          nom: string
          prenom: string
          email: string
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          role?: 'admin' | 'commercial' | 'client'
          nom?: string
          prenom?: string
          email?: string
          created_by?: string | null
          created_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          nom: string
          entreprise: string
          commercial_id: string
          contact: string
          created_at: string
        }
        Insert: {
          id?: string
          nom: string
          entreprise: string
          commercial_id: string
          contact: string
          created_at?: string
        }
        Update: {
          id?: string
          nom?: string
          entreprise?: string
          commercial_id?: string
          contact?: string
          created_at?: string
        }
      }
      commandes: {
        Row: {
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
        Insert: {
          id?: string
          reference: string
          client_id: string
          commercial_id: string
          produit: string
          quantite: number
          statut?: 'en_attente' | 'en_cours' | 'termine' | 'livre'
          date_livraison: string
          created_at?: string
        }
        Update: {
          id?: string
          reference?: string
          client_id?: string
          commercial_id?: string
          produit?: string
          quantite?: number
          statut?: 'en_attente' | 'en_cours' | 'termine' | 'livre'
          date_livraison?: string
          created_at?: string
        }
      }
      stock: {
        Row: {
          id: string
          nom: string
          quantite: number
          unite: string
          updated_at: string
        }
        Insert: {
          id?: string
          nom: string
          quantite: number
          unite: string
          updated_at?: string
        }
        Update: {
          id?: string
          nom?: string
          quantite?: number
          unite?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
