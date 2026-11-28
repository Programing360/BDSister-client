"use client";

import React, { useState, useEffect, useCallback } from "react";
import { KeyRound, Plus, Ban, RefreshCw, Copy, CheckCircle2, AlertCircle } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

interface PartnerApiKey {
    _id: string;
    wingName: string;
    keyPrefix?: string;
    isActive: boolean;
    createdAt: string;
}

export function AdminIntegrationsView() {
    const [keys, setKeys] = useState<PartnerApiKey[]>([]);
    const [wingName, setWingName] = useState("Muhsina Organization");
    const [newlyGeneratedKey, setNewlyGeneratedKey] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchKeys = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await apiClient.get<{ data?: PartnerApiKey[] }>(
                API_ENDPOINTS.admin.apiKeys
            );
            const raw = res as unknown as { data?: PartnerApiKey[] } | PartnerApiKey[];
            setKeys(Array.isArray(raw) ? raw : raw.data || []);
        } catch {
            setKeys([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchKeys();
    }, [fetchKeys]);

    const handleGenerateKey = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const res = await apiClient.post<{ rawKey?: string; data?: { rawKey?: string } }>(
                API_ENDPOINTS.admin.apiKeys,
                { wingName }
            );
            const raw = res as unknown as { rawKey?: string; data?: { rawKey?: string } };
            const generated = raw.rawKey || raw.data?.rawKey;
            if (generated) setNewlyGeneratedKey(generated);
            await fetchKeys();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate API key.");
        }
    };

    const handleRevoke = async (id: string) => {
        if (!confirm("Revoke this Wing API Key? Connected platform sync will stop.")) return;
        await apiClient.patch(API_ENDPOINTS.admin.revokeApiKey(id));
        await fetchKeys();
    };

    return (
        <div className="space-y-6 pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-[#5B9891]/20 bg-gradient-to-r from-[#F7DFC7]/45 via-white to-[#5B9891]/10 p-6 shadow-xs">
                <div>
                    <div className="flex items-center gap-2.5">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                            Wing API Integrations
                        </h1>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#F7DFC7]/80 border border-[#D98408]/30 px-3 py-0.5 text-xs font-bold text-[#D98408]">
                            <KeyRound className="h-3.5 w-3.5" />
                            Unified Database Sync
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-600">
                        Issue and revoke API keys linking BDSisters profiles with Muhsina Org, CoP, TSPP, IMBD, MIDJ & The Hut Network.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={fetchKeys}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#5B9891]/30 bg-white px-4 py-2 text-xs font-bold text-[#5B9891]"
                >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                    <span>Refresh</span>
                </button>
            </div>

            {error && (
                <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700 animate-in fade-in">
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                    <span>{error}</span>
                </div>
            )}

            {/* Newly Generated Key Alert */}
            {newlyGeneratedKey && (
                <div className="rounded-2xl border border-[#D98408]/40 bg-[#F7DFC7]/60 p-4 space-y-2">
                    <p className="text-xs font-bold text-[#D98408]">
                        Copy this API key now — for security it will not be shown in full again:
                    </p>
                    <div className="flex items-center gap-2">
                        <code className="flex-1 rounded-xl bg-white px-3.5 py-2 font-mono text-xs font-bold text-gray-900 border border-[#D98408]/30">
                            {newlyGeneratedKey}
                        </code>
                        <button
                            type="button"
                            onClick={() => {
                                navigator.clipboard.writeText(newlyGeneratedKey);
                                setCopied(true);
                                setTimeout(() => setCopied(false), 2500);
                            }}
                            className="inline-flex items-center gap-1 rounded-xl bg-[#5B9891] px-3.5 py-2 text-xs font-bold text-white"
                        >
                            {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            <span>{copied ? "Copied" : "Copy"}</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Generate Key Form */}
            <form
                onSubmit={handleGenerateKey}
                className="flex flex-col sm:flex-row gap-3 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-2xs"
            >
                <select
                    value={wingName}
                    onChange={(e) => setWingName(e.target.value)}
                    className="flex-1 rounded-xl border border-gray-200 bg-[#FAF8F5] px-3.5 py-2 text-xs font-bold text-gray-900"
                >
                    <option value="Muhsina Organization">Muhsina Organization</option>
                    <option value="CoP (Community of Parenting)">CoP (Parenting & Homeschooling)</option>
                    <option value="TSPP">TSPP (Publications & Resources)</option>
                    <option value="IMBD">IMBD</option>
                    <option value="MIDJ">MIDJ (Featured Contributors)</option>
                    <option value="The Hut Network">The Hut Network (Vendors)</option>
                </select>

                <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#5B9891] px-5 py-2 text-xs font-bold text-white hover:bg-[#467A74] transition"
                >
                    <Plus className="h-4 w-4" /> Generate Wing API Key
                </button>
            </form>

            {/* Active Keys Table */}
            <div className="rounded-2xl border border-gray-200/80 bg-white shadow-2xs overflow-hidden">
                <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF8F5] text-[11px] font-bold uppercase text-gray-500 border-b border-gray-100">
                        <tr>
                            <th className="py-3.5 px-4">Connected Wing</th>
                            <th className="py-3.5 px-4">Key Prefix</th>
                            <th className="py-3.5 px-4 text-center">Status</th>
                            <th className="py-3.5 px-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {keys.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="py-10 text-center text-gray-400">
                                    No Wing API keys issued yet.
                                </td>
                            </tr>
                        ) : (
                            keys.map((k) => (
                                <tr key={k._id} className="hover:bg-[#F7DFC7]/20">
                                    <td className="py-3.5 px-4 font-bold text-gray-900">{k.wingName}</td>
                                    <td className="py-3.5 px-4 font-mono text-gray-600">
                                        {k.keyPrefix || "bds_live_••••••••"}
                                    </td>
                                    <td className="py-3.5 px-4 text-center">
                                        <span
                                            className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${k.isActive
                                                    ? "bg-[#5B9891]/15 text-[#467A74]"
                                                    : "bg-rose-50 text-rose-700"
                                                }`}
                                        >
                                            {k.isActive ? "Active" : "Revoked"}
                                        </span>
                                    </td>
                                    <td className="py-3.5 px-4 text-right">
                                        {k.isActive && (
                                            <button
                                                type="button"
                                                onClick={() => handleRevoke(k._id)}
                                                className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-700 hover:bg-rose-100"
                                            >
                                                <Ban className="h-3 w-3" /> Revoke
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}