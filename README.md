<div align="center">
  <img src="./public/logo.svg" alt="Poiema Ministries Logo" width="200" />
  
  # Poiema Ministries Website
  
  **English Ministry of Bayside Presbyterian Church**
  
  [![Next.js](https://img.shields.io/badge/Next.js-16.1-black)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19.2-blue)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)](https://tailwindcss.com/)
</div>

## About

Poiema Ministries is the English Ministry of the Korean Presbyterian Church of
Bayside, located in Bayside, NY. "Poiema" is a Greek word meaning "workmanship"
or "masterpiece," reflecting our mission to serve as God's workmanship in our
community.

This website serves as the digital home for Poiema Ministries, providing
information about our services, sermons, events, teams, and ministry activities.
We are committed to sharing the gospel and love of Jesus Christ with our local
community and beyond.

### Features

- **Service Information**: Details about our Sunday worship services (9:30 AM
  and 11:30 AM)
- **Sermons**: Access to past sermons and messages
- **Events Gallery**: Photos and information about past and upcoming events
- **Team Directory**: Meet our ministry teams and members
- **Bulletins & Announcements**: Stay updated with weekly bulletins and ministry
  announcements
- **Contact Forms**: Connect with us through prayer requests, new member
  registration, and contact forms
- **Online Offering**: Support the ministry through online giving
- **Content Management**: Integrated Sanity CMS for easy content updates

## Tech Stack

### Frontend Framework

- **[Next.js 16](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript

### Styling

- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Kaisei Decol](https://fonts.google.com/specimen/Kaisei+Decol)** - Custom
  Google Font

### Content Management

- **[Sanity CMS](https://www.sanity.io/)** - Headless CMS for content management
- **Sanity Studio** - Content editing interface at `/studio`

### Services & Integrations

- **[Cloudinary](https://cloudinary.com/)** - Image hosting and optimization
- **[Resend](https://resend.com/)** - Email service for contact forms
- **Google Maps API** - Location and map integration

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **React Hook Form** - Form handling

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18.0 or higher)
- **npm** (comes with Node.js) or **yarn** or **pnpm**
- **Git**

### Local Development Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd frontend/main
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory. Contact the project
   maintainer for the required environment variables.

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to view the
   application.

6. **Access Sanity Studio (optional)**

   Navigate to [http://localhost:3000/studio](http://localhost:3000/studio) to
   access the content management interface.

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server (requires `npm run build` first)
- `npm run lint` - Run ESLint to check code quality
- `npm run prettier` - Format code using Prettier

## Project Structure

```
├── app/                    # Next.js App Router pages and components
│   ├── api/               # API routes
│   ├── common/            # Shared components and utilities
│   └── [pages]/           # Page routes
├── public/                # Static assets (images, logos, etc.)
├── sanity/                # Sanity CMS configuration and schemas
├── lib/                   # Utility functions and configurations
└── [config files]         # Configuration files (Next.js, TypeScript, etc.)
```

## Contributing

This is a private project for Poiema Ministries. If you're part of the
development team, please follow the project's coding standards and commit
guidelines.

## License

Copyright © 2025 Poiema Ministries. All Rights Reserved.

---

**Poiema Ministries** | English Ministry of Bayside Presbyterian Church  
_"We are God's workmanship, created in Christ Jesus to do good works."_ -
Ephesians 2:10
