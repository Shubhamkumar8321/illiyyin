import mongoose, { Schema, models } from "mongoose";

const fundraiserSchema = new Schema(
  {
    title: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    goal: { type: Number, required: true },
    raised: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Fundraiser =
  models.Fundraiser || mongoose.model("Fundraiser", fundraiserSchema);

export default Fundraiser;
