"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import emailjs from "@emailjs/browser";

export function ContactForm() {
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userEmail: "",
    message: "",
  });
  const [isSending, setIsSending] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (errorMessage) {
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [errorMessage]);

  useEffect(() => {
    if (successMessage) {
      toast({
        title: "Succès",
        description: successMessage,
      });
    }
  }, [successMessage]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSending(true);
    setIsSubmitted(false);
    setErrorMessage(null);
    setSuccessMessage(null);

    const service_id = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const template_id = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const public_key = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!service_id || !template_id || !public_key) {
      setIsSending(false);
      setErrorMessage("Configuration EmailJS manquante.");
      toast({
        title: "Erreur",
        description: "Configuration EmailJS manquante.",
        variant: "destructive",
      });
      return;
    }

    const emailData = {
      userName: `${formData.firstName} ${formData.lastName}`,
      userEmail: formData.userEmail,
      message: formData.message,
    };

    emailjs
      .send(service_id, template_id, emailData, { publicKey: public_key })
      .then(() => {
        setIsSending(false);
        setIsSubmitted(true);
        setSuccessMessage("Message envoyé avec succès !");
        setFormData({
          firstName: "",
          lastName: "",
          userEmail: "",
          message: "",
        });
        toast({
          title: "Succès",
          description: "Message envoyé avec succès !",
        });
      })
      .catch(() => {
        setIsSending(false);
        setErrorMessage("Une erreur est survenue.");
        toast({
          title: "Erreur",
          description: "Une erreur est survenue. Veuillez réessayer.",
          variant: "destructive",
        });
      });
  };

  return (
    <form className="space-y-4" onSubmit={(e) => handleSubmit(e)}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom</Label>
          <Input
            id="firstName"
            name="firstName"
            placeholder="Entrez votre prénom"
            required
            value={formData.firstName}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Nom de famille</Label>
          <Input
            id="lastName"
            name="lastName"
            placeholder="Entrez votre nom"
            required
            value={formData.lastName}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="userEmail">Email</Label>
        <Input
          id="userEmail"
          name="userEmail"
          type="email"
          placeholder="Entrez votre email"
          required
          value={formData.userEmail}
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Entrez votre message"
          required
          className="min-h-[120px]"
          value={formData.message}
          onChange={handleInputChange}
        />
      </div>

      <Button type="submit" className="w-full sm:w-auto" disabled={isSending}>
        {isSending ? "Envoi..." : "Envoyer le Message"}
      </Button>

      {successMessage && <p className="text-green-600">{successMessage}</p>}
      {errorMessage && <p className="text-red-600">{errorMessage}</p>}
    </form>
  );
}
