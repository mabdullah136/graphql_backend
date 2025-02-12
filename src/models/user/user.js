const mongoose = require("mongoose");

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
    required: true,
    unique: true, // Ensuring email uniqueness
  },
  designations: {
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

module.exports = mongoose.model("User", UserSchema);
