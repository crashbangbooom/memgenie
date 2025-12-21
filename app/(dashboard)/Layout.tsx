// app/(dashboard)/layout.tsx
'use client';
import { AppSidebar } from '@/components/app-sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Spinner } from '@/components/ui/spinner';
import { AppContext } from '@/utils/context';
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';

export default function Dashboard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const {
    context: { user },
  } = useContext(AppContext);

  // useEffect(() => {
  //   if (!user) return router.push('/auth/signin');
  //   if (user.isAdmin === false) {
  //     router.push('/');
  //   }
  // }, [user, router]);

  // if (!user) {
  //   return (
  //     <div className="flex h-screen items-center justify-center text-lg">
  //       <Spinner className="w-10 h-10" />
  //     </div>
  //   );
  // }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1">
                    MemGenie Assistant
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          {/* <div className="ml-auto px-3">
            <NavActions />
          </div> */}
        </header>
        <div className="flex flex-1 gap-4 p-4 border">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
