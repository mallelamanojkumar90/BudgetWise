"use client";

import { useState, useRef } from 'react';
import PageHeader from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockBudgets, mockCategories, mockExpenses } from '@/lib/data';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import JSZip from 'jszip';


declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

type ExportFormat = 'json' | 'pdf' | 'csv';

export default function SettingsPage() {
  const { toast } = useToast();
  const [name, setName] = useState("User Name");
  const [email, setEmail] = useState("user@example.com");
  const [currency, setCurrency] = useState("USD");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('json');

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving profile:", { name, email });
    toast({
      title: "Profile Saved",
      description: "Your profile information has been updated.",
    });
  };
  
  const handlePreferencesSave = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving preferences:", { currency });
    toast({
      title: "Preferences Saved",
      description: "Your preferences have been updated.",
    });
  };

  const handleExport = () => {
    if (exportFormat === 'json') {
      exportAsJson();
    } else if (exportFormat === 'pdf') {
      exportAsPdf();
    } else if (exportFormat === 'csv') {
      exportAsCsv();
    }
  };

  const exportAsJson = () => {
     const dataToExport = {
      categories: mockCategories,
      expenses: mockExpenses,
      budgets: mockBudgets,
    };
    const dataStr = JSON.stringify(dataToExport, null, 2);
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

   const exportAsPdf = () => {
    const doc = new jsPDF();
    
    // Title
    doc.text("BudgetWise Data Export", 14, 16);
    doc.setFontSize(12);

    // Categories
    doc.autoTable({
      startY: 22,
      head: [['Categories']],
      body: [[]],
      theme: 'plain',
      styles: { fontStyle: 'bold' }
    });
    doc.autoTable({
      head: [['ID', 'Name', 'Icon']],
      body: mockCategories.map(c => [c.id, c.name, c.iconName]),
    });

    // Expenses
    doc.autoTable({
      head: [['Expenses']],
      body: [[]],
      theme: 'plain',
      styles: { fontStyle: 'bold' }
    });
    doc.autoTable({
      head: [['ID', 'Description', 'Amount', 'Category ID', 'Date']],
      body: mockExpenses.map(e => [e.id, e.description, `$${e.amount.toFixed(2)}`, e.categoryId, format(e.date, 'yyyy-MM-dd')]),
    });

    // Budgets
     doc.autoTable({
      head: [['Budgets']],
      body: [[]],
      theme: 'plain',
      styles: { fontStyle: 'bold' }
    });
    doc.autoTable({
      head: [['ID', 'Category', 'Budgeted', 'Spent', 'Period']],
      body: mockBudgets.map(b => [b.id, b.categoryName, `$${b.amount.toFixed(2)}`, `$${b.spentAmount.toFixed(2)}`, b.period]),
    });

    doc.save('budgetwise_data.pdf');
    toast({
      title: "Data Exported",
      description: "Your data has been downloaded as budgetwise_data.pdf.",
    });
  };

  const exportAsCsv = async () => {
    const zip = new JSZip();

    // Categories
    const categoriesCsv = "id,name,iconName\n" + mockCategories.map(c => `${c.id},${c.name},${c.iconName}`).join("\n");
    zip.file("categories.csv", categoriesCsv);

    // Expenses
    const expensesCsv = "id,description,amount,categoryId,date\n" + mockExpenses.map(e => `${e.id},"${e.description}",${e.amount},${e.categoryId},${format(e.date, 'yyyy-MM-dd')}`).join("\n");
    zip.file("expenses.csv", expensesCsv);

    // Budgets
    const budgetsCsv = "id,categoryId,categoryName,amount,spentAmount,period\n" + mockBudgets.map(b => `${b.id},${b.categoryId},${b.categoryName},${b.amount},${b.spentAmount},${b.period}`).join("\n");
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
        // Here you would typically validate and update your application state
        // For this demo, we'll just log it and show a toast.
        console.log("Imported data:", importedData);
        toast({
          title: "Data Import Successful",
          description: "Your data has been imported. (See console for details)",
        });
      } catch (error) {
        console.error("Failed to parse JSON:", error);
        toast({
          variant: "destructive",
          title: "Import Failed",
          description: "The selected file is not valid JSON.",
        });
      }
    };
    reader.readAsText(file);

    // Reset file input
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
                    <Button variant="outline" onClick={handleExport}>Export Data</Button>
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
          </CardContent>
        </Card>
      </div>
    </>
  );
}
