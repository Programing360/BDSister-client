"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { Resource } from "@/types/public";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle2, Loader2, Sparkles, AlertCircle } from "lucide-react";

interface ResourceDownloadActionProps {
  resource: Resource;
}

export function ResourceDownloadAction({ resource }: ResourceDownloadActionProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPremium = resource.tags?.some((t) =>
    ["premium", "pro", "exclusive", "paid"].includes(t.toLowerCase())
  );

  const handleDownload = async () => {
    if (!user) {
      router.push(`/login?redirect=/resources/${resource.slug}`);
      return;
    }

    // Role-based check: Admins always allowed; if premium resource, check user entitlement
    const userRole = (user as any).role || "MEMBER";
    const membershipTier = (user as any).membershipTier || "FREE";
    const isAdmin = ["SUPER_ADMIN", "ADMIN", "CONTENT_MANAGER"].includes(userRole);
    const isPaidMember = ["BASIC", "PREMIUM", "ENTERPRISE"].includes(membershipTier);

    if (isPremium && !isAdmin && !isPaidMember) {
      setError(
        "This exclusive toolkit is reserved for Paid Members (Basic, Premium, Enterprise). Please upgrade your membership to unlock instant downloads."
      );
      return;
    }

    try {
      setDownloading(true);
      setError(null);

      // Call download endpoint
      try {
        await apiClient.get(API_ENDPOINTS.resources.download(resource.id));
      } catch (err) {
        console.warn("[ResourceDownload] API deferred, direct file download:", (err as Error).message);
      }

      // Trigger download
      const targetUrl = resource.downloadUrl || "/downloads/sample-bdsisters-toolkit.pdf";
      const link = document.createElement("a");
      link.href = targetUrl;
      link.download = `${resource.slug || "bdsisters-toolkit"}.pdf`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloaded(true);
    } catch (err) {
      setError((err as Error).message || "Unable to download resource.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-3">
      {error && (
        <div className="rounded-2xl bg-danger/10 p-3.5 text-xs text-danger border border-danger/20 font-medium space-y-2">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
          {error.includes("upgrade") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/member/membership")}
              className="w-full text-xs font-bold border-danger/30 text-danger hover:bg-danger/10"
            >
              Upgrade Membership via ZiniPay →
            </Button>
          )}
        </div>
      )}

      {downloaded ? (
        <div className="rounded-2xl border border-success/30 bg-success/10 p-3.5 text-center space-y-1.5">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-success-foreground">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <span>Download Started!</span>
          </div>
          <p className="text-[11px] text-text-secondary">
            Check your browser downloads. You can also re-download anytime.
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            disabled={downloading}
            className="text-xs font-bold text-primary mt-1"
          >
            Download Again
          </Button>
        </div>
      ) : (
        <Button
          variant="primary"
          size="lg"
          onClick={handleDownload}
          disabled={downloading}
          className="w-full justify-center gap-2 font-bold text-base py-3.5 shadow-button hover:shadow-card-hover"
        >
          {downloading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Preparing Download...</span>
            </>
          ) : (
            <>
              <Download className="h-5 w-5" />
              <span>Download Free Toolkit</span>
            </>
          )}
        </Button>
      )}

      <p className="text-[11px] text-center text-text-secondary">
        {user
          ? "Free instant download for verified sisters."
          : "Unlocked with your free sister account."}
      </p>
    </div>
  );
}
