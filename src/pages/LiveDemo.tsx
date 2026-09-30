import { Link } from "react-router-dom";
import { 
  Cpu, 
  Smartphone, 
  Truck, 
  Building2, 
  Layers, 
  ShieldAlert, 
  QrCode, 
  Award, 
  Sparkles, 
  ArrowRight, 
  ExternalLink,
  CheckCircle2,
  Zap,
  Activity,
  BarChart3,
  FileText
} from "lucide-react";

const LiveDemo = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 selection:bg-blue-600 selection:text-white">
      {/* Top Banner / SIH 2026 Header */}
      <header className="bg-white border-b border-slate-200/80 px-6 py-8 shadow-xs">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black shadow-md shadow-blue-600/20">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 uppercase tracking-wider">
                  SMART INDIA HACKATHON 2026
                </span>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-1">
                  PARALLAX Smart Waste Segregation Ecosystem
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs font-bold font-mono">
              <span className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200">
                TEAM ID: 120357
              </span>
              <span className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200">
                PS ID: SIH26212
              </span>
              <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-xl border border-blue-200">
                TEAM: PARALLAX
              </span>
            </div>
          </div>

          <p className="text-sm text-slate-600 font-medium max-w-3xl leading-relaxed">
            <strong>Problem Statement:</strong> Student Innovation Solutions for waste segregation, disposal, and sanitation system improvement. 
            <span className="text-slate-400 font-normal"> Theme: Clean & Green Technology · Category: Hardware</span>
          </p>
        </div>
      </header>

      {/* Main Interactive Demo Launcher Grid */}
      <main className="max-w-5xl mx-auto px-6 py-10 space-y-12">
        {/* Section 1: Live Interactive App Launcher */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                Live Demo Applications (3 Interfaces)
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Launch any of the 3 real-time synchronized interfaces in your browser
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Server Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Citizen App */}
            <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Smartphone className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono font-extrabold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full uppercase">
                  INTERFACE 1
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-2 mb-1">Citizen Household App</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium mb-4">
                  Multi-bin management, software-defined 4-slot chute remapping across 6 waste categories, QR pass, 1,720 PTS rewards, and daily eco-tasks.
                </p>

                <ul className="space-y-1.5 text-xs text-slate-600 font-semibold mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Multi-Bin Household Switcher</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Dynamic Chute Slot Re-mapping</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Gamified Rewards (PTS & Levels)</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/"
                className="w-full py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all"
              >
                <span>Launch Citizen App</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Card 2: Driver App */}
            <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Truck className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono font-extrabold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full uppercase">
                  INTERFACE 2
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-2 mb-1">Driver Collection App</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium mb-4">
                  Sanitation truck operator portal featuring one-tap camera QR scanning for household collection verification and pickup search.
                </p>

                <ul className="space-y-1.5 text-xs text-slate-600 font-semibold mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>One-Tap SCAN CITIZEN QR</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Household Phone & Address Search</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Fleet Unit Operator Details</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/driver"
                className="w-full py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all"
              >
                <span>Launch Driver App</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Card 3: Municipal Admin */}
            <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono font-extrabold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full uppercase">
                  INTERFACE 3
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-2 mb-1">Municipal Admin Dashboard</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium mb-4">
                  Executive city sanitation command center monitoring real-time waste metrics, segregation accuracy (83%), driver dispatch, and bio-hazards.
                </p>

                <ul className="space-y-1.5 text-xs text-slate-600 font-semibold mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Real-Time Waste Telemetry (kg)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>7-Day Waste Category Trends</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>10+ Municipal Operations Suites</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/municipal"
                className="w-full py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all"
              >
                <span>Launch Municipal Admin</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Section 2: Innovation Highlights (From SIH PPT) */}
        <section className="rounded-3xl bg-white border border-slate-200/90 p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-[10px] font-mono font-extrabold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 uppercase">
              SIH 2026 INNOVATION & UNIQUENESS
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">Key Technological Breakthroughs</h2>
            <p className="text-xs text-slate-500 font-medium">Core innovations designed for Team PARALLAX (SIH26212)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-slate-900">Pre-Drop Composite Interlocking</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Uses multiclass computer vision to spot mixed items (e.g. food inside packaging), halting chute actuation to prevent batch cross-contamination.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-slate-900">Customizable Dynamic Bins</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Software lookup table dynamically maps 4 physical compartments across 6 categories (Organic, Recyclables, Non-Recyclables, Hazardous, E-Waste, Bio-Medical) with zero mechanical adjustments.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-slate-900">QR-Verified Compliance</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Daily household QR scans by waste pickers confirm segregated handovers for rewards or flag mixed waste to trigger municipal compliance loops.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Technical Approach & Hardware Architecture */}
        <section className="rounded-3xl bg-white border border-slate-200/90 p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-[10px] font-mono font-extrabold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 uppercase">
              HARDWARE & EDGE AI ARCHITECTURE
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">Technical Architecture & Stack</h2>
            <p className="text-xs text-slate-500 font-medium">On-device edge inference & sensor integration specifications</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-blue-600" />
                Compute & Sensing
              </h3>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                <p><strong>Processing Unit:</strong> Raspberry Pi 5 (8GB RAM) with 3.5" Touch LCD</p>
                <p><strong>Actuation:</strong> Dual MG995 servos on 2-axis aluminum pan-tilt chute</p>
                <p><strong>Sensory Array:</strong> 5x Ultrasonic sensors (intake + 4 fill levels), 50kg HX711 Load Cell, Pi Camera Module 3</p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-blue-600" />
                Edge AI Pipeline
              </h3>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                <p><strong>Detection Model:</strong> YOLOv11n / YOLOv8n (INT8 Quantized TFLite Runtime)</p>
                <p><strong>Inference Latency:</strong> 200ms to 300ms on-device sorting decision</p>
                <p><strong>Vision Pipeline:</strong> OpenCV normalization, localized bounding-box cropping, Softmax gating ($P \ge 0.80$)</p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-blue-600" />
                Software & Cloud
              </h3>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                <p><strong>Firmware:</strong> Python 3 utilizing TFLite Runtime, GPIO Zero, PySerial</p>
                <p><strong>Telemetry:</strong> Firebase Firestore managed via MQTT and HTTPS payloads</p>
                <p><strong>User Apps:</strong> React Web App + Tailwind CSS with responsive light UI</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Problem & Impact Summary */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-sm space-y-3">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              The Problem We Solve
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">•</span>
                <span><strong>Zero Segregation at Source:</strong> Cognitive fatigue causes households to dump un-sorted waste into single bins.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">•</span>
                <span><strong>Cross-Contamination:</strong> Food residue in recyclables destroys batch recyclability and creates landfill waste.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">•</span>
                <span><strong>Sanitation Hazards:</strong> Biomedical sharps in domestic waste endanger informal and municipal waste pickers.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-sm space-y-3">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              Impact & Value Delivered
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span><strong>Landfill Diversion:</strong> Diverts organic & recyclable waste directly to processing plants (MoHUA/CPCB compliant).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span><strong>Gamified Incentives:</strong> Distributes civic rebates and store vouchers per kg of segregated waste deposited.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span><strong>Sanitation Protection:</strong> Motorized self-sealing liners isolate hazardous & biomedical pathogens.</span>
              </li>
            </ul>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 pt-10 text-center text-xs text-slate-400 font-medium border-t border-slate-200/80">
        PARALLAX Smart Waste Segregation Ecosystem · Smart India Hackathon 2026 (Team ID: 120357, PS ID: SIH26212)
      </footer>
    </div>
  );
};

export default LiveDemo;
