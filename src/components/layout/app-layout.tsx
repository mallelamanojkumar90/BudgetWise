import type { ReactNode } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import SidebarNav from './sidebar-nav';
import { Button } from '@/components/ui/button';
import { Bell, UserCircle, Wallet } from 'lucide-react';
import Link from 'next/link';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen bg-background">
        <Sidebar collapsible="icon" className="border-r">
          <SidebarHeader className="p-4">
            <Link href="/dashboard" className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
                <Wallet className="h-7 w-7 text-primary" />
                <span className="font-semibold text-xl text-primary group-data-[collapsible=icon]:hidden">BudgetWise</span>
            </Link>
          </SidebarHeader>
          <SidebarContent className="p-2">
            <SidebarNav />
          </SidebarContent>
        </Sidebar>
        <div className="flex flex-col flex-1">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background/80 backdrop-blur-sm px-4 sm:px-6">
            {/* Desktop: Spacer or search. Mobile: Sidebar Trigger */}
            <div className="md:w-1/3">
              <SidebarTrigger className="md:hidden"/>
            </div>
            
            {/* Optional: Centered element like breadcrumbs or global search for larger screens */}
            {/* <div className="hidden md:flex md:w-1/3 justify-center">
              <Input placeholder="Search..." className="max-w-xs"/>
            </div> */}
            
            <div className="flex items-center gap-3 md:w-1/3 justify-end">
              <Button variant="ghost" size="icon" className="rounded-full text-foreground/70 hover:text-foreground">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full text-foreground/70 hover:text-foreground">
                <UserCircle className="h-6 w-6" />
                <span className="sr-only">User Profile</span>
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
