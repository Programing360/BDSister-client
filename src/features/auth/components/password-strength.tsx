"use client";

import React from "react";
import { Check, X } from "lucide-react";

interface PasswordStrengthProps {
  password?: string;
}

export function PasswordStrength({ password = "" }: PasswordStrengthProps) {
  if (!password) return null;

  const checks = [
    { label: "At least 8 characters", pass: password.length >= 8 },
    { label: "One uppercase letter", pass: /[A-Z]/.test(password) },
    { label: "One lowercase letter", pass: /[a-z]/.test(password) },
    { label: "One number", pass: /[0-9]/.test(password) },
  ];

  const score = checks.filter((c) => c.pass).length;

  const getColor = () => {
    if (score === 0) return "bg-gray-200";
    if (score === 1) return "bg-red-500";
    if (score === 2) return "bg-amber-500";
    if (score === 3) return "bg-blue-500";
    return "bg-[#5B46F6]";
  };

  const getLabel = () => {
    if (score === 0) return "";
    if (score === 1) return "Weak";
    if (score === 2) return "Fair";
    if (score === 3) return "Good";
    return "Strong";
  };

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex flex-1 gap-1.5">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                step <= score ? getColor() : "bg-gray-200"
              }`}
            />
          ))}
        </div>
        <span className="ml-3 text-xs font-semibold text-gray-600">
          {getLabel()}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-1 text-xs text-gray-500">
        {checks.map((check, idx) => (
          <div key={idx} className="flex items-center gap-1.5">
            {check.pass ? (
              <Check className="h-3.5 w-3.5 text-emerald-600" />
            ) : (
              <X className="h-3.5 w-3.5 text-gray-300" />
            )}
            <span className={check.pass ? "text-gray-700 font-medium" : "text-gray-400"}>
              {check.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
