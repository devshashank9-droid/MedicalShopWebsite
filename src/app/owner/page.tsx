"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Lock,
  Unlock,
  Power,
  Package,
  Pill,
  Plus,
  Trash2,
  Pencil,
  Check,
  CheckCircle2,
  X,
  RotateCcw,
  ShieldAlert,
  Clock,
  Camera,
  UserCheck,
  Cloud,
} from "lucide-react";
import {
  PHARMACY_CONFIG,
  StoreCategoryItem,
  SymptomCategory,
} from "@/data/pharmacyData";
import {
  BoardMode,
  getOwnerBoardMode,
  setOwnerBoardMode,
  getOwnerReopenTime,
  setOwnerReopenTime,
  getOwnerPhoto,
  setOwnerPhoto,
  getStoreCategories,
  saveStoreCategories,
  getSymptomGuide,
  saveSymptomGuide,
  resetAllOwnerData,
  subscribeStoreUpdates,
} from "@/lib/storeManager";
import { isFirebaseConfigured } from "@/lib/firebase";

const QUICK_REOPEN_PRESETS = [
  "4:00 PM Today",
  "5:00 PM Today",
  "6:00 PM Today",
  "Tomorrow at 7:00 AM",
  "Tomorrow at 8:00 AM",
];

function compressImageFile(file: File, maxSize = 480): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas unavailable"));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = () => reject(new Error("Invalid image file"));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export default function OwnerPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState<
    "board" | "stock" | "symptoms" | "photo"
  >("board");

  const [boardMode, setBoardMode] = useState<BoardMode>("auto");
  const [reopenTime, setReopenTime] = useState<string>("");
  const [isTimeSaved, setIsTimeSaved] = useState(false);
  const [ownerPhoto, setOwnerPhotoState] = useState<string | null>(null);
  const [categories, setCategories] = useState<StoreCategoryItem[]>([]);
  const [symptoms, setSymptoms] = useState<SymptomCategory[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [stockCategory, setStockCategory] = useState<
    "Human Healthcare" | "Veterinary"
  >("Human Healthcare");
  const [stockBadge, setStockBadge] = useState("");
  const [stockName, setStockName] = useState("");
  const [stockDescription, setStockDescription] = useState("");
  const [stockUnit, setStockUnit] = useState("In Stock");

  const [selectedSymptomId, setSelectedSymptomId] = useState<string>("");
  const [medName, setMedName] = useState("");
  const [medAgeGroup, setMedAgeGroup] = useState("Adults");
  const [medUsageNote, setMedUsageNote] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const handleSaveError = (err: unknown) => {
    const message =
      err instanceof Error ? err.message : "Failed to save changes.";
    if (message.toLowerCase().includes("unauthorized")) {
      setIsAuthenticated(false);
      setAuthError("Your 12-hour session expired. Please log in again.");
      return;
    }
    showToast(`Error: ${message}`);
  };

  useEffect(() => {
    let isMounted = true;

    const verifyCookieSession = async () => {
      try {
        const res = await fetch("/api/owner-login", { method: "GET" });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.authenticated) {
            setIsAuthenticated(true);
          }
        }
      } catch {
        // Ignore network errors on initial check; user can still log in manually
      } finally {
        if (isMounted) {
          setIsCheckingSession(false);
        }
      }
    };

    verifyCookieSession();

    const syncFromStore = () => {
      setBoardMode(getOwnerBoardMode());
      setReopenTime(getOwnerReopenTime());
      setOwnerPhotoState(getOwnerPhoto());
      setCategories(getStoreCategories());
      const loadedSymptoms = getSymptomGuide();
      setSymptoms(loadedSymptoms);
      setSelectedSymptomId(
        (prev) =>
          prev || (loadedSymptoms.length > 0 ? loadedSymptoms[0].id : ""),
      );
    };

    syncFromStore();
    const unsubscribe = subscribeStoreUpdates(syncFromStore);
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setAuthError("");

    try {
      const res = await fetch("/api/owner-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput.trim() }),
      });

      if (res.ok) {
        setIsAuthenticated(true);
        setPasswordInput("");
      } else if (res.status === 404) {
        setAuthError(
          "Login API route not found (404). Make sure src/app/api/owner-login/route.ts exists.",
        );
      } else {
        const data = await res.json().catch(() => ({}));
        setAuthError(
          data.message || "Incorrect owner password. Please try again.",
        );
      }
    } catch {
      setAuthError("Network error while verifying password.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/owner-login", { method: "DELETE" });
    } finally {
      setIsAuthenticated(false);
    }
  };

  const handleBoardChange = async (mode: BoardMode) => {
    try {
      setBoardMode(mode);
      await setOwnerBoardMode(mode);
      if (mode === "open") {
        setReopenTime("");
        await setOwnerReopenTime("");
      }
      const label =
        mode === "open"
          ? "WE ARE OPEN"
          : mode === "closed"
            ? "WE ARE CLOSED"
            : "Automatic Schedule (7 AM - 9 PM)";
      showToast(`Live signboard updated for all visitors: ${label}`);
    } catch (err) {
      handleSaveError(err);
    }
  };

  const handleSaveReopenTime = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setOwnerReopenTime(reopenTime);
      setIsTimeSaved(true);
      setTimeout(() => setIsTimeSaved(false), 2000);

      if (reopenTime.trim()) {
        setBoardMode("closed");
        await setOwnerBoardMode("closed");
        showToast(
          `Live update sent: Shop closed, will open at ${reopenTime.trim()}`,
        );
      } else {
        showToast("Custom opening time cleared.");
      }
    } catch (err) {
      handleSaveError(err);
    }
  };

  const handleClearReopenTime = async () => {
    try {
      setReopenTime("");
      await setOwnerReopenTime("");
      setIsTimeSaved(false);
      showToast("Custom opening time cleared.");
    } catch (err) {
      handleSaveError(err);
    }
  };

  const handleOwnerPhotoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressedDataUrl = await compressImageFile(file, 480);
      setOwnerPhotoState(compressedDataUrl);
      await setOwnerPhoto(compressedDataUrl);
      showToast("Owner photo updated live on About page!");
    } catch (err) {
      handleSaveError(err);
    }
  };

  const handleRemoveOwnerPhoto = async () => {
    try {
      setOwnerPhotoState(null);
      await setOwnerPhoto(null);
      showToast("Owner photo removed.");
    } catch (err) {
      handleSaveError(err);
    }
  };

  const resetStockForm = () => {
    setEditingStockId(null);
    setStockCategory("Human Healthcare");
    setStockBadge("");
    setStockName("");
    setStockDescription("");
    setStockUnit("In Stock");
  };

  const handleSaveStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockName.trim()) return;

    let updated: StoreCategoryItem[];
    if (editingStockId) {
      updated = categories.map((item) =>
        item.id === editingStockId
          ? {
              ...item,
              category: stockCategory,
              badge: stockBadge.trim() || undefined,
              name: stockName.trim(),
              description: stockDescription.trim(),
              unit: stockUnit.trim() || "In Stock",
            }
          : item,
      );
    } else {
      const newItem: StoreCategoryItem = {
        id: `stock-${Date.now()}`,
        category: stockCategory,
        badge: stockBadge.trim() || undefined,
        name: stockName.trim(),
        description: stockDescription.trim(),
        unit: stockUnit.trim() || "In Stock",
      };
      updated = [newItem, ...categories];
    }

    try {
      await saveStoreCategories(updated);
      setCategories(updated);
      showToast(
        editingStockId
          ? "Medicine stock updated live!"
          : "New medicine stock published live!",
      );
      resetStockForm();
    } catch (err) {
      handleSaveError(err);
    }
  };

  const handleEditStockClick = (item: StoreCategoryItem) => {
    setEditingStockId(item.id);
    setStockCategory(item.category);
    setStockBadge(item.badge || "");
    setStockName(item.name);
    setStockDescription(item.description);
    setStockUnit(item.unit);
  };

  const handleDeleteStock = async (id: string) => {
    const updated = categories.filter((item) => item.id !== id);
    try {
      await saveStoreCategories(updated);
      setCategories(updated);
      if (editingStockId === id) resetStockForm();
      showToast("Stock item removed.");
    } catch (err) {
      handleSaveError(err);
    }
  };

  const handleAddSymptomMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSymptomId || !medName.trim()) return;

    const updated = symptoms.map((cat) => {
      if (cat.id !== selectedSymptomId) return cat;
      return {
        ...cat,
        medicines: [
          ...cat.medicines,
          {
            name: medName.trim(),
            ageGroup: medAgeGroup.trim() || "Adults",
            usageNote:
              medUsageNote.trim() ||
              "Available at counter. Confirm dosage before use.",
          },
        ],
      };
    });

    try {
      await saveSymptomGuide(updated);
      setSymptoms(updated);
      setMedName("");
      setMedAgeGroup("Adults");
      setMedUsageNote("");
      showToast("Medicine published to Symptom Guide!");
    } catch (err) {
      handleSaveError(err);
    }
  };

  const handleRemoveSymptomMedicine = async (
    symptomId: string,
    medicineIndex: number,
  ) => {
    const updated = symptoms.map((cat) => {
      if (cat.id !== symptomId) return cat;
      return {
        ...cat,
        medicines: cat.medicines.filter((_, idx) => idx !== medicineIndex),
      };
    });

    try {
      await saveSymptomGuide(updated);
      setSymptoms(updated);
      showToast("Medicine removed from Symptom Guide.");
    } catch (err) {
      handleSaveError(err);
    }
  };

  const handleResetDefaults = async () => {
    try {
      await resetAllOwnerData();
      setBoardMode("auto");
      setReopenTime("");
      setIsTimeSaved(false);
      setOwnerPhotoState(null);
      setCategories(getStoreCategories());
      setSymptoms(getSymptomGuide());
      showToast("All live settings restored to default.");
    } catch (err) {
      handleSaveError(err);
    }
  };

  if (isCheckingSession) {
    return (
      <main className="flex min-h-[75vh] items-center justify-center bg-slate-50/60 px-4 py-16 transition-colors dark:bg-slate-950/60">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-bold text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          Verifying owner session...
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-[75vh] items-center justify-center bg-slate-50/60 px-4 py-16 transition-colors dark:bg-slate-950/60">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
            <Lock className="h-7 w-7" />
          </div>

          <h1 className="mt-4 text-center text-2xl font-black text-slate-900 dark:text-white">
            Owner Access Only
          </h1>
          <p className="mt-1.5 text-center text-xs text-slate-500 dark:text-slate-400">
            {PHARMACY_CONFIG.name} • Enter owner password to manage live shop
            status and medicine stock.
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Owner Password
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </div>

            {authError && (
              <p className="flex items-center gap-1.5 rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 dark:bg-rose-500/15 dark:text-rose-300">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                {authError}
              </p>
            )}

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.96 }}
              type="submit"
              disabled={isLoggingIn}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-extrabold text-white shadow-md transition hover:bg-emerald-700 disabled:opacity-60"
            >
              <Unlock className="h-4 w-4" />
              {isLoggingIn ? "Verifying..." : "Unlock Owner Panel"}
            </motion.button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50/60 py-10 transition-colors dark:bg-slate-950/60 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Top Owner Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-emerald-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300">
                Owner Control Panel
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold ${
                  isFirebaseConfigured
                    ? "bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300"
                    : "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300"
                }`}
              >
                <Cloud className="h-3.5 w-3.5" />
                {isFirebaseConfigured
                  ? "Live Cloud Sync Active (All Phones)"
                  : "Local Browser Mode (Restart dev server to load .env.local)"}
              </span>
            </div>

            <h1 className="mt-2 text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">
              Welcome, {PHARMACY_CONFIG.ownerName}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Changes saved here sync in real time to every customer&apos;s
              phone and browser.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleResetDefaults}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset Defaults
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleLogout}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-extrabold text-white transition hover:bg-rose-700"
            >
              <Lock className="h-3.5 w-3.5" />
              Lock Panel
            </motion.button>
          </div>
        </div>

        {/* Toast Notification */}
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-center text-xs font-extrabold text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-200"
          >
            ✓ {toastMessage}
          </motion.div>
        )}

        {/* Control Section Tabs */}
        <div className="mt-6 flex flex-wrap gap-2">
          <motion.button
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={() => setActiveTab("board")}
            className={`inline-flex cursor-pointer items-center gap-2 rounded-2xl px-5 py-3 text-xs font-extrabold transition sm:text-sm ${
              activeTab === "board"
                ? "bg-emerald-600 text-white shadow-sm"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            }`}
          >
            <Power className="h-4 w-4" />
            1. Open / Close Signboard
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={() => setActiveTab("stock")}
            className={`inline-flex cursor-pointer items-center gap-2 rounded-2xl px-5 py-3 text-xs font-extrabold transition sm:text-sm ${
              activeTab === "stock"
                ? "bg-emerald-600 text-white shadow-sm"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            }`}
          >
            <Package className="h-4 w-4" />
            2. Edit Medicine Stock ({categories.length})
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={() => setActiveTab("symptoms")}
            className={`inline-flex cursor-pointer items-center gap-2 rounded-2xl px-5 py-3 text-xs font-extrabold transition sm:text-sm ${
              activeTab === "symptoms"
                ? "bg-emerald-600 text-white shadow-sm"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            }`}
          >
            <Pill className="h-4 w-4" />
            3. Symptom Guide Medicines
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={() => setActiveTab("photo")}
            className={`inline-flex cursor-pointer items-center gap-2 rounded-2xl px-5 py-3 text-xs font-extrabold transition sm:text-sm ${
              activeTab === "photo"
                ? "bg-emerald-600 text-white shadow-sm"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            }`}
          >
            <Camera className="h-4 w-4" />
            4. Owner Photo (About Page)
          </motion.button>
        </div>

        {/* TAB 1: OPEN / CLOSE SIGNBOARD & CUSTOM REOPEN TIME */}
        {activeTab === "board" && (
          <div className="mt-6 space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Shop Signboard Status Control
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Only you can change the hanging signboard on the homepage and
                the live status badge in the navbar.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={() => handleBoardChange("open")}
                  className={`cursor-pointer rounded-2xl border-2 p-5 text-left transition ${
                    boardMode === "open"
                      ? "border-emerald-600 bg-emerald-50/70 dark:bg-emerald-500/15"
                      : "border-slate-200 hover:border-emerald-300 dark:border-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="h-3 w-3 rounded-full bg-emerald-500" />
                    {boardMode === "open" && (
                      <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-[11px] font-bold text-white">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-lg font-black text-slate-900 dark:text-white">
                    WE ARE OPEN
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Manually keep the shop board green &amp; open at all times.
                  </p>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={() => handleBoardChange("closed")}
                  className={`cursor-pointer rounded-2xl border-2 p-5 text-left transition ${
                    boardMode === "closed"
                      ? "border-rose-600 bg-rose-50/70 dark:bg-rose-500/15"
                      : "border-slate-200 hover:border-rose-300 dark:border-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="h-3 w-3 rounded-full bg-rose-500" />
                    {boardMode === "closed" && (
                      <span className="rounded-full bg-rose-600 px-2.5 py-0.5 text-[11px] font-bold text-white">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-lg font-black text-slate-900 dark:text-white">
                    WE ARE CLOSED
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Manually show the red closed board (e.g., break or holiday).
                  </p>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={() => handleBoardChange("auto")}
                  className={`cursor-pointer rounded-2xl border-2 p-5 text-left transition ${
                    boardMode === "auto"
                      ? "border-amber-500 bg-amber-50/70 dark:bg-amber-500/15"
                      : "border-slate-200 hover:border-amber-300 dark:border-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    {boardMode === "auto" && (
                      <span className="rounded-full bg-amber-600 px-2.5 py-0.5 text-[11px] font-bold text-white">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-lg font-black text-slate-900 dark:text-white">
                    Automatic Schedule
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Automatically shows Open from 7:00 AM to 9:00 PM IST.
                  </p>
                </motion.button>
              </div>
            </div>

            {/* CUSTOM REOPEN TIME CARD */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                <Clock className="h-4 w-4" />
                Next Opening Time Note
              </div>
              <h3 className="mt-1 text-lg font-black text-slate-900 dark:text-white">
                Set Custom Time When Shop Will Open
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Write when you will reopen (for example:{" "}
                <strong>5:00 PM Today</strong> or{" "}
                <strong>Tomorrow at 8:00 AM</strong>). It will appear directly
                on the homepage signboard when the shop is closed.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {QUICK_REOPEN_PRESETS.map((preset) => (
                  <motion.button
                    key={preset}
                    whileTap={{ scale: 0.94 }}
                    type="button"
                    onClick={() => setReopenTime(preset)}
                    className={`cursor-pointer rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
                      reopenTime === preset
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800 dark:border-emerald-500 dark:bg-emerald-500/20 dark:text-emerald-200"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:border-emerald-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    {preset}
                  </motion.button>
                ))}
              </div>

              <form
                onSubmit={handleSaveReopenTime}
                className="mt-4 flex flex-col gap-3 sm:flex-row"
              >
                <input
                  type="text"
                  value={reopenTime}
                  onChange={(e) => setReopenTime(e.target.value)}
                  placeholder="e.g. 5:00 PM Today / Tomorrow at 8:00 AM"
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.93 }}
                  type="submit"
                  className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-extrabold text-white shadow-md transition-colors duration-200 ${
                    isTimeSaved
                      ? "bg-teal-600 ring-4 ring-emerald-400/40"
                      : "bg-emerald-600 hover:bg-emerald-500"
                  }`}
                >
                  {isTimeSaved ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 animate-bounce" />
                      <span>Saved Live!</span>
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Save Opening Time</span>
                    </>
                  )}
                </motion.button>

                {reopenTime && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.93 }}
                    type="button"
                    onClick={handleClearReopenTime}
                    className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    <X className="h-4 w-4" />
                    Clear
                  </motion.button>
                )}
              </form>

              {reopenTime.trim() && (
                <p className="mt-3 rounded-xl bg-rose-50 px-3.5 py-2 text-xs font-semibold text-rose-800 dark:bg-rose-500/15 dark:text-rose-200">
                  Homepage Preview when Closed:{" "}
                  <strong>
                    Will open at {reopenTime.trim()} • WhatsApp active 24/7
                  </strong>
                </p>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: EDIT MEDICINE STOCK */}
        {activeTab === "stock" && (
          <div className="mt-6 grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <form
                onSubmit={handleSaveStock}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  {editingStockId
                    ? "Edit Medicine Stock"
                    : "Add New Medicine Stock"}
                </h2>

                <div className="mt-4 space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Department
                    </label>
                    <select
                      value={stockCategory}
                      onChange={(e) =>
                        setStockCategory(
                          e.target.value as "Human Healthcare" | "Veterinary",
                        )
                      }
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    >
                      <option value="Human Healthcare">Human Healthcare</option>
                      <option value="Veterinary">Veterinary</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Medicine / Category Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={stockName}
                      onChange={(e) => setStockName(e.target.value)}
                      placeholder="e.g. Veterinary Calcium & Liver Tonics"
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Tag / Badge
                      </label>
                      <input
                        type="text"
                        value={stockBadge}
                        onChange={(e) => setStockBadge(e.target.value)}
                        placeholder="e.g. Livestock Care"
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Stock Status *
                      </label>
                      <input
                        type="text"
                        required
                        value={stockUnit}
                        onChange={(e) => setStockUnit(e.target.value)}
                        placeholder="e.g. Fresh Stock Available"
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Details / Description *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={stockDescription}
                      onChange={(e) => setStockDescription(e.target.value)}
                      placeholder="Write details about available brands or medicines..."
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    />
                  </div>

                  <div className="flex gap-2 pt-1">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-emerald-700"
                    >
                      {editingStockId ? (
                        <>
                          <Check className="h-4 w-4" />
                          Save Changes
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          Add to Stock
                        </>
                      )}
                    </motion.button>

                    {editingStockId && (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={resetStockForm}
                        className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-600 dark:border-slate-700 dark:text-slate-300"
                      >
                        <X className="h-4 w-4" />
                      </motion.button>
                    )}
                  </div>
                </div>
              </form>
            </div>

            <div className="space-y-3 lg:col-span-7">
              {categories.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${
                          item.category === "Veterinary"
                            ? "bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-300"
                            : "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300"
                        }`}
                      >
                        {item.category}
                      </span>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        ✓ {item.unit}
                      </span>
                    </div>
                    <h3 className="mt-1.5 text-base font-extrabold text-slate-900 dark:text-white">
                      {item.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <motion.button
                      whileTap={{ scale: 0.94 }}
                      type="button"
                      onClick={() => handleEditStockClick(item)}
                      className="inline-flex cursor-pointer items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.94 }}
                      type="button"
                      onClick={() => handleDeleteStock(item.id)}
                      className="inline-flex cursor-pointer items-center gap-1 rounded-xl bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-100 dark:bg-rose-500/15 dark:text-rose-300"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove
                    </motion.button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SYMPTOM GUIDE MEDICINES MANAGER */}
        {activeTab === "symptoms" && (
          <div className="mt-6 grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <form
                onSubmit={handleAddSymptomMedicine}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  Add Medicine to Symptom Guide
                </h2>

                <div className="mt-4 space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Select Problem Category
                    </label>
                    <select
                      value={selectedSymptomId}
                      onChange={(e) => setSelectedSymptomId(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    >
                      {symptoms.map((sym) => (
                        <option key={sym.id} value={sym.id}>
                          {sym.problem} ({sym.hindiLabel})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Medicine Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={medName}
                      onChange={(e) => setMedName(e.target.value)}
                      placeholder="e.g. Calpol 650mg Tablet"
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Age Group
                    </label>
                    <input
                      type="text"
                      value={medAgeGroup}
                      onChange={(e) => setMedAgeGroup(e.target.value)}
                      placeholder="e.g. Adults / Infants & Kids / All Ages"
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Usage Note *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={medUsageNote}
                      onChange={(e) => setMedUsageNote(e.target.value)}
                      placeholder="Short note on when/how it helps..."
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    />
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-emerald-700"
                  >
                    <Plus className="h-4 w-4" />
                    Add Medicine
                  </motion.button>
                </div>
              </form>
            </div>

            <div className="space-y-4 lg:col-span-7">
              {symptoms.map((cat) => (
                <div
                  key={cat.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900"
                >
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {cat.problem}{" "}
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      ({cat.hindiLabel})
                    </span>
                  </h3>

                  <div className="mt-3 space-y-2">
                    {cat.medicines.length === 0 ? (
                      <p className="text-xs text-slate-400">
                        No medicines listed under this problem yet.
                      </p>
                    ) : (
                      cat.medicines.map((med, idx) => (
                        <div
                          key={`${cat.id}-${med.name}-${idx}`}
                          className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-2.5 dark:border-slate-800 dark:bg-slate-950"
                        >
                          <div>
                            <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                              {med.name}{" "}
                              <span className="ml-1.5 rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                {med.ageGroup}
                              </span>
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {med.usageNote}
                            </p>
                          </div>

                          <motion.button
                            whileTap={{ scale: 0.92 }}
                            type="button"
                            onClick={() =>
                              handleRemoveSymptomMedicine(cat.id, idx)
                            }
                            className="shrink-0 cursor-pointer rounded-lg bg-rose-50 p-2 text-rose-600 transition hover:bg-rose-100 dark:bg-rose-500/15 dark:text-rose-300"
                            title="Remove medicine"
                          >
                            <Trash2 className="h-4 w-4" />
                          </motion.button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: OWNER PHOTO FOR ABOUT PAGE */}
        {activeTab === "photo" && (
          <div className="mt-6 max-w-xl">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                <UserCheck className="h-4 w-4" />
                About Page Portrait
              </div>
              <h2 className="mt-1 text-xl font-black text-slate-900 dark:text-white">
                Owner Photo ({PHARMACY_CONFIG.ownerName})
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Only you can upload or change this photo from the Owner Panel.
                It appears directly on the <strong>About</strong> page for all
                visitors.
              </p>

              <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row">
                <div className="relative h-36 w-36 shrink-0 overflow-hidden rounded-3xl border-4 border-emerald-100 bg-emerald-50 shadow-md dark:border-slate-800 dark:bg-slate-950">
                  {ownerPhoto ? (
                    <img
                      src={ownerPhoto}
                      alt={PHARMACY_CONFIG.ownerName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center text-center text-emerald-700 dark:text-emerald-300">
                      <UserCheck className="h-10 w-10 opacity-70" />
                      <span className="mt-1 text-[11px] font-bold">
                        No Photo Set
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-3">
                  <motion.label
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.96 }}
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-emerald-700"
                  >
                    <Camera className="h-4 w-4" />
                    <span>
                      {ownerPhoto ? "Change Owner Photo" : "Upload Owner Photo"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleOwnerPhotoUpload}
                      className="hidden"
                    />
                  </motion.label>

                  {ownerPhoto && (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={handleRemoveOwnerPhoto}
                      className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-rose-50 px-4 py-2.5 text-xs font-extrabold text-rose-700 transition hover:bg-rose-100 dark:bg-rose-500/15 dark:text-rose-300"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove Photo
                    </motion.button>
                  )}

                  <p className="text-[11px] text-slate-400">
                    Supports JPG, PNG, or WebP. Automatically compressed for
                    instant live sync across devices.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
