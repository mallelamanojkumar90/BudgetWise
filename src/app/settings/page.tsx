"use client";

import { useState } from 'react';
import PageHeader from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function SettingsPage() {
  const { toast } = useToast();
  const [name, setName] = useState("User Name");
  const [email, setEmail] = useState("user@example.com");
  const [currency, setCurrency] = useState("USD");

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would save this data to a backend.
    console.log("Saving profile:", { name, email });
    toast({
      title: "Profile Saved",
      description: "Your profile information has been updated.",
    });
  };
  
  const handlePreferencesSave = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would save this data to a backend.
    console.log("Saving preferences:", { currency });
    toast({
      title: "Preferences Saved",
      description: "Your preferences have been updated.",
    });
  };

  return (
    <>
      <PageHeader 
        title="Settings"
        description="Manage your application settings and preferences."
      />
      <div className="space-y-8">
        <form onSubmit={handleProfileSave}>
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Update your personal information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>
              <Button type="submit">Save Profile</Button>
            </CardContent>
          </Card>
        </form>

        <form onSubmit={handlePreferencesSave}>
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Customize your app experience.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="space-y-1 max-w-xs">
                  <Label htmlFor="currency">Default Currency</Label>
                   <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - United States Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                      <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                      <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                      <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                 <div className="space-y-1">
                  <Label htmlFor="notifications">Notifications</Label>
                  <p className="text-sm text-muted-foreground">Manage notification settings (UI placeholder).</p>
                </div>
                <Button type="submit">Save Preferences</Button>
              </CardContent>
            </Card>
        </form>
        
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
