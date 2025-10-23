"use client";
import { useState } from "react";
import { CreditCard, Smartphone } from "lucide-react";

export default function DonationPage() {
  const [selectedAmount, setSelectedAmount] = useState(20);
  const [customAmount, setCustomAmount] = useState<number | "">("");
  const [isZakat, setIsZakat] = useState(false);

  const [tip, setTip] = useState<number>(3.2);
  const [tipType, setTipType] = useState<string | number>(3.2);
  const [customTip, setCustomTip] = useState<number | "">("");

  const [newsletter, setNewsletter] = useState(true);
  const [shareEmail, setShareEmail] = useState(false);
  const [comment, setComment] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("googlepay");
  const [frequency, setFrequency] = useState("one-time");
  const [currency, setCurrency] = useState("USD");

  const givingLevels = [
    {
      amount: 3,
      title: "Single Meal Donation",
      desc: "Donate a meal, save a life.",
      claimed: 15,
    },
    {
      amount: 20,
      title: "Two Meals & Care Package",
      desc: "Supports two individuals with meals and critical care packages.",
      claimed: 890,
    },
    {
      amount: 30,
      title: "Family Meal & Care Package Bundle",
      desc: "Delivers three meals and care packages to sustain a small family.",
      claimed: 795,
    },
    {
      amount: 70,
      title: "Large Family Meal & Care Package Bundle",
      desc: "Delivers multiple meals and care packages for a large family.",
      claimed: 580,
    },
  ];

  const currencies = [
    "USD",
    "EUR",
    "INR",
    "GBP",
    "AUD",
    "CAD",
    "SGD",
    "JPY",
    "CHF",
    "CNY",
    "AED",
    "NZD",
    "SAR",
    "MYR",
    "PKR",
    "SEK",
    "NOK",
    "DKK",
    "KRW",
    "TRY",
    "RUB",
  ];

  // Compute total donation (custom or selected amount + tip)
  const total = (
    (customAmount === "" ? selectedAmount : customAmount) + tip
  ).toFixed(2);

  const handleGiveClick = () => {
    alert(
      `You donated ${currency} ${total} via ${paymentMethod} (${frequency})!`
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 py-8 max-w-7xl mx-auto mt-8 px-4">
      {/* LEFT SIDE 60% */}
      <div className="flex-1 lg:w-3/5">
        <h2 className="text-xl font-semibold mb-2">
          Support{" "}
          <span className="text-green-700">
            Help Give 400K Meals to Palestinian Families!
          </span>
        </h2>
        <p className="text-sm text-gray-500 mb-6">Organized by Webspecia</p>

        {/* One-time / Recurring Toggle */}
        <div className="flex bg-gray-100 rounded-full mb-6 overflow-hidden">
          <button
            onClick={() => setFrequency("one-time")}
            className={`flex-1 py-2 font-medium rounded-full ${
              frequency === "one-time"
                ? "bg-green-500 text-white"
                : "text-gray-600"
            }`}
          >
            One-time
          </button>
          <button
            onClick={() => setFrequency("recurring")}
            className={`flex-1 py-2 font-medium rounded-full ${
              frequency === "recurring"
                ? "bg-green-500 text-white"
                : "text-gray-600"
            }`}
          >
            Recurring
          </button>
        </div>

        {/* Currency Selector */}
        <div className="flex items-center mb-4 gap-3 justify-between">
          <label className="font-medium text-gray-700">Currency:</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="border px-3 py-2 rounded-lg text-gray-700"
          >
            {currencies.map((cur) => (
              <option key={cur} value={cur}>
                {cur}
              </option>
            ))}
          </select>
        </div>

        {/* Custom Amount */}
        <div>
          <h3 className="font-semibold mb-2 text-lg">Your giving amount</h3>
          <p className="text-gray-600 text-sm mb-2">Enter a custom amount</p>
          <div className="flex items-center border rounded-lg px-4 py-3 mb-6">
            <span className="text-xl font-semibold">
              {currency === "USD"
                ? "$"
                : currency === "EUR"
                ? "€"
                : currency === "INR"
                ? "₹"
                : currency}
            </span>
            <input
              type="number"
              placeholder="0.00"
              min={0}
              value={customAmount}
              onChange={(e) => {
                const value = Number(e.target.value);
                setCustomAmount(value < 0 ? 0 : value);
              }}
              className="w-full text-right outline-none text-xl font-semibold"
            />
          </div>
        </div>

        {/* Preset Giving Levels */}
        <div>
          <p className="font-medium mb-2">Or select a giving level</p>
          <div className="flex flex-col gap-4">
            {givingLevels.map((level) => (
              <div
                key={level.amount}
                onClick={() => {
                  setSelectedAmount(level.amount);
                  setCustomAmount("");
                }}
                className={`border rounded-lg p-4 cursor-pointer transition hover:border-green-500 ${
                  selectedAmount === level.amount
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200"
                }`}
              >
                <p className="text-xl font-bold">
                  {currency === "USD"
                    ? "$"
                    : currency === "EUR"
                    ? "€"
                    : currency === "INR"
                    ? "₹"
                    : currency}
                  {level.amount}
                </p>
                <p className="font-medium">{level.title}</p>
                <p className="text-gray-600 text-sm">{level.desc}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {level.claimed} claimed
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tip Section */}
        <div className="mt-10">
          <h3 className="text-lg font-semibold mb-2">Help us help the Ummah</h3>
          <p className="text-gray-600 text-sm mb-3">
            Because Illiyyin doesn't charge a platform fee, we rely on donors
            like you 💖
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Tip Selector */}
            <select
              value={tipType}
              onChange={(e) => {
                const value = e.target.value;
                setTipType(value);
                if (value !== "custom") {
                  setTip(Number(value));
                }
              }}
              className="border px-3 py-2 rounded-lg text-gray-700"
            >
              <option value={3.2}>16% ($3.20)</option>
              <option value={2}>10% ($2.00)</option>
              <option value={0}>No Tip ($0.00)</option>
              <option value="custom">Custom Amount</option>
            </select>

            {/* Custom Tip Input */}
            {tipType === "custom" && (
              <input
                type="number"
                min="0"
                placeholder="Enter custom tip"
                value={customTip}
                onChange={(e) => {
                  const val =
                    e.target.value === "" ? "" : Number(e.target.value);
                  setCustomTip(val);
                  setTip(val === "" ? 0 : Number(val));
                }}
                className="border px-3 py-2 rounded-lg text-gray-700 w-full sm:w-[180px]"
              />
            )}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-3">Payment method</h3>
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="googlepay"
                checked={paymentMethod === "googlepay"}
                onChange={() => setPaymentMethod("googlepay")}
              />
              <Smartphone size={20} /> Google Pay
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
              />
              <CreditCard size={20} /> Credit / Debit Card
            </label>
          </div>
        </div>

        {/* Preferences */}
        <div className="mt-10">
          <h3 className="text-lg font-semibold mb-2">Preferences</h3>
          <label className="flex items-start gap-2 mb-2">
            <input
              type="checkbox"
              checked={shareEmail}
              onChange={() => setShareEmail(!shareEmail)}
            />
            <span className="text-gray-700">
              Share your email with the organizers to keep up with their work.
            </span>
          </label>
          <label className="flex items-start gap-2 mb-6">
            <input
              type="checkbox"
              checked={newsletter}
              onChange={() => setNewsletter(!newsletter)}
            />
            <span className="text-gray-700">
              Sign up to Illiyyin’s newsletter and learn about inspiring causes
              with over <strong>800k</strong> people.
            </span>
          </label>

          <div>
            <h3 className="font-semibold text-lg mb-1">Words of support</h3>
            <p className="text-sm text-gray-500 mb-2">
              (Optional) Leave a comment for the organizer.
            </p>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Write your message..."
            />
          </div>

          <button
            onClick={handleGiveClick}
            className="w-full bg-green-600 text-white py-3 mt-6 rounded-full font-semibold text-lg hover:bg-green-700 transition"
          >
            GIVE {currency} {total}
          </button>

          <p className="text-xs text-gray-500 text-center mt-3">
            Backed by our{" "}
            <a href="#" className="underline">
              Trust & Safety guarantee
            </a>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE 40% */}
      <div className="lg:w-2/5">
        <div className="lg:sticky lg:top-24 bg-gray-50 p-6 rounded-lg shadow-sm h-fit">
          <div className="border-b pb-4 mb-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                Zakat-verified campaign{" "}
                <span className="text-green-600 text-xl">🟢</span>
              </h3>
            </div>
            <label className="flex items-center gap-2 mt-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isZakat}
                onChange={() => setIsZakat(!isZakat)}
              />
              <span className="text-gray-700">Count this as your Zakat</span>
            </label>
            <p className="text-gray-500 text-sm mt-1">
              The organizer will use your donation as Zakat funds.
            </p>
          </div>

          {/* Review Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Review</h3>
            <div className="flex justify-between text-gray-700 mb-2">
              <p>Your giving amount</p>
              <p>
                {currency} {customAmount === "" ? selectedAmount : customAmount}
              </p>
            </div>
            <div className="flex justify-between text-gray-700 mb-2">
              <p>Illiyyin tip</p>
              <p>
                {currency} {tip.toFixed(2)}
              </p>
            </div>
            <div className="flex justify-between font-semibold text-gray-900 mt-3 border-t pt-2">
              <p>Your total ({currency})</p>
              <p>
                {currency} {total}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// "use client";
// import { useState } from "react";
// import { CreditCard, Smartphone } from "lucide-react";

// export default function DonationPage({
//   campaignId = "6707c8b48e7f9a123456789a", // ✅ pass this dynamically from route or props
// }: {
//   campaignId?: string;
// }) {
//   const [selectedAmount, setSelectedAmount] = useState(20);
//   const [customAmount, setCustomAmount] = useState<number | "">("");
//   const [isZakat, setIsZakat] = useState(false);
//   const [tip, setTip] = useState<number>(3.2);
//   const [tipType, setTipType] = useState<string | number>(3.2);
//   const [customTip, setCustomTip] = useState<number | "">("");
//   const [newsletter, setNewsletter] = useState(true);
//   const [shareEmail, setShareEmail] = useState(false);
//   const [comment, setComment] = useState("");
//   const [paymentMethod, setPaymentMethod] = useState("googlepay");
//   const [frequency, setFrequency] = useState("one-time");
//   const [currency, setCurrency] = useState("USD");
//   const [loading, setLoading] = useState(false);

//   const givingLevels = [
//     {
//       amount: 3,
//       title: "Single Meal Donation",
//       desc: "Donate a meal, save a life.",
//       claimed: 15,
//     },
//     {
//       amount: 20,
//       title: "Two Meals & Care Package",
//       desc: "Supports two individuals with meals and critical care packages.",
//       claimed: 890,
//     },
//     {
//       amount: 30,
//       title: "Family Meal & Care Package Bundle",
//       desc: "Delivers three meals and care packages to sustain a small family.",
//       claimed: 795,
//     },
//     {
//       amount: 70,
//       title: "Large Family Meal & Care Package Bundle",
//       desc: "Delivers multiple meals and care packages for a large family.",
//       claimed: 580,
//     },
//   ];

//   const currencies = [
//     "USD",
//     "EUR",
//     "INR",
//     "GBP",
//     "AUD",
//     "CAD",
//     "SGD",
//     "JPY",
//     "CHF",
//     "CNY",
//     "AED",
//     "NZD",
//     "SAR",
//     "MYR",
//     "PKR",
//     "SEK",
//     "NOK",
//     "DKK",
//     "KRW",
//     "TRY",
//     "RUB",
//   ];

//   // Compute total donation
//   const total = (
//     (customAmount === "" ? selectedAmount : customAmount) + tip
//   ).toFixed(2);

//   // ✅ Save comment + donation info to DB
//   const handleGiveClick = async () => {
//     setLoading(true);
//     try {
//       // Step 1: Show alert (simulating payment success)
//       alert(
//         `You donated ${currency} ${total} via ${paymentMethod} (${frequency})!`
//       );

//       // Step 2: Save comment if available
//       if (comment.trim() !== "") {
//         const res = await fetch("/api/comments", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             campaignId,
//             user: shareEmail ? "Registered Donor" : "Anonymous",
//             text: comment,
//             amount: Number(total),
//           }),
//         });

//         const data = await res.json();
//         if (!data.success) {
//           console.error("Failed to save comment:", data.message);
//         } else {
//           console.log("Comment saved successfully:", data.data);
//         }
//       }

//       // Step 3: Reset fields
//       setComment("");
//     } catch (err) {
//       console.error("Error during donation:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col lg:flex-row gap-8 py-8 max-w-7xl mx-auto mt-8 px-4">
//       {/* LEFT SIDE */}
//       <div className="flex-1 lg:w-3/5">
//         {/* ... (keep your entire left-side code exactly as it is) ... */}

//         {/* Comment Box */}
//         <div>
//           <h3 className="font-semibold text-lg mb-1">Words of support</h3>
//           <p className="text-sm text-gray-500 mb-2">
//             (Optional) Leave a comment for the organizer.
//           </p>
//           <textarea
//             rows={4}
//             value={comment}
//             onChange={(e) => setComment(e.target.value)}
//             className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none"
//             placeholder="Write your message..."
//           />
//         </div>

//         {/* GIVE Button */}
//         <button
//           onClick={handleGiveClick}
//           disabled={loading}
//           className={`w-full bg-green-600 text-white py-3 mt-6 rounded-full font-semibold text-lg hover:bg-green-700 transition ${
//             loading ? "opacity-70 cursor-not-allowed" : ""
//           }`}
//         >
//           {loading ? "Processing..." : `GIVE ${currency} ${total}`}
//         </button>

//         <p className="text-xs text-gray-500 text-center mt-3">
//           Backed by our{" "}
//           <a href="#" className="underline">
//             Trust & Safety guarantee
//           </a>
//         </p>
//       </div>

//       {/* RIGHT SIDE (unchanged) */}
//       <div className="lg:w-2/5">
//         <div className="lg:sticky lg:top-24 bg-gray-50 p-6 rounded-lg shadow-sm h-fit">
//           {/* ... keep your review section exactly as is ... */}
//         </div>
//       </div>
//     </div>
//   );
// }
