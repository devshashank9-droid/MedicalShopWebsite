"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Brain,
  Flame,
  Activity,
  Snowflake,
  Thermometer,
  Pill,
  MessageCircle,
  AlertCircle,
} from "lucide-react";
import { SYMPTOM_GUIDE, SymptomCategory } from "@/data/pharmacyData";
import { getSymptomInquiryUrl } from "@/lib/whatsapp";
import { getSymptomGuide, subscribeStoreUpdates } from "@/lib/storeManager";
import { useLanguage } from "@/context/LanguageContext";

const ICON_MAP: Record<SymptomCategory["iconName"], React.ReactNode> = {
  headache: <Brain className="h-5 w-5" />,
  stomach: <Flame className="h-5 w-5" />,
  bodypain: <Activity className="h-5 w-5" />,
  cold: <Snowflake className="h-5 w-5" />,
  fever: <Thermometer className="h-5 w-5" />,
};

export default function SymptomGuide() {
  const { lang } = useLanguage();
  const [symptoms, setSymptoms] = useState<SymptomCategory[]>(SYMPTOM_GUIDE);
  const [activeId, setActiveId] = useState<string>(SYMPTOM_GUIDE[0].id);

  useEffect(() => {
    const refresh = () => setSymptoms(getSymptomGuide());
    refresh();
    return subscribeStoreUpdates(refresh);
  }, []);

  const activeCategory =
    symptoms.find((item) => item.id === activeId) || symptoms[0];

  return (
    <section
  id="symptoms"
  className="bg-slate-50/65 py-16 transition-colors dark:bg-slate-900/60 sm:py-20"
>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300">
            {lang === "hi"
              ? "लक्षण और राहत गाइड"
              : "Quick Symptom & Relief Guide"}
          </span>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            {lang === "hi"
              ? "सामान्य स्वास्थ्य समस्याओं के अनुसार दवाइयाँ खोजें"
              : "Find Medicines by Common Health Problems"}
          </h2>
          <p className="mt-2.5 text-sm text-slate-600 dark:text-slate-400 sm:text-base">
            {lang === "hi"
              ? "काजल मेडिकल हॉल में उपलब्ध दवाइयाँ देखने और व्हाट्सएप पर स्टॉक पूछने के लिए नीचे अपनी समस्या चुनें।"
              : "Select a problem below to view commonly stocked medicines at Kajal Medical Hall and confirm availability on WhatsApp."}
          </p>
        </div>

        {/* Interactive Problem Tabs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          {symptoms.map((item) => {
            const isSelected = item.id === activeCategory.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveId(item.id)}
                className={`relative flex cursor-pointer items-center gap-2 rounded-2xl px-4 py-3 text-left text-xs font-bold transition sm:px-5 sm:text-sm ${
                  isSelected
                    ? "text-white shadow-md shadow-emerald-600/20"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-emerald-500 dark:hover:bg-slate-700"
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeSymptomTab"
                    transition={{ type: "spring", stiffness: 380, damping: 28 }}
                    className="absolute inset-0 rounded-2xl bg-emerald-600"
                  />
                )}
                <span className="relative z-10">{ICON_MAP[item.iconName]}</span>
                <span className="relative z-10">
                  {lang === "hi" ? (
                    item.hindiLabel
                  ) : (
                    <>
                      {item.problem.split(" ")[0]}{" "}
                      <span className="opacity-85">({item.hindiLabel})</span>
                    </>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Symptom Medicines Panel */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-8"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                    {ICON_MAP[activeCategory.iconName]}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">
                      {lang === "hi"
                        ? activeCategory.hindiLabel
                        : activeCategory.problem}
                    </h3>
                    <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                      {lang === "hi"
                        ? `${activeCategory.problem} • काउंटर पर उपलब्ध`
                        : `${activeCategory.hindiLabel} • Available at Counter`}
                    </p>
                  </div>
                </div>

                <a
                  href={getSymptomInquiryUrl({
                    problem: activeCategory.problem,
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-xs font-extrabold text-emerald-700 transition hover:bg-emerald-100 dark:bg-emerald-500/15 dark:text-emerald-300 dark:hover:bg-emerald-500/25 sm:text-sm"
                >
                  <MessageCircle className="h-4 w-4" />
                  {lang === "hi"
                    ? `${activeCategory.hindiLabel} के लिए सलाह लें`
                    : `Ask Pharmacist for ${activeCategory.problem.split(" ")[0]}`}
                </a>
              </div>

              {/* Medicines Grid */}
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {activeCategory.medicines.map((med, idx) => (
                  <motion.div
                    key={`${med.name}-${idx}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06 }}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-slate-50/60 p-5 transition hover:border-emerald-300 hover:bg-white hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-500/50"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1 text-[11px] font-bold text-slate-600 shadow-xs dark:bg-slate-800 dark:text-slate-300">
                          <Pill className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                          {med.ageGroup}
                        </span>
                      </div>

                      <h4 className="mt-3 text-base font-extrabold text-slate-900 dark:text-white">
                        {med.name}
                      </h4>
                      <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                        {med.usageNote}
                      </p>
                    </div>

                    <a
                      href={getSymptomInquiryUrl({
                        problem: activeCategory.problem,
                        medicineName: med.name,
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-emerald-200 bg-white px-3.5 py-2.5 text-xs font-extrabold text-emerald-700 transition hover:bg-emerald-600 hover:text-white dark:border-emerald-500/30 dark:bg-slate-800 dark:text-emerald-300 dark:hover:bg-emerald-600 dark:hover:text-white"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      {lang === "hi"
                        ? "व्हाट्सएप पर स्टॉक पूछें"
                        : "Check Stock on WhatsApp"}
                    </a>
                  </motion.div>
                ))}
              </div>

              {/* Medical Safety Disclaimer */}
              <div className="mt-6 flex items-start gap-2.5 rounded-2xl bg-amber-50/80 p-3.5 text-xs text-amber-900 dark:bg-amber-500/10 dark:text-amber-200">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <p>
                  {lang === "hi" ? (
                    <>
                      <strong>फार्मासिस्ट नोट:</strong> यहाँ दी गई दवाइयाँ
                      सामान्य जानकारी के लिए हैं। कृपया बच्चों, बुजुर्गों या
                      किसी नियमित बीमारी के लिए सही खुराक (डोज़) हमारे काउंटर
                      या डॉक्टर से जरूर पूछें।
                    </>
                  ) : (
                    <>
                      <strong>Pharmacist Note:</strong> Listed names are common
                      over-the-counter options for general awareness. Always
                      confirm correct dosage with our counter or your
                      doctor—especially for children, elderly patients, or
                      ongoing medications.
                    </>
                  )}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}