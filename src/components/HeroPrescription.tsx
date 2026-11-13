"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Clock,
  Award,
  Users,
  Camera,
  Pill,
  Stethoscope,
  PawPrint,
  MapPin,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { PHARMACY_CONFIG } from "@/data/pharmacyData";
import { getStoreLiveStatus } from "@/lib/whatsapp";
import {
  BoardMode,
  getOwnerBoardMode,
  getOwnerReopenTime,
  subscribeStoreUpdates,
} from "@/lib/storeManager";
import { useLanguage } from "@/context/LanguageContext";

export default function HeroPrescription() {
  const { lang } = useLanguage();
  const [liveStatus, setLiveStatus] = useState<{
    isOpen: boolean;
    statusLabel: string;
    subText: string;
  } | null>(null);

  const [ownerMode, setOwnerMode] = useState<BoardMode>("auto");
  const [customReopenTime, setCustomReopenTime] = useState<string>("");

  useEffect(() => {
    const refresh = () => {
      setLiveStatus(getStoreLiveStatus());
      setOwnerMode(getOwnerBoardMode());
      setCustomReopenTime(getOwnerReopenTime());
    };
    refresh();
    const interval = setInterval(refresh, 60000);
    const unsubscribe = subscribeStoreUpdates(refresh);
    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  const isCurrentlyOpen =
    ownerMode === "auto"
      ? (liveStatus?.isOpen ?? true)
      : ownerMode === "open";

  const boardTitle = isCurrentlyOpen
    ? lang === "hi"
      ? "दुकान खुली है (OPEN)"
      : "WE ARE OPEN"
    : lang === "hi"
    ? "दुकान बंद है (CLOSED)"
    : "WE ARE CLOSED";

  let boardSubtext = "";
  if (isCurrentlyOpen) {
    if (lang === "hi") {
      boardSubtext =
        ownerMode === "auto"
          ? "सुबह 7:00 से रात 9:00 बजे तक खुला • सभी दवाइयाँ उपलब्ध"
          : "काउंटर अभी खुला है • दुकान पर आएं या पर्चा भेजें";
    } else {
      boardSubtext =
        ownerMode === "auto"
          ? liveStatus?.subText ||
            "Counter open for human & veterinary medicines"
          : "Counter open now • Visit or send prescription";
    }
  } else {
    if (lang === "hi") {
      boardSubtext = customReopenTime
        ? `दुकान खुलने का समय: ${customReopenTime} • व्हाट्सएप 24/7 चालू है`
        : "दुकान अभी बंद है • व्हाट्सएप पर पूछताछ 24/7 चालू है";
    } else {
      boardSubtext = customReopenTime
        ? `Will open at ${customReopenTime} • WhatsApp active 24/7`
        : ownerMode === "auto"
        ? liveStatus?.subText || "Opens at 7:00 AM IST • WhatsApp active 24/7"
        : "Shop closed right now • WhatsApp inquiries open 24/7";
    }
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/60 via-transparent to-slate-50/60 pt-8 pb-20 transition-colors dark:from-emerald-950/25 dark:via-transparent dark:to-slate-950/60 sm:pt-12 sm:pb-28">
      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6">
        {/* TOP HANGING SIGNBOARD */}
        <div className="mb-10 flex flex-col items-center">
          <div className="flex w-44 justify-between px-6">
            <div className="h-5 w-0.5 bg-slate-400 dark:bg-slate-600" />
            <div className="h-5 w-0.5 bg-slate-400 dark:bg-slate-600" />
          </div>

          <motion.div
            key={`${boardTitle}-${boardSubtext}`}
            initial={{ rotate: -4, y: -6, opacity: 0.9 }}
            animate={{ rotate: 0, y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 14 }}
            whileHover={{ rotate: 1.5, scale: 1.02 }}
            className={`relative w-full max-w-md rounded-2xl border-4 px-6 py-4 text-center shadow-xl transition-colors duration-300 ${
              isCurrentlyOpen
                ? "border-emerald-600 bg-emerald-950 text-white shadow-emerald-900/15 dark:shadow-emerald-500/10"
                : "border-rose-600 bg-rose-950 text-white shadow-rose-900/15 dark:shadow-rose-500/10"
            }`}
          >
            <span className="absolute top-2.5 left-2.5 h-2 w-2 rounded-full bg-white/30" />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-white/30" />
            <span className="absolute bottom-2.5 left-2.5 h-2 w-2 rounded-full bg-white/30" />
            <span className="absolute bottom-2.5 right-2.5 h-2 w-2 rounded-full bg-white/30" />

            <div className="flex items-center justify-center gap-2.5">
              <span
                className={`h-3.5 w-3.5 rounded-full ${
                  isCurrentlyOpen
                    ? "animate-pulse bg-emerald-400 shadow-[0_0_12px_#34d399]"
                    : "bg-rose-400 shadow-[0_0_12px_#fb7185]"
                }`}
              />
              <span
                className={`text-2xl font-black tracking-wider sm:text-3xl ${
                  isCurrentlyOpen ? "text-emerald-300" : "text-rose-300"
                }`}
              >
                {boardTitle}
              </span>
            </div>

            <p className="mt-1.5 flex items-center justify-center gap-1.5 text-xs font-medium text-slate-200 sm:text-sm">
              <Clock className="h-3.5 w-3.5 shrink-0 opacity-80" />
              <span>{boardSubtext}</span>
            </p>
          </motion.div>
        </div>

        {/* 32-YEAR LEGACY & THOUSANDS OF FAMILIES BADGE */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-amber-300 bg-amber-50/90 px-4 py-1.5 text-xs font-extrabold text-amber-900 shadow-xs backdrop-blur-xs dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300 sm:text-sm">
            <Award className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span>
              {lang === "hi"
                ? "32 वर्षों का भरोसा (स्थापना 1994)"
                : "32 Years of Excellence (Est. 1994)"}
            </span>
            <span className="text-amber-400">•</span>
            <span className="flex items-center gap-1 text-emerald-800 dark:text-emerald-300">
              <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              {lang === "hi"
                ? "हजारों परिवारों की पहली पसंद"
                : "Trusted by Thousands of Families"}
            </span>
          </div>

          <h1 className="mx-auto mt-5 max-w-3xl text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl sm:leading-[1.12]">
            {lang === "hi" ? (
              <>
                काजल मेडिकल हॉल —{" "}
                <span className="text-emerald-600 dark:text-emerald-400">
                  1994
                </span>{" "}
                से आपकी सेवा में
              </>
            ) : (
              <>
                {PHARMACY_CONFIG.name} — Caring for Generations Since{" "}
                <span className="text-emerald-600 dark:text-emerald-400">
                  1994
                </span>
              </>
            )}
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
            {lang === "hi" ? (
              <>
                संस्थापक{" "}
                <strong className="text-slate-900 dark:text-white">
                  संजीत कुमार गुप्ता
                </strong>{" "}
                द्वारा{" "}
                <strong className="text-slate-900 dark:text-white">
                  सहवाजपुर पुरैना, पातेपुर
                </strong>{" "}
                में स्थापित। पिछले <strong>32 वर्षों</strong> से पातेपुर और
                वैशाली के हजारों परिवार और पशुपालक हर उम्र की मानव दवाइयों और
                पशु (वेटरनरी) दवाइयों के लिए हम पर भरोसा करते हैं।
              </>
            ) : (
              <>
                Founded by{" "}
                <strong className="text-slate-900 dark:text-white">
                  {PHARMACY_CONFIG.ownerName}
                </strong>{" "}
                at{" "}
                <strong className="text-slate-900 dark:text-white">
                  {PHARMACY_CONFIG.address}
                </strong>
                . For over <strong>32 years</strong>, thousands of families and
                livestock owners across Patepur &amp; Vaishali have relied on us
                for 100% genuine medicines for every age group and veterinary
                care.
              </>
            )}
          </p>

          {/* Primary Navigation Buttons to Sub-Pages */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
            <Link
              href="/prescription"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-4 text-sm font-extrabold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 sm:w-auto sm:text-base"
            >
              <Camera className="h-5 w-5" />
              <span>
                {lang === "hi"
                  ? "व्हाट्सएप पर डॉक्टर का पर्चा भेजें"
                  : "Send Prescription on WhatsApp"}
              </span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/medicines"
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white/90 px-6 py-4 text-sm font-extrabold text-slate-800 backdrop-blur-xs transition hover:border-emerald-400 hover:bg-emerald-50/50 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-100 dark:hover:border-emerald-500 dark:hover:bg-slate-800 sm:w-auto sm:text-base"
            >
              <Pill className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <span>
                {lang === "hi"
                  ? "दवाइयाँ और लक्षण गाइड देखें"
                  : "Explore Medicines & Symptom Guide"}
              </span>
            </Link>
          </div>
        </motion.div>

        {/* 32-YEAR TRUST HIGHLIGHTS STRIP */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="mt-14 grid gap-4 text-left sm:grid-cols-3"
        >
          <div className="rounded-2xl border border-amber-200/80 bg-white/90 p-5 shadow-sm backdrop-blur-xs dark:border-amber-500/20 dark:bg-slate-900/90">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <p className="mt-3 text-2xl font-black text-slate-900 dark:text-white">
              {lang === "hi" ? "32+ वर्ष" : "32+ Years"}
            </p>
            <p className="text-xs font-bold text-amber-800 dark:text-amber-300">
              {lang === "hi" ? "1994 में स्थापित" : "Established in 1994"}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {lang === "hi"
                ? "संस्थापक संजीत कुमार गुप्ता के नेतृत्व में तीन दशकों की ईमानदार सेवा।"
                : `Three decades of honest service under founder ${PHARMACY_CONFIG.ownerName}.`}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-200/80 bg-white/90 p-5 shadow-sm backdrop-blur-xs dark:border-emerald-500/20 dark:bg-slate-900/90">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
              <Users className="h-5 w-5" />
            </div>
            <p className="mt-3 text-2xl font-black text-slate-900 dark:text-white">
              {lang === "hi" ? "हजारों परिवार" : "1,000s of Families"}
            </p>
            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
              {lang === "hi"
                ? "हर उम्र के लिए दवाइयाँ"
                : "All Ages & Generations"}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {lang === "hi"
                ? "बच्चों से लेकर बुजुर्गों तक की सभी दवाइयों के लिए सहवाजपुर पुरैना व पातेपुर का भरोसेमंद केंद्र।"
                : "Trusted across Sahwajpur Puraina & Patepur for pediatric to senior care."}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur-xs dark:border-slate-800 dark:bg-slate-900/90">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <div className="flex items-center gap-0.5">
                <Stethoscope className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <PawPrint className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-black text-slate-900 dark:text-white">
              {lang === "hi" ? "मानव और पशु चिकित्सा" : "Human & Veterinary"}
            </p>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {lang === "hi"
                ? "संपूर्ण मेडिकल रेंज"
                : "Complete Medical Range"}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {lang === "hi"
                ? "मानव दवाइयों के साथ-साथ पशुओं (वेटरनरी) की सभी जरूरी दवाइयाँ उपलब्ध।"
                : "Full stock of human medicines plus dedicated veterinary & animal care."}
            </p>
          </div>
        </motion.div>

        {/* Compact Location & Quick Link Footer Note */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            {lang === "hi"
              ? "सहवाजपुर पुरैना, पातेपुर, वैशाली, बिहार"
              : PHARMACY_CONFIG.address}
          </span>
          <span>•</span>
          <Link
            href="/medicines"
            className="font-bold text-emerald-700 underline-offset-4 hover:underline dark:text-emerald-400"
          >
            {lang === "hi"
              ? "सभी दवाइयाँ और लक्षण गाइड देखें →"
              : "View All Medicines & Symptom Guide →"}
          </Link>
        </div>
      </div>
    </section>
  );
}