import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

// Landing route for the console. Redirects straight to the overview section so
// /admin always resolves inside the guarded dashboard shell.
export default function AdminIndexPage() {
  redirect('/admin/overview')
}




