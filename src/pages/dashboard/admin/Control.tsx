import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { ShieldCheck, AlertTriangle, Users, Briefcase, TrendingUp, Mail, Rss, FileText } from 'lucide-react';
import { useGetDashboardStatsQuery, useGetSystemActivityQuery } from '@/features/admin/adminApiService';
import { formatDistanceToNow } from 'date-fns';

const StatCard = ({ title, value, icon, isLoading }: { title: string, value: string | number, icon: React.ReactNode, isLoading: boolean }) => (
    <Card>
      <CardContent className="p-4">
        {isLoading ? <Skeleton className="h-12 w-full" /> : (
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">{icon}</div>
              <div>
                <div className="text-2xl font-bold text-foreground">{value}</div>
                <p className="text-xs text-muted-foreground">{title}</p>
              </div>
            </div>
        )}
      </CardContent>
    </Card>
);

const AdminControl = () => {
  const [systemAlert, setSystemAlert] = useState('');
  const { data: stats, isLoading: isLoadingStats } = useGetDashboardStatsQuery();
  const { data: activities, isLoading: isLoadingActivities } = useGetSystemActivityQuery(undefined, { pollingInterval: 30000 });

  const handleSendSystemAlert = () => {
    console.log('Sending system alert:', systemAlert);
    setSystemAlert('');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
            <CardTitle>Platform Control Panel</CardTitle>
            <CardDescription>An overview of platform metrics, recent activity, and system-wide communication tools.</CardDescription>
        </CardHeader>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total Users" value={stats?.totalUsers || 0} icon={<Users className="w-5 h-5 text-primary" />} isLoading={isLoadingStats} />
        <StatCard title="Total Jobs" value={stats?.totalJobs || 0} icon={<Briefcase className="w-5 h-5 text-primary" />} isLoading={isLoadingStats} />
        <StatCard title="Pending Jobs" value={stats?.pendingJobs || 0} icon={<AlertTriangle className="w-5 h-5 text-primary" />} isLoading={isLoadingStats} />
        <StatCard title="Total Applications" value={stats?.totalApplications || 0} icon={<FileText className="w-5 h-5 text-primary" />} isLoading={isLoadingStats} />
        <StatCard title="New Users (7 days)" value={stats?.newUsersLast7Days || 0} icon={<TrendingUp className="w-5 h-5 text-primary" />} isLoading={isLoadingStats} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Rss size={20}/>Recent System Activity</CardTitle>
            <CardDescription>A live feed of the latest platform events.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {isLoadingActivities ? <Skeleton className="h-48 w-full" /> : (
                    activities?.map((activity) => (
                      <div key={activity._id} className="flex items-start gap-3 p-3 bg-muted/40 rounded-lg">
                        <div className="p-2 bg-background rounded-full border"><ShieldCheck className="w-4 h-4 text-muted-foreground" /></div>
                        <div>
                          <p className="text-sm font-medium">{activity.message}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    ))
                )}
                {!isLoadingActivities && activities?.length === 0 && <p className="text-center text-muted-foreground py-8">No recent activity.</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Mail size={20}/>System Communications</CardTitle>
            <CardDescription>Send alerts and announcements to all users.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="systemAlert">System-wide Alert</Label>
              <Textarea id="systemAlert" placeholder="Enter a message to broadcast..." value={systemAlert} onChange={(e) => setSystemAlert(e.target.value)} rows={4}/>
            </div>
            <Button onClick={handleSendSystemAlert} disabled={!systemAlert.trim()} className="w-full">
              <Mail className="w-4 h-4 mr-2" />
              Send Alert to All Users
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminControl;