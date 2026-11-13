import { doc, onSnapshot, setDoc, deleteDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import {
  STORE_CATEGORIES,
  SYMPTOM_GUIDE,
  StoreCategoryItem,
  SymptomCategory,
} from "@/data/pharmacyData";

export type BoardMode = "auto" | "open" | "closed";

interface CloudStorePayload {
  boardMode?: BoardMode;
  reopenTime?: string;
  ownerPhoto?: string | null;
  categories?: StoreCategoryItem[];
  symptoms?: SymptomCategory[];
  updatedAt?: number;
}

const KEYS = {
  BOARD_MODE: "kmh_owner_board_mode",
  REOPEN_TIME: "kmh_owner_reopen_time",
  OWNER_PHOTO: "kmh_owner_photo",
  CATEGORIES: "kmh_owner_categories",
  SYMPTOMS: "kmh_owner_symptoms",
};

const UPDATE_EVENT = "kmh-store-updated";
const STORE_DOC_COLLECTION = "pharmacy";
const STORE_DOC_ID = "kajal-medical-hall";

let listenerCount = 0;
let unsubscribeFirestore: (() => void) | null = null;

function notifyStoreUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(UPDATE_EVENT));
  }
}

function applyCloudPayloadToLocal(data: CloudStorePayload) {
  if (typeof window === "undefined") return;

  if (
    data.boardMode === "open" ||
    data.boardMode === "closed" ||
    data.boardMode === "auto"
  ) {
    localStorage.setItem(KEYS.BOARD_MODE, data.boardMode);
  }

  if (typeof data.reopenTime === "string" && data.reopenTime.trim()) {
    localStorage.setItem(KEYS.REOPEN_TIME, data.reopenTime.trim());
  } else if (data.reopenTime === "") {
    localStorage.removeItem(KEYS.REOPEN_TIME);
  }

  if (typeof data.ownerPhoto === "string" && data.ownerPhoto) {
    localStorage.setItem(KEYS.OWNER_PHOTO, data.ownerPhoto);
  } else if (data.ownerPhoto === null) {
    localStorage.removeItem(KEYS.OWNER_PHOTO);
  }

  if (Array.isArray(data.categories)) {
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(data.categories));
  }

  if (Array.isArray(data.symptoms)) {
    localStorage.setItem(KEYS.SYMPTOMS, JSON.stringify(data.symptoms));
  }

  notifyStoreUpdated();
}

function ensureFirestoreListener() {
  if (typeof window === "undefined" || !isFirebaseConfigured || !db) return;
  if (unsubscribeFirestore) return;

  const storeRef = doc(db, STORE_DOC_COLLECTION, STORE_DOC_ID);
  unsubscribeFirestore = onSnapshot(
    storeRef,
    (snapshot) => {
      if (snapshot.exists()) {
        applyCloudPayloadToLocal(snapshot.data() as CloudStorePayload);
      }
    },
    (error) => {
      console.error("Firestore live sync error:", error);
    }
  );
}

async function syncPatchToCloud(patch: CloudStorePayload): Promise<void> {
  const res = await fetch("/api/owner-update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    if (res.status === 401) {
      throw new Error("Unauthorized: Session expired.");
    }
    throw new Error(data.message || `Server error (${res.status}) while saving.`);
  }
}

export function subscribeStoreUpdates(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  listenerCount += 1;
  ensureFirestoreListener();

  window.addEventListener(UPDATE_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(UPDATE_EVENT, callback);
    window.removeEventListener("storage", callback);
    listenerCount = Math.max(0, listenerCount - 1);
    if (listenerCount === 0 && unsubscribeFirestore) {
      unsubscribeFirestore();
      unsubscribeFirestore = null;
    }
  };
}

// 1. Open / Close Signboard Mode
export function getOwnerBoardMode(): BoardMode {
  if (typeof window === "undefined") return "auto";
  const saved = localStorage.getItem(KEYS.BOARD_MODE);
  if (saved === "open" || saved === "closed" || saved === "auto") {
    return saved;
  }
  return "auto";
}

export async function setOwnerBoardMode(mode: BoardMode): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.setItem(KEYS.BOARD_MODE, mode);
    notifyStoreUpdated();
  }
  await syncPatchToCloud({ boardMode: mode });
}

// 1b. Custom Reopen Time Message
export function getOwnerReopenTime(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(KEYS.REOPEN_TIME) || "";
}

export async function setOwnerReopenTime(timeText: string): Promise<void> {
  const trimmed = timeText.trim();
  if (typeof window !== "undefined") {
    if (trimmed) {
      localStorage.setItem(KEYS.REOPEN_TIME, trimmed);
    } else {
      localStorage.removeItem(KEYS.REOPEN_TIME);
    }
    notifyStoreUpdated();
  }
  await syncPatchToCloud({ reopenTime: trimmed });
}

// 1c. Owner Portrait Photo
export function getOwnerPhoto(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEYS.OWNER_PHOTO);
}

export async function setOwnerPhoto(
  photoDataUrl: string | null
): Promise<void> {
  if (typeof window !== "undefined") {
    if (photoDataUrl) {
      localStorage.setItem(KEYS.OWNER_PHOTO, photoDataUrl);
    } else {
      localStorage.removeItem(KEYS.OWNER_PHOTO);
    }
    notifyStoreUpdated();
  }
  await syncPatchToCloud({ ownerPhoto: photoDataUrl });
}

// 2. Medicine Stock & Categories
export function getStoreCategories(): StoreCategoryItem[] {
  if (typeof window === "undefined") return STORE_CATEGORIES;
  try {
    const raw = localStorage.getItem(KEYS.CATEGORIES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Fallback to default data
  }
  return STORE_CATEGORIES;
}

export async function saveStoreCategories(
  categories: StoreCategoryItem[]
): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
    notifyStoreUpdated();
  }
  await syncPatchToCloud({ categories });
}

// 3. Symptom Guide Medicines
export function getSymptomGuide(): SymptomCategory[] {
  if (typeof window === "undefined") return SYMPTOM_GUIDE;
  try {
    const raw = localStorage.getItem(KEYS.SYMPTOMS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Fallback to default data
  }
  return SYMPTOM_GUIDE;
}

export async function saveSymptomGuide(
  symptoms: SymptomCategory[]
): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.setItem(KEYS.SYMPTOMS, JSON.stringify(symptoms));
    notifyStoreUpdated();
  }
  await syncPatchToCloud({ symptoms });
}

// Reset all owner edits back to factory defaults
export async function resetAllOwnerData(): Promise<void> {
  const res = await fetch("/api/owner-update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reset: true }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    if (res.status === 401) {
      throw new Error("Unauthorized: Session expired.");
    }
    throw new Error(data.message || "Failed to reset cloud data.");
  }

  if (typeof window !== "undefined") {
    localStorage.removeItem(KEYS.BOARD_MODE);
    localStorage.removeItem(KEYS.REOPEN_TIME);
    localStorage.removeItem(KEYS.OWNER_PHOTO);
    localStorage.removeItem(KEYS.CATEGORIES);
    localStorage.removeItem(KEYS.SYMPTOMS);
    notifyStoreUpdated();
  }
}