# Kajal Medical Hall — Digital Pharmacy & Healthcare Portal

A modern, bilingual (English & Hindi) Next.js and Cloud Firestore web application built for **Kajal Medical Hall** (Sahwajpur Puraina, Patepur, Vaishali, Bihar — Established 1994). The platform connects local families and livestock owners with real-time shop availability, WhatsApp prescription ordering, medicine stock catalogs, and an authenticated owner control panel.

---

## ✨ Key Features

* **Real-Time Open/Closed Signboard:** Displays live store hours (7:00 AM – 9:00 PM IST automatic schedule) or manual owner overrides (including custom reopening times) synced instantly across all visitor devices via Cloud Firestore.
* **Bilingual Support (English & हिन्दी):** One-click language switcher in the navigation bar translating UI labels, symptom guides, and pharmacy details between English and Hindi.
* **Dark & Light Mode:** Persistent theme toggle supporting both light and dark interfaces.
* **WhatsApp Prescription & Medicine Inquiry:** Dedicated `/prescription` flow and direct WhatsApp deep-links pre-filled with medicine or symptom context for fast counter verification.
* **Interactive Symptom Guide & Stock Catalog:** Searchable human healthcare and veterinary medicine categories alongside a common symptom relief guide (`/medicines`).
* **Authenticated Owner Control Panel (`/owner`):**
  * Password-protected login backed by `HttpOnly` signed session cookies.
  * Instant control over the live Open/Closed signboard and custom reopen message.
  * Full CRUD management for **Medicine Stock Categories** (Human Healthcare & Veterinary).
  * Full CRUD management for **Symptom Categories** and **Symptom Guide Medicines**.
  * Upload and live-sync the owner portrait displayed on the `/about` page.

---

## 🛠️ Tech Stack

* **Framework:** Next.js (App Router, Static Pre-rendering + Dynamic Server API Routes)
* **Language:** TypeScript & React
* **Styling & Animation:** Tailwind CSS, Lucide Icons, Motion (`motion/react`)
* **Database & Real-Time Sync:** Firebase Cloud Firestore (with long-polling enabled for reliable mobile/ISP connectivity) & Firebase Admin SDK
* **Deployment:** Netlify / Vercel

---

## 📁 Project Structure

```text
src/
├── app/
│   ├── about/                  # Pharmacy heritage, owner portrait & location details
│   ├── api/
│   │   ├── owner-login/        # POST/GET/DELETE HttpOnly session authentication
│   │   └── owner-update/       # Server-side Firestore writes via Firebase Admin SDK
│   ├── medicines/              # Medicine stock catalog & interactive symptom guide
│   ├── owner/                  # Protected Owner Control Panel (Signboard, Stock, Symptoms, Photo)
│   ├── prescription/           # Prescription upload & WhatsApp dispatch flow
│   └── page.tsx                # Homepage with live hanging signboard & quick actions
├── components/                 # Navbar, SymptomGuide, PrescriptionSender, MobileBottomBar, etc.
├── context/
│   └── LanguageContext.tsx     # English / Hindi state provider
├── data/
│   └── pharmacyData.ts         # Pharmacy config, default stock categories & symptom guide schema
└── lib/
    ├── firebase.ts             # Client Firestore setup (long-polling enabled)
    ├── storeManager.ts         # Real-time Firestore subscriptions & local fallback sync
    └── whatsapp.ts             # Store hours calculator & WhatsApp URL builders
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory (and add these exact variables to your Netlify/Vercel deployment settings):

```env
# Firebase Client SDK (Public)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK (Server-Only)
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project_id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"

# Owner Panel Authentication
OWNER_PASSWORD=your_secure_owner_password
OWNER_SESSION_SECRET=a_long_random_secret_string_for_cookie_signing
```

---

## 🚀 Getting Started Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Add your Firebase and Owner credentials to `.env.local` as shown above.

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   * Public Website: `http://localhost:3000`
   * Owner Control Panel: `http://localhost:3000/owner`

---

## 🌐 Deployment (Netlify)

1. Push your code to GitHub (`main` or `master` branch).
2. Import the repository in **Netlify** (`npm run build` as the build command).
3. Add all 10 environment variables from `.env.local` under **Site configuration → Environment variables**.
4. Add your live `.netlify.app` (or custom) domain to **Firebase Console → Authorized domains**.

---

## ⚠️ Medical Disclaimer

The symptom guide and medicine listings on this portal are provided strictly for general informational and availability-checking purposes. Always consult a qualified doctor or licensed pharmacist before starting or changing any medication.