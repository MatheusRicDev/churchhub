# ChurchHub - Sistema de Gestão para Igrejas

## Stack
- Next.js 16 (App Router)
- TypeScript, Tailwind CSS
- Prisma 7 (PostgreSQL)
- NextAuth v5
- next-themes, Lucide React, Zod, React Hook Form
- Recharts

## Scripts
```bash
npm run dev        # Start development server
npm run build      # Production build
npm run db:migrate # Run Prisma migrations
npm run db:seed    # Seed database
npm run db:generate # Generate Prisma client
```

## Architecture
Page → Server Action → Service → Repository → Prisma → PostgreSQL

## Routes
- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - Dashboard with stats
- `/members` - CRUD members
- `/visitors` - Visitor registry
- `/events` - Event management
- `/settings` - Account settings

## Database
- PostgreSQL with Prisma 7
- Prisma config: `prisma.config.ts`
- Schema: `prisma/schema.prisma`
- Generated client: `prisma/generated/client/`

## Seed
- Church: "Igreja Batista Testemunho"
- Admin: admin@churchhub.com / admin123
- 8 members, 5 events, 3 visitors

## Project Structure
```
src/
  actions/       - Server Actions
  app/           - Next.js App Router pages
  components/
    ui/          - Reusable UI components
    layout/      - Layout components (Sidebar, Header)
  lib/           - Auth, Prisma client
  repositories/  - Data access layer
  services/      - Business logic layer
  types/         - TypeScript types
```

## Prisma 7 Notes
- Uses driver adapter (`@prisma/adapter-pg` + `pg`)
- Prisma config in `prisma.config.ts` (not in schema)
- Client output to `prisma/generated/client/`
- Import `PrismaClient` from `@db/client`
- Import `Prisma` types from `@db/client`
