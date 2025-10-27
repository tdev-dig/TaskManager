import { redirect } from 'next/navigation'

export default function ClientCommandesPage() {
  // Rediriger vers le dashboard principal qui affiche déjà les commandes
  redirect('/dashboard/client')
}
