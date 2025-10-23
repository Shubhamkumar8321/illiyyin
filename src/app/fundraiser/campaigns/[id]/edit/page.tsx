"use client";

import React, { useEffect, useState, useRef, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import type { Editor as TinyMCEEditor } from "tinymce";

// ✅ Client-only import
const Editor = dynamic(
  () => import("@tinymce/tinymce-react").then((mod) => mod.Editor),
  { ssr: false }
);

interface TinyMCEBlobInfo {
  blob: () => Blob;
  filename: () => string;
}

const tinyMCEApiKey = "z5vh0ddczzx3mymq1w8u9vbp4usbm66sp02g17wlf3jtnl91";

const categories = [
  "Education",
  "Health",
  "Environment",
  "Animals",
  "Community",
];

type Campaign = {
  _id: string;
  title: string;
  content?: string;
  description?: string;
  category: string;
  goal: number;
  raised: number;
  endDate: string;
  isFeatured: boolean;
};

export default function FundEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const editorRef = useRef<TinyMCEEditor | null>(null);

  const [draft, setDraft] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  // ✅ Normalize HTML safely before showing editor
  function normalizeHTMLContent(html: string): string {
    if (!html) return "";
    let fixedHTML = html;

    // 1️⃣ Fix relative image paths (prepend /uploads or domain if needed)
    fixedHTML = fixedHTML.replace(
      /<img([^>]*?)src=["'](?!https?:|data:)([^"']+)["']/g,
      `<img$1src="/$2"`
    );

    // 2️⃣ Ensure proper closing tags for malformed markup
    fixedHTML = fixedHTML.replace(/<\/?p[^>]*>/g, (tag) => tag.toLowerCase());

    return fixedHTML;
  }

  // ✅ Fetch campaign
  useEffect(() => {
    setMounted(true);
    setLoading(true);

    const fetchCampaign = async () => {
      try {
        const res = await fetch(`/api/campaigns/${id}`, { cache: "no-store" });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to fetch campaign");
        }

        const data = await res.json();
        const fetched = data.data;

        // ✅ Always ensure "content" has valid HTML
        const html = normalizeHTMLContent(
          fetched.content || fetched.description || ""
        );
        setDraft({ ...fetched, content: html });
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

  // ✅ Save handler
  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!draft || !editorRef.current) return;

    setSaving(true);
    setError("");

    try {
      const htmlContent = editorRef.current.getContent();

      const res = await fetch(`/api/campaigns/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...draft, content: htmlContent }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to update campaign");

      router.push(`/fundraiser/campaigns/${id}`);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <p className="p-6 text-center text-gray-500">Loading...</p>;
  if (error && !draft)
    return <p className="p-6 text-center text-red-500">{error}</p>;
  if (!draft)
    return <p className="p-6 text-center text-gray-500">Campaign not found</p>;

  return (
    <div className="ml-4 max-w-6xl p-6 bg-white/20 shadow-md rounded">
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSave} className="flex flex-col md:flex-row gap-6">
        {/* LEFT COLUMN */}
        <div className="flex-1 flex flex-col gap-4">
          <input
            type="text"
            placeholder="Campaign Title"
            value={draft.title || ""}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            className="border p-2 rounded w-full shadow-sm focus:ring focus:ring-blue-200"
            required
          />

          {/* ✅ Editor that always shows images */}
          {mounted && (
            <Editor
              apiKey={tinyMCEApiKey}
              onInit={(_evt, editor) => (editorRef.current = editor)}
              value={draft.content || ""}
              init={{
                height: 400,
                menubar: true,
                automatic_uploads: true,
                images_reuse_filename: true,
                images_upload_base_path: "/uploads",
                convert_urls: false,
                relative_urls: false,
                remove_script_host: false,
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
                  "undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright | bullist numlist outdent indent | removeformat | image | code | preview",
                images_upload_handler: async (blobInfo: TinyMCEBlobInfo) => {
                  const formData = new FormData();
                  formData.append("file", blobInfo.blob(), blobInfo.filename());
                  const resp = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                  });
                  if (!resp.ok) throw new Error("Upload failed");
                  const json = await resp.json();
                  return json.location as string;
                },
                file_picker_types: "image",
                file_picker_callback: (cb) => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*";
                  input.onchange = async (e: any) => {
                    const file = e.target.files[0];
                    const formData = new FormData();
                    formData.append("file", file);
                    const resp = await fetch("/api/upload", {
                      method: "POST",
                      body: formData,
                    });
                    const json = await resp.json();
                    cb(json.location, { title: file.name });
                  };
                  input.click();
                },
              }}
              onEditorChange={(newContent) =>
                setDraft({ ...draft, content: newContent })
              }
            />
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="w-full md:w-64 flex flex-col gap-4 p-4 bg-white/50 rounded shadow-md">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>

          <div className="flex flex-col gap-1">
            <label className="font-medium">Category</label>
            <select
              value={draft.category || ""}
              onChange={(e) => setDraft({ ...draft, category: e.target.value })}
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

          <div className="flex flex-col gap-1">
            <label className="font-medium">Goal Amount (₹)</label>
            <input
              type="number"
              placeholder="Amount to Raise"
              value={draft.goal || ""}
              onChange={(e) =>
                setDraft({ ...draft, goal: Number(e.target.value) })
              }
              className="border p-2 rounded focus:ring focus:ring-blue-200"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-medium">End Date</label>
            <input
              type="date"
              value={draft.endDate || ""}
              onChange={(e) => setDraft({ ...draft, endDate: e.target.value })}
              className="border p-2 rounded focus:ring focus:ring-blue-200"
              required
            />
          </div>

          <button
            type="button"
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => router.push(`/fundraiser/campaigns/${id}`)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
