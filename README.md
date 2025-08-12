This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev

# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# UI-NEXT-SkyWatchApp


## Structure of the project
```bash
├── sky-watch-app/              # The root directory of the Next.js application.
│   ├── .wrangler/              # Contains Wrangler-specific files and configurations.
│   ├── migrations/
│   │   └── 0001_initial.sql    # Initial SQL migration file for database setup.
│   ├── node_modules/
│   ├── public/                 # A directory for static files like images and icons.
│   ├── src/                    # Contains the main application code.
│   │   ├── app/                # The core application files, including pages and layouts.
│   │   │   ├── counter.ts
│   │   │   ├── favicon.ico
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/         # Reusable UI components, each focusing on specific functionalities like aurora forecasts, moon phases, etc.
│   │   │   ├── AuroraForecastCard.tsx
│   │   │   ├── DailyHighlights.tsx
│   │   │   ├── LocationDetector.tsx
│   │   │   ├── MeteorShowersCard.tsx
│   │   │   ├── MoonPhaseCard.tsx
│   │   │   ├── PlanetsCard.tsx
│   │   │   ├── SatellitesCard.tsx
│   │   │   └── ui/
│   │   ├── hooks/              # Placeholder for custom React hooks.
│   │   ├── lib/
│   │   │   └── apiService.ts   # Centralized API functions for fetching data from various astronomy APIs.
│   │   └── ...
│   ├── README.md               # Project overview and setup instructions.
│   ├── components.json         # Configuration related to components.
│   ├── env.d.ts
│   ├── eslint.config.mjs
│   ├── next.config.ts          # Configuration files for Next.js and deployment settings.
│   ├── next-env.d.ts
│   ├── open-next.config.ts     # Configuration files for Next.js and deployment settings.
│   ├── package.json            # Project dependencies and lockfile.
│   ├── pnpm-lock.yaml          # Project dependencies and lockfile.
│   ├── postcss.config.mjs      # Configuration files for Tailwind CSS and PostCSS.
│   ├── tailwind.config.ts      # Configuration files for Tailwind CSS and PostCSS.
│   └── wrangler.toml
```

cd /skywatchapp && npm run build
cd /skywatchapp && npm run start
cd /home && lsof -i :3000 | grep LISTEN
cd /home && pkill -f "node.*next"
