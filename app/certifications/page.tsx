"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FileText, ArrowLeft, Plus, History, Shield } from "lucide-react";
import { CertificateIssuanceForm } from "./_components/CertificateIssuanceForm";
import { ClearanceQueueTable } from "./_components/ClearanceQueueTable";
import { CertificateData } from "./_components/templates";

export default function CertificationsPage() {
  const [activeTab, setActiveTab] = useState<"issue" | "queue">("issue");
  const [actingRole, setActingRole] = useState<
    "Barangay Secretary" | "Punong Barangay"
  >("Barangay Secretary");
  const [records, setRecords] = useState<CertificateData[]>([
    {
      controlNumber: "BCIS-2026-1049",
      residentName: "Eduardo Dela Vega",
      address: "Purok 2, Lot 14, Sta. Lucia",
      purpose: "PNP Police Clearance Requirement",
      certificateType: "Barangay Clearance",
      philSysCardNo: "1092-4829-1928-3019",
      orNumber: "OR-892-019",
      amountPaid: 50.0,
      dateIssued: "2026-08-20",
      issuingOfficer: "Sec. Maria Clara Santos",
    },
    {
      controlNumber: "BCIS-2026-1048",
      residentName: "Althea Ramos",
      address: "Block 8, San Jose Compound, Sta. Lucia",
      purpose: "Financial Aid (DSWD AICS)",
      certificateType: "Certificate of Indigency",
      philSysCardNo: "2049-5839-2918-4910",
      orNumber: "EXEMPTED",
      amountPaid: 0.0,
      dateIssued: "2026-08-20",
      issuingOfficer: "Hon. Punong Barangay",
    },
    {
      controlNumber: "BCIS-2026-1047",
      residentName: "Ricardo Gomez Jr.",
      address: "Purok 5, Sta. Lucia",
      purpose: "Passport Application (DFA)",
      certificateType: "Certificate of Residency",
      philSysCardNo: "3920-1928-4920-5819",
      orNumber: "OR-892-015",
      amountPaid: 50.0,
      dateIssued: "2026-08-19",
      issuingOfficer: "Sec. Maria Clara Santos",
      periodOfResidency: "8 years",
    },
    {
      controlNumber: "BCIS-2026-1046",
      residentName: "Luzviminda Cruz",
      address: "102 Katipunan Ave., Sta. Lucia",
      purpose: "Water Station Commercial Renewal",
      certificateType: "Business Permit",
      orNumber: "OR-892-004",
      amountPaid: 350.0,
      dateIssued: "2026-08-18",
      issuingOfficer: "Sec. Maria Clara Santos",
      businessName: "AquaLucia Purified Water",
      businessType: "Water Refilling Station",
    },
  ]);

  const handleCertificateIssued = (newCert: CertificateData) => {
    setRecords((prev) => [newCert, ...prev]);
    setActiveTab("queue");
  };

  return (
    <div className="space-y-6">
      {/* Header Breadcrumb & Title Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link
              href="/"
              className="hover:text-[#580011] flex items-center gap-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
            </Link>
            <span>/</span>
            <span className="font-semibold text-slate-700">
              Certificates & Clearances
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-50 text-[#580011]">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Certificates & Clearances (BCIS)
                </h1>
                <span className="text-[10px] font-mono font-bold bg-[#580011] text-white px-2 py-0.5 rounded">
                  BIMS Form B2
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Automated issuance of Barangay Clearance, Certificate of
                Indigency, and Business Permits pursuant to DILG MC 2025-104.
              </p>
            </div>
          </div>
        </div>

        {/* RBAC Session Role Indicator & Primary Action */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
            <Shield className="h-3.5 w-3.5 text-[#580011]" />
            <label
              htmlFor="bcis-role-select"
              className="text-slate-500 font-medium"
            >
              Role:
            </label>
            <select
              id="bcis-role-select"
              value={actingRole}
              onChange={(e) =>
                setActingRole(
                  e.target.value as "Barangay Secretary" | "Punong Barangay",
                )
              }
              className="bg-transparent font-semibold text-[#580011] focus:outline-none cursor-pointer"
            >
              <option value="Barangay Secretary">Barangay Secretary</option>
              <option value="Punong Barangay">Punong Barangay</option>
            </select>
          </div>

          <button
            onClick={() => setActiveTab("issue")}
            className="px-3.5 py-2 rounded-lg bg-[#580011] hover:bg-[#3d000c] text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="h-4 w-4 text-[#e5a623]" /> Issue Certificate
          </button>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("issue")}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === "issue"
              ? "bg-[#580011] text-white"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Plus className="h-3.5 w-3.5" />
          Issue Document (Form B2)
        </button>
        <button
          onClick={() => setActiveTab("queue")}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === "queue"
              ? "bg-[#580011] text-white"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <History className="h-3.5 w-3.5" />
          Issuance Queue & Records ({records.length})
        </button>
      </div>

      {/* Tab Viewport */}
      <div>
        {activeTab === "issue" ? (
          <CertificateIssuanceForm
            actingRole={actingRole}
            onIssueSuccess={handleCertificateIssued}
          />
        ) : (
          <ClearanceQueueTable initialRecords={records} />
        )}
      </div>
    </div>
  );
}
