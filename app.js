// app.js
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const router = require('./router');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs } = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const authenticate = require('./graphql/authenticate');

const app = express();
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(router);


async function startApolloServer() {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req }) => authenticate(req)
    });
    await server.start();
    server.applyMiddleware({ app });
}
startApolloServer();

module.exports = app;