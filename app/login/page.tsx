"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  LockKeyhole,
  Shield,
  ShieldAlert,
  UserRound,
} from "lucide-react";
import {
  ADMIN_PROFILES,
  ADMIN_ROLE_IDS,
  getAccessibleModules,
  hasPermission,
  type AdminRoleId,
} from "@/lib/auth/rbac";

export default function AdminLoginPage() {
  const [selectedRole, setSelectedRole] =
    useState<AdminRoleId>("barangay-secretary");
  const profile = ADMIN_PROFILES[selectedRole];
  const accessibleModules = getAccessibleModules(selectedRole);

  const preventUnconfiguredSignIn = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#580011] text-[#E5A623] ring-2 ring-[#E5A623]/50">
              <Shield className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-sm font-extrabold tracking-wide text-[#580011]">
                BARANGAY STA. LUCIA
              </span>
              <span className="block text-xs text-slate-500">
                Barangay Information System · BIS v2.5
              </span>
            </span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-[#580011]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to portal</span>
          </Link>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:py-12">
        <section className="space-y-6">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#8A1428]">
              Administrative access
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              One trusted workspace for barangay services.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
              Select a role to preview its draft access scope. Permissions
              should be approved by the barangay before backend enforcement.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Admin profiles
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Choose a role to preview its permissions.
                </p>
              </div>
              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-800">
                Draft RBAC
              </span>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {ADMIN_ROLE_IDS.map((role) => {
                const item = ADMIN_PROFILES[role];
                const isSelected = selectedRole === role;

                return (
                  <button
                    key={role}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedRole(role)}
                    className={`flex min-h-20 items-start gap-3 rounded-xl border p-3 text-left transition ${
                      isSelected
                        ? "border-[#580011] bg-rose-50 ring-1 ring-[#580011]/10"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        isSelected
                          ? "bg-[#580011] text-[#E5A623]"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <UserRound className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-bold text-slate-900">
                        {item.name}
                      </span>
                      <span className="mt-1 block text-[11px] leading-4 text-slate-500">
                        {item.title}
                      </span>
                    </span>
                    {isSelected && (
                      <Check
                        aria-hidden="true"
                        className="h-4 w-4 shrink-0 text-[#580011]"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 border-t border-slate-100 pt-4">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-800">
                  <Shield className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {profile.name}
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    {profile.summary}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {accessibleModules.map((module) => (
                  <span
                    key={module.id}
                    className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-medium text-slate-600"
                  >
                    {module.name}
                  </span>
                ))}
                {hasPermission(selectedRole, "vawc:read") && (
                  <span className="rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-[10px] font-bold text-rose-800">
                    Restricted VAWC records
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center">
          <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#580011] text-[#E5A623]">
              <LockKeyhole className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Admin sign in
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Use your barangay-issued account to continue.
            </p>

            <div
              role="status"
              className="mt-5 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3.5"
            >
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
              <p className="text-xs leading-5 text-amber-900">
                Authentication is not connected yet. Sign-in is unavailable;
                profile selection is only a preview, not an access-control
                boundary.
              </p>
            </div>

            <form
              className="mt-6 space-y-4"
              onSubmit={preventUnconfiguredSignIn}
            >
              <div>
                <label
                  htmlFor="admin-email"
                  className="mb-1.5 block text-xs font-semibold text-slate-700"
                >
                  Work email
                </label>
                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  placeholder="name@stalucia.gov.ph"
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#580011] focus:ring-2 focus:ring-[#580011]/10"
                />
              </div>
              <div>
                <label
                  htmlFor="admin-password"
                  className="mb-1.5 block text-xs font-semibold text-slate-700"
                >
                  Password
                </label>
                <input
                  id="admin-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#580011] focus:ring-2 focus:ring-[#580011]/10"
                />
              </div>
              <button
                type="submit"
                disabled
                className="w-full cursor-not-allowed rounded-lg bg-[#580011] px-4 py-3 text-sm font-bold text-white opacity-60"
              >
                Sign-in setup pending
              </button>
            </form>

            <p className="mt-5 text-center text-[11px] leading-5 text-slate-500">
              No credentials are accepted or stored on this page. Connect an
              authentication provider and account store to enable sign-in.
            </p>
          </div>
        </section>
      </div>

      <footer className="mx-auto max-w-7xl px-5 pb-6 text-center text-[10px] text-slate-400 sm:px-8">
        Barangay Sta. Lucia · Quezon City · BIS v2.5
      </footer>
    </main>
  );
}
