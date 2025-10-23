"use client";

import React, { useState, useEffect, useRef, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import type { Editor as TinyMCEEditor } from "tinymce";

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
  "Emergency",
];

// ✅ Normalize any HTML from DB before displaying
function normalizeHTMLContent(html: string): string {
  if (!html) return "";

  // Fix relative image paths to absolute URLs
  return html.replace(
    /<img([^>]*?)src=["'](?!https?:|data:)([^"']+)["']/gi,
    (_match, before, src) => {
      let fixed = src;
      // Remove starting ../ or ./ if any
      fixed = fixed.replace(/^(\.\.\/|\.\/)/, "");
      // Add leading slash if missing
      if (!fixed.startsWith("/")) fixed = "/" + fixed;
      return `<img${before}src="${fixed}"`;
    }
  );
}

export default function EditCampaign() {
  const { id } = useParams();
  const router = useRouter();
  const editorRef = useRef<TinyMCEEditor | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    goal: "",
    endDate: "",
    isFeatured: false,
  });

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ✅ Fetch campaign from DB
  useEffect(() => {
    setMounted(true);
    const fetchCampaign = async () => {
      try {
        const res = await fetch(`/api/campaigns/${id}`, { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load campaign");

        const c = data.data;
        const fixedDesc = normalizeHTMLContent(
          c.description || c.content || ""
        );

        setForm({
          title: c.title || "",
          description: fixedDesc,
          category: c.category || "",
          goal: c.goal || "",
          endDate: c.endDate?.slice(0, 10) || "",
          isFeatured: c.isFeatured || false,
        });
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Error fetching campaign");
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [id]);

  // ✅ Save updates
  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const updatedHTML = editorRef.current
      ? editorRef.current.getContent()
      : form.description;

    // Extract all image URLs to store separately
    const images: string[] = [];
    const regex = /<img[^>]+src=["']([^"']+)["']/g;
    let match;
    while ((match = regex.exec(updatedHTML)) !== null) {
      images.push(match[1]);
    }

    try {
      const res = await fetch(`/api/campaigns/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          description: updatedHTML,
          images,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");
      router.push(`/admin/campaigns/${id}`);
    } catch (err: any) {
      console.error("Save error:", err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <div className="p-6 text-center text-gray-500">Loading...</div>;

  return (
    <div className="ml-4 max-w-6xl p-6 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-6">Edit Campaign</h1>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-600 rounded">{error}</div>
      )}

      <form onSubmit={handleSave} className="flex flex-col md:flex-row gap-6">
        {/* LEFT SIDE */}
        <div className="flex-1 flex flex-col gap-4">
          <input
            type="text"
            placeholder="Campaign Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="border p-2 rounded w-full shadow-sm focus:ring focus:ring-blue-200"
            required
          />

          {/* ✅ TinyMCE Editor with full image support */}
          {mounted && (
            <Editor
              apiKey={tinyMCEApiKey}
              onInit={(_evt, editor) => (editorRef.current = editor)}
              value={form.description}
              init={{
                height: 450,
                menubar: true,
                automatic_uploads: true,
                images_reuse_filename: true,
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
              onEditorChange={(content) =>
                setForm({ ...form, description: content })
              }
            />
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="w-72 flex flex-col gap-4 p-4 bg-white/70 rounded shadow-md">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          {/* Category */}
          <div className="flex flex-col gap-1">
            <label className="font-medium">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
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

          {/* Goal */}
          <div className="flex flex-col gap-1">
            <label className="font-medium">Goal (₹)</label>
            <input
              type="number"
              value={form.goal}
              onChange={(e) => setForm({ ...form, goal: e.target.value })}
              className="border p-2 rounded focus:ring focus:ring-blue-200"
              required
            />
          </div>

          {/* End Date */}
          <div className="flex flex-col gap-1">
            <label className="font-medium">End Date</label>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              className="border p-2 rounded focus:ring focus:ring-blue-200"
              required
            />
          </div>

          {/* Featured */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) =>
                setForm({ ...form, isFeatured: e.target.checked })
              }
              className="w-4 h-4"
            />
            <label className="font-medium">Feature this campaign</label>
          </div>

          {/* Cancel */}
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => router.push("/admin/campaigns")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
