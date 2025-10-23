import mongoose, { Schema, models } from "mongoose";

const CommentSchema = new Schema(
  {
    campaignId: {
      type: Schema.Types.ObjectId, // ✅ ObjectId type ensures Mongo matches properly
      ref: "Campaign",
      required: true,
    },
    user: { type: String, default: "Anonymous" },
    text: { type: String, required: true },
    amount: { type: Number, default: 0 }, // ✅ optional field if you also store amount
  },
  { timestamps: true }
);

const Comment = models.Comment || mongoose.model("Comment", CommentSchema);
export default Comment;
