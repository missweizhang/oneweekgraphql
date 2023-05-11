import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { readFileSync } from "fs";
import { join } from "path";

import type { Resolvers } from "../../types";

const typeDefs = readFileSync(join(process.cwd(), "schema.graphql"), {
  encoding: "utf8",
});

const resolvers: Resolvers = {
  Query: {
    // hello: () => "world",
    cart: (_, { id }) => {
      return {
        id,
        totalItems: 0,
      };
    },
  },
};

const server = new ApolloServer({
  resolvers,
  typeDefs,
});

export default startServerAndCreateNextHandler(server);
