const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userCounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const userCounter = mongoose.model("userCounter", userCounterSchema);

async function getNextUserId() {
  const result = await userCounter.findByIdAndUpdate(
    "user",
    { $inc: { seq: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  return result.seq;
}

const UserSchema = new mongoose.Schema({
  userId: {
    type: Number,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
  },
  designations: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

UserSchema.pre("save", async function (next) {
  if (this.isNew) {
    this.userId = await getNextUserId();
  }
  next();
});

UserSchema.methods.validPassword = function (salt, userPassword) {
  return bcrypt.compareSync(salt + userPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
