"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AOS from "aos";
import {
  ShieldCheck,
  CreditCard,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Lock,
  Globe,
  Radio,
  CheckCircle2,
  ChevronRight,
  Info,
  Server,
  Zap,
} from "lucide-react";
import {
  DEMO_ZINIPAY_CONFIG,
  DEMO_PAYMENT_DISCLAIMER,
} from "../../data/mock-payments";
import type { ZiniPayGatewayConfig } from "../../types/payment";

export function ZiniPayGatewayView() {
  const [config, setConfig] = useState<ZiniPayGatewayConfig>(DEMO_ZINIPAY_CONFIG);
  const [environment, setEnvironment] = useState<"SANDBOX" | "PRODUCTION">(config.environment);
  const [isEnabled, setIsEnabled] = useState(config.isEnabled);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; timestamp: string } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    AOS.init({
      duration: 650,
      easing: "ease-out-cubic",
      once: true,
      offset: 35,
    });
    AOS.refresh();
  }, [environment, isEnabled]);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleTestConnection = () => {
    setIsTesting(true);
    setTestResult(null);

    setTimeout(() => {
      setIsTesting(false);
      setTestResult({
        success: true,
        message: "Simulated handshake with ZiniPay API endpoint succeeded. TLS 1.3 verified. IPN webhook responder 200 OK.",
        timestamp: new Date().toLocaleTimeString(),
      });
      setToastMessage("ZiniPay Connection Test Simulated: Status Active.");
      setTimeout(() => setToastMessage(null), 3500);
    }, 1200);
  };

  const handleSaveDemoConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setConfig((prev) => ({
      ...prev,
      environment,
      isEnabled,
      lastConnectionCheck: "Just now",
    }));
    setToastMessage("Gateway configuration preferences saved (Client State Simulation).");
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-gray-900/95 backdrop-blur-md text-white text-xs font-semibold shadow-2xl shadow-purple-900/40 flex items-center gap-3 border border-gray-700 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumb */}
      <nav
        data-aos="fade-down"
        className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400"
      >
        <Link href="/admin" className="hover:text-gray-900 dark:hover:text-white transition-colors">
          Admin
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link href="/admin/payments" className="hover:text-gray-900 dark:hover:text-white transition-colors">
          Payments
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="font-semibold text-gray-900 dark:text-white">ZiniPay Gateway</span>
      </nav>

      {/* Header Banner */}
      <div
        data-aos="fade-down"
        data-aos-delay="50"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5"
      >
        <div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/60 dark:to-purple-950/40 text-[#5B46F6] dark:text-indigo-300 flex items-center justify-center border border-indigo-100/80 dark:border-indigo-900 shadow-lg shadow-[#5B46F6]/10">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
                  ZiniPay Payment Gateway
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
                  Exclusive Provider
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Official single payment aggregator for bKash, Nagad, Rocket, and Bangladeshi Debit/Credit cards
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="https://zinipay.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 rounded-xl transition-all border border-indigo-200 dark:border-indigo-800 shadow-xs"
          >
            <span>Official Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://zinipay.com/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all border border-gray-200 dark:border-gray-800 shadow-xs"
          >
            <span>API Documentation</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Security & Demonstration Banner */}
      <div
        data-aos="fade-up"
        className="bg-gradient-to-r from-indigo-50/90 via-purple-50/40 to-indigo-50/90 dark:from-indigo-950/40 dark:via-purple-950/20 dark:to-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 rounded-3xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg shadow-indigo-500/5"
      >
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-2xl bg-[#5B46F6] text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20">
            <Lock className="w-4 h-4" />
          </div>
          <div className="text-xs space-y-0.5">
            <p className="font-semibold text-gray-900 dark:text-white">
              Strict Security Standards & Masked Credentials
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Live ZiniPay private keys and merchant secrets are securely sealed in server-side environment variables (`.env.local`). Never expose raw keys in client bundles.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
            <span>IPN Listener Active</span>
          </span>
        </div>
      </div>

      {/* Configuration Grid */}
      <form onSubmit={handleSaveDemoConfig} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: Merchant Settings & Credentials (2 Cols) */}
        <div
          data-aos="fade-up"
          data-aos-delay="100"
          className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xl shadow-purple-500/5 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 space-y-6"
        >
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
            <div>
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                Merchant Gateway Parameters
              </h3>
              <p className="text-xs text-gray-500">
                Configure connection environment and endpoint references
              </p>
            </div>

            {/* Toggle Enable / Disable */}
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Gateway Status:
              </span>
              <button
                type="button"
                onClick={() => setIsEnabled(!isEnabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  isEnabled ? "bg-[#5B46F6]" : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    isEnabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
              <span className={`text-xs font-semibold ${isEnabled ? "text-emerald-600" : "text-gray-400"}`}>
                {isEnabled ? "Enabled" : "Disabled"}
              </span>
            </label>
          </div>

          {/* Environment Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Gateway Target Environment
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => setEnvironment("SANDBOX")}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-1 ${
                  environment === "SANDBOX"
                    ? "border-[#5B46F6] bg-indigo-50/50 dark:bg-indigo-950/40 shadow-xs"
                    : "border-gray-200 dark:border-gray-800 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-gray-900 dark:text-white">
                    ZiniPay Sandbox
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800">
                    Testing Mode
                  </span>
                </div>
                <p className="text-[11px] text-gray-500">
                  Simulates bKash/Nagad transactions without real monetary deductions.
                </p>
              </div>

              <div
                onClick={() => setEnvironment("PRODUCTION")}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-1 ${
                  environment === "PRODUCTION"
                    ? "border-[#5B46F6] bg-indigo-50/50 dark:bg-indigo-950/40 shadow-xs"
                    : "border-gray-200 dark:border-gray-800 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-gray-900 dark:text-white">
                    Production Live
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                    Live BDT Settlement
                  </span>
                </div>
                <p className="text-[11px] text-gray-500">
                  Direct commercial clearing into BDSisters registered bank accounts.
                </p>
              </div>
            </div>
          </div>

          {/* Masked Credentials Fields */}
          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                ZiniPay Merchant ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={config.merchantId}
                  className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl bg-gray-50 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 select-all"
                />
                <button
                  type="button"
                  onClick={() => handleCopy(config.merchantId, "mid")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                  title="Copy Merchant ID"
                >
                  {copiedField === "mid" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Public API Key (Masked Demo)
              </label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={config.apiKey}
                  className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl bg-gray-50 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 text-gray-500 select-all"
                />
                <button
                  type="button"
                  onClick={() => handleCopy(config.apiKey, "apikey")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                  title="Copy Key"
                >
                  {copiedField === "apikey" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Merchant API Secret (Masked Demo)
              </label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={config.apiSecret}
                  className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl bg-gray-50 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 text-gray-500 select-all"
                />
                <button
                  type="button"
                  onClick={() => handleCopy(config.apiSecret, "secret")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                  title="Copy Secret"
                >
                  {copiedField === "secret" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Callback & Webhook URLs */}
          <div className="space-y-4 pt-2 border-t border-gray-100 dark:border-gray-800">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Payment Verification Return URL (Callback)
              </label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={config.callbackUrl}
                  className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl bg-gray-50 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 select-all"
                />
                <button
                  type="button"
                  onClick={() => handleCopy(config.callbackUrl, "cb")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                  title="Copy Callback URL"
                >
                  {copiedField === "cb" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Instant Payment Notification (IPN / Webhook)
              </label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={config.webhookUrl}
                  className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl bg-gray-50 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 select-all"
                />
                <button
                  type="button"
                  onClick={() => handleCopy(config.webhookUrl, "wh")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                  title="Copy Webhook URL"
                >
                  {copiedField === "wh" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
              Simulation Notice: Frontend presentation preferences only.
            </span>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#5B46F6] hover:bg-indigo-700 transition-all shadow-md shadow-indigo-500/20 cursor-pointer"
            >
              <span>Save Configuration (Demo)</span>
            </button>
          </div>
        </div>

        {/* Right Column: Connection Diagnostics & Supported Channels (1 Col) */}
        <div className="space-y-5">
          {/* Diagnostic Card */}
          <div
            data-aos="fade-up"
            data-aos-delay="150"
            className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xl shadow-indigo-500/5 space-y-4"
          >
            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
              <Server className="w-4 h-4 text-[#5B46F6]" />
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                Connection Diagnostics
              </h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">API Status:</span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Operational</span>
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">API Engine:</span>
                <span className="font-mono text-gray-700 dark:text-gray-300">{config.apiVersion}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Last Verified:</span>
                <span className="text-gray-700 dark:text-gray-300">{config.lastConnectionCheck}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">TLS Encryption:</span>
                <span className="font-semibold text-gray-900 dark:text-white">TLS 1.3 / AES-256</span>
              </div>
            </div>

            {testResult && (
              <div
                className={`p-3 rounded-2xl text-xs space-y-1 ${
                  testResult.success
                    ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                    : "bg-rose-50 text-rose-900 border border-rose-200"
                }`}
              >
                <div className="flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Handshake Succeeded ({testResult.timestamp})</span>
                </div>
                <p className="text-[11px] text-emerald-800 dark:text-emerald-300 leading-relaxed">
                  {testResult.message}
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-md shadow-indigo-500/20 cursor-pointer"
            >
              <Zap className={`w-3.5 h-3.5 ${isTesting ? "animate-spin" : ""}`} />
              <span>{isTesting ? "Testing Handshake..." : "Test Gateway Handshake (Demo)"}</span>
            </button>
          </div>

          {/* Supported MFS Channels Card */}
          <div
            data-aos="fade-up"
            data-aos-delay="200"
            className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xl shadow-purple-500/5 space-y-4"
          >
            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
              <CreditCard className="w-4 h-4 text-purple-600" />
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                Active Payment Channels
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              {config.supportedChannels.map((channel, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800"
                >
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{channel}</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                    <Check className="w-3 h-3" />
                    <span>Enabled</span>
                  </span>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-gray-400">
              Transactions are settled directly via ZiniPay instant IPN push callbacks.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
