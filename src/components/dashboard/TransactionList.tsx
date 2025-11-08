import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit } from "lucide-react";
import { format } from "date-fns";
import { TransactionDialog } from "./TransactionDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  id: string;
  amount: number;
  type: string;
  category: string;
  date: string;
  description: string | null;
}

interface TransactionListProps {
  transactions: Transaction[];
  onUpdate: () => void;
}

export const TransactionList = ({ transactions, onUpdate }: TransactionListProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Transaction deleted",
        description: "The transaction has been successfully deleted.",
      });
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingTransaction(null);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Transactions</CardTitle>
          <Button onClick={() => setDialogOpen(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No transactions yet. Add your first transaction to get started!
              </p>
            ) : (
              transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={transaction.type === "income" ? "default" : "destructive"}
                        className={transaction.type === "income" ? "bg-success" : ""}
                      >
                        {transaction.category}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(transaction.date), "MMM dd, yyyy")}
                      </span>
                    </div>
                    {transaction.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {transaction.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-lg font-semibold ${
                        transaction.type === "income" ? "text-success" : "text-destructive"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}$
                      {transaction.amount.toFixed(2)}
                    </span>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(transaction)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(transaction.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <TransactionDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSuccess={onUpdate}
        transaction={editingTransaction}
      />
    </>
  );
};
