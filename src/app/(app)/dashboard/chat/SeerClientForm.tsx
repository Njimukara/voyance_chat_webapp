import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserDTO } from "@/types/general";
import { useToast } from "@/hooks/use-toast";
import ApiClient from "@/utils/axiosbase";

export function SeerClientForm({ client }: { client: UserDTO }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: client.name || "",
    email: client.email,
    sex: client.sex || "",
    customer_question: client.customer_question || "",
    soul_mate_birth_date: client.soul_mate_birth_date || "",
    concern: client.concern || "",
  });

  const { toast } = useToast();

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      soul_mate_birth_date: value,
    }));

    // Age validation logic after setting the birth date
    const birthDate = new Date(value);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    const day = today.getDate() - birthDate.getDate();

    if (age < 18 || (age === 18 && (month < 0 || (month === 0 && day < 0)))) {
      toast({
        title: "Âge Invalide",
        description: "Le partenaire doit avoir au moins 18 ans.",
        variant: "destructive",
      });
      setFormData((prevData) => ({
        ...prevData,
        soul_mate_birth_date: "", // Clear the field if invalid
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await ApiClient.post("chat/seer/customers", formData);
      if (
        !response.status.toString().startsWith("2") &&
        !response.status.toString().startsWith("3")
      ) {
        toast({
          title: "Erreur Inattendue",
          description:
            "Impossible de mettre à jour les informations du client.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur Inattendue",
        description:
          "Une erreur s’est produite lors de la mise à jour du client.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
    // Logic to update the client details
    console.log("Updated Client Data:", formData);
  };

  return (
    <Card className="w-80 border-l bg-card shrink-0 overflow-y-auto">
      <form onSubmit={handleSubmit}>
        <CardHeader className="p-4 border-b">
          <h2 className="text-lg font-semibold">Détails du Client</h2>
        </CardHeader>

        <CardContent className="p-4 space-y-3">
          <div>
            <label className="text-xs text-muted-foreground">Nom</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              readOnly
              className="w-full p-1 text-sm border rounded-md bg-background text-foreground focus:ring-2 focus:ring-accent focus:outline-none"
              placeholder="Nom du client"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Sexe</label>
            <select
              name="sex"
              value={formData.sex}
              onChange={handleInputChange}
              className="w-full p-1 text-sm border rounded-md bg-background text-foreground focus:ring-2 focus:ring-accent focus:outline-none"
            >
              <option value="">Sélectionner Sexe</option>{" "}
              <option value="1">Homme</option>
              <option value="2">Femme</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">
              Date de Naissance du Partenaire
            </label>
            <input
              type="date"
              name="soul_mate_birth_date"
              value={formData.soul_mate_birth_date}
              onChange={handleBirthDateChange}
              className="w-full p-1 text-sm border rounded-md bg-background text-foreground focus:ring-2 focus:ring-accent focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">
              Question du Client
            </label>
            <textarea
              name="customer_question"
              value={formData.customer_question}
              onChange={handleInputChange}
              className="w-full p-1 text-sm border rounded-md bg-background text-foreground focus:ring-2 focus:ring-accent focus:outline-none"
              placeholder="Décrire le problème du client"
              rows={3}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">
              Note du Client
            </label>
            <textarea
              name="concern"
              value={formData.concern}
              onChange={handleInputChange}
              className="w-full p-1 text-sm border rounded-md bg-background text-foreground focus:ring-2 focus:ring-accent focus:outline-none"
              placeholder="Ajouter des notes sur le client"
              rows={3}
            />
          </div>
        </CardContent>

        <div className="p-4 border-t flex justify-end">
          <Button
            type="submit"
            className="w-full py-2 bg-primary text-white rounded-md hover:bg-accent-dark transition"
          >
            Mettre à jour
          </Button>
        </div>
      </form>
    </Card>
  );
}
