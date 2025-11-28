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

// Extend the window interface for jspdf-autotable
declare global {
  interface Window {
    jsPDF: typeof jsPDF;
  }
}

interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}


export default function SettingsPage() {
  const { toast } = useToast();
  const [name, setName] = useState("User Name");
  const [email, setEmail] = useState("user@example.com");
  const [currency, setCurrency] = useState("USD");
  const [exportFormat, setExportFormat] = useState("json");
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    } else {
      exportAsPdf();
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
    const doc = new jsPDF() as jsPDFWithAutoTable;
    const pageTitle = "BudgetWise Data Export";
    const generatedDate = `Generated on: ${format(new Date(), 'PPP')}`;

    // Add title and date
    doc.setFontSize(18);
    doc.text(pageTitle, 14, 22);
    doc.setFontSize(11);
    doc.text(generatedDate, 14, 30);

    // Categories Table
    doc.setFontSize(14);
    doc.text("Categories", 14, 40);
    doc.autoTable({
      startY: 45,
      head: [['Name', 'Icon']],
      body: mockCategories.map(cat => [cat.name, cat.iconName]),
      theme: 'grid',
    });

    // Expenses Table
    let finalY = (doc as any).lastAutoTable.finalY || 50;
    doc.text("Expenses", 14, finalY + 10);
    doc.autoTable({
      startY: finalY + 15,
      head: [['Date', 'Description', 'Category', 'Amount']],
      body: mockExpenses
        .sort((a,b) => b.date.getTime() - a.date.getTime())
        .map(exp => {
        const categoryName = mockCategories.find(c => c.id === exp.categoryId)?.name || 'N/A';
        return [format(exp.date, 'yyyy-MM-dd'), exp.description, categoryName, `$${exp.amount.toFixed(2)}`];
      }),
      theme: 'grid',
    });
    
    // Budgets Table
    finalY = (doc as any).lastAutoTable.finalY;
    doc.text("Budgets", 14, finalY + 10);
    doc.autoTable({
      startY: finalY + 15,
      head: [['Category', 'Budgeted', 'Spent', 'Remaining']],
      body: mockBudgets.map(bud => {
        const remaining = bud.amount - bud.spentAmount;
        return [bud.categoryName, `$${bud.amount.toFixed(2)}`, `$${bud.spentAmount.toFixed(2)}`, `$${remaining.toFixed(2)}`];
      }),
      theme: 'grid',
    });

    doc.save("budgetwise_data.pdf");
    toast({
      title: "PDF Exported",
      description: "Your data has been downloaded as budgetwise_data.pdf.",
    });
  }

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
                    <Select value={exportFormat} onValueChange={setExportFormat}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Format" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="json">JSON</SelectItem>
                            <SelectItem value="pdf">PDF</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={handleExport}>Export Data</Button>
                </div>
                <Button variant="outline" onClick={handleImportClick}>Import Data</Button>
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
