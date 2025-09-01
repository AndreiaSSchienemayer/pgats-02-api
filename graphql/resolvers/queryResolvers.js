// Resolvers de Query
const userService = require('../../service/userService');
const transferService = require('../../service/transferService');

module.exports = {
  users: () => userService.listUsers(),
  transfers: (parent, args, context) => {
    if (!context.user) throw new Error('Autenticação obrigatória');
    return transferService.listTransfers();
  },
};
