
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export function ContactForm() {
  const { toast } = useToast();

  // Placeholder function for form submission, now inside a Client Component
  const handleContactSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // In a real app, you'd collect form data and send it to an API endpoint
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log('Formulaire de contact soumis:', data);

    // Show a success message using toast
    toast({
      title: "Message Envoyé !",
      description: "Merci pour votre message. Nous vous répondrons bientôt.",
    });

    event.currentTarget.reset(); // Reset the form
  };

  return (
    <form className="space-y-4" onSubmit={handleContactSubmit}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="first-name">Prénom</Label>
          <Input id="first-name" name="firstName" placeholder="Entrez votre prénom" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last-name">Nom de famille</Label>
          <Input id="last-name" name="lastName" placeholder="Entrez votre nom de famille" required />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="Entrez votre email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject">Sujet</Label>
        <Input id="subject" name="subject" placeholder="Concernant..." required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" placeholder="Entrez votre message" required className="min-h-[120px]" />
      </div>
      <Button type="submit" className="w-full sm:w-auto">Envoyer le Message</Button>
    </form>
  );
}
