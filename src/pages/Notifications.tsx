import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Bell, BellRing, Check, X, Briefcase, MessageSquare, Loader2 } from 'lucide-react';
import { useGetMyNotificationsQuery, useMarkAllAsReadMutation, useMarkOneAsReadMutation } from '@/features/api/notificationApiService';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import TimeAgo from 'react-timeago';

const NotificationIcon = ({ message }: { message: string }) => {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('interview') || lowerMessage.includes('offer')) {
        return <Briefcase className="h-5 w-5" />;
    }
    if (lowerMessage.includes('message')) {
        return <MessageSquare className="h-5 w-5" />;
    }
    return <Bell className="h-5 w-5" />;
};

const Notifications = () => {
    const { t } = useTranslation();
    const { data: notifications = [], isLoading, isError } = useGetMyNotificationsQuery(undefined, { pollingInterval: 60000 });
    const [markAllAsRead] = useMarkAllAsReadMutation();
    const [markOneAsRead] = useMarkOneAsReadMutation();
    const [dismissed, setDismissed] = useState<string[]>([]);

    const activeNotifications = useMemo(() => notifications.filter(n => !dismissed.includes(n._id)), [notifications, dismissed]);
    const unreadCount = useMemo(() => activeNotifications.filter(n => !n.read).length, [activeNotifications]);

    const handleMarkAll = async () => {
        try {
            await markAllAsRead().unwrap();
            toast.success("All notifications marked as read.");
        } catch {
            toast.error("Failed to mark all as read.");
        }
    };

    const handleMarkOne = async (id: string) => {
        try {
            await markOneAsRead(id).unwrap();
        } catch {
            toast.error("Failed to mark as read.");
        }
    };
    
    const handleDismiss = (id: string) => {
        setDismissed(prev => [...prev, id]);
    };

    if (isLoading) {
        return <div className="p-8"><Skeleton className="h-96 w-full" /></div>;
    }
    if (isError) {
        return <div className="p-8 text-center text-red-500">Failed to load notifications. Please try again.</div>;
    }

  return (
    <div className="min-h-screen bg-page">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3"><BellRing className="h-8 w-8 text-primary" /><div><h1 className="text-3xl font-bold text-foreground">Notifications</h1><p className="text-muted-foreground">Stay updated with your latest activities</p></div></div>
                {unreadCount > 0 && (<Badge variant="destructive" className="text-lg px-3 py-1">{unreadCount} new</Badge>)}
            </div>
            {unreadCount > 0 && (<Button variant="secondary" onClick={handleMarkAll} className="ml-auto">Mark all as read</Button>)}
        </div>

        <div className="space-y-4">
          {activeNotifications.length > 0 ? activeNotifications.map((notification) => (
            <Card key={notification._id} className={`transition-all hover:shadow-md ${!notification.read ? 'ring-2 ring-primary/20 bg-primary/5' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-full bg-muted text-primary`}><NotificationIcon message={notification.message} /></div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <Link to={notification.link || '#'} className={`font-semibold hover:underline ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {notification.message}
                      </Link>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                        <span className="text-sm text-muted-foreground"><TimeAgo date={notification.createdAt} /></span>
                        {!notification.read && (<div className="w-3 h-3 bg-primary rounded-full" title="Unread"></div>)}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      {!notification.read && (<Button size="sm" variant="outline" onClick={() => handleMarkOne(notification._id)} className="flex items-center gap-1"><Check className="h-3 w-3" />Mark as read</Button>)}
                      <Button size="sm" variant="ghost" onClick={() => handleDismiss(notification._id)} className="flex items-center gap-1 text-muted-foreground"><X className="h-3 w-3" />Dismiss</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )) : (
             <Card>
                <CardContent className="p-12 text-center">
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No notifications</h3>
                    <p className="text-muted-foreground">You're all caught up! Check back later for updates.</p>
                </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;