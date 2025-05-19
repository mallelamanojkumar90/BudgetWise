'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Receipt,
  Tags,
  Goal,
  BarChart3,
  Settings,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/expenses', label: 'Expenses', icon: Receipt },
  { href: '/categories', label: 'Categories', icon: Tags },
  { href: '/budgets', label: 'Budgets', icon: Goal },
  { href: '/reports', label: 'Reports', icon: BarChart3 },
];

const bottomNavItems = [
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      <SidebarMenu className="flex-1">
        {navItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))}
              tooltip={{ children: item.label, className: "bg-sidebar text-sidebar-foreground border-sidebar-border" }}
              className={cn(
                "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                (pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))) && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 hover:text-sidebar-primary-foreground"
              )}
            >
              <Link href={item.href}>
                <item.icon />
                <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      <SidebarMenu className="mt-auto">
        {bottomNavItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith(item.href)}
              tooltip={{ children: item.label, className: "bg-sidebar text-sidebar-foreground border-sidebar-border" }}
               className={cn(
                "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                (pathname === item.href || pathname.startsWith(item.href)) && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 hover:text-sidebar-primary-foreground"
              )}
            >
              <Link href={item.href}>
                <item.icon />
                <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </div>
  );
}
