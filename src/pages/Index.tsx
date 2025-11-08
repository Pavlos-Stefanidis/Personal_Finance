import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthForm } from "@/components/AuthForm";
import { DashboardLayout } from "@/components/DashboardLayout";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { TransactionList } from "@/components/dashboard/TransactionList";
import { SpendingChart } from "@/components/dashboard/SpendingChart";
import { AIPrediction } from "@/components/dashboard/AIPrediction";
import { Skeleton } from "@/components/ui/skeleton";

interface Transaction {
  id: string;
  amount: number;
  type: string;
  category: string;
  date: string;
  description: string | null;
}

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const calculateTotals = () => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-secondary/10">
        <div className="space-y-4">
          <Skeleton className="h-12 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  const { totalIncome, totalExpenses, balance } = calculateTotals();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Financial Overview</h2>
          <p className="text-muted-foreground">
            Track your income, expenses, and get AI-powered predictions
          </p>
        </div>

        <SummaryCards
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          balance={balance}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <SpendingChart transactions={transactions} />
          <AIPrediction transactions={transactions} />
        </div>

        <TransactionList transactions={transactions} onUpdate={fetchTransactions} />
      </div>
    </DashboardLayout>
  );
};

export default Index;
