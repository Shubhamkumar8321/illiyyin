"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function AdminCampaignDetail() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;

  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 📝 Notes
  const [notes, setNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 5;

  // ✅ Universal image sanitizer — works for TinyMCE HTML and DB URLs
  const normalizeHTML = (html: string) => {
    if (!html) return "<em>No description provided.</em>";

    return html
      .replace(
        /<img([^>]*?)src=["'](?!https?:|data:)([^"']+)["']/gi,
        (_match, before, src) => {
          let fixed = src.replace(/^(\.\.\/|\.\/)/, "");
          if (!fixed.startsWith("/")) fixed = "/" + fixed;
          return `<img${before}src="${fixed}"`;
        }
      )
      .replace(
        /<img/gi,
        `<img style="max-width:100%;height:auto;object-fit:contain;border-radius:8px;margin:8px 0;display:block;" loading="lazy" onerror="this.src='/placeholder.jpg'"`
      );
  };

  // ✅ Safe image URL resolver
  const getSafeImageUrl = (url: string) => {
    if (!url) return "/placeholder.jpg";
    const isDataUrl = url.startsWith("data:image/");
    const isHttpUrl = /^https?:\/\//i.test(url);
    if (isDataUrl || isHttpUrl) return url;
    if (url.startsWith("/")) return url;
    return `/uploads/${url}`;
  };

  // ✅ Fetch campaign from DB
  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await fetch(`/api/admin/campaigns/${campaignId}/edit`);
        const data = await res.json();

        if (data.success && data.campaign) {
          setCampaign(data.campaign);
        } else {
          setError("Campaign not found");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch campaign");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [campaignId]);

  // ✅ Fetch notes from DB
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch(`/api/campaigns/${campaignId}/notes`);
        const data = await res.json();
        if (data.success) {
          setNotes(data.notes);
        }
      } catch (err) {
        console.error("Error fetching notes:", err);
      }
    };

    fetchNotes();
  }, [campaignId]);

  // ✅ Add note to DB
  const addNote = async () => {
    if (!newNote.trim()) return;

    try {
      const res = await fetch(`/api/campaigns/${campaignId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newNote }),
      });

      const data = await res.json();
      if (data.success) {
        setNotes([data.note, ...notes]);
        setNewNote("");
        setPage(1);
      } else {
        alert(data.message || "Failed to add note");
      }
    } catch (err) {
      console.error("Error adding note:", err);
      alert("Server error while adding note");
    }
  };

  const totalPages = Math.ceil(notes.length / perPage) || 1;
  const currentNotes = notes.slice((page - 1) * perPage, page * perPage);

  // ✅ Loading & error handling
  if (loading)
    return <p className="p-6 text-center text-gray-500">Loading campaign...</p>;

  if (error || !campaign)
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 text-lg mb-4">
          ❌ {error || "Campaign not found"}
        </p>
        <button
          onClick={() => router.push("/admin/campaigns")}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded transition"
        >
          Back to Campaigns
        </button>
      </div>
    );

  // ✅ Ensure valid images
  const imageList =
    Array.isArray(campaign.images) && campaign.images.length > 0
      ? campaign.images
      : ["/placeholder.jpg"];

  return (
    <div className="p-6 space-y-8 bg-white shadow-lg rounded-xl max-w-6xl mx-auto mt-6">
      {/* 📄 Campaign Info */}
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-gray-800">{campaign.title}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <p>
            <strong>Category:</strong> {campaign.category || "N/A"}
          </p>
          <p>
            <strong>Goal:</strong> ₹{Number(campaign.goal).toLocaleString()}
          </p>
          <p>
            <strong>Raised:</strong> ₹{Number(campaign.raised).toLocaleString()}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`px-2 py-1 rounded text-xs font-semibold ${
                campaign.status === "approved"
                  ? "bg-green-100 text-green-700"
                  : campaign.status === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {campaign.status}
            </span>
          </p>
          <p>
            <strong>End Date:</strong>{" "}
            {new Date(campaign.endDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Featured:</strong> {campaign.isFeatured ? "🌟 Yes" : "— No"}
          </p>
        </div>
        {/* 🧾 Description (TinyMCE HTML with universal image support) */}
        <div className="mt-6">
          <strong className="text-gray-800">Description:</strong>
          <div
            className="mt-2 p-4 border rounded bg-gray-50 text-gray-800 leading-relaxed prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{
              __html: normalizeHTML(
                campaign.description ||
                  campaign.content ||
                  "<em>No description provided.</em>"
              ),
            }}
          />
        </div>
      </div>

      {/* 📝 Admin Notes Section */}
      <div className="pt-6 border-t border-gray-200">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">
          📝 Admin Notes
        </h3>

        {notes.length === 0 ? (
          <p className="text-gray-500">No notes yet.</p>
        ) : (
          <>
            <ul className="list-disc pl-6 space-y-2">
              {currentNotes.map((note, i) => (
                <li
                  key={i}
                  className="text-gray-700 bg-gray-100 p-2 rounded shadow-sm"
                >
                  {note.text}
                  <span className="block text-xs text-gray-500 mt-1">
                    {new Date(note.createdAt).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-4 space-x-4">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
                >
                  Prev
                </button>
                <span className="text-sm">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Add Note */}
        <div className="mt-6 flex flex-col md:flex-row gap-2">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Write an internal note..."
            className="border p-3 rounded flex-1 focus:outline-none focus:ring focus:ring-blue-300"
          />
          <button
            onClick={addNote}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded transition"
          >
            Add
          </button>
        </div>
      </div>

      {/* ⬅ Back Button */}
      <div className="border-t pt-4">
        <button
          onClick={() => router.push("/admin/campaigns")}
          className="mt-4 px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded transition"
        >
          ⬅ Back to Campaigns
        </button>
      </div>
    </div>
  );
}
