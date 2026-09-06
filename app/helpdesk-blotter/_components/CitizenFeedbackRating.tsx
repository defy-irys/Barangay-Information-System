"use client";

import React, { useState } from "react";
import {
  Star,
  CheckCircle2,
  HeartHandshake,
  MessageSquare,
  ShieldCheck,
  Send,
  Sparkles,
  Award,
} from "lucide-react";
import { ConsentClause } from "./ConsentClause";

export interface CitizenFeedbackData {
  id: string;
  caseNumber: string;
  complainantName: string;
  overallRating: number; // 1 to 5
  promptnessRating: number; // 1 to 5
  fairnessRating: number; // 1 to 5
  courtesyRating: number; // 1 to 5
  comments: string;
  recommendations?: string;
  dateSubmitted: string;
}

const initialMockFeedbacks: CitizenFeedbackData[] = [
  {
    id: "FB-8911",
    caseNumber: "KP-2026-098",
    complainantName: "Corazon Aquino-Cruz",
    overallRating: 5,
    promptnessRating: 5,
    fairnessRating: 5,
    courtesyRating: 5,
    comments:
      "The Lupon mediated our small claim dispute with high impartiality and patience. Both parties were heard fairly.",
    recommendations: "Maintain the clean and organized session hall setup.",
    dateSubmitted: "2026-08-11",
  },
  {
    id: "FB-8912",
    caseNumber: "KP-2026-101",
    complainantName: "Rosalinda Mendoza",
    overallRating: 4,
    promptnessRating: 4,
    fairnessRating: 5,
    courtesyRating: 4,
    comments:
      "Summons notice was served promptly. The dialogue session helped resolve boundary wall dispute amicably.",
    dateSubmitted: "2026-08-20",
  },
];

const initialFormState = {
  caseNumber: "KP-2026-102",
  complainantName: "Danilo Fernandez",
  overallRating: 5,
  promptnessRating: 5,
  fairnessRating: 5,
  courtesyRating: 5,
  comments: "",
  recommendations: "",
};

export function CitizenFeedbackRating() {
  const [feedbacks, setFeedbacks] =
    useState<CitizenFeedbackData[]>(initialMockFeedbacks);
  const [formData, setFormData] = useState(initialFormState);
  const [certified, setCertified] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [lastLoggedId, setLastLoggedId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `FB-${Date.now().toString().slice(-4)}`;
    const newEntry: CitizenFeedbackData = {
      id: newId,
      caseNumber: formData.caseNumber,
      complainantName: formData.complainantName,
      overallRating: formData.overallRating,
      promptnessRating: formData.promptnessRating,
      fairnessRating: formData.fairnessRating,
      courtesyRating: formData.courtesyRating,
      comments: formData.comments,
      recommendations: formData.recommendations,
      dateSubmitted: "2026-08-22",
    };

    setFeedbacks([newEntry, ...feedbacks]);
    setLastLoggedId(newId);
    setSubmitted(true);
    setCertified(false);
    setFormData(initialFormState);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const avgOverall = (
    feedbacks.reduce((acc, curr) => acc + curr.overallRating, 0) /
    (feedbacks.length || 1)
  ).toFixed(1);

  const avgPromptness = (
    feedbacks.reduce((acc, curr) => acc + curr.promptnessRating, 0) /
    (feedbacks.length || 1)
  ).toFixed(1);

  const avgFairness = (
    feedbacks.reduce((acc, curr) => acc + curr.fairnessRating, 0) /
    (feedbacks.length || 1)
  ).toFixed(1);

  const avgCourtesy = (
    feedbacks.reduce((acc, curr) => acc + curr.courtesyRating, 0) /
    (feedbacks.length || 1)
  ).toFixed(1);

  const renderStarRating = (
    label: string,
    idPrefix: string,
    currentValue: number,
    onChange: (val: number) => void,
  ) => {
    return (
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-800">{label}</span>
          <span className="text-xs font-bold font-mono text-[#580011]">
            {currentValue} / 5
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = star <= currentValue;
            return (
              <button
                key={star}
                id={`${idPrefix}-star-${star}`}
                type="button"
                onClick={() => onChange(star)}
                aria-label={`${label} ${star} star`}
                className="p-1 text-slate-300 hover:text-[#e5a623] transition-colors cursor-pointer"
              >
                <Star
                  className={`h-5 w-5 ${
                    isFilled
                      ? "fill-[#e5a623] text-[#e5a623]"
                      : "text-slate-300"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Memo Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#580011] bg-rose-50 px-2.5 py-0.5 rounded border border-rose-200">
                BIMS Form C: Citizen Feedback
              </span>
              <span className="text-[10px] font-bold text-slate-500">
                Citizen Satisfaction Rating Mechanism
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-1">
              Barangay Response Quality & Satisfaction Feedback
            </h2>
            <p className="text-xs text-slate-500">
              Pursuant to DILG Memorandum Circular No. 2025-104, record citizen
              evaluation on promptness, fairness, and staff courtesy for
              resolved or ongoing Katarungang Pambarangay matters.
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-50 text-[#580011] hidden sm:block">
            <HeartHandshake className="h-6 w-6" />
          </div>
        </div>

        {/* Analytics Summary Scorecards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-3.5 bg-rose-50/50 border border-rose-100 rounded-xl">
            <p className="text-[11px] font-medium text-slate-600">
              Overall Rating
            </p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-[#580011]">
                {avgOverall}
              </span>
              <span className="text-xs text-slate-400">/ 5.0</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-[#e5a623]" /> Excellent index
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <p className="text-[11px] font-medium text-slate-600">
              Speed / Promptness
            </p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-slate-800">
                {avgPromptness}
              </span>
              <span className="text-xs text-slate-400">/ 5.0</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Response turnaround
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <p className="text-[11px] font-medium text-slate-600">
              Lupon Impartiality
            </p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-slate-800">
                {avgFairness}
              </span>
              <span className="text-xs text-slate-400">/ 5.0</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Fair hearing conduct
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <p className="text-[11px] font-medium text-slate-600">
              Staff Courtesy
            </p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-slate-800">
                {avgCourtesy}
              </span>
              <span className="text-xs text-slate-400">/ 5.0</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Professional demeanor
            </p>
          </div>
        </div>
      </div>

      {submitted && (
        <div className="bg-emerald-50 border border-[#10b981] p-4 rounded-xl flex items-center gap-3 text-slate-800 shadow-sm">
          <CheckCircle2 className="h-5 w-5 text-[#10b981] shrink-0" />
          <div className="text-xs">
            <p className="font-bold text-slate-900">
              Satisfaction Feedback Logged Successfully
            </p>
            <p className="text-slate-600">
              Evaluation {lastLoggedId} for Case {formData.caseNumber} has been
              registered into the DILG BIMS citizen quality metrics.
            </p>
          </div>
        </div>
      )}

      {/* Interactive Feedback Form */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <label
                htmlFor="fb-case-number"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1"
              >
                Blotter / Incident Case Reference{" "}
                <span className="text-rose-500">*</span>
              </label>
              <input
                id="fb-case-number"
                type="text"
                required
                value={formData.caseNumber}
                onChange={(e) =>
                  setFormData({ ...formData, caseNumber: e.target.value })
                }
                placeholder="e.g. KP-2026-101"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-[#580011] focus:outline-none focus:ring-1 focus:ring-[#580011]"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Reference case number evaluated by the constituent.
              </p>
            </div>

            <div>
              <label
                htmlFor="fb-complainant-name"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1"
              >
                Constituent / Respondent Name{" "}
                <span className="text-rose-500">*</span>
              </label>
              <input
                id="fb-complainant-name"
                type="text"
                required
                value={formData.complainantName}
                onChange={(e) =>
                  setFormData({ ...formData, complainantName: e.target.value })
                }
                placeholder="Full Name of Evaluator"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#580011]"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Name of party providing response feedback.
              </p>
            </div>
          </div>

          {/* 4 Governance Rating Dimensions */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800">
              Service Quality Dimensions (1 = Poor, 5 = Outstanding){" "}
              <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {renderStarRating(
                "1. Overall Response Quality",
                "fb-overall",
                formData.overallRating,
                (val) => setFormData({ ...formData, overallRating: val }),
              )}
              {renderStarRating(
                "2. Promptness / Timeliness of Action",
                "fb-promptness",
                formData.promptnessRating,
                (val) => setFormData({ ...formData, promptnessRating: val }),
              )}
              {renderStarRating(
                "3. Fairness & Impartiality of Lupon",
                "fb-fairness",
                formData.fairnessRating,
                (val) => setFormData({ ...formData, fairnessRating: val }),
              )}
              {renderStarRating(
                "4. Courtesy & Demeanor of Officers",
                "fb-courtesy",
                formData.courtesyRating,
                (val) => setFormData({ ...formData, courtesyRating: val }),
              )}
            </div>
          </div>

          {/* Qualitative Narrative Feedback */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="fb-comments"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1"
              >
                Constituent Remarks / Comments{" "}
                <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="fb-comments"
                required
                rows={3}
                value={formData.comments}
                onChange={(e) =>
                  setFormData({ ...formData, comments: e.target.value })
                }
                placeholder="Share your experience with the barangay desk and mediation process..."
                className="w-full p-3 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#580011]"
              />
            </div>

            <div>
              <label
                htmlFor="fb-recommendations"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1"
              >
                Suggestions for Improvement{" "}
                <span className="text-slate-400 font-normal text-[11px]">
                  (Optional)
                </span>
              </label>
              <textarea
                id="fb-recommendations"
                rows={3}
                value={formData.recommendations}
                onChange={(e) =>
                  setFormData({ ...formData, recommendations: e.target.value })
                }
                placeholder="How can the barangay further improve its mediation and resolution services?"
                className="w-full p-3 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#580011]"
              />
            </div>
          </div>

          {/* Statutory Attestation & LGUSS-BIMS Consent Clause */}
          <ConsentClause
            checked={certified}
            onChange={setCertified}
            variant="standard"
            required
          />

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
              <ShieldCheck className="h-4 w-4 text-[#10b981]" />
              <span>
                Encrypted & Logged into LGUSS-BIMS Quality Assurance Databank
              </span>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-[#580011] hover:bg-[#3d000c] text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Send className="h-4 w-4 text-[#e5a623]" />
              Submit Citizen Evaluation
            </button>
          </div>
        </form>
      </div>

      {/* Recent Feedback Submissions Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-[#580011]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Recent Citizen Evaluations Register ({feedbacks.length})
            </h3>
          </div>
          <span className="text-[11px] text-slate-500">
            Official feedback submissions for DILG performance auditing
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Evaluation ID</th>
                <th className="py-3 px-4">Case #</th>
                <th className="py-3 px-4">Evaluator</th>
                <th className="py-3 px-4">Overall</th>
                <th className="py-3 px-4">Promptness</th>
                <th className="py-3 px-4">Fairness</th>
                <th className="py-3 px-4">Courtesy</th>
                <th className="py-3 px-4">Comments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {feedbacks.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-bold text-slate-800">
                    {item.id}
                  </td>
                  <td className="py-3 px-4 font-mono text-[#580011] font-semibold">
                    {item.caseNumber}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-900">
                    {item.complainantName}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      <Star className="h-3 w-3 fill-amber-500 text-amber-500" />{" "}
                      {item.overallRating}.0
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                    {item.promptnessRating}/5
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                    {item.fairnessRating}/5
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                    {item.courtesyRating}/5
                  </td>
                  <td className="py-3 px-4 max-w-xs truncate text-slate-700">
                    <span className="inline-flex items-center gap-1">
                      <MessageSquare className="h-3 w-3 text-slate-400 shrink-0" />
                      {item.comments}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
