# PARALLAX - Edge AI-Powered Smart Waste Segregation Ecosystem
### Smart India Hackathon (SIH) 2026 Submission

![Smart India Hackathon 2026](https://img.shields.io/badge/SIH-2026-blue.svg)
![Problem Statement ID](https://img.shields.io/badge/PS_ID-SIH26212-emerald.svg)
![Theme](https://img.shields.io/badge/Theme-Clean_%26_Green_Technology-green.svg)
![Category](https://img.shields.io/badge/Category-Hardware-orange.svg)

---

## 📌 Submission Overview

| Parameter | Details |
|---|---|
| **Team Name** | **PARALLAX** |
| **Team ID** | **120357** |
| **Problem Statement ID** | **SIH26212** |
| **Problem Statement Title** | Student Innovation - Solutions could be in the form of waste segregation, disposal, and improve sanitization system |
| **Theme** | Clean & Green Technology |
| **Category** | Hardware |

---

## 🌐 Live Interactive Applications (3 Interfaces)

Experience the live interactive web applications built for all three ecosystem user groups:

| Interface | Target User Group | Primary Features & Description | Live Route & Route Hash |
|---|---|---|---|
| **1️⃣ Citizen App** | Households & Residents | Multi-bin switcher (`Main Kitchen Bin`, `Balcony Bin`, `Garage Bin`), Software-Defined Slot Re-mapping across 6 categories, QR pass, 1,720 PTS rewards, spin wheel & raffles. | `/#/` |
| **2️⃣ Driver App** | Sanitation Fleet Drivers | Driver collection portal featuring one-tap camera **`SCAN CITIZEN QR`** scanner, household search by phone/address, and fleet unit operator details. | `/#/driver` |
| **3️⃣ Municipal Admin** | City Sanitation Authorities | Executive command dashboard with real-time ward telemetry (14 Households, 2,657 kg Daily Waste, 83% Accuracy), 7-day category trend charts, driver fleet dispatch, and complaint resolution. | `/#/municipal` |
| **⭐ SIH Showcase** | Hackathon Evaluators | Full interactive SIH 2026 presentation, live demo launcher, technical architecture breakdown, and research references. | `/#/demo` |

> 🔗 **Live Web Demo Deployment**: [https://temporary-sonic-banjo-74cgp22.vercel.app/#/](https://temporary-sonic-banjo-74cgp22.vercel.app/#/)  
> *(Switch between **CITIZEN APP**, **DRIVER APP**, **MUNICIPAL ADMIN**, and **SIH 2026 DOCS** at any time using the top app switcher navigation bar!)*

---

## 💡 The Problem & Proposed Solution

### 🚨 Problem Statement
1. **Zero Segregation at Source**: Cognitive fatigue and busy daily routines cause households to dump mixed waste into a single bin.
2. **Cross-Contamination**: Food residue in dry containers ruins recyclable batches, forcing expensive manual sorting downstream.
3. **Absence of Incentives**: No immediate rebates or rewards leave residents with zero motivation to sort waste.
4. **Severe Sanitation Hazards**: Sharp biomedical and hazardous waste directly enter domestic trash, exposing sanitation workers to infections and injuries.
5. **Decline of Manual Sorting**: Rising education and social mobility reduce informal waste pickers, leaving cities with no downstream sorting labor.

### 💡 The PARALLAX Solution
**PARALLAX** is an **Edge AI-powered smart segregation bin** that uses on-device computer vision and a **dual-axis pan-tilt chute** to automatically classify and route household waste into dedicated physical compartments at the source, preventing cross-contamination and incentivizing compliant disposal.

- **Instant Multi-Class Sorting**: On-device CNN model classifies waste in real time across six categories: *Recyclables, Non-Recyclables, Hazardous, Organic, E-Waste, and Bio-Medical*.
- **Gamified Citizen Nudge**: Engages residents with daily segregation tasks, level progressions, and brand discount rewards based on salvage weight.

---

## 🔥 Key Innovations & Uniqueness

1. **🛡️ Pre-Drop Composite Interlocking**: Uses multiclass detection to spot mixed items (e.g. food inside containers), halting chute actuation to prevent cross-contamination.
2. **⚙️ Software-Defined Dynamic Slots**: Digital lookup table dynamically maps 4 physical compartments across 6 waste categories via the mobile app with zero mechanical adjustments.
3. **📱 QR-Verified Collection & Compliance**: Daily household QR scans by waste pickers confirm segregated handovers to release reward points or flag non-compliance.

---

## 🛠️ Technical Architecture & Core Stack

### Hardware & Sensing Array
- **Compute & Display**: Raspberry Pi 5 (8GB RAM) paired with a 3.5-inch touch LCD interface.
- **Actuation**: Dual high-torque MG995 servos mounted on a 2-axis aluminum pan-tilt chute mechanism.
- **Sensory Array**: 
  - 5x Ultrasonic sensors (1 for intake drop detection, 4 for compartment fill levels)
  - 50kg HX711 Load Cell for weight tracking
  - Pi Camera Module 3

### Edge AI & Vision Pipeline
- **Detection Model**: Quantized YOLOv11n / YOLOv8n (INT8 quantized via TFLite runtime) for real-time multiclass identification.
- **Inference Speed**: 200 ms to 300 ms on-device sorting decisions.
- **Vision Pipeline**: OpenCV frame normalization, localized bounding-box cropping, Softmax confidence gating ($P \ge 0.80$), and dynamic PWM servo angle signals.

### Software & Cloud Telemetry
- **Firmware**: Python 3 utilizing TFLite Runtime, GPIO Zero, and PySerial.
- **Cloud Sync**: Firebase Firestore managed via MQTT and HTTPS event-driven payloads.
- **User Applications**: Modern React Web Apps with Tailwind CSS, Lucide icons, and Recharts analytics.

---

## 📈 Impact & Benefits

- **Landfill Diversion**: India dumps over 70% of its 150,000+ daily tonnes of municipal waste; automated source segregation prevents contamination so organic and recyclable waste go directly to processing plants (*Source: MoHUA / CPCB*).
- **Sanitation Worker Safety**: Touch-free sorting locks away broken glass and medical sharps.
- **Higher Scrap Realization**: Clean, unsoiled dry waste fetches higher resale prices from local recyclers.
- **EPR Compliance**: Verified recovery logs supply registered recyclers with traceable plastics needed to fulfill brand Extended Producer Responsibility (EPR) targets.

---

## 📚 Research & References

1. **The Hindu / NGT Assessment (2024)** – *"India generates over 1.5 lakh tonnes of municipal solid waste daily, with over 70% dumped untreated due to poor source segregation"*
2. **CPCB Annual Report (2022–23)** – *"India generates more than 1.5 lakh tonnes of MSW per day, creating major challenges in collection, segregation and disposal."*
3. **MoEF&CC / SWM Rules (2016)** – *"Mandatory 3-stream source segregation and strict compliance guidelines for commercial Bulk Waste Generators (BWGs)"*
4. **CPCB / Extended Producer Responsibility (EPR) Guidelines (2022)** – *"Mandates accountability, traceability, and transparent recovery of plastic waste."*

---

## 💻 Local Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/dkarthikraj/Parallax-Smart-Segregation-Bin-Apps.git

# 2. Navigate to project root
cd Parallax-Smart-Segregation-Bin-Apps

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```

The application will be accessible locally at `http://localhost:8080/`.

---

© **Team PARALLAX (Team ID: 120357)** · Smart India Hackathon 2026
