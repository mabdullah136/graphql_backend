const User = require("../../models/user/user");

const resolvers = {
  Query: {
    getUsers: async () => await User.find(),
    getUser: async (_, { userId }) => await User.findOne({ userId }),
  },

  Mutation: {
    createUser: async (_, { name, email, designations }) => {
      const user = new User({ name, email, designations });
      await user.save();
      return user;
    },
    // updateUser: async (_, { userId, name, email, designations }) => {
    //   try {
    //     const updatedUser = await User.findOneAndUpdate(
    //       { userId },
    //       { name, email, designations },
    //       { new: true }
    //     );

    //     if (!updatedUser) {
    //       // throw new Error("User not found");
    //       return {
    //         status: "error",
    //         message: "User not found",
    //       };
    //     }

    //     return updatedUser;
    //   } catch (error) {
    //     throw new Error("Error updating user: " + error.message);
    //   }
    // },
    updateUser: async (_, { userId, name, email, designations }) => {
      try {
        const updatedUser = await User.findOneAndUpdate(
          { userId }, // Ensure filter is an object
          { name, email, designations },
          { new: true } // Returns the updated document
        );

        if (!updatedUser) {
          return {
            status: "error",
            message: "User not found",
            user: null,
          };
        }

        return {
          status: "success",
          message: "User updated successfully",
          user: updatedUser,
        };
      } catch (error) {
        return {
          status: "error",
          message: "Error updating user: " + error.message,
          user: null,
        };
      }
    },
    deleteUser: async (_, { userId }) => {
      try {
        const deletedUser = await User.findOneAndDelete({ userId });

        if (!deletedUser) {
          throw new Error("User not found");
        }

        return deletedUser;
      } catch (error) {
        throw new Error("Error deleting user: " + error.message);
      }
    },
  },
};

module.exports = resolvers;
