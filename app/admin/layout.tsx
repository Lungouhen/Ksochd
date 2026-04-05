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

  if (session.role !== Role.ADMIN) {
    redirect('/dashboard');
  }

  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen bg-slate-950 text-slate-50">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(13,148,136,0.12),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(250,204,21,0.08),transparent_25%)]" />
        <Sidebar />
        <div className="relative z-10 flex flex-1 flex-col">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
            <div className="mx-auto w-full max-w-6xl space-y-6">{children}</div>
          </main>
        </div>
        <Toaster richColors theme="dark" />
      </div>
    </SidebarProvider>
  );
}
