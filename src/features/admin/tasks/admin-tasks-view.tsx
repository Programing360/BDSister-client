
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { CheckSquare, Plus, Trash2, CheckCircle2, RefreshCw } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

interface AdminTaskItem {
    _id: string;
    title: string;
    description?: string;
    priority?: "Low" | "Medium" | "High";
    status: "Pending" | "InProgress" | "Completed";
    assignedTo?: { fullName?: string; email?: string };
    createdAt: string;
}

export function AdminTasksView() {
    const [tasks, setTasks] = useState<AdminTaskItem[]>([]);
    const [title, setTitle] = useState("");
    const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium");
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    const fetchTasks = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await apiClient.get<{ data?: AdminTaskItem[] }>(
                API_ENDPOINTS.admin.tasks
            );
            const raw = res as unknown as { data?: AdminTaskItem[] } | AdminTaskItem[];
            setTasks(Array.isArray(raw) ? raw : raw.data || []);
        } catch {
            setTasks([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        setIsCreating(true);
        try {
            await apiClient.post(API_ENDPOINTS.admin.tasks, {
                title: title.trim(),
                priority,
                status: "Pending",
            });
            setTitle("");
            await fetchTasks();
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to assign task.");
        } finally {
            setIsCreating(false);
        }
    };

    const handleCompleteTask = async (task: AdminTaskItem) => {
        const nextStatus = task.status === "Completed" ? "Pending" : "Completed";
        await apiClient.patch(API_ENDPOINTS.admin.taskDetail(task._id), {
            status: nextStatus,
        });
        await fetchTasks();
    };

    const handleDeleteTask = async (id: string) => {
        await apiClient.delete(API_ENDPOINTS.admin.taskDetail(id));
        await fetchTasks();
    };

    return (
        <div className="space-y-6 pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-[#5B9891]/20 bg-gradient-to-r from-[#F7DFC7]/45 via-white to-[#5B9891]/10 p-6 shadow-xs">
                <div>
                    <div className="flex items-center gap-2.5">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                            Admin Task Assignment
                        </h1>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#F7DFC7]/80 border border-[#D98408]/30 px-3 py-0.5 text-xs font-bold text-[#D98408]">
                            <CheckSquare className="h-3.5 w-3.5" />
                            Team Operations
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-600">
                        Assign moderation, verification, and content review tasks across administrators.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={fetchTasks}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#5B9891]/30 bg-white px-4 py-2 text-xs font-bold text-[#5B9891]"
                >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                    <span>Refresh</span>
                </button>
            </div>

            {/* Assign Task Form */}
            <form
                onSubmit={handleCreateTask}
                className="flex flex-col sm:flex-row gap-3 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-2xs"
            >
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Task description (e.g. Verify 10 pending NID submissions)..."
                    className="flex-1 rounded-xl border border-gray-200 bg-[#FAF8F5] px-3.5 py-2 text-xs font-medium text-gray-900 focus:border-[#5B9891] focus:bg-white focus:outline-hidden"
                    required
                />
                <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as "Low" | "Medium" | "High")}
                    className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700"
                >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                </select>
                <button
                    type="submit"
                    disabled={isCreating}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#5B9891] px-5 py-2 text-xs font-bold text-white hover:bg-[#467A74] transition"
                >
                    <Plus className="h-4 w-4" /> Assign Task
                </button>
            </form>

            {/* Tasks List */}
            <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-2xs space-y-3">
                {tasks.length > 0 ? (
                    tasks.map((task) => (
                        <div
                            key={task._id}
                            className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-[#FAF8F5] px-4 py-3 text-xs"
                        >
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => handleCompleteTask(task)}
                                    className={`flex h-6 w-6 items-center justify-center rounded-lg border transition ${task.status === "Completed"
                                            ? "bg-[#5B9891] border-[#5B9891] text-white"
                                            : "bg-white border-gray-300 text-transparent hover:border-[#5B9891]"
                                        }`}
                                >
                                    <CheckCircle2 className="h-4 w-4" />
                                </button>
                                <div>
                                    <p
                                        className={`font-bold ${task.status === "Completed"
                                                ? "line-through text-gray-400"
                                                : "text-gray-900"
                                            }`}
                                    >
                                        {task.title}
                                    </p>
                                    <p className="text-[11px] text-gray-500">
                                        Priority: <strong>{task.priority || "Medium"}</strong> • Status:{" "}
                                        {task.status}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => handleDeleteTask(task._id)}
                                className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="py-10 text-center text-xs text-gray-400">
                        No administrative tasks assigned yet.
                    </p>
                )}
            </div>
        </div>
    );
}