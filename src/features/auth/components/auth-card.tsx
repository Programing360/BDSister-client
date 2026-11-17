import React from "react";

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

export function AuthCard({ children, className = "" }: AuthCardProps) {
  return (
    <div
      className={`relative w-full rounded-3xl mx-auto border-[#DDD8EA] bg-white/95 p-8 shadow-xl shadow-[#5B46F6]/5 backdrop-blur-xl sm:p-10 ${className}`}
    >
      {children}
    </div>
  );
}
