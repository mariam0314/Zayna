# Overview

Zayna Hotel is a luxury hotel website built with Next.js, featuring an AI-powered chatbot assistant, guest registration system, and comprehensive hotel service showcase. The application provides an elegant digital presence for a luxury hotel with features including room browsing, spa and dining information, tourist guidance, and guest management capabilities.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: Next.js 15 with App Router architecture
- **Styling**: Tailwind CSS with custom CSS variables for consistent theming
- **UI Components**: Custom React components with Framer Motion for animations
- **Interactive Elements**: Swiper.js for image carousels, Lucide React for icons
- **State Management**: Zustand for client-side state management

## Backend Architecture
- **API Routes**: Next.js API routes for server-side functionality
- **Database**: MongoDB with connection pooling for guest data and contact forms
- **Authentication**: NextAuth.js integration prepared for guest panel authentication
- **Data Validation**: Zod schema validation for API endpoints

## Design System
- **Theme**: Luxury hotel aesthetic with golden (#FFD700) accent colors on black background
- **Typography**: Geist Sans and Geist Mono fonts
- **Layout**: Responsive design with mobile-first approach
- **Components**: Modular component structure organized by feature areas

## Key Features
- **AI Chatbot**: Google Gemini AI integration for hotel concierge assistance
- **Guest Management**: Registration and login system for hotel guests
- **Content Sections**: Hero, services, rooms, spa/dining, testimonials, FAQ
- **Contact System**: Contact form with MongoDB storage
- **Navigation**: Fixed header with mobile responsive menu

## External Dependencies

- **AI Service**: Google Gemini AI (@google/genai) for chatbot functionality
- **Database**: MongoDB with connection pooling for data persistence
- **Payment Processing**: Stripe integration prepared (react-stripe-js, stripe-js)
- **Authentication**: NextAuth.js with MongoDB adapter for user sessions
- **Animation**: Framer Motion for smooth UI transitions
- **Date Handling**: date-fns for date formatting and manipulation
- **Password Security**: bcryptjs for password hashing
- **UI Enhancements**: Swiper for carousels, Lucide React for icons

## Environment Configuration
- **MongoDB**: Requires MONGODB_URI environment variable
- **AI Service**: Requires GEMINI_API_KEY for chatbot functionality
- **Deployment**: Configured for Vercel platform deployment
- **Development**: Hot reload and TypeScript support enabled