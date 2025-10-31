"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import dynamic from "next/dynamic";
import type { Editor as TinyMCEEditor } from "tinymce";

// 🧩 Dynamically import TinyMCE Editor (client-only)
const Editor = dynamic(
  () => import("@tinymce/tinymce-react").then((mod) => mod.Editor),
  { ssr: false }
);

// 🧩 Image upload type
interface TinyMCEBlobInfo {
  blob: () => Blob;
  filename: () => string;
}

// 🧩 TinyMCE API key
const tinyMCEApiKey = "z5vh0ddczzx3mymq1w8u9vbp4usbm66sp02g17wlf3jtnl91";

// 🧩 Category options
const categories = [
  "Education",
  "Health",
  "Environment",
  "Animals",
  "Community",
];

export default function CreateCampaign() {
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const [mounted, setMounted] = useState(false);

  // 🧩 Campaign form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");

  // ✅ Prevent hydration mismatch for TinyMCE
  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ Load user from localStorage (you can adjust this to your auth system)
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsed = JSON.parse(userData);
      setUserEmail(parsed.email || "");
      setUserId(parsed._id || "");
    }
  }, []);

  // ✅ Load fundraising data from localStorage for auto-fill
  useEffect(() => {
    const stored = localStorage.getItem("fundraisingData");
    if (stored) {
      const parsed = JSON.parse(stored);

      // Prefill goal and reason-based category if available
      if (parsed.goal) setAmount(parsed.goal);
      if (parsed.reason) setCategory(parsed.reason);
    }
  }, []);

  // ✅ Handle campaign submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    if (!title || !editorRef.current) {
      setError("❌ Title and description are required");
      setLoading(false);
      return;
    }

    if (!userEmail) {
      setError("❌ User information missing. Please log in first.");
      setLoading(false);
      return;
    }

    const htmlContent = editorRef.current.getContent();

    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: htmlContent,
          category,
          goal: Number(amount),
          endDate,
          createdById: userId,
          createdByEmail: userEmail,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create campaign");

      setSuccessMsg("✅ Campaign created successfully!");
      setTitle("");
      setCategory("");
      setAmount("");
      setEndDate("");
      editorRef.current?.setContent("");

      // 🧹 Optional: clear fundraising data after campaign creation
      localStorage.removeItem("fundraisingData");
    } catch (err: any) {
      console.error("❌ Campaign creation error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ml-4 max-w-6xl p-6 bg-white/30 shadow-md rounded mt-10">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-6">
        {/* 🧩 Left Column — Editor */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Title Input */}
          <input
            type="text"
            placeholder="Campaign Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 rounded w-full shadow-sm focus:ring focus:ring-blue-200"
            required
          />

          {/* TinyMCE Editor */}
          {mounted && (
            <Editor
              apiKey={tinyMCEApiKey}
              onInit={(_evt, editor) => (editorRef.current = editor)}
              init={{
                height: 400,
                menubar: true,
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "help",
                  "wordcount",
                ],
                toolbar:
                  "undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright | bullist numlist outdent indent | removeformat | image | code",
                automatic_uploads: true,
                images_upload_handler: async (blobInfo: TinyMCEBlobInfo) => {
                  const formData = new FormData();
                  formData.append("file", blobInfo.blob(), blobInfo.filename());

                  const resp = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                  });

                  if (!resp.ok) throw new Error("Image upload failed");
                  const json = await resp.json();
                  return json.location as string;
                },
              }}
            />
          )}
        </div>

        {/* 🧩 Right Column — Campaign Info */}
        <div className="w-full md:w-64 flex flex-col gap-4 p-4 bg-white/70 rounded shadow-md">
          {/* Save Button */}
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-[#094C3B] text-white rounded hover:bg-[#094C3B] disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Campaign"}
          </button>

          {/* Error & Success Messages */}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {successMsg && <p className="text-green-600 text-sm">{successMsg}</p>}

          {/* Category */}
          <div className="flex flex-col gap-1">
            <label className="font-medium">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border p-2 rounded focus:ring focus:ring-blue-200"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Goal Amount */}
          <div className="flex flex-col gap-1">
            <label className="font-medium">Goal Amount ($)</label>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border p-2 rounded focus:ring focus:ring-blue-200"
              required
            />
          </div>

          {/* End Date */}
          <div className="flex flex-col gap-1">
            <label className="font-medium">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border p-2 rounded focus:ring focus:ring-blue-200"
              required
            />
          </div>
        </div>
      </form>
    </div>
  );
}
