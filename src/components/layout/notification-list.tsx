"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const mockNotifications = [
    { id: 1, user: 'John Doe', message: 'added a new expense for "Groceries".', time: '5m ago', avatar: '/avatars/01.png' },
    { id: 2, user: 'System', message: 'Your "Utilities" budget is 90% utilized.', time: '1h ago', avatar: '/avatars/system.png' },
    { id: 3, user: 'Jane Smith', message: 'updated the "Transportation" budget.', time: '3h ago', avatar: '/avatars/02.png' },
    { id: 4, user: 'System', message: 'A new report for May 2024 is available.', time: '1d ago', avatar: '/avatars/system.png' },
];

export default function NotificationList() {
    return (
        <>
            {mockNotifications.map(notification => (
                <DropdownMenuItem key={notification.id} className="flex items-start gap-3 p-3 cursor-pointer">
                    <Avatar className="h-8 w-8">
                        {/* In a real app, you would use next/image */}
                        <AvatarImage src={`https://i.pravatar.cc/40?u=${notification.user}`} alt={notification.user} />
                        <AvatarFallback>{notification.user.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <p className="text-sm leading-snug text-wrap">
                            <span className="font-semibold">{notification.user}</span> {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                    </div>
                </DropdownMenuItem>
            ))}
        </>
    );
}
