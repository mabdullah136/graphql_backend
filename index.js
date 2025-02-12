const dotenv = require("dotenv");
const express = require("express");
require("./src/config/config");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./src/graphql/user/typeDefs");
const resolvers = require("./src/graphql/user/resolvers");

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  const port = process.env.PORT;
  const ip = process.env.IP;
  app.listen(port, ip, () => console.log(`Server is running ${ip}:${port}`));
}

startServer();
