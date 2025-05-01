"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ApiClient from "@/utils/axiosbase";
import { CreditPackage } from "@/types/general";

interface CustomizationOptions {
  additionalCredits: number;
  customMessage: string;
}

const CustomizePlan: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const planId = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const [selectedPlan, setSelectedPlan] = useState<CreditPackage | null>(null);
  const [customizationOptions, setCustomizationOptions] =
    useState<CustomizationOptions>({
      additionalCredits: 0,
      customMessage: "",
    });

  useEffect(() => {
    const fetchPlanDetails = async () => {
      if (
        !planId ||
        (typeof planId !== "string" && typeof planId !== "number")
      ) {
        return;
      }
      var intPlan = parseInt(planId as string, 10);

      try {
        const response = await ApiClient(`/api/plans/subscription/${intPlan}/`);
        setSelectedPlan(response.data);
      } catch (error) {
        // console.error("Impossible de récupérer les détails du plan:", error);
      }
    };

    fetchPlanDetails();
  }, [planId]);

  const handleSubmit = () => {
    router.push("/confirmation"); // Redirect to a confirmation page
  };

  if (!selectedPlan) return <p>Chargement...</p>;

  return (
    <div className="customize-plan-page">
      <h1 className="text-2xl font-bold">Confirmez votre plan</h1>
      <p className="mt-2 text-gray-600">Plan: {selectedPlan.name}</p>
      <p className="mt-1 text-gray-600">Crédits: {selectedPlan.credit}</p>
      <p className="mt-1 text-gray-600">Prix: ${selectedPlan.amount} EUR</p>

      <div className="mt-4">
        <label className="block text-sm font-medium">
          Crédits supplémentaires
        </label>
        <input
          type="number"
          value={customizationOptions.additionalCredits}
          onChange={(e) =>
            setCustomizationOptions({
              ...customizationOptions,
              additionalCredits: parseInt(e.target.value, 10) || 0,
            })
          }
          className="mt-1 w-full rounded-lg border px-3 py-2"
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium">
          Message personnalisé
        </label>
        <textarea
          value={customizationOptions.customMessage}
          onChange={(e) =>
            setCustomizationOptions({
              ...customizationOptions,
              customMessage: e.target.value,
            })
          }
          className="mt-1 w-full rounded-lg border px-3 py-2"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="mt-6 rounded-lg bg-blue-500 px-6 py-2 text-white transition hover:bg-blue-600"
      >
        Soumettre la personnalisation
      </button>
    </div>
  );
};

export default CustomizePlan;
