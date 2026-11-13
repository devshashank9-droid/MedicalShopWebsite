import { PHARMACY_CONFIG } from "@/data/pharmacyData";

export function getStoreLiveStatus(): {
  isOpen: boolean;
  statusLabel: string;
  subText: string;
} {
  const now = new Date();
  const istString = now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
  const istDate = new Date(istString);
  const currentHour = istDate.getHours();

  const isOpen =
    currentHour >= PHARMACY_CONFIG.openHour &&
    currentHour < PHARMACY_CONFIG.closeHour;

  const formatHour = (h: number) => {
    const period = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12}:00 ${period}`;
  };

  if (isOpen) {
    return {
      isOpen: true,
      statusLabel: "WE ARE OPEN",
      subText: `Open today until ${formatHour(PHARMACY_CONFIG.closeHour)} IST`,
    };
  }

  return {
    isOpen: false,
    statusLabel: "WE ARE CLOSED",
    subText: `Opens at ${formatHour(PHARMACY_CONFIG.openHour)} IST • WhatsApp active 24/7`,
  };
}

export function getSymptomInquiryUrl(params: {
  problem: string;
  medicineName?: string;
}): string {
  const cleanNumber = PHARMACY_CONFIG.whatsappNumber.replace(/\D/g, "");
  const message = params.medicineName
    ? `Hello ${PHARMACY_CONFIG.name}, is *${params.medicineName}* (for ${params.problem}) available in stock right now?`
    : `Hello ${PHARMACY_CONFIG.name}, I need medicine advice/availability for *${params.problem}*.`;

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export async function shareOrOpenWhatsAppPrescription(params: {
  customerName: string;
  villageOrAddress: string;
  notes?: string;
  file?: File | null;
}): Promise<"shared" | "opened_link"> {
  const cleanNumber = PHARMACY_CONFIG.whatsappNumber.replace(/\D/g, "");

  const message = [
    `*Prescription Order - ${PHARMACY_CONFIG.name}*`,
    `• *Name:* ${params.customerName || "Customer"}`,
    `• *Village / Address:* ${params.villageOrAddress || "Patepur area"}`,
    params.notes ? `• *Medicine / Notes:* ${params.notes}` : "",
    !params.file ? `• _(Attaching prescription photo in chat)_` : "",
  ]
    .filter(Boolean)
    .join("\n");

  if (
    params.file &&
    typeof navigator !== "undefined" &&
    navigator.canShare &&
    navigator.canShare({ files: [params.file] })
  ) {
    try {
      await navigator.share({
        title: `Prescription for ${PHARMACY_CONFIG.name}`,
        text: message,
        files: [params.file],
      });
      return "shared";
    } catch {
      // User dismissed native share sheet; fall back to standard WhatsApp link
    }
  }

  const waUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
  window.open(waUrl, "_blank", "noopener,noreferrer");
  return "opened_link";
}
