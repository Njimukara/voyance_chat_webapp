"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import ApiClient from "@/utils/axiosbase";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { CreditPackage } from "@/types/general";
import { LoadingLayout } from "@/components/ui/loading-layout";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Coins } from "lucide-react";

const fetchPlans = async () => {
  const response = await ApiClient.get("/api/plans/list");
  if (response.status !== 200) {
    throw new Error("Impossible de récupérer les plans");
  }
  return response.data.results;
};

const BuyCreditsPage: React.FC = () => {
  const {
    data: dataPlans,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["plans"],
    queryFn: fetchPlans,
    staleTime: 3 * 60 * 1000,
    retry: 2,
  });

  const { data: session } = useSession();
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(
    null
  );
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);
  const [customOrderId, setCustomOrderId] = useState(null);
  const [paypalOrderId, setPaypalOrderId] = useState(null);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { toast } = useToast();
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

      // console.log(response);
      setMessage(`Transaction complétée par ${session?.user?.name}`);
      setTimeout(() => {
        setSelectedPackage(null);
      }, 3000);
      setTimeout(() => {
        setMessage("");
      }, 3000);

      setTimeout(() => {
        router.push("/dashboard/chat");
      }, 3000);
      return response.data?.id || "";
    } catch (error: any) {
      const errorMessage =
        error.response?.data ||
        "Une erreur est survenue lors de l'achat des crédits. Veuillez réessayer plus tard.";
    }
  }

  interface MessageProps {
    content: string;
  }

  function Message({ content }: MessageProps) {
    return (
      <p className="md:text-md mt-4 py-5 text-center text-sm capitalize text-green-600 lg:text-lg">
        {content}
      </p>
    );
  }
  if (loading) {
    return <LoadingLayout />;
  }

  return (
    <div className="h-full px-4 py-6">
      <h1 className="mb-2 text-center text-2xl font-bold">
        Acheter des crédits
      </h1>
      <p className="mb-6 text-center text-gray-600">
        Sélectionnez un plan ci-dessous pour effectuer votre paiement.
      </p>

      <AnimatePresence mode="wait">
        {!selectedPackage ? (
          <motion.div
            key="package-selection"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="flex flex-wrap justify-center gap-6"
          >
            {dataPlans?.map((plan: CreditPackage) => (
              <Card
                key={plan.id}
                className={`w-[300px] flex flex-col justify-between shadow-lg transition-all`}
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

                <CardFooter className="flex justify-center p-4 border-t">
                  <Button
                    variant="default"
                    onClick={() => setSelectedPackage(plan)}
                    disabled={!!processingPlanId}
                  >
                    Sélectionner et payer
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="confirmation-section"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="mt-8 mx-auto max-w-lg rounded-lg border p-6 shadow-md"
          >
            <h2 className="text-center text-xl font-bold text-accent">
              Confirmer l'achat
            </h2>
            <p className="mt-2 text-center text-gray-400">
              Vous êtes sur le point d'acheter{" "}
              <strong>{selectedPackage.credit}</strong> crédits pour{" "}
              <strong>€{selectedPackage.amount}</strong>.
            </p>

            <div className="mt-6">
              <PayPalButtons
                style={{
                  layout: "vertical",
                  color: "blue",
                  shape: "rect",
                  label: "pay",
                  height: 40,
                }}
                createOrder={async (data, actions) =>
                  await createOrder(data, actions)
                }
                onApprove={onApprove}
                onError={() =>
                  toast({
                    title: "Erreur PayPal",
                    description: "Une erreur est survenue. Veuillez réessayer.",
                    variant: "destructive",
                  })
                }
                onCancel={() =>
                  toast({
                    title: "Paiement annulé",
                    description: "Votre achat a été annulé.",
                    variant: "destructive",
                  })
                }
              />
            </div>

            <Button
              type="button"
              variant="ghost"
              onClick={() => setSelectedPackage(null)}
              className="mt-4 w-full"
            >
              Annuler
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BuyCreditsPage;
