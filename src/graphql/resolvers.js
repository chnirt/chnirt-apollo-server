const User = require("../models/user");

const resolvers = {
  Query: {
    getUsers: async () => await User.find({}),
    getUser: async (_, { _id }) => {
      return await User.findById(_id);
    }
  },
  Mutation: {
    addUser: async (_, { input }) => {
      try {
        return await User.create(input);
        // return response;
      } catch (e) {
        return e.message;
      }
    }
  }
};

module.exports = resolvers;
