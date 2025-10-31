// import mongoose from "mongoose";

// const schema = new mongoose.Schema(
//   {
//     campaignId: { type: String, required: true },
//     name: { type: String, default: "Anonymous" },
//     amount: Number,
//     comment: String,
//   },
//   { timestamps: true }
// );

// export default mongoose.models.Donation || mongoose.model("Donation", schema);
import mongoose, { Schema, Document } from "mongoose";

interface DonationDoc extends Document {
  campaignId: string;
  name: string;
  comment: string;
  amount: number;
}

const DonationSchema = new Schema(
  {
    campaignId: { type: String, required: true },
    name: { type: String, default: "Anonymous" },
    comment: { type: String, default: "" },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Donation ||
  mongoose.model<DonationDoc>("Donation", DonationSchema);
