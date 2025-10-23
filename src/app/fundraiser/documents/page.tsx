// "use client";
// import { useState } from "react";

// export default function DocumentsPage() {
//   const [files, setFiles] = useState<File[]>([]);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files) return;
//     setFiles(Array.from(e.target.files));
//   };

//   const handleUpload = () => {
//     alert(`Uploading ${files.length} file(s)`);
//     // Here you can integrate your API
//   };

//   return (
//     <div className="space-y-6">
//       <div className="p-4 bg-white shadow rounded space-y-4">
//         <input
//           type="file"
//           multiple
//           onChange={handleFileChange}
//           className="border p-2 rounded w-full"
//         />
//         <button
//           onClick={handleUpload}
//           disabled={files.length === 0}
//           className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
//         >
//           Upload
//         </button>
//       </div>

//       {files.length > 0 && (
//         <div className="p-4 bg-gray-50 rounded shadow">
//           <h2 className="font-semibold mb-2">Selected Files</h2>
//           <ul className="list-disc list-inside space-y-1">
//             {files.map((file, index) => (
//               <li key={index}>
//                 {file.name} - {(file.size / 1024).toFixed(2)} KB
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }
"use client";
import { useState, useEffect } from "react";

interface DocumentFile {
  _id: string;
  name: string;
  size: number;
  url: string;
}

export default function DocumentsPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<DocumentFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFiles(Array.from(e.target.files));
  };

  const fetchUploadedFiles = async () => {
    try {
      const res = await fetch("/api/documents");
      const data = await res.json();
      if (res.ok) setUploadedFiles(data.files);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  const handleUpload = async () => {
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    setLoading(true);
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        alert("Files uploaded successfully!");
        setFiles([]);
        fetchUploadedFiles();
      } else {
        alert(data.message || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return;
    try {
      const res = await fetch(`/api/documents/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("File deleted!");
        fetchUploadedFiles();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (file: DocumentFile) => {
    setEditingId(file._id);
    setEditName(file.name);
  };

  const handleSaveEdit = async (id: string) => {
    try {
      const res = await fetch(`/api/documents/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName }),
      });
      if (res.ok) {
        setEditingId(null);
        fetchUploadedFiles();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-white shadow rounded space-y-4">
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleUpload}
          disabled={files.length === 0 || loading}
          className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {files.length > 0 && (
        <div className="p-4 bg-gray-50 rounded shadow">
          <h2 className="font-semibold mb-2">Selected Files</h2>
          <ul className="list-disc list-inside space-y-1">
            {files.map((file, index) => (
              <li key={index}>
                {file.name} - {(file.size / 1024).toFixed(2)} KB
              </li>
            ))}
          </ul>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="p-4 bg-white rounded shadow">
          <h2 className="font-semibold mb-2">Uploaded Files</h2>
          <ul className="list-disc list-inside space-y-1">
            {uploadedFiles.map((file) => (
              <li key={file._id} className="flex items-center gap-2">
                {editingId === file._id ? (
                  <>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="border p-1 rounded"
                    />
                    <button
                      onClick={() => handleSaveEdit(file._id)}
                      className="px-2 py-1 bg-blue-500 text-white rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-2 py-1 bg-gray-300 rounded"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex-1"
                    >
                      {file.name} - {(file.size / 1024).toFixed(2)} KB
                    </a>
                    <button
                      onClick={() => handleEdit(file)}
                      className="px-2 py-1 bg-yellow-400 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(file._id)}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
