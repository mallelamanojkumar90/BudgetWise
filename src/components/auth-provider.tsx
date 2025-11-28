'use client';

import { useEffect, type ReactNode } from 'react';
import { useAuth, useUser, initiateAnonymousSignIn } from '@/firebase';
import AppLayout from '@/components/layout/app-layout';
import { Loader2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

interface AuthProviderProps {
    children: ReactNode;
}

const publicRoutes = ['/login', '/register'];

export default function AuthProvider({ children }: AuthProviderProps) {
    const { user, isUserLoading } = useUser();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (isUserLoading) return; // Wait until user status is resolved

        const isPublicRoute = publicRoutes.includes(pathname);

        if (!user && !isPublicRoute) {
            router.push('/login');
        } else if (user && isPublicRoute) {
            router.push('/dashboard');
        }
    }, [isUserLoading, user, pathname, router]);

    if (isUserLoading) {
         return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }
    
    const isPublicRoute = publicRoutes.includes(pathname);
    if(isPublicRoute){
        return <>{children}</>;
    }


    if (!user) {
        // This is a temporary state while redirecting
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return <AppLayout>{children}</AppLayout>;
}
