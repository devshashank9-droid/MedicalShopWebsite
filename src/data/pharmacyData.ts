export interface StoreCategoryItem {
  id: string;
  category: "Human Healthcare" | "Veterinary";
  badge?: string;
  name: string;
  description: string;
  unit: string;
}

export interface SymptomMedicine {
  name: string;
  ageGroup: string;
  usageNote: string;
}

export interface SymptomCategory {
  id: string;
  problem: string;
  hindiLabel: string;
  iconName: "headache" | "stomach" | "bodypain" | "cold" | "fever";
  description?: string;
  medicines: SymptomMedicine[];
}

export const PHARMACY_CONFIG = {
  name: "Kajal Medical Hall",
  ownerName: "Sanjeet Kumar Gupta",
  establishedYear: 1994,
  address: "Sahwajpur Puraina, Patepur, Vaishali, Bihar",
  phoneDisplay: "+91 99316 14365",
  whatsappNumber: "919931614365",
  googleMapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Sahwajpur+Puraina+Patepur+Vaishali+Bihar",
  openHour: 7, // 7:00 AM IST
  closeHour: 21, // 9:00 PM IST
};

export const STORE_CATEGORIES: StoreCategoryItem[] = [
  {
    id: "pediatric-care",
    category: "Human Healthcare",
    badge: "Infants & Kids",
    name: "Pediatric Drops, Syrups & Nutrition",
    description:
      "Safe, age-appropriate fever drops, colic relief, multivitamin syrups, ORS packets, and baby care essentials.",
    unit: "All leading pediatric brands in stock",
  },
  {
    id: "adult-chronic",
    category: "Human Healthcare",
    badge: "Daily Care",
    name: "BP, Diabetes, Thyroid & Heart Care",
    description:
      "Regular monthly strips and prescribed chronic care medicines stored under proper temperature control.",
    unit: "Full strips & monthly refill support",
  },
  {
    id: "senior-care",
    category: "Human Healthcare",
    badge: "Elderly Support",
    name: "Senior Citizen Bone, Joint & General Care",
    description:
      "Calcium, Vitamin D3, pain relief gels, digestive tonics, and daily wellness supplements for elders.",
    unit: "Genuine batch-verified stock",
  },
  {
    id: "general-otc",
    category: "Human Healthcare",
    badge: "First Aid & OTC",
    name: "First Aid, Skin Care & Everyday Relief",
    description:
      "Antiseptic liquids, bandages, fever thermometers, antifungal creams, eye/ear drops, and acidity relief.",
    unit: "Available over the counter",
  },
  {
    id: "vet-livestock",
    category: "Veterinary",
    badge: "Cattle & Livestock",
    name: "Veterinary Medicines & Calcium Tonics",
    description:
      "Complete veterinary antibiotics, deworming boluses, liver tonics, mineral mixtures, and milk-boosting supplements.",
    unit: "Trusted by local farmers & livestock owners",
  },
  {
    id: "vet-animal-care",
    category: "Veterinary",
    badge: "Animal Wellness",
    name: "Veterinary Wound Care & Immunity Boosters",
    description:
      "Antiseptic sprays, tick & parasite control, digestive powders, and vitamin concentrates for farm animals.",
    unit: "Fresh stock available daily",
  },
];

export const SYMPTOM_GUIDE: SymptomCategory[] = [
  {
    id: "headache",
    problem: "Headache & Migraine",
    hindiLabel: "सिर दर्द",
    iconName: "headache",
    medicines: [
      {
        name: "Saridon / Paracetamol 500mg",
        ageGroup: "Adults",
        usageNote:
          "Commonly used for tension headache and mild-to-moderate head pain.",
      },
      {
        name: "Ibuprofen + Paracetamol Tablet",
        ageGroup: "Adults",
        usageNote:
          "Provides faster relief when headache is accompanied by heaviness.",
      },
      {
        name: "Ayurvedic Pain Relief Roll-On / Balm",
        ageGroup: "All Ages",
        usageNote:
          "Topical cooling relief for forehead and temple discomfort.",
      },
    ],
  },
  {
    id: "stomach",
    problem: "Stomach Pain & Acidity",
    hindiLabel: "पेट दर्द और गैस",
    iconName: "stomach",
    medicines: [
      {
        name: "Pantoprazole / Rabeprazole + Domperidone",
        ageGroup: "Adults",
        usageNote:
          "Taken before meals to control acid reflux, gas, and heartburn.",
      },
      {
        name: "Dicyclomine + Mefenamic Acid",
        ageGroup: "Adults",
        usageNote:
          "Helps relieve abdominal cramps and spasmodic stomach pain.",
      },
      {
        name: "Digene Syrup / ORS Electrolyte Powder",
        ageGroup: "All Ages",
        usageNote:
          "Soothing antacid liquid and hydration support during upset stomach.",
      },
    ],
  },
  {
    id: "bodypain",
    problem: "Body Pain & Joint Ache",
    hindiLabel: "बदन दर्द",
    iconName: "bodypain",
    medicines: [
      {
        name: "Aceclofenac + Paracetamol",
        ageGroup: "Adults",
        usageNote:
          "Widely prescribed for muscular soreness, backache, and joint stiffness.",
      },
      {
        name: "Diclofenac Pain Relief Gel / Spray",
        ageGroup: "Adults & Seniors",
        usageNote:
          "Targeted external application for sprains, knee pain, and neck strain.",
      },
      {
        name: "Multivitamin & Calcium + D3",
        ageGroup: "Adults & Seniors",
        usageNote:
          "Supports recovery from general body weakness and fatigue.",
      },
    ],
  },
  {
    id: "cold",
    problem: "Cold, Cough & Allergy",
    hindiLabel: "सर्दी और जुकाम",
    iconName: "cold",
    medicines: [
      {
        name: "Cetirizine / Levocetirizine + Montelukast",
        ageGroup: "Adults & Kids (Syrup)",
        usageNote:
          "Relieves sneezing, runny nose, watery eyes, and seasonal allergies.",
      },
      {
        name: "Dextromethorphan / Ambroxol Cough Syrup",
        ageGroup: "All Ages",
        usageNote:
          "Available in both dry-cough and wet-cough formulations.",
      },
      {
        name: "Saline Nasal Drops & Steam Capsules",
        ageGroup: "Infants to Seniors",
        usageNote:
          "Clears blocked nasal passages safely without drowsiness.",
      },
    ],
  },
  {
    id: "fever",
    problem: "Fever & Viral Relief",
    hindiLabel: "बुखार",
    iconName: "fever",
    medicines: [
      {
        name: "Dolo 650 / Paracetamol 650mg",
        ageGroup: "Adults",
        usageNote:
          "Standard antipyretic to reduce high temperature and viral body ache.",
      },
      {
        name: "Paracetamol Pediatric Drops / Suspension",
        ageGroup: "Infants & Children",
        usageNote:
          "Weight-based liquid dosing for infants and school-age children.",
      },
      {
        name: "ORS + Zinc & Vitamin C Supplements",
        ageGroup: "All Ages",
        usageNote:
          "Prevents dehydration and supports faster immune recovery during fever.",
      },
    ],
  },
];