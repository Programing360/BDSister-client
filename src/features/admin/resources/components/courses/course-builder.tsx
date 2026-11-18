"use client";

import React, { useState } from "react";
import {
  Layers,
  Plus,
  Trash2,
  Edit2,
  Video,
  FileText,
  Download,
  HelpCircle,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
} from "lucide-react";
import type { CourseModule, LessonItem } from "../../types/resource";

interface CourseBuilderProps {
  initialModules: CourseModule[];
  onChange?: (modules: CourseModule[]) => void;
}

export function CourseBuilder({
  initialModules,
  onChange,
}: CourseBuilderProps) {
  const [modules, setModules] = useState<CourseModule[]>(
    initialModules.length > 0
      ? initialModules
      : [
          {
            id: "mod-1",
            courseId: "temp-course",
            title: "Module 1: Orientation & Foundations",
            description: "Core setup and introduction to curriculum objectives.",
            order: 1,
            lessons: [
              {
                id: "les-1",
                moduleId: "mod-1",
                title: "Welcome & Course Roadmap",
                lessonType: "VIDEO",
                duration: "15 mins",
                order: 1,
                isFreePreview: true,
              },
            ],
          },
        ]
  );

  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonType, setNewLessonType] = useState<
    "VIDEO" | "ARTICLE" | "DOWNLOADABLE" | "QUIZ_PLACEHOLDER"
  >("VIDEO");
  const [newLessonDuration, setNewLessonDuration] = useState("20 mins");
  const [simulationToast, setSimulationToast] = useState<string | null>(null);

  const notifyChange = (updated: CourseModule[]) => {
    setModules(updated);
    onChange?.(updated);
  };

  const showToast = (msg: string) => {
    setSimulationToast(msg);
    setTimeout(() => setSimulationToast(null), 3000);
  };

  const handleAddModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModuleTitle.trim()) return;

    const newModule: CourseModule = {
      id: `mod-${Date.now()}`,
      courseId: "temp-course",
      title: newModuleTitle.trim(),
      order: modules.length + 1,
      lessons: [],
    };

    const updated = [...modules, newModule];
    notifyChange(updated);
    setNewModuleTitle("");
    showToast(`[DEMO] Added new module "${newModule.title}".`);
  };

  const handleRemoveModule = (modId: string) => {
    const updated = modules.filter((m) => m.id !== modId);
    notifyChange(updated);
    showToast("[DEMO] Module removed.");
  };

  const handleAddLesson = (modId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonTitle.trim()) return;

    const updated = modules.map((m) => {
      if (m.id === modId) {
        const newLesson: LessonItem = {
          id: `les-${Date.now()}`,
          moduleId: modId,
          title: newLessonTitle.trim(),
          lessonType: newLessonType,
          duration: newLessonDuration,
          order: m.lessons.length + 1,
          isFreePreview: false,
        };
        return {
          ...m,
          lessons: [...m.lessons, newLesson],
        };
      }
      return m;
    });

    notifyChange(updated);
    setNewLessonTitle("");
    setSelectedModuleId(null);
    showToast(`[DEMO] Added lesson to curriculum.`);
  };

  const handleRemoveLesson = (modId: string, lesId: string) => {
    const updated = modules.map((m) => {
      if (m.id === modId) {
        return {
          ...m,
          lessons: m.lessons.filter((l) => l.id !== lesId),
        };
      }
      return m;
    });
    notifyChange(updated);
    showToast("[DEMO] Lesson removed from module.");
  };

  const getLessonIcon = (type: LessonItem["lessonType"]) => {
    switch (type) {
      case "VIDEO":
        return <Video className="w-3.5 h-3.5 text-rose-500" />;
      case "ARTICLE":
        return <FileText className="w-3.5 h-3.5 text-blue-500" />;
      case "DOWNLOADABLE":
        return <Download className="w-3.5 h-3.5 text-purple-500" />;
      case "QUIZ_PLACEHOLDER":
        return <HelpCircle className="w-3.5 h-3.5 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {simulationToast && (
        <div className="p-3 bg-brand-navy/95 text-white text-xs rounded-xl shadow-lg border border-brand-primary/40 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
          <span>{simulationToast}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-primary/10 pb-3">
        <div>
          <h3 className="text-base font-semibold text-brand-navy flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-primary" />
            Curriculum Builder & Lesson Hierarchy
          </h3>
          <p className="text-xs text-brand-muted font-normal">
            Structure your course into modules, lectures, reading materials, and checkpoints.
          </p>
        </div>
        <span className="text-xs font-semibold text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full self-start">
          {modules.length} Modules •{" "}
          {modules.reduce((sum, m) => sum + m.lessons.length, 0)} Lessons
        </span>
      </div>

      {/* Module List Accordion */}
      <div className="space-y-4">
        {modules.map((mod, modIdx) => (
          <div
            key={mod.id}
            className="p-5 rounded-2xl bg-brand-surface/40 border border-brand-primary/15 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-primary/15 text-brand-primary font-bold text-xs flex items-center justify-center">
                  {modIdx + 1}
                </span>
                <h4 className="text-sm font-semibold text-brand-navy">
                  {mod.title}
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedModuleId(
                      selectedModuleId === mod.id ? null : mod.id
                    )
                  }
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 transition"
                >
                  {selectedModuleId === mod.id ? "Cancel" : "+ Add Lesson"}
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveModule(mod.id)}
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition"
                  title="Remove Module"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Lessons Inside Module */}
            <div className="space-y-2 pl-4 border-l-2 border-brand-primary/20">
              {mod.lessons.map((les, lesIdx) => (
                <div
                  key={les.id}
                  className="p-3 rounded-xl bg-white border border-brand-primary/10 flex items-center justify-between text-xs hover:border-brand-primary/30 transition shadow-sm"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="p-1.5 rounded-lg bg-brand-surface">
                      {getLessonIcon(les.lessonType)}
                    </span>
                    <span className="font-semibold text-brand-navy truncate">
                      {lesIdx + 1}. {les.title}
                    </span>
                    {les.isFreePreview && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                        Preview
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px] text-brand-muted flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {les.duration}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveLesson(mod.id, les.id)}
                      className="p-1 rounded text-slate-400 hover:text-rose-600 transition"
                      title="Remove Lesson"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}

              {mod.lessons.length === 0 && (
                <p className="text-xs text-brand-muted italic py-1">
                  No lessons added yet. Click &quot;+ Add Lesson&quot; above.
                </p>
              )}
            </div>

            {/* Add Lesson Form Inline */}
            {selectedModuleId === mod.id && (
              <div className="p-4 rounded-xl bg-white border border-brand-primary/20 shadow-sm space-y-3 animate-in fade-in">
                <span className="text-xs font-semibold text-brand-navy">
                  Add Lesson to &ldquo;{mod.title}&rdquo;
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <input
                    type="text"
                    required
                    value={newLessonTitle}
                    onChange={(e) => setNewLessonTitle(e.target.value)}
                    placeholder="Lesson title..."
                    className="sm:col-span-2 px-3 py-2 text-xs bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                  />
                  <select
                    value={newLessonType}
                    onChange={(e) =>
                      setNewLessonType(
                        e.target.value as
                          | "VIDEO"
                          | "ARTICLE"
                          | "DOWNLOADABLE"
                          | "QUIZ_PLACEHOLDER"
                      )
                    }
                    className="px-3 py-2 text-xs bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                  >
                    <option value="VIDEO">Video Lecture</option>
                    <option value="ARTICLE">Reading Article</option>
                    <option value="DOWNLOADABLE">Asset / Worksheet</option>
                    <option value="QUIZ_PLACEHOLDER">Quiz Checkpoint</option>
                  </select>
                </div>
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedModuleId(null)}
                    className="px-3 py-1.5 text-xs text-brand-muted hover:text-brand-navy"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleAddLesson(mod.id, e)}
                    className="px-4 py-1.5 rounded-lg bg-brand-primary text-white text-xs font-semibold hover:bg-brand-primary/90 transition shadow-sm"
                  >
                    Save Lesson
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Module Input Form */}
      <div className="flex gap-2.5 pt-2">
        <input
          type="text"
          value={newModuleTitle}
          onChange={(e) => setNewModuleTitle(e.target.value)}
          placeholder="New module title (e.g. Module 3: Logistics & Couriers)..."
          className="flex-1 px-4 py-2.5 text-xs bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
        />
        <button
          type="button"
          onClick={handleAddModule}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white text-xs font-semibold shadow-[0_4px_16px_rgb(91,70,246,0.2)] transition shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Module
        </button>
      </div>
    </div>
  );
}
