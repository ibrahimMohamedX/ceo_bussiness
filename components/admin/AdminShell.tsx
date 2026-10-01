'use client'

// Client shell frame for the admin. Holds the mobile-drawer state and lays out
// the sidebar rail + topbar + main outlet. Kept client-side so the drawer works
// without round-tripping through the server layout.

import { useState, type ReactNode } from 'react'

import { AdminSidebar } from './AdminSidebar'
import { AdminTopbar, type AdminIdentity } from './AdminTopbar'

export function AdminShell({ identity, children }: { identity: AdminIdentity; children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <div className="min-h-screen">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-h-screen flex-col lg:pl-[260px]">
        <AdminTopbar identity={identity} onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  )
}




