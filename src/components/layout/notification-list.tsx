"use client";

import Link from 'next/link';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { query, collection, orderBy, doc, writeBatch } from 'firebase/firestore';
import type { Notification } from '@/lib/types';
import { DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, AlertCircle, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';


export default function NotificationList() {
    const { user } = useUser();
    const firestore = useFirestore();

    const notificationsQuery = useMemoFirebase(() => 
        user ? query(collection(firestore, 'users', user.uid, 'notifications'), orderBy('createdAt', 'desc')) : null,
        [firestore, user]
    );
    const { data: notifications } = useCollection<Notification>(notificationsQuery);

    const handleMarkAsRead = (notificationId: string) => {
        if (!user) return;
        const notifRef = doc(firestore, 'users', user.uid, 'notifications', notificationId);
        updateDocumentNonBlocking(notifRef, { read: true });
    };

    const handleClearRead = async () => {
        if (!user || !notifications) return;
        const batch = writeBatch(firestore);
        notifications.filter(n => n.read).forEach(n => {
            const notifRef = doc(firestore, 'users', user.uid, 'notifications', n.id);
            batch.delete(notifRef);
        });
        await batch.commit();
    };

    const unreadCount = notifications?.filter(n => !n.read).length || 0;
    const readCount = notifications?.filter(n => n.read).length || 0;

    const renderNotification = (notification: Notification) => {
         const Icon = notification.type === 'budget_warning' ? AlertCircle : Bell;
         const itemContent = (
             <div className="flex items-start gap-3 p-2">
                <Icon className={cn("h-5 w-5 mt-1 shrink-0", { "text-amber-500": notification.type === 'budget_warning' })} />
                <div className="flex flex-col">
                    <p className="text-sm leading-snug text-wrap">
                        {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(notification.createdAt.toDate(), { addSuffix: true })}
                    </p>
                </div>
             </div>
         );

        const Wrapper = notification.link ? Link : 'div';

        return (
            <DropdownMenuItem 
                key={notification.id} 
                className={cn("flex items-start gap-3 p-0 data-[focus]:bg-accent/50 cursor-pointer", !notification.read && "bg-accent/30")}
                onClick={() => !notification.read && handleMarkAsRead(notification.id)}
            >
                <Wrapper href={notification.link || '#'} className="w-full">
                    {itemContent}
                </Wrapper>
            </DropdownMenuItem>
        )
    }

    return (
        <>
            <DropdownMenuLabel className="flex justify-between items-center">
                <span>Notifications</span>
                {readCount > 0 && (
                    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={handleClearRead}>
                        Clear Read
                    </Button>
                )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ScrollArea className="h-[300px]">
                {notifications && notifications.length > 0 ? (
                    <>
                        {unreadCount > 0 && (
                           <>
                            <p className="text-xs font-medium text-muted-foreground px-3 py-1">Unread</p>
                            {notifications.filter(n => !n.read).map(renderNotification)}
                           </>
                        )}
                         {readCount > 0 && unreadCount > 0 && <DropdownMenuSeparator className="my-2" />}
                         {readCount > 0 && (
                           <>
                            <p className="text-xs font-medium text-muted-foreground px-3 py-1">Read</p>
                            {notifications.filter(n => n.read).map(renderNotification)}
                           </>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
                        <Check className="h-8 w-8 mb-2" />
                        <p className="text-sm font-medium">You're all caught up!</p>
                        <p className="text-xs">No new notifications.</p>
                    </div>
                )}
            </ScrollArea>
        </>
    );
}

    