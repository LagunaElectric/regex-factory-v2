# regex-factory-2-app

This is a [sidebase merino](https://sidebase.io/) app created by running `pnpm create sidebase@latest`. This project uses the following technologies for a great developer- and user-experience:
- [TypeScript](https://www.typescriptlang.org/)
- [Nuxt 3](https://nuxt.com)
- Prisma ORM
- nuxt-auth
- tRPC 10
- Tailwind CSS
- Naive UI
- GitHub Actions based CI

## How to get going?

This is a straight-forward setup with minimal templating and scaffolding. The options you selected during the sidebase CLI setup are all here though. Good places to continue reading are:
- [the First Steps documentation](https://sidebase.io/sidebase/usage)
- [our discord](https://discord.gg/auc8eCeGzx)

Some tasks you should probably do in the beginning are:
- [ ] replace this generic README with a more specific one
- [ ] install the Vue Volar extension
- [ ] enable [Volar takeover mode](https://nuxt.com/docs/getting-started/installation#prerequisites) to ensure a smooth editor setup
- [ ] [install Nuxt 3 devtools](https://github.com/nuxt/devtools#installation) if you want to use them
- [ ] Prisma: Edit your `prisma/prisma.schema` to your liking
- [ ] Prisma: Run `npx prisma db push` to sync the schema to your database & generate the Prisma Client
- [ ] Auth: Configure your auth providers to the [NuxtAuthHandler](./server/api/auth/[...].ts)
- [ ] Auth, optional: Enable global protection by setting `enableGlobalAppMiddleware: true` in [your nuxt.config.ts](./nuxt.config.ts). Delete the local middleware in the [protected.vue](./pages/protected.vue) page if you do

### Setup

Make sure to install the dependencies:

```bash
pnpm install
```

Copy the example .env files and add your credentials

```bash
cp example.env .env
open .env
```

Prep the local database so we can use OAuth correctly

```
npx prisma db push
```

### Development Server

Start the development server on http://localhost:3000

```bash
pnpm run dev
```

### Production

Build the application for production:

```bash
pnpm run build
```

Locally preview production build:

```bash
pnpm run preview
```
