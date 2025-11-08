import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const CATEGORIES = {
  income: ["Salary", "Freelance", "Investment", "Business", "Other Income"],
  expense: ["Food", "Transport", "Housing", "Entertainment", "Healthcare", "Shopping", "Other Expense"],
};

interface TransactionDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  transaction?: {
    id: string;
    amount: number;
    type: string;
    category: string;
    date: string;
    description: string | null;
  } | null;
}

export const TransactionDialog = ({ open, onClose, onSuccess, transaction }: TransactionDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (transaction) {
      setType(transaction.type as "income" | "expense");
      setAmount(transaction.amount.toString());
      setCategory(transaction.category);
      setDate(transaction.date);
      setDescription(transaction.description || "");
    } else {
      setType("expense");
      setAmount("");
      setCategory("");
      setDate(new Date().toISOString().split("T")[0]);
      setDescription("");
    }
  }, [transaction, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const transactionData = {
        user_id: user.id,
        amount: parseFloat(amount),
        type,
        category,
        date,
        description: description || null,
      };

      if (transaction) {
        const { error } = await supabase
          .from("transactions")
          .update(transactionData)
          .eq("id", transaction.id);

        if (error) throw error;
        toast({
          title: "Transaction updated",
          description: "The transaction has been successfully updated.",
        });
      } else {
        const { error } = await supabase
          .from("transactions")
          .insert([transactionData]);

        if (error) throw error;
        toast({
          title: "Transaction added",
          description: "The transaction has been successfully added.",
        });
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{transaction ? "Edit Transaction" : "Add New Transaction"}</DialogTitle>
          <DialogDescription>
            {transaction ? "Update the transaction details below." : "Enter the transaction details below."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={(value: "income" | "expense") => {
              setType(value);
              setCategory("");
            }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES[type].map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Add a note about this transaction"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>{transaction ? "Update" : "Add"} Transaction</>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
