# **App Name**: MysticConnect

## Core Features:

- User Authentication: Authentication pages for user login and registration, integrated with NextAuth or custom credentials.
- Dashboard Layout: Dashboard layout featuring a header and sidebar for navigation after successful login.
- Real-time Chat: Real-time chat interface using Socket.IO for direct communication between users and psychics.

## Style Guidelines:

- Primary colors: Soft purples and midnight blues for a calming, mystical feel.
- Secondary colors: Dusty rose and gentle gradients to add warmth and depth.
- Accent: Teal (#008080) for interactive elements and highlights.
- Use a modular and responsive layout with clear sections for easy navigation.
- Incorporate subtle animations and transitions using Tailwind and Framer Motion.
- Use minimalistic and elegant icons related to psychic themes.

## Original User Request:
Generate a full-stack Next.js 14 application for a psychic platform using the App Router.

Requirements:
Styling: Use Tailwind CSS with engaging but not overly bright colors (e.g., soft purples, midnight blues, dusty rose, gentle gradients).

Authentication:

Include login and registration pages.

Use NextAuth or a custom credentials provider.

Home Page:

Display a marketing-style homepage that introduces users to the platform with a hero section, feature highlights, and CTAs.

Post-Login Dashboard:

After signing in, the user is redirected to a dashboard layout.

Dashboard layout includes a Header and a Sidebar.

Sidebar navigation includes:

Real-time Chat

Seer Profiles

Purchase/Orders

Real-time Chat:

Implement real-time communication using Socket.IO.

Create a simple chat interface where users can talk with psychics.

Backend Communication:

Communicate with a Node.js backend using REST API for things like authentication, retrieving seer profiles, and managing purchases.

File Organization:

Use modular folder structure under /app for routes.

Have separate layouts for marketing (unauthenticated) and dashboard (authenticated) views.

Responsiveness:

Ensure the application is responsive and mobile-friendly.

Add subtle animations and transitions using Tailwind and Framer Motion for a polished UX.
  