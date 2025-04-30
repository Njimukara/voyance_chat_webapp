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
  // Removed selectedPlan state as each plan has its own button
  // const [selectedPlan, setSelectedPlan] = useState<CreditPlan | null>(null);
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null); // Track which plan is being processed
  const { toast } = useToast();

  const { data: creditPlans, isLoading, error } = usePlans();
  // Removed handlePlanSelect function

  // PayPal Integration Functions - Adjusted to accept the specific plan
  const createOrder = (
    plan: CreditPlan | undefined,
    data: any,
    actions: any
  ) => {
    if (!plan) {
      toast({
        title: "Erreur",
        description: "Plan de crédit sélectionné invalide.",
        variant: "destructive",
      });
      return Promise.reject(new Error("Plan invalide"));
    }
    setProcessingPlanId(plan.id); // Start loading state for the specific plan
    console.log("Création de la commande PayPal pour :", plan);
    return actions.order.create({
      purchase_units: [
        {
          description: `Achat de ${plan.credit} crédits pour Voyance`,
          amount: {
            currency_code: "EUR", // Use Euro
            value: plan.amount,
          },
          // Add custom_id or sku to identify the plan on backend if needed
          // custom_id: plan.id,
          // sku: plan.id,
        },
      ],
      application_context: {
        shipping_preference: "NO_SHIPPING", // No physical shipping needed
      },
    });
  };

  const onApprove = async (
    plan: CreditPlan | undefined,
    data: any,
    actions: any
  ) => {
    if (!plan) {
      console.error("onApprove appelé sans plan valide.");
      setProcessingPlanId(null); // End loading state
      return; // Should not happen if createOrder succeeded
    }
    console.log("Commande PayPal approuvée, capture...", data);
    // Capture the transaction
    return actions.order
      .capture()
      .then((details: any) => {
        console.log(
          "Transaction complétée par " + details.payer.name.given_name
        );
        console.log("Détails de la commande :", details);
        // --- Backend Integration ---
        // Here you would typically:
        // 1. Send the `details` (especially `details.id` and the `plan.id` or quantity purchased) to your backend.
        // 2. Your backend verifies the transaction with PayPal using the order ID.
        // 3. If verification is successful, your backend updates the user's credit balance in your database based on the purchased plan (`plan.credits`).
        // 4. Optionally, send a confirmation email to the user.
        // --- End Backend Integration ---

        // Show success message to the user
        toast({
          title: "Achat Réussi !",
          description: `Vous avez acheté ${plan.credit} crédits avec succès. Votre solde sera mis à jour sous peu.`,
          variant: "default",
        });

        // Optionally, redirect or update UI state
        setProcessingPlanId(null); // End loading state for this plan
      })
      .catch((error: any) => {
        console.error("Échec de la capture PayPal :", error);
        toast({
          title: "Échec de l'Achat",
          description:
            "Un problème est survenu lors du traitement de votre paiement. Veuillez réessayer ou contacter le support.",
          variant: "destructive",
        });
        setProcessingPlanId(null); // End loading state
      });
  };

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
                    createOrder={(data, actions) =>
                      createOrder(plan, data, actions)
                    }
                    onApprove={(data, actions) =>
                      onApprove(plan, data, actions)
                    }
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
