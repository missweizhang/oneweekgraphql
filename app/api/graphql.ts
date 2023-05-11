import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { readFileSync } from "fs";
import { join } from "path";
import currencyFormatter from "currency-formatter";

import type { Resolvers } from "../../types";

import type { PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export type GraphQLContext = {
  prisma: PrismaClient;
};

export async function createContext(): Promise<GraphQLContext> {
  return {
    prisma,
  };
}

const typeDefs = readFileSync(join(process.cwd(), "schema.graphql"), {
  encoding: "utf8",
});

const currencyCode = "USD";

const resolvers: Resolvers = {
  Query: {
    // hello: () => "world",
    cart: async (_, { id }, { prisma }) => {
      let cart = await prisma.cart.findUnique({
        where: {
          id,
        },
      });
      if (!cart) {
        cart = await prisma.cart.create({
          data: { id },
        });
      }
      // console.log(cart);
      return cart;
    },
  },
  Cart: {
    items: async ({ id }, _, { prisma }) => {
      const items = await prisma.cart
        .findUnique({
          where: { id },
        })
        .items();
      return items ?? [];
    },
    totalItems: async ({ id }, _, { prisma }) => {
      const items = await prisma.cart
        .findUnique({
          where: { id },
        })
        .items();
      return items?.reduce((total, item) => total + item.quantity || 1, 0) ?? 0;
    },
    subTotal: async ({ id }, _, { prisma }) => {
      const items = await prisma.cart
        .findUnique({
          where: { id },
        })
        .items();

      const amount =
        items?.reduce(
          (total, item) => total + item.price * item.quantity || 0,
          0
        ) ?? 0;
      return {
        formatted: currencyFormatter.format(amount / 100, {
          code: currencyCode,
        }),
        amount,
      };
    },
  },
};

const server = new ApolloServer<GraphQLContext>({
  resolvers,
  typeDefs,
});

export default startServerAndCreateNextHandler<NextRequest, GraphQLContext>(
  server,
  {
    context: createContext,
  }
);
