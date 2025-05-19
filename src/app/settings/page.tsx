import PageHeader from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
  return (
    <>
      <PageHeader 
        title="Settings"
        description="Manage your application settings and preferences."
      />
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Update your personal information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="User Name" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="user@example.com" />
              </div>
            </div>
            <Button>Save Profile</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Customize your app experience.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="currency">Default Currency</Label>
              <Input id="currency" defaultValue="USD" />
            </div>
             <div className="space-y-1">
              <Label htmlFor="notifications">Notifications</Label>
              <p className="text-sm text-muted-foreground">Manage notification settings (UI placeholder).</p>
            </div>
            <Button>Save Preferences</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>Export or import your financial data.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
                <Button variant="outline">Export Data</Button>
                <Button variant="outline">Import Data</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
