import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { readFileSync } from "fs";
import { join } from "path";

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

const resolvers: Resolvers = {
  Query: {
    // hello: () => "world",
    cart: (_, { id }, { prisma }) => {
      return {
        id,
        totalItems: 0,
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
