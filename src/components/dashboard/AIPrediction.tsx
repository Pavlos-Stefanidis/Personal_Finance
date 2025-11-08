import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  amount: number;
  type: string;
  date: string;
}

interface AIPredictionProps {
  transactions: Transaction[];
}

export const AIPrediction = ({ transactions }: AIPredictionProps) => {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<string | null>(null);
  const { toast } = useToast();

  const generatePrediction = async () => {
    if (transactions.length === 0) {
      toast({
        title: "No data available",
        description: "Add some transactions first to generate predictions.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("financial-prediction", {
        body: { transactions },
      });

      if (error) throw error;

      setPrediction(data.prediction);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate prediction",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Financial Prediction
        </CardTitle>
        <CardDescription>
          Get AI-powered insights about your future financial trends
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!prediction ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">
              Generate predictions based on your transaction history
            </p>
            <Button onClick={generatePrediction} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Prediction
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{prediction}</p>
            </div>
            <Button onClick={generatePrediction} disabled={loading} variant="outline" className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Regenerating...
                </>
              ) : (
                "Regenerate Prediction"
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
