# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

### Development
- `npm run dev` - Start development server with auto-reloading
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

### Package Management
- `npm i` - Install dependencies (uses package-lock.json)

### Convex Database Commands
- `npx convex dev` - Start Convex development server
- `npx convex deploy` - Deploy schema and functions to production
- `npx convex dashboard` - Open Convex dashboard
- `npx convex run seed:seedDatabase` - Populate database with sample data
- `npx convex run seed:clearDatabase` - Clear all database data (dev only)

## Project Architecture

This is a React-based Ragdoll cat gallery showcase for "BleuRoi Ragdoll Cattery" with a complete admin system, built with modern web technologies and Convex backend.

### Tech Stack
- **Vite** - Build tool and development server
- **React 18** - UI framework with TypeScript
- **Convex** - Real-time database and backend functions
- **shadcn/ui** - Component library built on Radix UI primitives
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and state management
- **React Hook Form** - Form handling with Zod validation

### Core Application Structure
- **Public Site** (`src/pages/Index.tsx`) - Main gallery showcase with hero, featured cats, TikTok videos, contact
- **Admin Panel** (`src/pages/Admin.tsx`) - Protected admin interface for content management
- **Database Layer** (`convex/`) - Convex schema and functions for cats, pedigree, auth, contact, settings

### Key Components Architecture

#### Frontend Components
- `src/components/ModernNavigation.tsx` - Header with language switcher and admin access
- `src/components/ModernHeroSection.tsx` - Hero banner with cat imagery
- `src/components/FeaturedModelsSection.tsx` - Gallery of cats with filtering and modals
- `src/components/PedigreeModal.tsx` - Interactive pedigree tree visualization
- `src/components/TikTokSection.tsx` - Embedded TikTok videos
- `src/components/ContactSection.tsx` - Contact form with Convex integration
- `src/components/admin/` - Admin management components (cats, images, pedigree, TikTok, settings)

#### Database Schema (Convex)
- **cats** - Cat profiles with gallery, pedigree data, display settings, categories
- **pedigreeConnections** - Parent-child relationships between cats
- **pedigreeTrees** - Saved pedigree tree configurations
- **adminSessions** - Authentication sessions with expiration
- **contactSubmissions** - Contact form submissions with status tracking
- **images** - Image metadata and associations
- **siteSettings** - Global site configuration (social media, contact info)
- **tiktokVideos** - TikTok video embeds linked to cats

#### Services Layer
- `src/services/convexCatService.ts` - Cat CRUD operations and queries
- `src/services/convexFileService.ts` - File upload and management
- `src/services/convexSiteSettingsService.ts` - Global settings management
- `src/services/convexTikTokService.ts` - TikTok video management

### Authentication & Admin System
- Session-based authentication using Convex
- Admin routes protected with `AdminAuthProvider`
- Session management with automatic expiration
- Login via `/admin` route with password authentication

### Internationalization
- Bulgarian default language with English support
- Translation files in `src/translations/`
- Language switcher in navigation
- `useLanguage` hook for component translations

### Key Development Patterns
- Convex functions for all data operations (queries, mutations)
- TypeScript for type safety across frontend and backend
- Real-time data updates via Convex subscriptions
- Component composition with shadcn/ui primitives
- Custom hooks for business logic (auth, language, mobile detection)
- Responsive design with Tailwind CSS utilities

### File Upload & Image Management
- Direct file uploads to Convex file storage
- Image association with cats via metadata tables
- Gallery management through admin interface
- Optimized image loading with proper fallbacks

## Development Notes

This project was originally created with Lovable platform and has been enhanced with a complete Convex backend integration. The codebase follows React best practices with clear separation between presentation, business logic, and data layers.

## Guidelines

### Build and Localization
- Do not run npm build commands, I can do that on my own
- The website should be in Bulgarian by default
- Always test admin functionality after changes
- Use Convex dashboard to monitor database operations
- Maintain session management for admin security