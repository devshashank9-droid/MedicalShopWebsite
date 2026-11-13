"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MapPin,
  Menu,
  X,
  Sun,
  Moon,
  Languages,
  Plus,
} from "lucide-react";
import { PHARMACY_CONFIG } from "@/data/pharmacyData";
import { getStoreLiveStatus } from "@/lib/whatsapp";
import {
  BoardMode,
  getOwnerBoardMode,
  subscribeStoreUpdates,
} from "@/lib/storeManager";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
  const pathname = usePathname();
  const { lang, toggleLanguage } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [ownerMode, setOwnerMode] = useState<BoardMode>("auto");
  const [status, setStatus] = useState<{
    isOpen: boolean;
    statusLabel: string;
  } | null>(null);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const refresh = () => {
      setStatus(getStoreLiveStatus());
      setOwnerMode(getOwnerBoardMode());
    };
    refresh();
    const interval = setInterval(refresh, 60000);
    const unsubscribe = subscribeStoreUpdates(refresh);
    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const navLinks = [
    { label: lang === "hi" ? "होम" : "Home", href: "/" },
    {
      label: lang === "hi" ? "पर्चा भेजें" : "Send Prescription",
      href: "/prescription",
    },
    { label: lang === "hi" ? "दवाइयाँ" : "Medicines", href: "/medicines" },
    { label: lang === "hi" ? "हमारे बारे में" : "About", href: "/about" },
  ];

  const isEffectiveOpen =
    ownerMode === "auto" ? status?.isOpen : ownerMode === "open";

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-100 bg-white/95 backdrop-blur-md transition-colors dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand & Red Plus on Yellow Background Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow-400 text-red-600 shadow-sm ring-1 ring-yellow-500/40">
            <Plus className="h-7 w-7" strokeWidth={3.5} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-xl">
                {lang === "hi" ? "काजल मेडिकल हॉल" : PHARMACY_CONFIG.name}
              </span>
            </div>
            <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <MapPin className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
              {lang === "hi"
                ? "सहवाजपुर पुरैना, पातेपुर"
                : "Sahwajpur Puraina, Patepur"}
            </p>
          </div>
        </Link>

        {/* Desktop Page Navigation Buttons */}
        <nav className="hidden items-center gap-1.5 lg:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-emerald-400"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {status && (
            <div
              className={`hidden items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold xl:flex ${
                isEffectiveOpen
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
                  : "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  isEffectiveOpen ? "animate-ping bg-emerald-500" : "bg-rose-500"
                }`}
              />
              {isEffectiveOpen
                ? lang === "hi"
                  ? "खुला है"
                  : "Open Now"
                : lang === "hi"
                ? "बंद है"
                : "Closed"}
            </div>
          )}

          {/* Hindi / English Toggle Button */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="inline-flex h-9 cursor-pointer items-center gap-1 rounded-xl border border-emerald-200 bg-emerald-50/80 px-2.5 text-xs font-extrabold text-emerald-800 transition hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300 dark:hover:bg-emerald-500/25"
            aria-label="Switch language between Hindi and English"
            title={
              lang === "en" ? "हिन्दी में देखें" : "Switch to English"
            }
          >
            <Languages className="h-3.5 w-3.5" />
            <span>{lang === "en" ? "हिन्दी" : "EN"}</span>
          </button>

          {/* Dark Mode Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-amber-300 dark:hover:bg-slate-700"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Light Mode" : "Dark Mode"}
          >
            {isDark ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          {/* Mobile Navigation Drawer Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl border border-slate-200 p-2 text-slate-700 dark:border-slate-700 dark:text-slate-200 lg:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950 lg:hidden">
          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                    isActive
                      ? "bg-emerald-600 text-white"
                      : "text-slate-700 hover:bg-emerald-50 dark:text-slate-200 dark:hover:bg-slate-800"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}