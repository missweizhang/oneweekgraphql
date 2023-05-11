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
