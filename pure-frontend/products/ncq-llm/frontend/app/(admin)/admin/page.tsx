import { Metadata } from 'next'
import { Suspense } from 'react'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { DashboardHeader } from '@/components/admin/dashboard-header'
import { DashboardShell } from '@/components/admin/dashboard-shell'
import { DashboardStats } from '@/components/admin/dashboard-stats'
import { TenantOverview } from '@/components/admin/tenant-overview'
import { RecentActivity } from '@/components/admin/recent-activity'
import { SystemHealth } from '@/components/admin/system-health'
import { LoadingCard } from '@/components/ui/loading-card'

export const metadata: Metadata = {
  title: 'Admin Dashboard | NCQ LLM',
  description: 'Admin dashboard for managing the NCQ LLM platform',
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  if (!session || session.user?.role !== 'admin') {
    redirect('/login')
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Admin Dashboard"
        text="Manage tenants, monitor system health, and view analytics."
      />
      <div className="grid gap-8">
        <Suspense fallback={<LoadingCard />}>
          <DashboardStats />
        </Suspense>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4">
            <Suspense fallback={<LoadingCard />}>
              <TenantOverview />
            </Suspense>
          </div>
          <div className="col-span-3">
            <Suspense fallback={<LoadingCard />}>
              <SystemHealth />
            </Suspense>
          </div>
        </div>
        
        <Suspense fallback={<LoadingCard />}>
          <RecentActivity />
        </Suspense>
      </div>
    </DashboardShell>
  )
} 