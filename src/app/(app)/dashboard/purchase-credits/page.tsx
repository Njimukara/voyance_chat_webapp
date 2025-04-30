"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// Removed RadioGroup components as they are no longer needed
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Label } from "@/components/ui/label";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Loader2, Coins } from "lucide-react"; // Added Coins icon
import { fetchPlans } from "@/services/plans";
import { usePlans } from "@/hooks/usePlans";
import { LoadingLayout } from "@/components/ui/loading-layout";
import { useSession } from "next-auth/react";
import { CreditPackage } from "@/types/general";
import ApiClient from "@/utils/axiosbase";
import { useRouter } from "next/navigation";
import axios from "axios";

// Replace with your actual PayPal Client ID
const PAYPAL_CLIENT_ID =
  process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "YOUR_PAYPAL_CLIENT_ID_HERE"; // Use environment variable

// Define credit plans (using credits instead of minutes)
interface CreditPlan {
  id: string;
  credit: number;
  amount: string;
  name: string;
}

export default function PurchaseCreditsPage() {
  const { data: session } = useSession();
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(
    null
  );
  const [customOrderId, setCustomOrderId] = useState(null);
  const [paypalOrderId, setPaypalOrderId] = useState(null);
  const [message, setMessage] = useState("");
  const [setError] = useState<string | null>(null);
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const { data: creditPlans, isLoading, error } = usePlans();

  async function createOrder(data: any, actions: any) {
    try {
      if (!selectedPackage) {
        return;
      }

      const payload = {
        user: session?.user?.id,
        plan_id: selectedPackage?.id,
      };

      try {
        const response = await ApiClient.post(
          "/api/plans/subscription/",
          payload
        );
        setCustomOrderId(response.data.id);
      } catch (backendError: any) {
        console.error("Backend API failed:", backendError);
        throw new Error(
          backendError.response?.data ||
            "Erreur lors de la création de la commande sur notre serveur"
        );
      }

      const order = await actions.order.create({
        purchase_units: [
          {
            amount: {
              currency_code: "EUR",
              value: selectedPackage?.amount,
            },
          },
        ],
      });
      setPaypalOrderId(order);
      return order;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.detail ||
          "Une erreur s'est produite lors de la création de la commande"
      );
    }
  }

  async function onApprove() {
    try {
      const payload = {
        user: session?.user?.id,
        plan_id: selectedPackage?.id,
        transaction_id: paypalOrderId,
      };

      const response = await ApiClient.post(
        `/api/plans/subscription/${customOrderId}/activate/`,
        payload
      );

      toast({
        title: "Transaction Réussie",
        description: `Transaction complétée par ${session?.user?.name}`,
        variant: "default",
      });
      setMessage(`Transaction complétée par ${session?.user?.name}`);
      toast({
        title: "Erreur Inattendue",
        description: `Transaction complétée par ${session?.user?.name}`,
        variant: "destructive",
      });
      setTimeout(() => {
        setSelectedPackage(null);
      }, 3000);
      setTimeout(() => {
        setMessage("");
      }, 3000);

      setTimeout(() => {
        router.push("/messages");
      }, 3000);
      return response.data?.id || "";
    } catch (error: any) {
      const errorMessage =
        error.response?.data ||
        "Une erreur est survenue lors de l'achat des crédits. Veuillez réessayer plus tard.";
      toast({
        title: "Erreur Inattendue",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }

  const onError = (planId: string, err: any) => {
    console.error(`Erreur PayPal pour le plan ${planId} :`, err);
    toast({
      title: "Erreur PayPal",
      description:
        "Une erreur s'est produite avec PayPal. Veuillez réessayer plus tard.",
      variant: "destructive",
    });
    setProcessingPlanId(null); // End loading state
  };

  const onCancel = (planId: string, data: any) => {
    console.log(`Paiement PayPal annulé pour le plan ${planId} :`, data);
    toast({
      title: "Paiement Annulé",
      description: "Votre achat a été annulé.",
      variant: "default",
    });
    setProcessingPlanId(null); // End loading state
  };

  if (!PAYPAL_CLIENT_ID || PAYPAL_CLIENT_ID === "YOUR_PAYPAL_CLIENT_ID_HERE") {
    return (
      <div className="p-4 md:p-6 flex justify-center items-center h-full">
        <Card className="max-w-md w-full shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-destructive">
              Erreur de Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              L'ID client PayPal est manquant. Veuillez le configurer dans vos
              variables d'environnement (
              <code>NEXT_PUBLIC_PAYPAL_CLIENT_ID</code>) pour activer les
              achats.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) return <LoadingLayout />;

  if (error) {
    const isNetworkError = axios.isAxiosError(error) && !error.response;

    return (
      <div className="p-4 md:p-6 flex justify-center items-center h-full">
        <Card className="max-w-md w-full shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-destructive">
              {isNetworkError ? "Erreur Réseau" : "Erreur de Chargement"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              {isNetworkError
                ? "Vérifiez votre connexion Internet et réessayez."
                : error?.message || "Impossible de charger les plans."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    // Add padding here since it was removed from the main layout element
    <div className="p-4 md:p-6 flex justify-center items-start md:items-center min-h-full">
      <PayPalScriptProvider
        options={{
          clientId: PAYPAL_CLIENT_ID,
          currency: "EUR",
          intent: "capture",
        }}
      >
        <div className="flex flex-wrap gap-6 justify-center p-4">
          {creditPlans?.map((plan: CreditPlan) => (
            <Card
              key={plan.id}
              className={`w-[300px] flex flex-col justify-between shadow-lg transition-all ${
                processingPlanId === plan.id
                  ? "opacity-50 pointer-events-none"
                  : ""
              }`}
            >
              <CardHeader>
                <CardTitle className="text-xl flex items-center justify-center gap-2">
                  <Coins className="h-6 w-6 text-primary" />
                  {plan.credit} Crédits
                </CardTitle>
                <CardDescription className="text-center">
                  {plan.name}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex flex-col items-center justify-center space-y-2">
                <span className="text-lg font-bold">€{plan.amount}</span>
              </CardContent>

              <CardFooter className="flex flex-col items-center p-4 border-t">
                {processingPlanId === plan.id ? (
                  <div className="flex flex-col items-center justify-center text-center p-2 space-y-1">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <p className="text-xs text-muted-foreground">
                      Traitement...
                    </p>
                  </div>
                ) : (
                  <PayPalButtons
                    key={plan.id}
                    style={{
                      layout: "vertical",
                      color: "blue",
                      shape: "rect",
                      label: "pay",
                      height: 40,
                    }}
                    createOrder={(data, actions) => createOrder(data, actions)}
                    onApprove={() => onApprove()}
                    onError={(err) => onError(plan.id, err)}
                    onCancel={(data) => onCancel(plan.id, data)}
                    disabled={!!processingPlanId}
                    forceReRender={[plan]}
                  />
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </PayPalScriptProvider>
    </div>
  );
}
