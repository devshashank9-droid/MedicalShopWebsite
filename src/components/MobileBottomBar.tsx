"use client";

import React from "react";
import Link from "next/link";
import { Phone, MessageCircle, Camera } from "lucide-react";
import { PHARMACY_CONFIG } from "@/data/pharmacyData";
import { useLanguage } from "@/context/LanguageContext";

export default function MobileBottomBar() {
  const { lang } = useLanguage();
  const whatsappUrl = `https://wa.me/${PHARMACY_CONFIG.whatsappNumber.replace(
    /\D/g,
    ""
  )}?text=${encodeURIComponent(
    lang === "hi"
      ? `नमस्ते ${PHARMACY_CONFIG.name}, मुझे एक दवाई के बारे में मदद चाहिए।`
      : `Hello ${PHARMACY_CONFIG.name}, I need help with a medicine.`
  )}`;

  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 border-t border-slate-200 bg-white/95 px-3 py-2.5 shadow-lg backdrop-blur-md transition-colors dark:border-slate-800 dark:bg-slate-950/95 md:hidden">
      <div className="grid grid-cols-3 gap-2">
        <a
          href={`tel:${PHARMACY_CONFIG.phoneDisplay.replace(/\s+/g, "")}`}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-extrabold text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        >
          <Phone className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          {lang === "hi" ? "कॉल" : "Call"}
        </a>

        <Link
          href="/prescription"
          className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-extrabold text-white"
        >
          <Camera className="h-4 w-4" />
          {lang === "hi" ? "पर्चा भेजें" : "Send Parcha"}
        </Link>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 rounded-xl bg-[#25D366] py-2.5 text-xs font-extrabold text-slate-950"
        >
          <MessageCircle className="h-4 w-4" />
          {lang === "hi" ? "व्हाट्सएप" : "WhatsApp"}
        </a>
      </div>
    </div>
  );
}