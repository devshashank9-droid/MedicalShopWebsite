"use client";

import React from "react";
import {
  Award,
  MapPin,
  Phone,
  MessageCircle,
  ExternalLink,
  CheckCircle2,
  UserCheck,
} from "lucide-react";
import { PHARMACY_CONFIG } from "@/data/pharmacyData";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { lang } = useLanguage();
  const whatsappUrl = `https://wa.me/${PHARMACY_CONFIG.whatsappNumber.replace(
    /\D/g,
    ""
  )}?text=${encodeURIComponent(
    lang === "hi"
      ? `नमस्ते ${PHARMACY_CONFIG.name}, मुझे दवाइयों के बारे में जानकारी चाहिए।`
      : `Hello ${PHARMACY_CONFIG.name}, I would like to inquire about medicines.`
  )}`;

  return (
    <footer className="border-t border-slate-800 bg-slate-900 pt-16 pb-24 text-white sm:pb-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Left: Heritage & Owner Card */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3.5 py-1 text-xs font-bold text-emerald-300">
              <Award className="h-4 w-4" />
              {lang === "hi"
                ? `स्थापना ${PHARMACY_CONFIG.establishedYear}`
                : `Established in ${PHARMACY_CONFIG.establishedYear}`}
            </div>

            <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-4xl">
              {lang === "hi" ? "काजल मेडिकल हॉल" : PHARMACY_CONFIG.name}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
              {lang === "hi" ? (
                <>
                  <strong>1994</strong> में{" "}
                  <strong className="text-white">संजीत कुमार गुप्ता</strong>{" "}
                  द्वारा स्थापित, काजल मेडिकल हॉल पिछले तीन दशकों से सहवाजपुर
                  पुरैना, पातेपुर और वैशाली के परिवारों व पशुपालकों को असली
                  दवाइयों और सही सलाह के साथ सेवा दे रहा है।
                </>
              ) : (
                <>
                  Founded in <strong>{PHARMACY_CONFIG.establishedYear}</strong>{" "}
                  by{" "}
                  <strong className="text-white">
                    {PHARMACY_CONFIG.ownerName}
                  </strong>
                  , Kajal Medical Hall has served families and livestock owners
                  across Sahwajpur Puraina, Patepur, and Vaishali for over three
                  decades with genuine medicines and honest guidance.
                </>
              )}
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-800/60 p-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                  <UserCheck className="h-4 w-4" />
                  {lang === "hi" ? "संचालक एवं संस्थापक" : "Owner & Founder"}
                </div>
                <p className="mt-1.5 text-base font-extrabold text-white">
                  {lang === "hi"
                    ? "संजीत कुमार गुप्ता"
                    : PHARMACY_CONFIG.ownerName}
                </p>
                <p className="text-xs text-slate-400">
                  {lang === "hi"
                    ? "1994 से समाज की सेवा में"
                    : "Serving the community since 1994"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-800/60 p-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                  <CheckCircle2 className="h-4 w-4" />
                  {lang === "hi" ? "विशेषताएँ" : "Specialties"}
                </div>
                <p className="mt-1.5 text-base font-extrabold text-white">
                  {lang === "hi"
                    ? "मानव + पशु चिकित्सा (Veterinary)"
                    : "Human + Veterinary Care"}
                </p>
                <p className="text-xs text-slate-400">
                  {lang === "hi"
                    ? "सभी उम्र की दवाइयाँ व वेटरनरी स्टॉक"
                    : "All age groups & veterinary stock"}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Address & Direct Contact Card */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-slate-800 bg-slate-800/80 p-6 sm:p-7">
              <h3 className="text-lg font-extrabold text-white">
                {lang === "hi"
                  ? "दुकान पर पधारें या संपर्क करें"
                  : "Visit or Contact the Shop"}
              </h3>

              <div className="mt-4 space-y-4 text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                  <div>
                    <p className="font-bold text-white">
                      {lang === "hi" ? "दुकान का पता" : "Store Address"}
                    </p>
                    <p>
                      {lang === "hi"
                        ? "सहवाजपुर पुरैना, पातेपुर, वैशाली, बिहार"
                        : PHARMACY_CONFIG.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                  <div>
                    <p className="font-bold text-white">
                      {lang === "hi"
                        ? "फ़ोन और व्हाट्सएप"
                        : "Phone & WhatsApp"}
                    </p>
                    <p>{PHARMACY_CONFIG.phoneDisplay}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-[#20bd5a]"
                >
                  <MessageCircle className="h-4 w-4" />
                  {lang === "hi" ? "व्हाट्सएप करें" : "WhatsApp Us"}
                </a>

                <a
                  href={PHARMACY_CONFIG.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-600 bg-slate-700/60 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-700"
                >
                  <span>{lang === "hi" ? "गूगल मैप्स" : "Google Maps"}</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()}{" "}
          {lang === "hi" ? "काजल मेडिकल हॉल" : PHARMACY_CONFIG.name} •{" "}
          {lang === "hi"
            ? "सहवाजपुर पुरैना, पातेपुर, वैशाली, बिहार"
            : PHARMACY_CONFIG.address}
        </div>
      </div>
    </footer>
  );
}