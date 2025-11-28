
"use client";

import { useState, useRef, useEffect } from 'react';
import PageHeader from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import JSZip from 'jszip';
import { useUser, useFirestore } from '@/firebase';
import { collection, query, getDocs } from 'firebase/firestore';
import type { Category, Expense, Budget } from '@/lib/types';
import { Loader2 } from 'lucide-react';


declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

type ExportFormat = 'json' | 'pdf' | 'csv';

export default function SettingsPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  
  const [name, setName] = useState("User Name"); // Placeholder
  const [email, setEmail] = useState(user?.email || "user@example.com");
  const [currency, setCurrency] = useState("INR");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('json');
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if(user?.displayName) setName(user.displayName);
    if(user?.email) setEmail(user.email);
  }, [user]);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would update the user profile in Firebase Auth
    toast({
      title: "Profile Saved",
      description: "Your profile information has been updated.",
    });
  };
  
  const handlePreferencesSave = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would save these preferences to Firestore
    toast({
      title: "Preferences Saved",
      description: "Your preferences have been updated.",
    });
  };
  
  const fetchAllData = async () => {
    if (!user || !firestore) return null;
    const categoriesQuery = query(collection(firestore, 'users', user.uid, 'categories'));
    const expensesQuery = query(collection(firestore, 'users', user.uid, 'expenses'));
    const budgetsQuery = query(collection(firestore, 'users', user.uid, 'budgets'));

    const [categoriesSnap, expensesSnap, budgetsSnap] = await Promise.all([
        getDocs(categoriesQuery),
        getDocs(expensesQuery),
        getDocs(budgetsQuery),
    ]);

    const categories = categoriesSnap.docs.map(d => ({id: d.id, ...d.data()})) as Category[];
    const expenses = expensesSnap.docs.map(d => {
        const data = d.data();
        return {id: d.id, ...data, date: (data.date as any).toDate() }
    }) as (Omit<Expense, 'date'> & { date: Date })[];
    const budgets = budgetsSnap.docs.map(d => ({id: d.id, ...d.data()})) as Budget[];
    
    return { categories, expenses, budgets };
  }

  const handleExport = async () => {
    setIsExporting(true);
    const data = await fetchAllData();
    if (!data) {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch data to export.' });
        setIsExporting(false);
        return;
    }

    if (exportFormat === 'json') {
      exportAsJson(data);
    } else if (exportFormat === 'pdf') {
      exportAsPdf(data);
    } else if (exportFormat === 'csv') {
      await exportAsCsv(data);
    }
    setIsExporting(false);
  };
  
  const exportAsJson = (data: any) => {
     const dataStr = JSON.stringify(data, (key, value) => {
        if (value instanceof Date) {
            return value.toISOString();
        }
        return value;
     }, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "budgetwise_data.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({
      title: "Data Exported",
      description: "Your data has been downloaded as budgetwise_data.json.",
    });
  };

   const exportAsPdf = (data: {categories: Category[], expenses: (Omit<Expense, 'date'> & { date: Date })[], budgets: Budget[]}) => {
    const doc = new jsPDF();
    
    doc.text("BudgetWise Data Export", 14, 16);
    doc.setFontSize(12);

    doc.autoTable({
      startY: 22,
      head: [['Categories']],
      theme: 'plain',
      styles: { fontStyle: 'bold' }
    });
    doc.autoTable({
      head: [['ID', 'Name', 'Icon']],
      body: data.categories.map(c => [c.id, c.name, c.iconName]),
    });

    doc.autoTable({
      head: [['Expenses']],
      theme: 'plain',
      styles: { fontStyle: 'bold' }
    });
    doc.autoTable({
      head: [['ID', 'Description', 'Amount', 'Category ID', 'Date']],
      body: data.expenses.map(e => [e.id, e.description, `₹${e.amount.toFixed(2)}`, e.categoryId, format(e.date, 'yyyy-MM-dd')]),
    });

    doc.autoTable({
      head: [['Budgets']],
      theme: 'plain',
      styles: { fontStyle: 'bold' }
    });
    doc.autoTable({
      head: [['ID', 'Category ID', 'Amount']],
      body: data.budgets.map(b => [b.id, b.categoryId, `₹${b.amount.toFixed(2)}`]),
    });

    doc.save('budgetwise_data.pdf');
    toast({
      title: "Data Exported",
      description: "Your data has been downloaded as budgetwise_data.pdf.",
    });
  };

  const exportAsCsv = async (data: {categories: Category[], expenses: (Omit<Expense, 'date'> & { date: Date })[], budgets: Budget[]}) => {
    const zip = new JSZip();

    const categoriesCsv = "id,name,iconName,userId\n" + data.categories.map(c => `${c.id},${c.name},${c.iconName},${c.userId}`).join("\n");
    zip.file("categories.csv", categoriesCsv);

    const expensesCsv = "id,description,amount,categoryId,date,userId\n" + data.expenses.map(e => `${e.id},"${e.description}",${e.amount},${e.categoryId},${format(e.date, 'yyyy-MM-dd')},${e.userId}`).join("\n");
    zip.file("expenses.csv", expensesCsv);

    const budgetsCsv = "id,categoryId,amount,userId\n" + data.budgets.map(b => `${b.id},${b.categoryId},${b.amount},${b.userId}`).join("\n");
    zip.file("budgets.csv", budgetsCsv);

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "budgetwise_data_csv.zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Data Exported",
      description: "Your data has been downloaded as budgetwise_data_csv.zip.",
    });
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        console.log("Imported data:", importedData);
        toast({
          title: "Data Import Successful",
          description: "Data logged to console. Import to Firestore not yet implemented.",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Import Failed",
          description: "The selected file is not valid JSON.",
        });
      }
    };
    reader.readAsText(file);

    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
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
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} disabled />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled />
                </div>
              </div>
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
                   <Select value={currency} onValueChange={(value) => setCurrency(value as "INR")}>
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
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex gap-2 items-center">
                    <Select value={exportFormat} onValueChange={(value) => setExportFormat(value as ExportFormat)}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="json">JSON</SelectItem>
                            <SelectItem value="pdf">PDF</SelectItem>
                            <SelectItem value="csv">CSV (zip)</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={handleExport} disabled={isExporting}>
                        {isExporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Export Data
                    </Button>
                </div>
                <Button variant="outline" onClick={handleImportClick}>Import Data from JSON</Button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="application/json"
                  onChange={handleFileChange}
                />
            </div>
             <p className="text-xs text-muted-foreground">
                Note: Import functionality is for demonstration and logs data to the console.
             </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
