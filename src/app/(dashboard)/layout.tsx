import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/deals" className="text-xl font-bold text-slate-900">
              Fair Play
            </Link>
            <nav className="flex items-center gap-6">
              <NavLink href="/deals">Deals</NavLink>
              <NavLink href="/contracts">Contracts</NavLink>
              <NavLink href="/compliance">Compliance</NavLink>
              <NavLink href="/profile">Profile</NavLink>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
    >
      {children}
    </Link>
  )
}
