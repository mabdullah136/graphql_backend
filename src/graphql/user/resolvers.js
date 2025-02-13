const User = require("../../models/user/user");
const bcrypt = require("bcryptjs");
const { generate: uniqueId } = require("shortid");
const jwt = require("jsonwebtoken");

const resolvers = {
  Query: {
    getUsers: async () => {
      try {
        const users = await User.find();
        if (!users.length) {
          return { users: [] };
        }
        return {
          users,
        };
      } catch (error) {
        return {
          users: [],
        };
      }
    },
    getUser: async (_, { userId }) => {
      try {
        const user = await User.findOne({ userId: userId }); // Use `_id` if using MongoDB
        if (!user) {
          return { user: null };
        }
        return {
          user,
        };
      } catch (error) {
        return {
          user: null,
        };
      }
    },
  },

  Mutation: {
    createUser: async (_, { name, email, designations, password }) => {
      try {
        let salt = uniqueId();
        const passwordHash = bcrypt.hashSync(salt + password, 10);

        if (!name) {
          return {
            user: null,
          };
        }

        if (!email) {
          return {
            user: null,
          };
        }

        if (!email.includes("@")) {
          return {
            user: null,
          };
        }

        if (email) {
          const existingUser = await User.findOne({
            email,
          });
          if (existingUser) {
            return {
              user: null,
            };
          }
        }

        if (!designations) {
          return {
            user: null,
          };
        }

        if (!password) {
          return {
            user: null,
          };
        }

        const user = new User({
          name,
          email,
          designations,
          password: passwordHash,
          salt: salt,
        });
        await user.save();

        return {
          user,
        };
      } catch (error) {
        return {
          user: null,
        };
      }
    },
    updateUser: async (_, { userId, name, email, designations }) => {
      try {
        const updatedUser = await User.findOneAndUpdate(
          { userId }, // Ensure filter is an object
          { name, email, designations },
          { new: true } // Returns the updated document
        );

        if (!updatedUser) {
          return {
            user: null,
          };
        }

        return {
          user: updatedUser,
        };
      } catch (error) {
        return {
          user: null,
        };
      }
    },
    deleteUser: async (_, { userId }) => {
      try {
        const deletedUser = await User.findOneAndDelete({ userId });

        if (!deletedUser) {
          return {
            user: null,
          };
        }

        return {
          user: deletedUser,
        };
      } catch (error) {
        return {
          user: null,
        };
      }
    },
    loginUser: async (_, { email, password }, { res }) => {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          return {
            user: null,
            token: null,
          };
        }

        const isMatch = user.validPassword(user.salt, password);

        if (!isMatch) {
          return {
            user: null,
            token: null,
          };
        }

        const accessToken = jwt.sign(
          {
            UserInfo: {
              username: user.name,
              email: user.email,
              userId: user.userId,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15d" }
        );

        const refreshToken = jwt.sign(
          { email: user.email },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "20d" }
        );
        if (res) {
          res.cookie("jwt", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });
        }
        return {
          user,
          token: accessToken,
        };
      } catch (error) {
        return {
          user: null,
          token: null,
        };
      }
    },
  },
};

module.exports = resolvers;
