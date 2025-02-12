const dotenv = require("dotenv");
const express = require("express");
require("./src/config/config");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./src/graphql/user/typeDefs");
const resolvers = require("./src/graphql/user/resolvers");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();
const app = express();

app.use(cors());

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({ req, res }),
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app, cors: false });

  const port = process.env.PORT;
  const ip = process.env.IP;
  app.listen(port, ip, () => console.log(`Server is running ${ip}:${port}`));
}

startServer();
