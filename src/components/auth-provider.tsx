'use client';

import { useEffect, type ReactNode } from 'react';
import { useAuth, useUser, initiateAnonymousSignIn } from '@/firebase';
import AppLayout from '@/components/layout/app-layout';
import { Loader2 } from 'lucide-react';

interface AuthProviderProps {
    children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
    const auth = useAuth();
    const { user, isUserLoading } = useUser();
    
    useEffect(() => {
        if (!isUserLoading && !user) {
            initiateAnonymousSignIn(auth);
        }
    }, [isUserLoading, user, auth]);

    if (isUserLoading || !user) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return <AppLayout>{children}</AppLayout>;
}
