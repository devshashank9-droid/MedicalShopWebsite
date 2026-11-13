"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Camera,
  ImagePlus,
  Send,
  X,
  CheckCircle2,
  FileText,
  Smartphone,
} from "lucide-react";
import { PHARMACY_CONFIG } from "@/data/pharmacyData";
import { shareOrOpenWhatsAppPrescription } from "@/lib/whatsapp";
import { useLanguage } from "@/context/LanguageContext";

export default function PrescriptionSender() {
  const { lang } = useLanguage();
  const [customerName, setCustomerName] = useState("");
  const [village, setVillage] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setStatusFeedback(null);
    if (selected.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(selected));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreviewUrl(null);
    setStatusFeedback(null);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await shareOrOpenWhatsAppPrescription({
      customerName,
      villageOrAddress: village,
      notes,
      file,
    });

    if (result === "opened_link" && file) {
      setStatusFeedback(
        lang === "hi"
          ? "व्हाट्सएप खुल गया है! कृपया अपनी चुनी हुई पर्चे की फोटो भेजने के लिए व्हाट्सएप में पिन (📎) आइकन दबाएं।"
          : "WhatsApp opened! Please tap the attachment (📎) icon in WhatsApp to attach your selected prescription photo."
      );
    } else if (result === "shared") {
      setStatusFeedback(
        lang === "hi"
          ? "पर्चा शेयर हो गया! व्हाट्सएप में काजल मेडिकल हॉल चुनें।"
          : "Prescription shared! Select Kajal Medical Hall in WhatsApp."
      );
    }
  };

  return (
    <section
  id="send-prescription"
  className="border-y border-emerald-100 bg-white/60 py-14 transition-colors dark:border-slate-800 dark:bg-slate-950/60 sm:py-20"
>
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid items-center gap-8 rounded-3xl border border-emerald-200/80 bg-emerald-50/60 p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900 sm:p-10 lg:grid-cols-12">
          {/* Left Side: 3-Step Visual Guide */}
          <div className="lg:col-span-5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white">
              <Smartphone className="h-3.5 w-3.5" />
              {lang === "hi" ? "आसान व्हाट्सएप ऑर्डर" : "Easy WhatsApp Order"}
            </span>
            <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              {lang === "hi"
                ? "व्हाट्सएप पर डॉक्टर का पर्चा भेजें"
                : "Send Doctor's Prescription on WhatsApp"}
            </h2>
            <p className="mt-2.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {lang === "hi" ? (
                <>
                  डॉक्टर की लिखावट समझने की चिंता न करें। अपने पर्चे या दवाई के
                  पत्ते की साफ फोटो खींचें और सीधे{" "}
                  <strong className="text-slate-900 dark:text-white">
                    काजल मेडिकल हॉल
                  </strong>{" "}
                  पर भेजें।
                </>
              ) : (
                <>
                  Don&apos;t worry about hard-to-read doctor handwriting. Snap a
                  clear photo of your prescription or medicine strip and send it
                  directly to{" "}
                  <strong className="text-slate-900 dark:text-white">
                    {PHARMACY_CONFIG.name}
                  </strong>
                  .
                </>
              )}
            </p>

            <ol className="mt-6 space-y-3 text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-extrabold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
                  1
                </span>
                <span>
                  <strong className="text-slate-900 dark:text-white">
                    {lang === "hi"
                      ? "फोटो खींचें या चुनें:"
                      : "Snap or Upload:"}
                  </strong>{" "}
                  {lang === "hi"
                    ? "अपने पर्चे की फोटो लें या गैलरी से चुनें।"
                    : "Take a photo of your parcha or select from gallery."}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-extrabold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
                  2
                </span>
                <span>
                  <strong className="text-slate-900 dark:text-white">
                    {lang === "hi"
                      ? "नाम और गाँव लिखें:"
                      : "Add Name & Village:"}
                  </strong>{" "}
                  {lang === "hi"
                    ? "ताकि हम आपकी दवाइयाँ पैक कर सकें और उपलब्धता बता सकें।"
                    : "So we can pack your medicines and confirm availability."}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-extrabold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
                  3
                </span>
                <span>
                  <strong className="text-slate-900 dark:text-white">
                    {lang === "hi"
                      ? "व्हाट्सएप पर भेजें:"
                      : "Send on WhatsApp:"}
                  </strong>{" "}
                  {lang === "hi"
                    ? `${PHARMACY_CONFIG.phoneDisplay} से तुरंत स्टॉक और बिल की जानकारी पाएं।`
                    : `Get instant reply on stock and total bill from ${PHARMACY_CONFIG.phoneDisplay}.`}
                </span>
              </li>
            </ol>
          </div>

          {/* Right Side: Interactive Capture & Send Form */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSend}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-6"
            >
              <label className="block text-xs font-extrabold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                {lang === "hi"
                  ? "1. पर्चे की फोटो (पर्चा / दवाई का पत्ता)"
                  : "1. Prescription Photo (Parcha / Medicine Strip)"}
              </label>

              <AnimatePresence mode="wait">
                {!file ? (
                  <motion.div
                    key="upload-buttons"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="mt-2 grid grid-cols-2 gap-3"
                  >
                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/60 p-4 text-center transition hover:border-emerald-500 hover:bg-emerald-50 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:hover:border-emerald-400 dark:hover:bg-emerald-500/15">
                      <Camera className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                      <span className="mt-1.5 text-xs font-extrabold text-slate-900 dark:text-white sm:text-sm">
                        {lang === "hi" ? "फोटो खींचें" : "Take Photo"}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {lang === "hi" ? "कैमरा खोलें" : "Open Phone Camera"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>

                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/70 p-4 text-center transition hover:border-emerald-400 hover:bg-emerald-50/30 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-emerald-500 dark:hover:bg-slate-800">
                      <ImagePlus className="h-7 w-7 text-slate-700 dark:text-slate-300" />
                      <span className="mt-1.5 text-xs font-extrabold text-slate-900 dark:text-white sm:text-sm">
                        {lang === "hi" ? "फाइल चुनें" : "Upload File"}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {lang === "hi"
                          ? "गैलरी फोटो या PDF"
                          : "Gallery Photo or PDF"}
                      </span>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                  </motion.div>
                ) : (
                  <motion.div
                    key="file-preview"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    className="mt-2 flex items-center justify-between rounded-2xl border border-emerald-300 bg-emerald-50 p-3.5 dark:border-emerald-500/40 dark:bg-emerald-950/50"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="Prescription preview"
                          className="h-16 w-16 rounded-xl object-cover shadow-sm ring-2 ring-white dark:ring-slate-800"
                        />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-emerald-200 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300">
                          <FileText className="h-7 w-7" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-800 dark:text-emerald-300">
                          <CheckCircle2 className="h-4 w-4 shrink-0" />
                          <span>
                            {lang === "hi"
                              ? "पर्चा संलग्न है"
                              : "Prescription Attached"}
                          </span>
                        </div>
                        <p className="truncate text-xs font-medium text-slate-700 dark:text-slate-200">
                          {file.name}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {(file.size / 1024).toFixed(0)} KB
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="rounded-xl bg-white p-2 text-slate-500 shadow-sm transition hover:text-rose-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-rose-400"
                      aria-label="Remove prescription"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Patient Details */}
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    {lang === "hi" ? "आपका नाम *" : "Your Name *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={
                      lang === "hi" ? "अपना नाम लिखें" : "Enter your name"
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    {lang === "hi" ? "गाँव / पता" : "Village / Landmark"}
                  </label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder={
                      lang === "hi"
                        ? "जैसे: सहवाजपुर पुरैना, पातेपुर"
                        : "e.g. Sahwajpur Puraina, Patepur"
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500"
                  />
                </div>
              </div>

              <div className="mt-3">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {lang === "hi"
                    ? "अतिरिक्त जानकारी (वैकल्पिक)"
                    : "Extra Notes (Optional)"}
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={
                    lang === "hi"
                      ? "जैसे: पूरा पत्ता चाहिए / बच्चे की उम्र 5 साल / पशु दवाई"
                      : "e.g. Need full strip / Patient age 5 yrs / Veterinary medicine"
                  }
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500"
                />
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 text-sm font-black text-slate-950 shadow-md shadow-emerald-500/20 transition hover:bg-[#20bd5a] sm:text-base"
              >
                <Send className="h-5 w-5" />
                {lang === "hi"
                  ? "व्हाट्सएप पर पर्चा भेजें"
                  : "Send Prescription to WhatsApp"}
              </motion.button>

              {statusFeedback && (
                <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-center text-xs font-semibold text-amber-900 dark:bg-amber-500/15 dark:text-amber-300">
                  {statusFeedback}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}