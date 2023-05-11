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
