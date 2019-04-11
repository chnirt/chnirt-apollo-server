const User = require("../models/user");

const resolvers = {
  Query: {
    getUsers: async () => await User.find(),
    getUser: async (_, { _id }) => {
      return await User.findOne({ _id: _id });
    }
  },
  Mutation: {
    addUser: async (_, { user }) => {
      try {
        return await User.create(user);
      } catch (e) {
        return e.message;
      }
    },
    editUser: async (_, { _id, user }) => {
      try {
        return await User.findOneAndUpdate(
          { _id: _id },
          {
            $set: {
              username: user.username,
              email: user.email
            }
          },
          { new: true }
        );
      } catch (error) {
        return e.message;
      }
    },
    deleteUser: async (_, { _id }) => {
      try {
        return (await User.findOneAndDelete({ _id })) ? _id : null;
      } catch (e) {
        return e.message;
      }
    }
  }
};

module.exports = resolvers;
