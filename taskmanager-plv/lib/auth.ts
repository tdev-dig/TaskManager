import { createClient } from './supabase/server'

export async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export type UserProfile = {
  id: string
  role: 'admin' | 'commercial' | 'client'
  nom: string
  prenom: string
  email: string
  created_by: string | null
  created_at: string
}

export async function getUserProfile(): Promise<UserProfile | null> {
  const supabase = await createClient()
  const user = await getUser()
  
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile as UserProfile | null
}

export async function signIn(email: string, password: string) {
  const supabase = await createClient()
  return await supabase.auth.signInWithPassword({
    email,
    password,
  })
}

export async function signUp(email: string, password: string, metadata: {
  nom: string
  prenom: string
}) {
  const supabase = await createClient()
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata
    }
  })
}

export async function signOut() {
  const supabase = await createClient()
  return await supabase.auth.signOut()
}
