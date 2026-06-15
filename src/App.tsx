import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Compass,
  FileText,
  User,
  Calendar,
  Clock,
  MapPin,
  Languages,
  UploadCloud,
  X,
  ChevronRight,
  BookOpen,
  Copy,
  Check,
  Download,
  Info,
  CircleAlert,
  Moon,
  Sun,
  Activity,
  Heart,
  TrendingUp,
  Plane,
  Scale
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "motion/react";
import { BirthProfile, PalmTraits } from "./types";

// Cosmic/Spiritual Quotes to rotate during the loading phase
const SPIRITUAL_QUOTES = [
  {
    en: "The cosmos does not compel; it inclines. Your free will is the ultimate force that shapes your destiny.",
    si: "තාරකා මණ්ඩලය බලපෑම් නොකරයි; එය මඟ පෙන්වයි. ඔබේ නිදහස් කැමැත්ත ඔබේ දෛවය හැඩගස්වන උත්තරීතර බලවේගයයි."
  },
  {
    en: "Your palm holds the blueprint of your soul's journey, while the stars illuminate the crossroads of life.",
    si: "ඔබේ අත්ලෙහි ආත්මයේ ගමන් මඟෙහි සැලැස්ම සටහන්ව ඇති අතර, තාරකා ජීවිතයේ සන්ධිස්ථාන ඒකාලෝක කරයි."
  },
  {
    en: "Do not gaze at the stars with fear, but with understanding. Every Dasha is a season for growth.",
    si: "බියෙන් තොරව, අවබෝධයෙන් යුතුව තාරකා දෙස බලන්න. සෑම ග්‍රහ දශාවක්ම ආත්මීය වර්ධනයට මඟ පාදයි."
  },
  {
    en: "When inner wisdom meets the planetary movements, challenges transform into stepping stones of destiny.",
    si: "අභ්‍යන්තර ප්‍රඥාව සහ විශ්ව ග්‍රහ චලිතය එකිනෙක මුණගැසුණු කල, බාධක දෛවයේ ජයග්‍රහණ බවට පත්වේ."
  },
  {
    en: "In the Jataka (birth chart), we find our seed. Through our daily karma, we decide how beautiful the flower will bloom.",
    si: "කේන්දර සටහනක ඇත්තේ අපේ ජීවිතයේ බීජයයි. අපේ දිනපතා කර්මය මඟින් එම මල කොතරම් අලංකාරව පිපෙන්නේදැයි තීරණය කරයි."
  }
];

export default function App() {
  // Setup default state
  const [profile, setProfile] = useState<BirthProfile>({
    name: "",
    dob: "",
    tob: "",
    pob: "",
    gender: "",
    language: "Mixed",
    questions: "",
    palmTraits: {
      lifeLine: "Long, unbroken & wrapping fully around the Venus Mount",
      headLine: "Straight, sharp & running across the palm",
      heartLine: "Long, curving up to between Jupiter and Saturn mounts",
      fateLine: "Distinct line starting from near the wrist straight to Saturn mount",
      majorMount: "Jupiter Mount (Below Index - Ambition & Wisdom)"
    },
    palmImages: []
  });

  const [palmImages, setPalmImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [quoteIndex, setQuoteIndex] = useState<number>(0);
  const [reading, setReading] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"jyotish" | "palm" | "questions">("jyotish");

  // Spin/Cycle quotes every 6 seconds during loading
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setQuoteIndex((prev) => (prev + 1) % SPIRITUAL_QUOTES.length);
      }, 6000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Read upload image and convert to Base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError(null);
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        setImageError("Please upload valid image files only.");
        return;
      }
      if (file.size > 8 * 1024 * 1024) {
        setImageError("Images must be smaller than 8MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          // Limit to maximum 3 palm images to avoid exceeding payload limits
          setPalmImages((prev) => {
            if (prev.length >= 3) {
              setImageError("You can upload a maximum of 3 palm images.");
              return prev;
            }
            return [...prev, reader.result as string];
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (indexToRemove: number) => {
    setPalmImages((prev) => prev.filter((_, i) => i !== indexToRemove));
    setImageError(null);
  };

  // Trait descriptions mapping
  const lifeLineOptions = [
    { value: "Long, unbroken & wrapping fully around the Venus Mount", label: "Long & Deep (දිගු සහ අඛණ්ඩ)", desc: "Robust vitality, high physical resilience, family ties, strong foundation." },
    { value: "Faint, thin or short", label: "Faint or Short (ලා පැහැති හෝ කෙටි)", desc: "Intellect-led vitality, seeks peaceful surroundings, highly adaptive." },
    { value: "Slightly broken or chained in sections", label: "Broken / Chained (කැඩීම් හෝ දම්වැල් හැඩ)", desc: "Major transition phases, shifts in lifestyle, lessons of perseverance." }
  ];

  const headLineOptions = [
    { value: "Straight, sharp & running across the palm", label: "Straight & Sharp (කෙලින් පිහිටි)", desc: "Logical, pragmatic thinker, analytical, values facts and solid truth." },
    { value: "Curving deeply down towards the Moon Mount", label: "Curving to Moon (චන්ද්‍රය දෙසට නැමුණු)", desc: "Immense creative imagination, intuitive solver, works from visualization." },
    { value: "Forked at the end (Writer's Fork/Talent fork)", label: "Forked End (අගින් බෙදුණු හැඩය)", desc: "Diverse mental abilities, multi-perspective thinker, natural communicator." }
  ];

  const heartLineOptions = [
    { value: "Long, curving up to between Jupiter and Saturn mounts", label: "Balanced Curve (සමබර වක්‍රය)", desc: "Empathetic, stable relationships, mature emotional expression." },
    { value: "Short & straight, ending below the Saturn Mount", label: "Short & Straight (කෙටි සහ කෙලින්)", desc: "Guarded feelings, highly practical in love, values privacy, self-directed." },
    { value: "Highly chained, feathered or cluttered with tiny branches", label: "Chained / Feathered (රැලි හෝ දම්වැල් හැඩ)", desc: "Deep emotional sensitivity, absorbs external energies, strong empathy." }
  ];

  const fateLineOptions = [
    { value: "Distinct line starting from near the wrist straight to Saturn mount", label: "Strong & Continuous (පැහැදිලිව දර්ශනය වන)", desc: "Early sense of personal direction, structured carer, self-made path." },
    { value: "Starts late from inside the Life Line or Head Line", label: "Late Breakout Stars (මැදිවියේදී ඇරඹෙන)", desc: "Breakout success coming through family support or self-effort later in life." },
    { value: "Faint, broken or absent", label: "Alternative/Fluid Path (ලා පැහැති හෝ නොමැති)", desc: "Fluid destiny, loves flexibility, pivots careers successfully, values autonomy." }
  ];

  const majorMountOptions = [
    { value: "Jupiter Mount (Below Index - Ambition & Wisdom)", label: "Jupiter Mount (ගුරු මණ්ඩලය)", desc: "Natural leadership, philosophical seeker, high aspirations, generosity." },
    { value: "Saturn Mount (Below Middle - Discipline & Duty)", label: "Saturn Mount (සෙනසුරු මණ්ඩලය)", desc: "Disciplinary, methodical, loves silence, values order and long-term grit." },
    { value: "Sun Mount (Below Ring - Fame & Creativity)", label: "Sun Mount (රවි මණ්ඩලය)", desc: "Aesthetic appreciation, creative voice, charismatic, loves noble acts." },
    { value: "Mercury Mount (Below Pinky - Business & Intellect)", label: "Mercury Mount (ბුධ මණ්ඩලය)", desc: "Business intelligence, clever speaking, sharp trade, healing hands." },
    { value: "Venus Mount (Thick base of thumb - Love & Vitality)", label: "Venus Mount (සිකුරු මණ්ඩලය)", desc: "Sensory enjoyer, highly social, empathetic companion, lover of arts." },
    { value: "Moon Mount (Fleshy heel of palm - Intuition & Journeys)", label: "Moon Mount (චන්ද්‍ර මණ්ඩලය)", desc: "Dreamy depths, mystical ideas, connection to water/travel, active subconscious." }
  ];

  const updateTrait = (key: keyof PalmTraits, value: string) => {
    setProfile((prev) => ({
      ...prev,
      palmTraits: {
        ...prev.palmTraits,
        [key]: value
      }
    }));
  };

  // Submit profile to backend API
  const handleConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!profile.name.trim()) {
      setValidationError("Please enter your name (ඔබගේ නම ඇතුළත් කරන්න).");
      return;
    }
    if (!profile.dob) {
      setValidationError("Please select your date of birth (උපන් දිනය තෝරන්න).");
      return;
    }
    if (!profile.gender) {
      setValidationError("Please select your gender (ස්ත්‍රී/පුරුෂ භාවය තෝරන්න).");
      return;
    }

    try {
      setLoading(true);
      setReading(null);

      const payload = {
        name: profile.name,
        dob: profile.dob,
        tob: profile.tob,
        pob: profile.pob,
        gender: profile.gender,
        language: profile.language,
        palmTraits: profile.palmTraits,
        questions: profile.questions,
        palmImages: palmImages
      };

      const response = await fetch("/api/astrology/reading", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to reach the guru. Please check internet connection or server logs.");
      }

      const data = await response.json();
      setReading(data.reading);
    } catch (err: any) {
      setValidationError(err.message || "An unexpected error occurred during cosmic alignment.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!reading) return;
    try {
      await navigator.clipboard.writeText(reading);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Clipboard copy failed:", err);
    }
  };

  const handleDownload = () => {
    if (!reading) return;
    const element = document.createElement("a");
    const file = new Blob([reading], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = `${profile.name.replace(/\s+/g, "_")}_Vedic_Reading.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-[#0a0b0e] text-[#f5f2ed] font-serif antialiased selection:bg-[#c5a059]/30 selection:text-[#f5f2ed] border-4 md:border-8 border-[#1a1c23] relative">
      {/* Exquisite Top Header */}
      <header className="relative border-b border-[#c5a059]/30 bg-[#0a0b0e] py-8">
        <div className="absolute inset-0 bg-[radial-gradient(#c5a059_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.03]"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end">
            <div className="flex flex-col text-center md:text-left mb-4 md:mb-0">
              <span className="text-[#c5a059] uppercase tracking-[0.2em] text-xs mb-1.5 font-sans">Vedic Insight & Palmistry Sanctuary</span>
              <h1 className="text-3xl md:text-4xl font-light font-display italic tracking-wide text-[#f5f2ed]">
                The Celestial Blueprint
              </h1>
            </div>
            <div className="text-center md:text-right">
              <p className="text-xs text-[#c5a059]/60 font-sans tracking-widest uppercase mb-1">Session ID: JS-1082-V</p>
              <p className="text-sm italic text-[#f5f2ed]/80">"Destiny is a map; wisdom is the compass."</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid Workspace */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* LEFT PANEL: INPUT CHAMBER (5 columns) */}
          <section className="lg:col-span-5 space-y-6">
            <div className="rounded-sm border border-[#c5a059]/20 bg-[#14161c] p-6 shadow-xl shadow-black/40">
              
              <div className="flex items-center gap-2.5 border-b border-[#c5a059]/20 pb-4 mb-5">
                <Compass className="h-5 w-5 text-[#c5a059]" />
                <h2 className="font-sans text-xs uppercase tracking-widest text-[#c5a059] font-bold">Consultation Profile (විස්තර සටහන)</h2>
              </div>

              {/* Step Navigation Tabs */}
              <div className="grid grid-cols-3 gap-1 rounded bg-[#0a0b0e] p-1 text-xs font-semibold mb-6 border border-[#c5a059]/10 font-sans">
                <button
                  type="button"
                  onClick={() => setActiveTab("jyotish")}
                  className={`flex items-center justify-center gap-1.5 rounded py-2 transition-all cursor-pointer ${
                    activeTab === "jyotish" ? "bg-[#14161c] text-[#c5a059] border border-[#c5a059]/20 shadow-sm" : "text-[#f5f2ed]/50 hover:text-[#f5f2ed]"
                  }`}
                >
                  <Calendar className="h-3.5 w-3.5" />
                  Birth Data
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("palm")}
                  className={`flex items-center justify-center gap-1.5 rounded py-2 transition-all cursor-pointer ${
                    activeTab === "palm" ? "bg-[#14161c] text-[#c5a059] border border-[#c5a059]/20 shadow-sm" : "text-[#f5f2ed]/50 hover:text-[#f5f2ed]"
                  }`}
                >
                  <Activity className="h-3.5 w-3.5" />
                  Palm Lines
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("questions")}
                  className={`flex items-center justify-center gap-1.5 rounded py-2 transition-all cursor-pointer ${
                    activeTab === "questions" ? "bg-[#14161c] text-[#c5a059] border border-[#c5a059]/20 shadow-sm" : "text-[#f5f2ed]/50 hover:text-[#f5f2ed]"
                  }`}
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  Questions
                </button>
              </div>

              <form onSubmit={handleConsultation} className="space-y-4">
                
                {/* TAB 1: JYOTISH BIRTH PROFILE */}
                {activeTab === "jyotish" && (
                  <div className="space-y-4 animate-fadeIn">
                    <div>
                      <label className="block text-xs font-semibold text-[#c5a059] uppercase tracking-wider mb-1.5 font-sans">
                        Full Name / ඔබගේ නම <span className="text-[#c5a059]/80">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#c5a059]/40">
                          <User className="h-4 w-4" />
                        </span>
                        <input
                          type="text"
                          required
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          placeholder="e.g. Kasun Alwis"
                          className="w-full rounded border border-[#c5a059]/20 bg-[#0a0b0e] py-2 pl-10 pr-4 text-xs md:text-sm text-[#f5f2ed] focus:border-[#c5a059] focus:outline-none focus:ring-1 focus:ring-[#c5a059] font-sans placeholder-[#f5f2ed]/30"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#c5a059] uppercase tracking-wider mb-1.5 font-sans">
                          Date of Birth / උපන් දිනය <span className="text-[#c5a059]/80">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            required
                            value={profile.dob}
                            onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                            className="w-full rounded border border-[#c5a059]/20 bg-[#0a0b0e] py-2 px-3 text-xs text-[#f5f2ed] focus:border-[#c5a059] focus:outline-none focus:ring-1 focus:ring-[#c5a059] font-sans"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#c5a059] uppercase tracking-wider mb-1.5 font-sans">
                          Time of Birth / වෙලාව
                        </label>
                        <div className="relative">
                          <input
                            type="time"
                            value={profile.tob}
                            onChange={(e) => setProfile({ ...profile, tob: e.target.value })}
                            className="w-full rounded border border-[#c5a059]/20 bg-[#0a0b0e] py-2 px-3 text-xs text-[#f5f2ed] focus:border-[#c5a059] focus:outline-none focus:ring-1 focus:ring-[#c5a059] font-sans"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#c5a059] uppercase tracking-wider mb-1.5 font-sans">
                          Place of Birth / උපන් ස්ථානය
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#c5a059]/40">
                            <MapPin className="h-3.5 w-3.5" />
                          </span>
                          <input
                            type="text"
                            value={profile.pob}
                            onChange={(e) => setProfile({ ...profile, pob: e.target.value })}
                            placeholder="e.g. Colombo, Sri Lanka"
                            className="w-full rounded border border-[#c5a059]/20 bg-[#0a0b0e] py-2 pl-9 pr-4 text-xs text-[#f5f2ed] focus:border-[#c5a059] focus:outline-none focus:ring-1 focus:ring-[#c5a059] font-sans placeholder-[#f5f2ed]/30"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#c5a059] uppercase tracking-wider mb-1.5 font-sans">
                          Gender / ස්ත්‍රී/පුරුෂ භාවය <span className="text-[#c5a059]/80">*</span>
                        </label>
                        <select
                          required
                          value={profile.gender}
                          onChange={(e: any) => setProfile({ ...profile, gender: e.target.value })}
                          className="w-full rounded border border-[#c5a059]/20 bg-[#0a0b0e] py-2 px-3 text-xs text-[#f5f2ed] focus:border-[#c5a059] focus:outline-none focus:ring-1 focus:ring-[#c5a059] font-sans"
                        >
                          <option value="" className="bg-[#14161c]">Choose Gender</option>
                          <option value="Male" className="bg-[#14161c]">Male (පුරුෂ)</option>
                          <option value="Female" className="bg-[#14161c]">Female (ස්ත්‍රී)</option>
                          <option value="Other" className="bg-[#14161c]">Other (වෙනත්)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#c5a059] uppercase tracking-wider mb-2 font-sans">
                        Report Language / වාර්තාවේ භාෂාව
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {["English", "Sinhala", "Mixed"].map((lang) => (
                          <button
                            key={lang}
                            type="button"
                            onClick={() => setProfile({ ...profile, language: lang as any })}
                            className={`rounded border py-2 text-center text-xs font-semibold cursor-pointer transition-all font-sans ${
                              profile.language === lang
                                ? "border-[#c5a059] bg-[#c5a059]/10 text-[#c5a059]"
                                : "border-[#c5a059]/10 text-[#f5f2ed]/70 hover:bg-[#14161c]"
                            }`}
                          >
                            {lang === "Mixed" ? "Mixed (සිංහල+Eng)" : lang}
                          </button>
                        ))}
                      </div>
                      <p className="mt-1.5 text-[10px] text-[#f5f2ed]/50 font-sans">
                        The guru will write the full life counseling profile in your chosen style.
                      </p>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setActiveTab("palm")}
                        className="flex w-full items-center justify-center gap-1.5 rounded border border-[#c5a059]/20 bg-[#c5a059]/5 py-2.5 text-xs font-medium text-[#c5a059] hover:bg-[#c5a059]/10 font-sans cursor-pointer transition-all"
                      >
                        Proceed to Palm Line Builder <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 2: INTERACTIVE PALMISTRY CONFIGURATION & IMAGE UPLOAD */}
                {activeTab === "palm" && (
                  <div className="space-y-4 animate-fadeIn max-h-[500px] overflow-y-auto pr-1">
                    
                    {/* Palm Photo Upload Block */}
                    <div className="rounded border border-dashed border-[#c5a059]/30 bg-[#0a0b0e] p-4 text-center">
                      <UploadCloud className="mx-auto h-8 w-8 text-[#c5a059]/80" />
                      <p className="mt-1.5 text-xs font-medium text-[#f5f2ed]/90 font-sans">Upload Palm Photo (අත්ල ඡායාරූපය)</p>
                      <p className="mt-0.5 text-[10px] text-[#f5f2ed]/50 font-sans">Left/Right hand. Highly recommended for accurate lineage reading.</p>
                      
                      <label className="mt-3 inline-block rounded bg-[#c5a059]/15 hover:bg-[#c5a059]/25 text-[#c5a059] border border-[#c5a059]/30 px-3 py-1.5 text-xs font-medium cursor-pointer transition-all font-sans">
                        Browse Files
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>

                      {palmImages.length > 0 && (
                        <div className="mt-4 grid grid-cols-3 gap-2">
                          {palmImages.map((img, i) => (
                            <div key={i} className="relative group rounded border border-[#c5a059]/20 overflow-hidden bg-[#0a0b0e] aspect-square">
                              <img src={img} alt={`uploaded palm ${i}`} className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => removeImage(i)}
                                className="absolute top-1 right-1 rounded-full bg-red-600 text-white p-1 hover:bg-red-700 shadow-sm"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {imageError && (
                        <div className="mt-2 text-[10px] text-red-400 flex items-center justify-center gap-1 font-sans">
                          <CircleAlert className="h-3 w-3 inline" /> {imageError}
                        </div>
                      )}
                    </div>

                    <div className="border-t border-[#c5a059]/20 pt-4">
                      <h3 className="font-display text-sm font-semibold text-[#c5a059] flex items-center gap-1.5 mb-3">
                        <span>Interactive Palm Lines Customizer</span>
                        <span className="text-[10px] font-sans font-normal text-[#f5f2ed]/50">(නොමිලේ රේඛා තේරීම)</span>
                      </h3>
                      
                      {/* Life Line Selection */}
                      <div className="space-y-1 mb-4">
                        <label className="block text-[11px] font-semibold text-[#f5f2ed]/75 font-sans">Life Line (ආයු රේඛාව)</label>
                        <select
                          value={profile.palmTraits.lifeLine}
                          onChange={(e) => updateTrait("lifeLine", e.target.value)}
                          className="w-full rounded border border-[#c5a059]/20 bg-[#0a0b0e] text-[#f5f2ed] py-1.5 px-3 text-xs font-sans focus:border-[#c5a059] focus:outline-none"
                        >
                          {lifeLineOptions.map((opt) => (
                            <option key={opt.value} value={opt.value} className="bg-[#14161c]">{opt.label}</option>
                          ))}
                        </select>
                        <p className="text-[10px] italic text-[#c5a059]/80 pl-1 leading-normal">
                          {lifeLineOptions.find(o => o.value === profile.palmTraits.lifeLine)?.desc}
                        </p>
                      </div>

                      {/* Head Line Selection */}
                      <div className="space-y-1 mb-4">
                        <label className="block text-[11px] font-semibold text-[#f5f2ed]/75 font-sans">Head Line (ශීර්ෂ රේඛාව)</label>
                        <select
                          value={profile.palmTraits.headLine}
                          onChange={(e) => updateTrait("headLine", e.target.value)}
                          className="w-full rounded border border-[#c5a059]/20 bg-[#0a0b0e] text-[#f5f2ed] py-1.5 px-3 text-xs font-sans focus:border-[#c5a059] focus:outline-none"
                        >
                          {headLineOptions.map((opt) => (
                            <option key={opt.value} value={opt.value} className="bg-[#14161c]">{opt.label}</option>
                          ))}
                        </select>
                        <p className="text-[10px] italic text-[#c5a059]/80 pl-1 leading-normal">
                          {headLineOptions.find(o => o.value === profile.palmTraits.headLine)?.desc}
                        </p>
                      </div>

                      {/* Heart Line Selection */}
                      <div className="space-y-1 mb-4">
                        <label className="block text-[11px] font-semibold text-[#f5f2ed]/75 font-sans">Heart Line (හෘද රේඛාව)</label>
                        <select
                          value={profile.palmTraits.heartLine}
                          onChange={(e) => updateTrait("heartLine", e.target.value)}
                          className="w-full rounded border border-[#c5a059]/20 bg-[#0a0b0e] text-[#f5f2ed] py-1.5 px-3 text-xs font-sans focus:border-[#c5a059] focus:outline-none"
                        >
                          {heartLineOptions.map((opt) => (
                            <option key={opt.value} value={opt.value} className="bg-[#14161c]">{opt.label}</option>
                          ))}
                        </select>
                        <p className="text-[10px] italic text-[#c5a059]/80 pl-1 leading-normal">
                          {heartLineOptions.find(o => o.value === profile.palmTraits.heartLine)?.desc}
                        </p>
                      </div>

                      {/* Fate Line Selection */}
                      <div className="space-y-1 mb-4">
                        <label className="block text-[11px] font-semibold text-[#f5f2ed]/75 font-sans">Fate Line (දෛව රේඛාව)</label>
                        <select
                          value={profile.palmTraits.fateLine}
                          onChange={(e) => updateTrait("fateLine", e.target.value)}
                          className="w-full rounded border border-[#c5a059]/20 bg-[#0a0b0e] text-[#f5f2ed] py-1.5 px-3 text-xs font-sans focus:border-[#c5a059] focus:outline-none"
                        >
                          {fateLineOptions.map((opt) => (
                            <option key={opt.value} value={opt.value} className="bg-[#14161c]">{opt.label}</option>
                          ))}
                        </select>
                        <p className="text-[10px] italic text-[#c5a059]/80 pl-1 leading-normal">
                          {fateLineOptions.find(o => o.value === profile.palmTraits.fateLine)?.desc}
                        </p>
                      </div>

                      {/* Dominant Mount Selection */}
                      <div className="space-y-1 mb-4">
                        <label className="block text-[11px] font-semibold text-[#f5f2ed]/75 font-sans">Dominant Mount (ප්‍රධාන ග්‍රහ මණ්ඩලය)</label>
                        <select
                          value={profile.palmTraits.majorMount}
                          onChange={(e) => updateTrait("majorMount", e.target.value)}
                          className="w-full rounded border border-[#c5a059]/20 bg-[#0a0b0e] text-[#f5f2ed] py-1.5 px-3 text-xs font-sans focus:border-[#c5a059] focus:outline-none"
                        >
                          {majorMountOptions.map((opt) => (
                            <option key={opt.value} value={opt.value} className="bg-[#14161c]">{opt.label}</option>
                          ))}
                        </select>
                        <p className="text-[10px] italic text-[#c5a059]/80 pl-1 leading-normal">
                          {majorMountOptions.find(o => o.value === profile.palmTraits.majorMount)?.desc}
                        </p>
                      </div>

                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setActiveTab("questions")}
                        className="flex w-full items-center justify-center gap-1.5 rounded border border-[#c5a059]/20 bg-[#c5a059]/5 py-2.5 text-xs font-medium text-[#c5a059] hover:bg-[#c5a059]/10 font-sans cursor-pointer transition-all"
                      >
                        Proceed to Specific Questions <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 3: SPECIFIC QUESTIONS */}
                {activeTab === "questions" && (
                  <div className="space-y-4 animate-fadeIn">
                    <div>
                      <label className="block text-xs font-semibold text-[#c5a059] uppercase tracking-wider mb-1.5 font-sans">
                        Specific Questions / විශේෂ ගැටළු (Section 7 Answers)
                      </label>
                      <textarea
                        rows={6}
                        value={profile.questions}
                        onChange={(e) => setProfile({ ...profile, questions: e.target.value })}
                        placeholder="e.g. Ask any 2-3 specific questions about your marriage timing, best career transitions, health alerts or foreign travels. Our guru will resolve them directly in Chapter 7 with custom timeline dates and Vedic remedies."
                        className="w-full rounded border border-[#c5a059]/20 bg-[#0a0b0e] py-2.5 px-3 text-xs text-[#f5f2ed] focus:border-[#c5a059] focus:outline-none focus:ring-1 focus:ring-[#c5a059] font-sans placeholder-[#f5f2ed]/30"
                      />
                    </div>

                    <div className="rounded bg-[#c5a059]/10 p-3.5 border border-[#c5a059]/30">
                      <div className="flex gap-2">
                        <Info className="h-4 w-4 text-[#c5a059] shrink-0 mt-0.5" />
                        <p className="text-[11px] text-[#f5f2ed]/80 leading-relaxed font-sans">
                          Your questions will be decoded using detailed planetary alignments in combination with signs etched on your Palm.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Validation and submission section */}
                {validationError && (
                  <div className="rounded bg-red-950/40 p-3.5 border border-red-500/30 text-xs text-red-200 flex items-start gap-2 font-sans">
                    <CircleAlert className="h-4 w-4 shrink-0 mt-0.5" />
                    <div>{validationError}</div>
                  </div>
                )}

                <div className="pt-4 border-t border-[#c5a059]/20">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded bg-[#c5a059] hover:bg-[#d6b56f] text-[#0a0b0e] py-3.5 text-xs tracking-widest uppercase font-bold shadow-lg shadow-black/40 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-sans"
                  >
                    <Sparkles className="h-4.5 w-4.5" />
                    {loading ? "Aligning Planetary Coordinates..." : "Get Live Guru Reading (දේව ජ්‍යෝතිෂය)"}
                  </button>
                </div>

              </form>
            </div>
            
            {/* Elegant Instructional Card */}
            <div className="rounded border border-[#c5a059]/20 bg-[#14161c] p-6 text-xs text-[#f5f2ed]/80 shadow-md">
              <h3 className="font-display italic text-[#c5a059] text-sm mb-3 flex items-center gap-1.5">
                <Compass className="h-4 w-4 text-[#c5a059]" />
                The Synergy of Stars & Palms
              </h3>
              <p className="leading-relaxed mb-4">
                In Indian Jyotish tradition, palmistry (Hasta Rekha Shastra) and astrology (Vedic Kundli) are seen as mirrors of the same karmic blueprint.
              </p>
              <div className="grid grid-cols-2 gap-3 font-sans text-[10px]">
                <div className="bg-[#0a0b0e] p-3 rounded border border-[#c5a059]/10">
                  <span className="font-bold text-[#c5a059] block mb-1">10th House (Profession)</span>
                  <p className="text-[#f5f2ed]/60 leading-normal">Maps straight into the depth & star markings of your Head & Fate lines.</p>
                </div>
                <div className="bg-[#0a0b0e] p-3 rounded border border-[#c5a059]/10">
                  <span className="font-bold text-[#c5a059] block mb-1">7th House (Union)</span>
                  <p className="text-[#f5f2ed]/60 leading-normal">Reflected in the marriage branches running along your Venus Mount boundary.</p>
                </div>
              </div>
            </div>

          </section>

          {/* RIGHT PANEL: REVELATIONS & REDEEMING CONSOLE (7 columns) */}
          <section className="lg:col-span-7">
            
            <AnimatePresence mode="wait">
              
              {/* NO STATE: WELCOME SANCTUARY MAPPED SCREEN */}
              {!loading && !reading && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="rounded border border-[#c5a059]/20 bg-[#14161c] p-8 md:p-12 text-center shadow-xl shadow-black/40 min-h-[500px] flex flex-col justify-center items-center"
                >
                  <div className="rounded-full bg-[#c5a059]/10 p-5 border border-[#c5a059]/30 mb-5">
                    <Compass className="h-8 w-8 text-[#c5a059] animate-spin-slow" />
                  </div>
                  <h2 className="font-display text-2xl font-light text-[#c5a059]">
                    Step Into the Hall of Revelation
                  </h2>
                  <p className="mt-3 text-[#f5f2ed]/70 text-sm max-w-md leading-relaxed italic">
                    Welcome, seeker. Your birth chart is a snapshot of the celestial orbit at your hour of arrival, and your palms hold the daily updates. 
                  </p>
                  
                  <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-lg">
                    <div className="p-4 rounded bg-[#0a0b0e] border border-[#c5a059]/10 text-center">
                      <div className="flex justify-center mb-2"><Sun className="h-5 w-5 text-[#c5a059]" /></div>
                      <span className="text-xs font-bold text-[#c5a059] block uppercase tracking-wider font-sans">1. Vedic Wisdom</span>
                      <p className="text-[11px] text-[#f5f2ed]/50 mt-1.5 leading-normal">Planetary Dashas and specific Nakshatras.</p>
                    </div>
                    <div className="p-4 rounded bg-[#0a0b0e] border border-[#c5a059]/10 text-center">
                      <div className="flex justify-center mb-2"><Activity className="h-5 w-5 text-[#c5a059]" /></div>
                      <span className="text-xs font-bold text-[#c5a059] block uppercase tracking-wider font-sans">2. Palmistry Decode</span>
                      <p className="text-[11px] text-[#f5f2ed]/50 mt-1.5 leading-normal">Life, Head, and Heart Line calculations.</p>
                    </div>
                    <div className="p-4 rounded bg-[#0a0b0e] border border-[#c5a059]/10 text-center">
                      <div className="flex justify-center mb-2"><Heart className="h-5 w-5 text-[#c5a059]" /></div>
                      <span className="text-xs font-bold text-[#c5a059] block uppercase tracking-wider font-sans">3. Remedies</span>
                      <p className="text-[11px] text-[#f5f2ed]/50 mt-1.5 leading-normal">Simple spiritual path tuning and gemstones.</p>
                    </div>
                  </div>

                  <p className="mt-10 text-xs text-[#c5a059]/50 italic tracking-wider uppercase font-sans">
                    Fill in your data and click \"Get Live Guru Reading\" to consult the celestial blueprint.
                  </p>
                </motion.div>
              )}

              {/* LOADING STATE */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded border border-[#c5a059]/20 bg-[#14161c] p-8 md:p-12 text-center shadow-xl shadow-black/40 min-h-[500px] flex flex-col justify-center items-center"
                >
                  {/* Glowing spinning Vedic mandala representation */}
                  <div className="relative flex items-center justify-center">
                    <div className="absolute w-24 h-24 rounded-full border-2 border-dashed border-[#c5a059]/30 animate-spin"></div>
                    <div className="absolute w-20 h-20 rounded-full border border-double border-[#c5a059]/40 animate-spin-slow"></div>
                    <div className="relative rounded-full bg-[#0a0b0e] p-5 border border-[#c5a059]/20 shadow-inner">
                      <UniverseMandalaIcon className="h-10 w-10 text-[#c5a059] animate-pulse" />
                    </div>
                  </div>

                  <h3 className="mt-8 font-display text-xl font-semibold text-[#c5a059]">
                    Consulting the Celestial Ledger
                  </h3>
                  <p className="mt-1.5 font-sans text-[10px] text-[#f5f2ed]/55 tracking-widest uppercase">
                    DECODING PLANETARY GRAHAS & ALIGNING PALM MARKINGS
                  </p>

                  {/* Rotating Spiritual Quotes Container */}
                  <div className="mt-8 max-w-md mx-auto min-h-[110px] flex flex-col justify-center bg-[#0a0b0e] border border-[#c5a059]/10 rounded p-6 shadow-inner">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={quoteIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-2"
                      >
                        <p className="text-xs text-[#f5f2ed]/80 leading-relaxed italic">
                          "{SPIRITUAL_QUOTES[quoteIndex].en}"
                        </p>
                        <p className="text-[11px] text-[#c5a059]/75 leading-relaxed">
                          "{SPIRITUAL_QUOTES[quoteIndex].si}"
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <p className="mt-6 text-[11px] text-[#f5f2ed]/50 font-sans">
                    Vedic alignment takes around 15 seconds. Please wait while the guru sees your blueprint...
                  </p>
                </motion.div>
              )}

              {/* REVELATION ACTIVE STATE */}
              {!loading && reading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded border border-[#c5a059]/20 bg-[#14161c] shadow-xl p-6 md:p-8 space-y-6"
                >
                  
                  {/* Floating Action Header Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#c5a059]/25 pb-4">
                    <div>
                      <span className="font-sans text-[10px] font-bold text-[#c5a059] tracking-widest uppercase">Revealed Destinies</span>
                      <h2 className="font-display text-lg font-bold text-[#f5f2ed]">
                        {profile.name}'s Divine Scroll
                      </h2>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCopy}
                        className="flex items-center gap-1 border border-[#c5a059]/20 hover:bg-[#0a0b0e] rounded px-3 py-1.5 text-xs font-semibold cursor-pointer text-[#c5a059] bg-[#0a0b0e]/30 font-sans transition-all"
                        title="Copy to clipboard"
                      >
                        {isCopied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                        {isCopied ? "Copied" : "Copy"}
                      </button>
                      <button
                        type="button"
                        onClick={handleDownload}
                        className="flex items-center gap-1 border border-[#c5a059]/20 hover:bg-[#0a0b0e] rounded px-3 py-1.5 text-xs font-semibold cursor-pointer text-[#c5a059] bg-[#0a0b0e]/30 font-sans transition-all"
                        title="Export as Text File"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Download
                      </button>
                    </div>
                  </div>

                  {/* Summary Profile Badges */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#0a0b0e] border border-[#c5a059]/10 p-3 rounded text-center">
                    <div>
                      <span className="block text-[9px] font-sans text-[#c5a059]/60 uppercase tracking-widest">Consultant</span>
                      <span className="text-xs font-serif font-bold text-[#f5f2ed] truncate max-w-[120px] block">{profile.name}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] font-sans text-[#c5a059]/60 uppercase tracking-widest">Sun/Vitality Star</span>
                      <span className="text-xs font-serif font-bold text-[#f5f2ed]">Calculated</span>
                    </div>
                    <div>
                      <span className="block text-[9px] font-sans text-[#c5a059]/60 uppercase tracking-widest font-bold">Palm Reading</span>
                      <span className="text-xs font-serif font-bold text-[#c5a059]">{palmImages.length > 0 ? "Analyzed" : "Customized"}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] font-sans text-[#c5a059]/60 uppercase tracking-widest">Resolution Status</span>
                      <span className="text-xs font-serif font-bold text-[#f5f2ed]">Perfected</span>
                    </div>
                  </div>

                  {/* Complete Revelations text wrapped in scroll sanctuary */}
                  <div className="prose max-w-none text-[#f5f2ed] bg-[#0a0b0e] border border-[#c5a059]/10 rounded p-6 md:p-8 max-h-[700px] overflow-y-auto font-serif shadow-inner">
                    <ReactMarkdown
                      components={{
                        h3: ({ node, ...props }) => (
                          <h3 className="text-xl md:text-2xl font-display text-[#c5a059] font-semibold border-b border-[#c5a059]/20 pb-2 mt-8 mb-4 flex items-center gap-2" {...props} />
                        ),
                        h4: ({ node, ...props }) => (
                          <h5 className="text-md font-bold text-[#f5f2ed] mt-5 mb-2 block font-serif" {...props} />
                        ),
                        p: ({ node, ...props }) => (
                          <p className="text-[#f5f2ed]/90 leading-relaxed text-sm md:text-md my-4 font-serif" {...props} />
                        ),
                        li: ({ node, ...props }) => (
                          <li className="text-[#f5f2ed]/80 text-sm leading-relaxed my-1 list-disc list-inside pl-1 font-serif" {...props} />
                        ),
                        ul: ({ node, ...props }) => (
                          <ul className="my-2 pl-4 list-disc" {...props} />
                        ),
                        strong: ({ node, ...props }) => (
                          <strong className="text-[#c5a059] font-medium" {...props} />
                        ),
                        // Support styling key insights elegantly
                        blockquote: ({ node, ...props }) => (
                          <blockquote className="border-l-4 border-[#c5a059] bg-[#c5a059]/5 p-4 rounded my-6 text-sm italic font-serif text-[#f5f2ed]/85 leading-relaxed" {...props} />
                        )
                      }}
                    >
                      {reading}
                    </ReactMarkdown>
                  </div>

                  <div className="flex items-center justify-center gap-1.5 text-center text-xs text-[#c5a059]/65 font-serif border-t border-[#c5a059]/15 pt-4">
                    <Sparkles className="h-4 w-4 text-[#c5a059]" />
                    <span>Karma can refine the blueprint of the stars. Walk wisely.</span>
                    <Sparkles className="h-4 w-4 text-[#c5a059]" />
                  </div>

                </motion.div>
              )}

            </AnimatePresence>

          </section>

        </div>
      </main>

      <footer className="footer bg-[#14161c] text-[#f5f2ed]/40 py-8 border-t border-[#c5a059]/20 mt-16 text-center text-xs font-sans">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-[#c5a059]/80 uppercase tracking-widest font-semibold mb-2">Gurukul Vedic Sciences • Sri Lanka Edition</p>
          <p>© 2026 Cosmic Astro-Palmistry Reading Sanctuary. All rights reserved.</p>
          <p className="mt-2 text-[#f5f2ed]/40 italic">
            Dedicated to deep spiritual counseling, astrological dasha analysis, palm line calculations, and humanitarian remedies.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Simple custom component icon for beautiful Vedic mandala
function UniverseMandalaIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2v20" />
      <path d="M2 12h20" />
      <path d="m16.24 7.76-8.48 8.48" />
      <path d="m7.76 7.76 8.48 8.48" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
