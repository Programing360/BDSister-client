"use client";

import React from "react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

interface AffiliateLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  businessId: string;
  href: string;
  children: React.ReactNode;
}

export function AffiliateLink({
  businessId,
  href,
  children,
  className,
  onClick,
  ...props
}: AffiliateLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // 1. Record affiliate click asynchronously without blocking navigation
    if (businessId) {
      try {
        const endpoint = API_ENDPOINTS.business.affiliateClick(businessId);
        if (typeof navigator !== "undefined" && navigator.sendBeacon) {
          navigator.sendBeacon(endpoint, JSON.stringify({ timestamp: Date.now() }));
        } else {
          apiClient.post(endpoint).catch(() => {
            // Silently ignore tracking errors
          });
        }
      } catch {
        // Silently continue
      }
    }

    if (onClick) {
      onClick(e);
    }
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children}
    </a>
  );
}
