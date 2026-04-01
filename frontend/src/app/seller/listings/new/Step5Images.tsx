// import { Controller, UseFormReturn } from "react-hook-form";
// import { PropertyFormData } from "@/schemas/property.schema";
// import { useEffect, useState } from "react";

// type Props = {
//   form: UseFormReturn<PropertyFormData>;
//   isSubmitting?: boolean;
// };

// export default function Step5Images({ form }: Props) {
//   const images = form.watch("images") || [];
//   const [isUploading, setIsUploading] = useState(false);

//   // Replace these with your actual Cloudinary details
//   const CLOUD_NAME = "di6tk193z";           // ← Change this
//   const UPLOAD_PRESET = "qtx6d9f8";     // ← Change this (unsigned preset)

//   // Initialize Cloudinary Upload Widget
//   useEffect(() => {
//     // Load Cloudinary widget script
//     const script = document.createElement("script");
//     script.src = "https://upload-widget.cloudinary.com/global/all.js";
//     script.async = true;
//     document.body.appendChild(script);

//     return () => {
//       document.body.removeChild(script);
//     };
//   }, []);

//   const openCloudinaryWidget = () => {
//     if (images.length >= 20) {
//       alert("Maximum 20 images allowed");
//       return;
//     }

//     const remainingSlots = 20 - images.length;

//     // @ts-ignore
//     const myWidget = window.cloudinary.createUploadWidget(
//       {
//         cloudName: CLOUD_NAME,
//         uploadPreset: UPLOAD_PRESET,
//         maxFiles: remainingSlots,
//         multiple: true,
//         sources: ["local", "url", "camera", "google_drive", "dropbox"],
//         folder: "property-listings", // optional
//         clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
//       },
//       (error: any, result: any) => {
//         if (!error && result && result.event === "success") {
//           const currentImages = form.getValues("images") || [];
//           const newImageUrl = result.info.secure_url;

//           form.setValue(
//             "images",
//             [...currentImages, newImageUrl],
//             { shouldValidate: true }
//           );
//         }

//         if (result.event === "close") {
//           setIsUploading(false);
//         }
//       }
//     );

//     myWidget.open();
//   };

//   const removeImage = (index: number) => {
//     const current = form.getValues("images") || [];
//     form.setValue(
//       "images",
//       current.filter((_, i) => i !== index),
//       { shouldValidate: true }
//     );
//   };

//   return (
//     <div className="space-y-8">
//       <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50/80 px-5 py-5">
//         <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
//           Property Images
//         </p>
//         <p className="mt-3 text-sm leading-7 text-slate-600">
//           Upload up to <strong>20 images</strong>. Bright, high-quality photos work best.
//         </p>
//       </div>

//       <div className="space-y-4">
//         {images.length === 0 && (
//           <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/80 px-5 py-5 text-sm leading-7 text-slate-600">
//             No images uploaded yet. Click the button below to start uploading.
//           </div>
//         )}

//         {images.map((url, index) => (
//           <div
//             key={index}
//             className="flex flex-col gap-3 rounded-[1.5rem] border border-slate-200/80 bg-white/80 p-4 sm:flex-row sm:items-center"
//           >
//             <div className="flex-1">
//               <div className="flex items-center gap-3">
//                 <img
//                   src={url}
//                   alt={`Property ${index + 1}`}
//                   className="h-20 w-20 rounded-2xl object-cover border border-slate-200"
//                 />
//                 <div className="flex-1 truncate text-sm text-slate-600">
//                   {url.substring(0, 60)}...
//                 </div>
//               </div>
//             </div>

//             <button
//               type="button"
//               onClick={() => removeImage(index)}
//               className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
//             >
//               ✕
//             </button>
//           </div>
//         ))}
//       </div>

//       <button
//         type="button"
//         onClick={openCloudinaryWidget}
//         disabled={images.length >= 20 || isUploading}
//         className="rounded-full border border-slate-900/10 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
//       >
//         {images.length >= 20 
//           ? "Maximum 20 images reached" 
//           : `Upload Images (${images.length}/20)`}
//       </button>

//       <p className="text-xs text-slate-500">
//         Images are uploaded directly to Cloudinary and stored securely.
//       </p>
//     </div>
//   );
// }

import { Controller, UseFormReturn } from "react-hook-form";
import { PropertyFormData } from "@/schemas/property.schema";
import { useEffect, useState } from "react";

type Props = {
  form: UseFormReturn<PropertyFormData>;
};

export default function Step5Images({ form }: Props) {
  const media = form.watch("images") || [];
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragging, setDragging] = useState(false);

  const CLOUD_NAME = "di6tk193z";           
  const UPLOAD_PRESET = "qtx6d9f8";  

  //  Cloudinary Upload Widget
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://upload-widget.cloudinary.com/global/all.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const openCloudinaryWidget = () => {
    if (media.length >= 20) {
      alert("You have reached the maximum of 20 media files.");
      return;
    }

    // @ts-ignore
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUD_NAME,
        uploadPreset: UPLOAD_PRESET,
        maxFiles: 20 - media.length,
        multiple: true,
        sources: ["local", "url", "camera", "google_drive", "dropbox"],
        resourceType: "auto",
        clientAllowedFormats: ["jpg", "jpeg", "png", "webp", "mp4", "mov"],
        folder: "property-media",
      },
      (error: any, result: any) => {
        if (result?.event === "success") {
          const current = form.getValues("images") || [];
          form.setValue("images", [...current, result.info.secure_url], {
            shouldValidate: true,
          });
        }

        if (result?.event === "progress") {
          setUploadProgress(Math.round(result.info.progress));
        }

        if (result?.event === "close") {
          setIsUploading(false);
          setUploadProgress(0);
        }
      }
    );

    setIsUploading(true);
    widget.open();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    alert("Please use the Upload button above for Cloudinary integration.");
  };

  const addExternalUrl = () => {
    const url = prompt("Paste YouTube or external video URL here:");
    if (!url) return;

    const current = form.getValues("images") || [];
    form.setValue("images", [...current, url], { shouldValidate: true });
  };

  const removeMedia = (index: number) => {
    const current = form.getValues("images") || [];
    form.setValue(
      "images",
      current.filter((_, i) => i !== index),
      { shouldValidate: true }
    );
  };

  return (
    <div className="space-y-8">
      <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50/80 px-5 py-5">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
          Property Media
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Upload up to <strong>20 images or videos</strong> using Cloudinary. You can also add YouTube links.
        </p>
      </div>

      {/* Drag & Drop Area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`rounded-[1.5rem] border-2 border-dashed p-12 text-center transition-all ${
          dragging ? "border-teal-500 bg-teal-50" : "border-slate-300 bg-slate-50/80"
        }`}
      >
        <p className="text-slate-500 mb-4">Drag and drop images or videos here</p>
        <button
          type="button"
          onClick={openCloudinaryWidget}
          disabled={media.length >= 20 || isUploading}
          className="rounded-full bg-teal-600 px-8 py-3.5 text-white font-semibold hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading 
            ? `Uploading... ${uploadProgress}%` 
            : "📤 Upload Images & Videos"}
        </button>
      </div>

      {/* Media List */}
      <div className="space-y-4">
        {media.length === 0 && (
          <div className="rounded-[1.5rem] border border-slate-200 bg-white/80 px-6 py-12 text-center text-slate-500">
            No media added yet. Start uploading above.
          </div>
        )}

        {media.map((url: string, index: number) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-4"
          >
            <div className="flex-shrink-0">
              {url.includes("youtube.com") || url.includes("youtu.be") ? (
                <img
                  src={`https://img.youtube.com/vi/${url.split("v=")[1] || url.split("/").pop()}/hqdefault.jpg`}
                  alt="YouTube thumbnail"
                  className="h-24 w-40 rounded-2xl object-cover"
                />
              ) : (
                <img
                  src={
                    url.includes(".mp4") || url.includes(".mov")
                      ? "https://via.placeholder.com/160x100/1f2937/ffffff?text=VIDEO"
                      : url
                  }
                  alt={`Media ${index + 1}`}
                  className="h-24 w-40 rounded-2xl object-cover border border-slate-200"
                />
              )}
            </div>

            <div className="flex-1 min-w-0 pt-2">
              <p className="text-sm text-slate-600 break-all line-clamp-3">{url}</p>
              <p className="text-xs text-slate-400 mt-1">
                {url.includes("youtube.com") || url.includes("youtu.be")
                  ? "YouTube Video"
                  : url.includes(".mp4") || url.includes(".mov")
                  ? "Video"
                  : "Image"}
              </p>
            </div>

            <button
              type="button"
              onClick={() => removeMedia(index)}
              className="h-10 w-10 rounded-full border border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-600 transition flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={openCloudinaryWidget}
          disabled={media.length >= 20 || isUploading}
          className="rounded-full border border-slate-900/10 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          📤 Upload More Media ({media.length}/20)
        </button>

        <button
          type="button"
          onClick={addExternalUrl}
          className="rounded-full border border-slate-900/10 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          + Add YouTube / External URL
        </button>
      </div>

      <p className="text-xs text-slate-500">
        Images and videos are securely hosted on Cloudinary. YouTube links are stored directly.
      </p>
    </div>
  );
}