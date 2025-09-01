const app = require('./app');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`REST e GraphQL rodando em http://localhost:${PORT}`);
  console.log(`GraphQL em http://localhost:${PORT}/graphql`);
});
