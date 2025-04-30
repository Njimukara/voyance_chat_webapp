
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2 } from 'lucide-react'; // Import Loader2
import { signIn } from 'next-auth/react'; // Import signIn for Google
import { Checkbox } from '@/components/ui/checkbox'; // Import Checkbox
import { useToast } from '@/hooks/use-toast'; // Import useToast

// Define API URL (replace with environment variable in production)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';


const registerSchema = z.object({
  firstName: z.string().min(1, { message: 'Le prénom est requis.' }),
  lastName: z.string().min(1, { message: 'Le nom de famille est requis.' }),
  email: z.string().email({ message: 'Adresse email invalide.' }),
  password: z.string().min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères.' }),
  ageConfirmation: z.boolean().refine(value => value === true, {
      message: 'Vous devez confirmer que vous avez plus de 18 ans.',
  }), // Add age confirmation
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();


  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      ageConfirmation: false, // Default to false
    },
  });

   const onSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);
    console.log('Formulaire d\'inscription soumis pour API :', values);

    const registrationData = {
        name: `${values.firstName} ${values.lastName}`, // Combine names
        email: values.email,
        password: values.password,
        role: 'client', // Default role
        ageConfirmation: values.ageConfirmation,
    };

    try {
      // --- Actual user registration API call ---
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(registrationData),
      });

      if (response.ok) {
         console.log('Inscription réussie via API, redirection vers la connexion.');
         toast({
             title: 'Inscription Réussie !',
             description: 'Votre compte a été créé. Veuillez vous connecter.',
             variant: 'default',
         });
         // Redirect to login page after successful registration, passing email
         router.push(`/login?email=${encodeURIComponent(values.email)}`);
       } else {
          // Handle API errors
          const errorData = await response.json();
          const errorMessage = errorData.message || `Erreur ${response.status}: Échec de l'inscription.`;
          setError(errorMessage);
          console.error('Échec de l\'inscription API:', errorMessage);
           toast({
             title: 'Échec de l\'inscription',
             description: errorMessage,
             variant: 'destructive',
           });
       }
       // --- End API Call ---

    } catch (err: any) { // Catch network or other fetch errors
      console.error('Échec de l\'appel API d\'inscription :', err);
      const fetchError = err instanceof Error ? err.message : 'Une erreur réseau ou inattendue s\'est produite.';
      setError(fetchError);
      toast({
         title: 'Erreur Réseau',
         description: fetchError,
         variant: 'destructive',
      });
    } finally {
       setIsLoading(false);
    }
  };

  // Handle Google Sign-Up (remains the same)
   const handleGoogleSignUp = async () => {
      setIsLoading(true);
      setError(null);
      console.log('Tentative d\'inscription/connexion Google...');
      try {
         await signIn('google', { callbackUrl: '/dashboard' }); // Redirect to dashboard after signup/login
      } catch (err) {
         console.error('Échec de l\'inscription/connexion Google :', err);
         setError('Impossible de s\'inscrire/se connecter avec Google. Veuillez réessayer.');
         setIsLoading(false); // Only set loading false on error for OAuth
          toast({
             title: 'Échec de la connexion Google',
             description: 'Une erreur s\'est produite lors de la tentative avec Google.',
             variant: 'destructive',
          });
      }
   };


  return (
    <Card className="w-full max-w-sm mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-center">S'inscrire</CardTitle>
        <CardDescription className="text-center">
          Entrez vos informations pour créer un compte
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
            <div className="mb-4 p-3 rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-sm text-center">
              {error}
            </div>
          )}
       <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
             <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <Input placeholder="Max" {...field} disabled={isLoading}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de famille</FormLabel>
                    <FormControl>
                      <Input placeholder="Robinson" {...field} disabled={isLoading}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </div>
           <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="m@example.com"
                      {...field}
                      type="email"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} disabled={isLoading}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Age Confirmation Checkbox */}
            <FormField
              control={form.control}
              name="ageConfirmation"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-border/50 p-4 shadow-sm bg-card">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                      aria-label="Confirmer l'âge" // French label
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="cursor-pointer">
                      Confirmer que vous avez 18 ans ou plus
                    </FormLabel>
                    <FormDescription>
                     Vous devez avoir au moins 18 ans pour utiliser ce service.
                    </FormDescription>
                    <FormMessage /> {/* Show validation error here */}
                  </div>
                </FormItem>
              )}
            />

          <Button type="submit" className="w-full" disabled={isLoading}>
             {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
             {isLoading ? 'Création du compte...' : 'Créer un compte'}
          </Button>
           {/* Google Sign Up Button */}
           <Button
              variant="outline"
              className="w-full"
              type="button"
              onClick={handleGoogleSignUp}
              disabled={isLoading}
            >
             {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
             S'inscrire avec Google
           </Button>
        </form>
       </Form>
        <div className="mt-4 text-center text-sm">
          Vous avez déjà un compte ?{' '}
          <Link href="/login" className="underline text-accent hover:text-accent/80">
            Se connecter
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
