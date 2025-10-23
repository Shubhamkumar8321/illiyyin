// import mongoose, { Schema, models } from "mongoose";

// // 🟩 Donation tiers / preset options
// const donationSchema = new Schema(
//   {
//     heading: { type: String },
//     amount: { type: Number },
//     text: { type: String },
//   },
//   { _id: false }
// );

// // 🟩 Individual supporters (actual donors)
// const supporterSchema = new Schema(
//   {
//     name: { type: String, required: true },
//     email: { type: String },
//     amount: { type: Number, required: true },
//     avatar: { type: String },
//     message: { type: String },
//     daysAgo: { type: Number },
//     createdAt: { type: Date, default: Date.now },
//   },
//   { _id: false }
// );

// // 🟩 Admin / organizer notes
// const noteSchema = new Schema(
//   {
//     text: { type: String, required: true },
//     createdAt: { type: Date, default: Date.now },
//   },
//   { _id: false }
// );

// // 🟩 Main campaign schema
// const CampaignSchema = new Schema(
//   {
//     title: { type: String, required: true },
//     description: { type: String, required: true }, // ✅ TinyMCE HTML
//     category: { type: String, required: true },
//     images: { type: [String], default: ["/placeholder.jpg"] },
//     goal: { type: Number, required: true },
//     raised: { type: Number, default: 0 },
//     endDate: { type: Date, required: true }, // ✅ FIX: should be Date, not String
//     donations: { type: [donationSchema], default: [] },
//     supporters: { type: [supporterSchema], default: [] },
//     status: {
//       type: String,
//       enum: ["pending", "approved", "rejected"],
//       default: "pending",
//     },
//     isFeatured: { type: Boolean, default: false },
//     organizer: { type: String },
//     notes: { type: [noteSchema], default: [] },
//   },
//   { timestamps: true }
// );


// const Campaign = models.Campaign || mongoose.model("Campaign", CampaignSchema);
// export default Campaign;
import mongoose, { Schema, models } from "mongoose";

const donationSchema = new Schema(
  { heading: String, amount: Number, text: String },
  { _id: false }
);

const supporterSchema = new Schema(
  {
    name: { type: String, required: true },
    email: String,
    amount: { type: Number, required: true },
    avatar: String,
    message: String,
    daysAgo: Number,
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const noteSchema = new Schema(
  { text: { type: String, required: true }, createdAt: { type: Date, default: Date.now } },
  { _id: false }
);
const organizerSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
  },
  { _id: false }
);

const CampaignSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    images: { type: [String], default: ["/placeholder.jpg"] },
    goal: { type: Number, required: true },
    raised: { type: Number, default: 0 },
    endDate: { type: Date, required: true },
    donations: { type: [donationSchema], default: [] },
    supporters: { type: [supporterSchema], default: [] },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    isFeatured: { type: Boolean, default: false },
    organizer: { type: organizerSchema, required: true },
    notes: { type: [noteSchema], default: [] },

    // 👇 Added for linking user
    createdById: { type: String, required: true },
    createdByEmail: { type: String, required: true },
  },
  { timestamps: true }
);

const Campaign = models.Campaign || mongoose.model("Campaign", CampaignSchema);
export default Campaign;
