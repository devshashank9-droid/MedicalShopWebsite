"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { PawPrint, HeartPulse } from "lucide-react";
import { STORE_CATEGORIES, StoreCategoryItem } from "@/data/pharmacyData";
import {
  getStoreCategories,
  subscribeStoreUpdates,
} from "@/lib/storeManager";
import { useLanguage } from "@/context/LanguageContext";

export default function StoreTrust() {
  const { lang } = useLanguage();
  const [categories, setCategories] =
    useState<StoreCategoryItem[]>(STORE_CATEGORIES);

  useEffect(() => {
    const refresh = () => setCategories(getStoreCategories());
    refresh();
    return subscribeStoreUpdates(refresh);
  }, []);

  return (
      <section
    id="categories"
    className="bg-white/60 py-16 transition-colors dark:bg-slate-950/60 sm:py-20"
  >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="rounded-full bg-amber-100 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-amber-900 dark:bg-amber-500/15 dark:text-amber-300">
              {lang === "hi"
                ? "एक ही छत के नीचे सभी दवाइयाँ"
                : "Complete Stock Under One Roof"}
            </span>
            <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              {lang === "hi"
                ? "हर उम्र और पशु चिकित्सा (वेटरनरी) की दवाइयाँ"
                : "Medicines for All Ages & Veterinary Care"}
            </h2>
          </div>
          <p className="max-w-md text-sm text-slate-600 dark:text-slate-400">
            {lang === "hi"
              ? "चाहे बच्चों के ड्रॉप्स हों, बुजुर्गों की नियमित दवाइयाँ हों, या पशुओं के लिए वेटरनरी सप्लीमेंट्स—सब कुछ ताज़ा स्टॉक में उपलब्ध है।"
              : "Whether it is pediatric drops, senior citizen chronic care, or veterinary supplements—everything is stocked fresh."}
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((item, idx) => {
            const isVeterinary = item.category
              .toLowerCase()
              .includes("veterinary");
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className={`rounded-2xl border p-6 transition hover:shadow-md ${
                  isVeterinary
                    ? "border-amber-200 bg-amber-50/40 dark:border-amber-500/25 dark:bg-slate-900"
                    : "border-slate-200/80 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold ${
                      isVeterinary
                        ? "bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-300"
                        : "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300"
                    }`}
                  >
                    {isVeterinary ? (
                      <PawPrint className="h-3.5 w-3.5" />
                    ) : (
                      <HeartPulse className="h-3.5 w-3.5" />
                    )}
                    {isVeterinary
                      ? lang === "hi"
                        ? "पशु चिकित्सा (Veterinary)"
                        : "Veterinary"
                      : lang === "hi"
                      ? "मानव स्वास्थ्य"
                      : item.category}
                  </span>
                  {item.badge && (
                    <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400">
                      {item.badge}
                    </span>
                  )}
                </div>

                <h3 className="mt-4 text-lg font-extrabold text-slate-900 dark:text-white">
                  {item.name}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {item.description}
                </p>
                <p className="mt-4 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  ✓ {item.unit}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}