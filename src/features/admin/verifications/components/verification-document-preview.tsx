"use client";

import React, { useState } from "react";
import {
  FileText,
  ZoomIn,
  ZoomOut,
  ShieldCheck,
  AlertTriangle,
  Lock,
} from "lucide-react";
import { SyntheticDocumentItem } from "../types/admin-verification";

interface VerificationDocumentPreviewProps {
  documents: SyntheticDocumentItem[];
  documentType: "NATIONAL_ID" | "PASSPORT";
  documentNumberMasked: string;
}

export function VerificationDocumentPreview({
  documents,
  documentType,
  documentNumberMasked,
}: VerificationDocumentPreviewProps) {
  const [selectedDocId, setSelectedDocId] = useState<string>(
    documents[0]?.id || ""
  );
  const [isZoomed, setIsZoomed] = useState(false);

  const activeDoc = documents.find((d) => d.id === selectedDocId) || documents[0];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs overflow-hidden space-y-4 p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#5B46F6]" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Identity Document Preview
            </h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Document: <span className="font-semibold text-gray-800 dark:text-gray-200">{documentType.replace("_", " ")}</span> • Masked ID: <span className="font-mono text-indigo-600 dark:text-indigo-400">{documentNumberMasked}</span>
          </p>
        </div>

        {/* Zoom & Document Tabs */}
        <div className="flex items-center gap-2">
          {documents.map((doc) => (
            <button
              key={doc.id}
              onClick={() => setSelectedDocId(doc.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedDocId === doc.id
                  ? "bg-[#5B46F6] text-white shadow-xs"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
              }`}
            >
              {doc.type === "NID_FRONT" ? "Front Side" : doc.type === "NID_BACK" ? "Back Side" : "Passport Page"}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setIsZoomed(!isZoomed)}
            className="p-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 transition"
            title={isZoomed ? "Reset Zoom" : "Zoom In"}
          >
            {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Synthetic or Real Document Viewer Stage */}
      {activeDoc ? (
        <div className="space-y-3">
          <div className="relative rounded-2xl bg-gray-950/90 dark:bg-black/90 p-6 flex items-center justify-center min-h-[320px] overflow-hidden border border-gray-800">
            {/* Watermark Diagonal Overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-25 select-none rotate-[-25deg] z-20">
              <span className="font-black text-2xl sm:text-3xl tracking-widest text-white border-4 border-dashed border-white px-8 py-4 uppercase">
                {activeDoc.samplePreviewWatermark || "BDSISTERS NID PREVIEW"}
              </span>
            </div>

            {/* If live presigned URL from vault exists, display real decrypted scan */}
            {activeDoc.previewUrl ? (
              <div
                className={`max-w-xl w-full flex items-center justify-center transition-transform duration-200 z-10 ${
                  isZoomed ? "scale-125" : "scale-100"
                }`}
              >
                <img
                  src={activeDoc.previewUrl}
                  alt={activeDoc.title}
                  className="max-h-[460px] w-auto max-w-full rounded-xl object-contain shadow-2xl border border-gray-700 bg-black/40"
                />
              </div>
            ) : (
              /* Synthetic Document Visual Card */
              <div
                className={`w-full max-w-md rounded-2xl bg-linear-to-br from-emerald-900/40 via-teal-900/40 to-slate-900 border-2 border-emerald-500/40 p-6 text-white shadow-2xl transition-transform duration-200 relative ${
                  isZoomed ? "scale-110 z-10" : "scale-100"
                }`}
              >
                {/* Card Header */}
                <div className="flex items-center justify-between border-b border-emerald-500/30 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-500/30 flex items-center justify-center text-xs font-bold text-emerald-300">
                      BD
                    </div>
                    <div>
                      <span className="text-[10px] tracking-wider uppercase text-emerald-300 block font-bold">
                        People&apos;s Republic of Bangladesh
                      </span>
                      <span className="text-xs font-bold tracking-tight">
                        {activeDoc.title}
                      </span>
                    </div>
                  </div>
                  <Lock className="w-4 h-4 text-emerald-400" />
                </div>

                {/* Card Body */}
                <div className="flex gap-4 items-center">
                  <div className="w-20 h-24 rounded-lg bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-center p-2 shrink-0">
                    <span className="text-[9px] text-emerald-400 font-mono">
                      SYNTHETIC PHOTO
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div>
                      <span className="text-[9px] text-emerald-400 uppercase tracking-wider block">
                        Synthetic Sample Identifier
                      </span>
                      <span className="font-mono font-bold text-emerald-200">
                        {documentNumberMasked}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-emerald-400 uppercase tracking-wider block">
                        Verification Hash
                      </span>
                      <span className="font-mono text-[10px] text-gray-400">
                        SHA256: 7f83b165...demo
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="mt-4 pt-3 border-t border-emerald-500/20 flex items-center justify-between text-[10px] text-emerald-400/80">
                  <span>FORMAT: {activeDoc.fileFormat}</span>
                  <span>SIZE: {activeDoc.fileSize}</span>
                </div>
              </div>
            )}
          </div>

          {/* Document metadata summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-gray-50 dark:bg-gray-800/40 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
            <div>
              <span className="text-gray-400 block text-[10px]">Document Part</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">{activeDoc.title}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">Uploaded At</span>
              <span className="font-mono text-gray-800 dark:text-gray-200">{activeDoc.uploadedAt}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">File Size</span>
              <span className="text-gray-800 dark:text-gray-200">{activeDoc.fileSize}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">Security Standard</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Protected / Masked</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-xs text-gray-400">
          <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
          No document pages attached.
        </div>
      )}

      {/* Security notice banner */}
      <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="font-semibold">Compliance Safe View:</strong> Real national documents are securely encrypted at rest. Administrative previews are rendered with synthetic watermarks to prevent unvetted screen capture and protect member privacy.
        </p>
      </div>
    </div>
  );
}
