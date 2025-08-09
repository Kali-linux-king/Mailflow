# Overview

DevToolkit is a comprehensive web application that provides 30+ free online tools for developers and marketers. It's built as a single-page application (SPA) featuring developer utilities like JSON formatters, password generators, QR code generators, text converters, and various other productivity tools. The application emphasizes privacy (no registration required), instant processing, and a clean, modern user interface.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Shadcn/ui component library built on Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with custom design tokens and responsive design
- **State Management**: TanStack React Query for server state and local React state for UI
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for consistent type safety across the stack
- **API Structure**: RESTful API design with `/api` prefix for all endpoints
- **Session Management**: PostgreSQL-based sessions using connect-pg-simple
- **Development Server**: Custom Vite integration for hot module replacement

## Data Storage Solutions
- **Primary Database**: PostgreSQL with Neon serverless hosting
- **ORM**: Drizzle ORM for type-safe database operations and migrations
- **In-Memory Storage**: Fallback MemStorage implementation for development
- **Client Storage**: Local storage for user analytics and preferences

## Authentication and Authorization
- **User Schema**: Basic username/password authentication system
- **Session Storage**: PostgreSQL-backed session management
- **Security**: Prepared for user authentication but currently focused on anonymous tool usage

## Tool Architecture
- **Modular Design**: Each tool is implemented as a separate React component
- **Tool Modal System**: Centralized modal system for displaying tools
- **Tool Categories**: Organized into categories (developer, image, PDF, SEO, calculator, text)
- **Analytics Tracking**: Client-side usage analytics for popular tools and user behavior

## External Dependencies
- **Database**: Neon PostgreSQL for production data storage
- **UI Libraries**: Radix UI primitives for accessible component foundation
- **Icons**: Lucide React for consistent iconography
- **Fonts**: Google Fonts (Inter) for typography
- **Development**: Replit-specific plugins for development environment integration
- **Validation**: Zod for runtime type validation and schema generation
- **Utilities**: Various utility libraries for date formatting, class management, and carousels

The application follows a monorepo structure with shared schemas and clear separation between client and server code, enabling efficient development and deployment workflows.