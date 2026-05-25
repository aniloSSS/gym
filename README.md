# Fitness Transformation App

Application web personnelle pour suivre séances, calories, protéines, progression physique et objectifs.

## Stack

- Next.js App Router
- TypeScript strict
- TailwindCSS
- Composants style shadcn/ui
- Supabase Auth + Database + Storage

## Démarrage

```bash
npm install
npm run dev
```

Copier `.env.example` vers `.env.local`, puis renseigner les clés Supabase.

## GitHub Pages

Le projet est configure pour un export statique Next.js compatible GitHub Pages.

Dans GitHub :

1. Ouvrir `Settings`
2. Aller dans `Pages`
3. Dans `Build and deployment`, choisir `GitHub Actions`
4. Pousser sur `main`

Le site sera publie a l'adresse :

`https://USERNAME.github.io/NOM_DU_REPO/`

## Supabase

Le schéma SQL complet est dans `supabase/schema.sql`. Il contient les tables, relations, policies RLS et données de départ.
