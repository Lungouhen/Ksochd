import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { Role } from '@/types/domain';
import { Sidebar } from '@/components/admin/Sidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { SidebarProvider } from '@/components/admin/sidebar-context';
import { Toaster } from 'sonner';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session || session.role !== Role.ADMIN) {
    redirect('/login');
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-slate-950 text-slate-50">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto bg-slate-900/60 p-4 md:p-6">
            {children}
          </main>
        </div>
        <Toaster richColors theme="dark" />
      </div>
    </SidebarProvider>
  );
}
