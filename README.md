# Fullstack eCommerce app with Apollo GraphQL, Prisma, NextJS, & Stripe Checkout

based on [OneWeekGraphQL.com](OneWeekGraphQL.com)

Video tutorial: https://www.youtube.com/watch?v=Eo2491uXAPA&list=PLs2PzMqLzi7URwCGValfOWlupv2fayxzp&index=1&pp=iAQB

## 1. Create a new Next.js app

```
 npx create-next-app@latest oneweekgraphql --ts --use-npm
 cd oneweekgraphql
 npm run dev
```

Open localhost:3000 to see Next.js app

## 2. Clean up and use tailwind css

Replace contents of `app/page.tsx` with:

```
<h1 className="text-purple-500 text-xl">Hello World</h1>
```

Remove css in `app/global.css` except tailwind import.

## 3. Install Apollo GraphQL Server and configure API route

install dependencies

```
npm install @apollo/server graphql @as-integrations/next
```

Create server at `app/api/graphql.ts`:
https://www.apollographql.com/docs/apollo-server/getting-started/

Configure routes, see Apollo server integration with Next.js:
https://github.com/apollo-server-integrations/apollo-server-integration-next

Add `schema.graphql` and start server with schema and resolvers.

## 4. Install and configure GraphQL Code Generator

```
npm install -D -E @graphql-codegen/cli
npx graphql-codegen init
```

? What type of application are you building? Backend - API or server
? Where is your schema?: (path or url) schema.graphql
? Pick plugins: TypeScript (required by other typescript plugins), TypeScript Resolvers (strongly typed resolve functions)
? Where to write the output: types.ts
? Do you want to generate an introspection file? Yes
? How to name the config file? (codegen.ts)
? What script in package.json should run the codegen? (codegen)

Notice the new script `codegen` generated in `package.json`

```
npm install
npm run codegen
```

See new file `types.ts` generated in the root directory.

Add type imports to `app/api/graphql.ts`:

```
import type { Resolvers } from "../../types";
//  ...
const resolvers: Resolvers = {
//  ...
}
```

## 5. Install and configure Docker Compose

Add a file `docker-compose.yml` to the root directory with the following contents:

```
version: "3"

services:
  database:
    platform: linux/amd64
    image: mysql
    restart: always
    environment:
      - MYSQL_DATABASE=mydb
      - MYSQL_ROOT_PASSWORD=password
      - MYSQL_USER=user
      - MYSQL_PASSWORD=password
    ports:
      - "3307:3306"
```

Start Docker Desktop (install from [docker.com](https://docs.docker.com/desktop/install/windows-install/)).
See no containers in Docker at the moment.

Run the command to create and run database:

```
docker compose up
```

## 6. Install and configure Prisma

Follow Prisma.io's Get Started guide:
https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-typescript-mysql

```
npm install -E -D prisma
npx prisma init
```

Update `provider` in `schema.prisma`:

```
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

Update `DATABASE_URL` in `.env`:

```
DATABASE_URL="mysql://root:password@localhost:3307/mydb"
```

Run docker:

```
docker compose up
```

Add script `"db:generate": "prisma generate"` to `package.json`.

Install prisma client dependency:

```
npm install -E @prisma/client
```

Create a file `lib/prisma.ts` with the [following content](https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices):

```
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

Add prisma client to `app/api/graphql.ts`:

```
import type { PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type GraphQLContext = {
  prisma: PrismaClient;
};
```

Add config for contextType to `codegen.ts` configuration:

```
...
"types.ts": {
  config: {
    contextType: "./app/api/graphql#GraphQLContext",
  },
}
```

Run `npm run codegen`.

## 7. Create prisma schema models

Create models for our types in `schema.prisma`.

Run `npm run db:generate`.

In `codegen.ts`, add the following mappers to the config:

```
  mapperTypeSuffix: "Model",
  mappers: {
    Cart: "@prisma/client#Cart",
    CartItem: "@prisma/client#CartItem",
  },
```

Run `npm run codegen`.

Open `types.ts` and you should see the new Model types imported from prisma client.
If you see an error, restart VS Code and the error should go away.

### Migrate database

Add scripts to `package.json`:

```
  "db:migrate": "prisma migrate dev",
  "db:studio": "prisma studio"
```

Run `npm run db:migrate`.
Choose to reset the database entirely.

? Enter a name for the new migration: › init cart setup

Note the new `migration.sql` file in the `prisma/migrations/<timestamp>_<migration_name>` folder, which contains the SQL query needed to recreate our database tables.
