import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
      type: String,
      enum: ["admin", "fundraiser", "donor"],
      default: "fundraiser",
    },
    organization: { type: String },
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);
export default User;
