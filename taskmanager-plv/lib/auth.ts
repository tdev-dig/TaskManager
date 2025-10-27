import { createClient } from './supabase/server'

export async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export type UserProfile = {
  id: string
  roles: ('admin' | 'commercial' | 'client')[]
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

// Utility functions for role management
export function hasRole(profile: UserProfile | null, role: 'admin' | 'commercial' | 'client'): boolean {
  return profile?.roles?.includes(role) ?? false
}

export function hasAnyRole(profile: UserProfile | null, roles: ('admin' | 'commercial' | 'client')[]): boolean {
  return profile?.roles?.some(role => roles.includes(role)) ?? false
}

export function isAdmin(profile: UserProfile | null): boolean {
  return hasRole(profile, 'admin')
}

export function isCommercial(profile: UserProfile | null): boolean {
  return hasRole(profile, 'commercial')
}

export function isClient(profile: UserProfile | null): boolean {
  return hasRole(profile, 'client')
}

export function canManageUsers(profile: UserProfile | null): boolean {
  return isAdmin(profile)
}

export function canManageClients(profile: UserProfile | null): boolean {
  return hasAnyRole(profile, ['admin', 'commercial'])
}

export function canManageOrders(profile: UserProfile | null): boolean {
  return hasAnyRole(profile, ['admin', 'commercial'])
}

export function canManageStock(profile: UserProfile | null): boolean {
  return isAdmin(profile)
}
