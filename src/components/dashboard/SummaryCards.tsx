import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

interface SummaryCardsProps {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export const SummaryCards = ({ totalIncome, totalExpenses, balance }: SummaryCardsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            ${balance.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Current available balance
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          <TrendingUp className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-success">
            +${totalIncome.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            All time income
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <TrendingDown className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">
            -${totalExpenses.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            All time expenses
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
