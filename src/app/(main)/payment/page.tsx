"use client";

import { useState, useEffect } from "react";
import { CreditCard, Smartphone } from "lucide-react";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation"; // ✅ added

// ✅ initialize Stripe once (safe for SSR)
let stripePromise: Promise<Stripe | null>;
if (typeof window !== "undefined") {
  stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
  );
} else {
  stripePromise = Promise.resolve(null);
}

export default function DonationPage() {
  // ✅ Read URL params
  const searchParams = useSearchParams();

  // --------------------- STATES ---------------------
  const [selectedAmount, setSelectedAmount] = useState(20);
  const [customAmount, setCustomAmount] = useState<number | "">("");
  const [isZakat, setIsZakat] = useState(false);
  const [tip, setTip] = useState<number>(3.2);
  const [tipType, setTipType] = useState<string | number>(3.2);
  const [customTip, setCustomTip] = useState<number | "">("");
  const [comment, setComment] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("googlepay");
  const [frequency, setFrequency] = useState("one-time");
  const [currency, setCurrency] = useState("USD");
  const [loading, setLoading] = useState(false);

  const [campaignId, setCampaignId] = useState<string | null>(null); // ✅ added

  // ✅ Get donation amount + campaignId from URL
  useEffect(() => {
    const amt = searchParams.get("amount");
    const camp = searchParams.get("campaignId");

    if (amt) {
      setSelectedAmount(Number(amt));
      setCustomAmount("");
    }

    if (camp) setCampaignId(camp);
  }, [searchParams]);

  // --------------------- SUCCESS / CANCEL ALERTS ---------------------
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");

    if (status === "success") {
      alert("✅ Donation Successful! Thank you for your support 💚");
    } else if (status === "cancel") {
      alert("❌ Payment cancelled. You can try again.");
    }

    if (status) {
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  // --------------------- STATIC DATA ---------------------
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
      desc: "Supports two individuals with meals and care packages.",
      claimed: 890,
    },
    {
      amount: 30,
      title: "Family Meal & Care Package Bundle",
      desc: "Delivers meals & care packages for a small family.",
      claimed: 795,
    },
    {
      amount: 70,
      title: "Large Family Meal Bundle",
      desc: "Meals & care packages for a large family.",
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

  // --------------------- TIP AUTO-CALCULATION ---------------------
  useEffect(() => {
    const baseAmount = customAmount === "" ? selectedAmount : customAmount;
    if (tipType !== "custom") {
      const tipPercentage = Number(tipType);
      const calculatedTip = (tipPercentage / 20) * baseAmount;
      setTip(Number(calculatedTip.toFixed(2)));
    }
  }, [customAmount, selectedAmount, tipType]);

  // --------------------- TOTAL ---------------------
  const total = (
    (customAmount === "" ? selectedAmount : customAmount) + tip
  ).toFixed(2);

  // --------------------- STRIPE CHECKOUT ---------------------
  const handleGiveClick = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(total),
          currency,
          frequency,
          comment,

          // ✅ IMPORTANT FIELDS SENT TO BACKEND
          actualDonation: customAmount === "" ? selectedAmount : customAmount,
          tip,
          isZakat,
          campaignId,
          paymentMethod,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.url) {
        alert(`❌ ${data.error || "Failed to create checkout session."}`);
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch (err) {
      console.error("Stripe Checkout Error:", err);
      alert("⚠️ Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // --------------------- CURRENCY SYMBOL ---------------------
  const getSymbol = (currency: string) => {
    switch (currency) {
      case "USD":
        return "$";
      case "EUR":
        return "€";
      case "INR":
        return "₹";
      default:
        return currency;
    }
  };

  // --------------------- UI ---------------------
  return (
    <div className="flex flex-col lg:flex-row gap-8 py-8 max-w-7xl mx-auto mt-8 px-4">
      {/* LEFT SIDE */}
      <div className="flex-1 lg:w-3/5">
        <h2 className="text-xl font-semibold mb-2">
          Support{" "}
          <span className="text-[#094C3B]">
            Help Give 400K Meals to Palestinian Families!
          </span>
        </h2>
        <p className="text-sm text-gray-500 mb-6">Organized by Webspecia</p>

        {/* Frequency */}
        <div className="flex bg-gray-100 rounded-full mb-6 overflow-hidden">
          <button
            onClick={() => setFrequency("one-time")}
            className={`flex-1 py-2 font-medium rounded-full ${
              frequency === "one-time"
                ? "bg-[#2B8C73] text-white"
                : "text-gray-600"
            }`}
          >
            One-time
          </button>
          <button
            onClick={() => setFrequency("recurring")}
            className={`flex-1 py-2 font-medium rounded-full ${
              frequency === "recurring"
                ? "bg-[#2B8C73] text-white"
                : "text-gray-600"
            }`}
          >
            Recurring
          </button>
        </div>

        {/* Currency */}
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
            <span className="text-xl font-semibold">{getSymbol(currency)}</span>
            <input
              type="number"
              placeholder="0.00"
              min={0}
              value={customAmount}
              onChange={(e) => {
                const value =
                  e.target.value === "" ? "" : Number(e.target.value);
                setCustomAmount(value);
                setSelectedAmount(0);
              }}
              className="w-full text-right outline-none text-xl font-semibold"
            />
          </div>
        </div>

        {/* Preset Levels */}
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
                className={`border rounded-lg p-4 cursor-pointer transition hover:border-[#094C3B] ${
                  selectedAmount === level.amount
                    ? "border-[#094C3B] bg-green-50"
                    : "border-gray-200"
                }`}
              >
                <p className="text-xl font-bold">
                  {getSymbol(currency)}
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
            Because Illiyyin doesn&apos;t charge a platform fee, we rely on
            donors like you 💖
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={tipType}
              onChange={(e) => {
                const value = e.target.value;
                setTipType(value);
                if (value !== "custom") setCustomTip("");
              }}
              className="border px-3 py-2 rounded-lg text-gray-700"
            >
              <option value={3.2}>16% (auto)</option>
              <option value={2}>10% (auto)</option>
              <option value={0}>No Tip ($0.00)</option>
              <option value="custom">Custom Amount</option>
            </select>

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

        {/* Comment Box */}
        <div className="mt-10">
          <h3 className="text-lg font-semibold mb-2">
            Leave a comment (optional)
          </h3>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your message or prayer..."
            className="w-full border rounded-lg p-3 text-gray-700 min-h-[100px]"
          />
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

        <button
          onClick={handleGiveClick}
          disabled={loading}
          className={`w-full ${
            loading ? "bg-gray-400" : "bg-[#2B8C73] hover:bg-[#2B8C80]"
          } text-white py-3 mt-6 rounded-full font-semibold text-lg transition`}
        >
          {loading ? "Redirecting..." : `GIVE ${currency} ${total}`}
        </button>
      </div>

      {/* RIGHT SIDE */}
      <div className="lg:w-2/5">
        <div className="lg:sticky lg:top-24 bg-gray-50 p-6 rounded-lg shadow-sm h-fit">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            Zakat-verified campaign{" "}
          </h3>
          <label className="flex items-center gap-2 mt-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isZakat}
              onChange={() => setIsZakat(!isZakat)}
            />
            <span className="text-gray-700">Count this as your Zakat</span>
          </label>

          <h3 className="text-lg font-semibold mt-6 mb-3">Review</h3>
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
  );
}
