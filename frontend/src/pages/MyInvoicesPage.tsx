import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, IndianRupee } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function MyInvoicesPage() {
    const handleDownload = (id: string) => {
        toast.success(`Downloading invoice #${id}`);
    };

    return (
        <div className="container max-w-4xl mx-auto py-8 px-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="font-heading text-3xl font-bold tracking-tight">Billing & Invoices</h1>
                <p className="text-muted-foreground mt-2">View your subscription history and download invoices provided by your company admin.</p>
            </div>

            <div className="grid md:grid-cols-[1fr_300px] gap-6">
                <div className="space-y-6">
                    <Card className="shadow-sm border-0 border-t-4 border-t-primary">
                        <CardHeader className="pb-4">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <FileText className="w-5 h-5 text-primary" /> Invoice History
                            </h3>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Dummy User Data for layout validation - Will be dynamic later */}
                            {[
                                { id: "INV-202603-001", date: "March 1, 2026", amount: 149.00, status: "Paid" },
                                { id: "INV-202602-001", date: "February 1, 2026", amount: 149.00, status: "Paid" },
                                { id: "INV-202601-001", date: "January 1, 2026", amount: 149.00, status: "Paid" },
                            ].map((invoice) => (
                                <div key={invoice.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-muted/30 transition-colors gap-4">
                                    <div>
                                        <h4 className="font-bold text-foreground">Invoice #{invoice.id}</h4>
                                        <p className="text-sm text-muted-foreground">{invoice.date}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="font-bold text-base">₹{invoice.amount.toFixed(2)}</p>
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-800">
                                                {invoice.status}
                                            </span>
                                        </div>
                                        <Button variant="outline" size="icon" onClick={() => handleDownload(invoice.id)} className="shrink-0">
                                            <Download className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="shadow-sm border-0 bg-primary/5">
                        <CardHeader>
                            <CardTitle className="text-base font-heading flex items-center gap-2 text-primary">
                                <IndianRupee className="w-5 h-5" /> Current Plan
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Active Subscription</p>
                                    <p className="font-bold text-xl text-foreground">Monthly Standard</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Billed Amount</p>
                                    <p className="font-bold text-lg text-foreground">₹149.00 / month</p>
                                </div>
                                <div className="pt-4 border-t border-border">
                                    <p className="text-xs text-muted-foreground">
                                        Next billing date is <strong className="text-foreground">April 1, 2026</strong>.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
