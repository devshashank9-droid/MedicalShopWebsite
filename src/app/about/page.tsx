"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Award,
  Users,
  ShieldCheck,
  MapPin,
  Phone,
  MessageCircle,
  Stethoscope,
  PawPrint,
  Camera,
  UserCheck,
} from "lucide-react";
import { PHARMACY_CONFIG } from "@/data/pharmacyData";
import { getOwnerPhoto, subscribeStoreUpdates } from "@/lib/storeManager";
import { useLanguage } from "@/context/LanguageContext";

export default function AboutPage() {
  const { lang } = useLanguage();
  const [ownerPhoto, setOwnerPhoto] = useState<string | null>(null);

  useEffect(() => {
    const refresh = () => setOwnerPhoto(getOwnerPhoto());
    refresh();
    return subscribeStoreUpdates(refresh);
  }, []);

  const whatsappUrl = `https://wa.me/${PHARMACY_CONFIG.whatsappNumber.replace(
    /\D/g,
    ""
  )}?text=${encodeURIComponent(
    lang === "hi"
      ? `नमस्ते ${PHARMACY_CONFIG.name}, मुझे आपकी दुकान के बारे में जानकारी चाहिए।`
      : `Hello ${PHARMACY_CONFIG.name}, I would like to know more about your pharmacy.`
  )}`;

  return (
    <main className="min-h-screen bg-slate-50/60 py-14 transition-colors dark:bg-slate-950/60 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="rounded-3xl border border-emerald-100 bg-white/95 p-7 shadow-sm backdrop-blur-xs dark:border-slate-800 dark:bg-slate-900/95 sm:p-10">
          {/* Top Section: Founder Photo + Story */}
          <div className="flex flex-col items-center gap-7 sm:flex-row sm:items-start">
            {/* Owner Portrait Card (Controlled Exclusively from /owner) */}
            <div className="flex shrink-0 flex-col items-center">
              <div className="h-36 w-36 overflow-hidden rounded-3xl border-4 border-emerald-200/80 bg-gradient-to-br from-emerald-100 to-amber-50 shadow-md dark:border-emerald-500/30 dark:from-emerald-950 dark:to-slate-800 sm:h-44 sm:w-44">
                {ownerPhoto ? (
                  <img
                    src={ownerPhoto}
                    alt={PHARMACY_CONFIG.ownerName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center p-3 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-xl font-black text-white shadow-xs">
                      SG
                    </div>
                    <span className="mt-2 text-[11px] font-extrabold text-emerald-900 dark:text-emerald-300">
                      {lang === "hi"
                        ? "संजीत कुमार गुप्ता"
                        : PHARMACY_CONFIG.ownerName}
                    </span>
                  </div>
                )}
              </div>

              <span className="mt-2.5 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-extrabold text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300">
                <UserCheck className="h-3.5 w-3.5" />
                {lang === "hi" ? "संस्थापक एवं संचालक" : "Founder & Owner"}
              </span>
            </div>

            {/* Story Text */}
            <div className="flex-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3.5 py-1 text-xs font-extrabold text-amber-900 dark:bg-amber-500/15 dark:text-amber-300">
                <Award className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                {lang === "hi"
                  ? "32 वर्षों का स्वास्थ्य सेवा विश्वास • स्थापना 1994"
                  : `32 Years of Healthcare Trust • Est. ${PHARMACY_CONFIG.establishedYear}`}
              </div>

              <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                {lang === "hi"
                  ? "काजल मेडिकल हॉल के बारे में"
                  : `About ${PHARMACY_CONFIG.name}`}
              </h1>

              <p className="mt-3.5 text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
                {lang === "hi" ? (
                  <>
                    <strong>1994</strong> में{" "}
                    <strong className="text-slate-900 dark:text-white">
                      संजीत कुमार गुप्ता
                    </strong>{" "}
                    द्वारा{" "}
                    <strong className="text-slate-900 dark:text-white">
                      सहवाजपुर पुरैना, पातेपुर, वैशाली, बिहार
                    </strong>{" "}
                    में स्थापित,{" "}
                    <strong className="text-slate-900 dark:text-white">
                      काजल मेडिकल हॉल
                    </strong>{" "}
                    पिछले <strong>32 वर्षों</strong> से स्थानीय परिवारों को
                    असली और विश्वसनीय दवाइयाँ उपलब्ध करा रहा है। आज पातेपुर और
                    वैशाली के हजारों परिवार और पशुपालक हम पर भरोसा करते हैं।
                  </>
                ) : (
                  <>
                    Established in{" "}
                    <strong>{PHARMACY_CONFIG.establishedYear}</strong> by{" "}
                    <strong className="text-slate-900 dark:text-white">
                      {PHARMACY_CONFIG.ownerName}
                    </strong>
                    ,{" "}
                    <strong className="text-slate-900 dark:text-white">
                      {PHARMACY_CONFIG.name}
                    </strong>{" "}
                    has been a cornerstone of healthcare in{" "}
                    <strong className="text-slate-900 dark:text-white">
                      {PHARMACY_CONFIG.address}
                    </strong>{" "}
                    for over <strong>32 years</strong>. What began as a
                    commitment to providing reliable, authentic medicines to
                    local households has grown into a trusted pharmacy serving
                    thousands of families and livestock owners across Patepur
                    and Vaishali.
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Key Pillars */}
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/70">
              <Users className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              <h2 className="mt-3 text-base font-extrabold text-slate-900 dark:text-white">
                {lang === "hi"
                  ? "हजारों परिवारों का भरोसा"
                  : "Trusted by Thousands"}
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                {lang === "hi"
                  ? "तीन पीढ़ियों से परिवार सही सलाह और असली दवाइयों के लिए हमारे काउंटर पर आते हैं।"
                  : "Three generations of families rely on our counter for honest advice and genuine medicines."}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/70">
              <div className="flex items-center gap-1.5">
                <Stethoscope className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                <PawPrint className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h2 className="mt-3 text-base font-extrabold text-slate-900 dark:text-white">
                {lang === "hi"
                  ? "सभी उम्र व वेटरनरी सेवा"
                  : "All Ages & Veterinary Care"}
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                {lang === "hi"
                  ? "नवजात बच्चों के ड्रॉप्स से लेकर बुजुर्गों की दवाइयाँ और पशु चिकित्सा (वेटरनरी) स्टॉक उपलब्ध।"
                  : "Complete stock ranging from infant drops and senior chronic care to veterinary & animal medicines."}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/70">
              <ShieldCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              <h2 className="mt-3 text-base font-extrabold text-slate-900 dark:text-white">
                {lang === "hi" ? "100% असली दवाइयाँ" : "100% Authentic Stock"}
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                {lang === "hi"
                  ? "सीधे अधिकृत वितरकों से मंगाई गई और सुरक्षित तापमान में रखी गई प्रमाणित दवाइयाँ।"
                  : "Properly stored, batch-verified medicines sourced directly from authorized distributors."}
              </p>
            </div>
          </div>

          {/* Direct Store Info & Actions */}
          <div className="mt-8 flex flex-col justify-between gap-6 rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-6 dark:border-emerald-500/20 dark:bg-emerald-950/30 sm:flex-row sm:items-center">
            <div className="space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
              <p className="font-extrabold text-slate-900 dark:text-white">
                {lang === "hi"
                  ? "संस्थापक एवं संचालक: संजीत कुमार गुप्ता"
                  : `Founder & Owner: ${PHARMACY_CONFIG.ownerName}`}
              </p>
              <p className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                {lang === "hi"
                  ? "सहवाजपुर पुरैना, पातेपुर, वैशाली, बिहार"
                  : PHARMACY_CONFIG.address}
              </p>
              <p className="flex items-center gap-1.5">
                <Phone className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                {PHARMACY_CONFIG.phoneDisplay}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/prescription"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-extrabold text-white shadow-xs transition hover:bg-emerald-700 sm:text-sm"
              >
                <Camera className="h-4 w-4" />
                {lang === "hi" ? "पर्चा भेजें" : "Send Prescription"}
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-xs font-extrabold text-slate-950 shadow-xs transition hover:bg-[#20bd5a] sm:text-sm"
              >
                <MessageCircle className="h-4 w-4" />
                {lang === "hi" ? "व्हाट्सएप पर बात करें" : "Chat on WhatsApp"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}