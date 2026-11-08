import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Flame, Gift, ArrowDown } from "lucide-react";
import ApertureCarousel from "../components/common/ApertureCarousel";

// SVG assets from /assets/images/hero
import heroDiyaGlow from "../assets/images/hero/hero-diya-glow.svg";

import bgVideo from "../assets/videos/10142444-hd_1920_1080_30fps.mp4";

// 4 Personal Photos of Manish Kumar
import manishCelebration from "../assets/images/slider/manish-celebration.jpg";
import manishPortrait from "../assets/images/slider/manish-portrait.jpg";

const DIWALI_SLIDES = [
  {
    image: manishCelebration,
    position: "center 15%",
    title: "Festive Radiance",
    caption: "May the sacred light of Diwali fill your life with warmth and blessings.",
    alt: "Manish Kumar celebrating the festival of lights",
  },
  {
    image: manishPortrait,
    position: "center 20%",
    title: "A Personal Wish",
    caption: "Warmest Diwali greetings and happiness from my side to you.",
    alt: "Manish Kumar wishing you a Happy Diwali",
  }
];

/* Mount the laptop video only on large screens so phones never download it. */
function useIsLargeScreen() {
  const query = "(min-width: 1024px)";
  const [isLarge, setIsLarge] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : true
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e) => setIsLarge(e.matches);
    setIsLarge(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isLarge;
}

function Hero({ slides = DIWALI_SLIDES }) {
  const isLargeScreen = useIsLargeScreen();

  const scrollTo = (href) => {
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="relative w-full min-h-screen overflow-hidden bg-[#080808]">
      {/* =========================================================================
          DESKTOP / LAPTOP LAYOUT (lg:block):
          - hero-background.svg completely covering the background.
          - Left side: Openly written Happy Diwali, glowing diya, quote & buttons.
          - Right side: Clear, bright Aperture Carousel photo frame.
          ========================================================================= */}
      <div className="hidden lg:block relative w-full min-h-screen">
        {/* Full-brightness festive video backdrop (diyas + rangoli) */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {isLargeScreen && (
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover"
            >
              <source src={bgVideo} type="video/mp4" />
            </video>
          )}

          {/* Light, targeted overlays only: the video itself stays vivid.
              - soft left shade so the greeting text is readable
              - gentle edge vignette + bottom fade for depth */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/70 via-[#080808]/20 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_55%,_rgba(8,8,8,0.5)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#080808]/80 to-transparent" />
        </div>

        {/* 2-Column Grid Container */}
        <div className="section-container relative z-10 grid grid-cols-12 items-center gap-12 min-h-screen pt-24 pb-16">
          {/* Left Column: Openly Written Greeting (No Card Box) */}
          <div className="col-span-7 flex flex-col items-start text-left relative">
            {/* soft local shade behind the text only */}
            <div className="absolute -inset-x-10 -inset-y-6 -z-10 bg-[radial-gradient(ellipse_at_left,_rgba(8,8,8,0.55)_0%,_transparent_70%)] blur-xl pointer-events-none" />

            {/* Glowing Hero Diya */}
            <motion.div
              animate={{
                y: [0, -6, 0],
                filter: [
                  "drop-shadow(0 0 20px rgba(255,157,50,0.85))",
                  "drop-shadow(0 0 35px rgba(255,180,60,1))",
                  "drop-shadow(0 0 20px rgba(255,157,50,0.85))",
                ],
              }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-28 mb-3"
            >
              <img
                src={heroDiyaGlow}
                alt="Glowing Diwali Diya"
                className="w-full h-auto object-contain"
              />
            </motion.div>

            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF65]/60 bg-black/45 backdrop-blur-md mb-4 shadow-[0_0_25px_rgba(212,175,101,0.35)]">
              <Sparkles size={12} className="text-[#FF9D32] animate-pulse" />
              <span className="text-[11px] font-semibold tracking-[3.5px] uppercase text-[#F4D28C]">
                A SPECIAL DIWALI GREETING
              </span>
              <Sparkles size={12} className="text-[#FF9D32] animate-pulse" />
            </div>

            {/* OPENLY WRITTEN: Happy Diwali! */}
            <h1 className="font-heading text-6xl xl:text-7xl font-bold tracking-tight text-[#FFF8E7] leading-[1.05] drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
              Happy{" "}
              <span className="gold-gradient italic font-serif drop-shadow-[0_0_40px_rgba(255,160,50,0.9)]">
                Diwali!
              </span>
            </h1>

            {/* OPENLY WRITTEN: From Manish Kumar */}
            <div className="mt-4 mb-2 flex items-center gap-3">
              <span className="h-[1px] w-12 bg-gradient-to-r from-transparent via-[#D4AF65] to-[#D4AF65]" />
              <p className="font-elegant text-3xl xl:text-4xl text-[#FFE3A0] tracking-wide font-medium drop-shadow-[0_0_20px_rgba(212,175,101,0.8)]">
                From <span className="text-[#FFF2C6] font-bold underline decoration-[#FF9D32] underline-offset-4 decoration-2">Manish Kumar</span>
              </p>
              <span className="h-[1px] w-12 bg-gradient-to-l from-transparent via-[#D4AF65] to-[#D4AF65]" />
            </div>

            {/* OPENLY WRITTEN: Message */}
            <p className="font-elegant italic text-xl xl:text-2xl text-[#E8DAC8] max-w-xl mt-3 leading-relaxed drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)]">
              &ldquo;A little light, a lot of happiness, and some special surprises just for you.&rdquo;
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center gap-4 mt-8">
              <button
                type="button"
                onClick={() => scrollTo("#gifts")}
                className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF65] via-[#F4D28C] to-[#D4AF65] text-[#080808] text-xs font-semibold tracking-wider uppercase shadow-[0_0_25px_rgba(212,175,101,0.7)] hover:shadow-[0_0_35px_rgba(255,157,50,0.9)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
              >
                <Gift size={16} className="transition-transform group-hover:rotate-12" />
                <span>Here Are Your Gifts</span>
              </button>

              <button
                type="button"
                onClick={() => scrollTo("#light-a-diya")}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full border border-[#D4AF65]/70 bg-black/40 backdrop-blur-md text-[#F4D28C] text-xs font-medium tracking-wider uppercase hover:border-[#D4AF65] hover:bg-[#D4AF65]/20 hover:shadow-[0_0_20px_rgba(212,175,101,0.4)] transition-all duration-300 cursor-pointer"
              >
                <Flame size={15} className="text-[#FF9D32]" />
                <span>Light a Diya</span>
              </button>
            </div>
          </div>

          {/* Right Column: Clearly Visible Aperture Carousel Photo Slider */}
          <div className="col-span-5 flex justify-center items-center">
            <div className="relative w-full max-w-[440px]">
              {/* Outer hairline gold frame offset behind the photo */}
              <div className="absolute -inset-3 rounded-[2rem] border border-[#D4AF65]/50 pointer-events-none" />
              {/* Warm glow echoing the diya flames in the video */}
              <div className="absolute -inset-6 rounded-[2.5rem] bg-[radial-gradient(circle_at_center,_rgba(255,157,50,0.25)_0%,_transparent_70%)] blur-2xl pointer-events-none" />

              <div className="relative w-full h-[580px] rounded-3xl overflow-hidden border-2 border-[#F4D28C]/70 shadow-[0_25px_70px_rgba(0,0,0,0.75),_0_0_40px_rgba(255,157,50,0.35)] bg-[#10080D]">
                <ApertureCarousel
                  slides={slides}
                  height="100%"
                  autoplay={6500}
                  duration={1100}
                  ink="#D4AF65"
                />
                <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/20 pointer-events-none z-20" />
              </div>

              {/* Corner sparkles */}
              <Sparkles size={20} className="absolute -top-6 -right-5 text-[#FFE3A0] animate-pulse" />
              <Sparkles size={14} className="absolute -bottom-5 -left-4 text-[#FF9D32] animate-pulse" />
            </div>
          </div>
        </div>

        {/* Bottom Scroll Indicator on Laptop */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
          <button
            type="button"
            onClick={() => scrollTo("#gifts")}
            aria-label="Scroll to gifts"
            className="inline-flex flex-col items-center gap-1 text-[#D4AF65]/80 hover:text-[#D4AF65] transition-colors cursor-pointer group"
          >
            <span className="text-[10px] tracking-[3px] uppercase font-semibold group-hover:tracking-[4px] transition-all">
              Scroll To Explore
            </span>
            <ArrowDown size={14} className="text-[#D4AF65] animate-bounce" />
          </button>
        </div>
      </div>

      {/* =========================================================================
          MOBILE / PHONE LAYOUT (block lg:hidden):
          - Photos are in COMPLETE SCREEN (full screen 100svh), fully clearly visible.
          - Openly written Happy Diwali wishes floating gracefully over the photos.
          ========================================================================= */}
      <div className="block lg:hidden relative w-full min-h-[100svh]">
        {/* Full-Screen Aperture Carousel on Phones */}
        <ApertureCarousel
          slides={slides}
          height="100svh"
          autoplay={7000}
          duration={1200}
          ink="#D4AF65"
        >
          {/* Subtle natural vignette ensuring photos are clearly visible yet text is readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/60 pointer-events-none z-15" />

          {/* Openly written wishes directly on screen (NO card container) */}
          <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between pt-20 pb-16 px-4">
            <div className="h-2" />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="w-full max-w-sm mx-auto text-center flex flex-col items-center"
            >
              {/* Glowing Hero Diya */}
              <motion.div
                animate={{
                  y: [0, -5, 0],
                  filter: [
                    "drop-shadow(0 0 18px rgba(255,157,50,0.85))",
                    "drop-shadow(0 0 30px rgba(255,180,60,1))",
                    "drop-shadow(0 0 18px rgba(255,157,50,0.85))",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-20 mb-1 pointer-events-none"
              >
                <img
                  src={heroDiyaGlow}
                  alt="Glowing Diwali Diya"
                  className="w-full h-auto object-contain"
                />
              </motion.div>

              {/* Eyebrow Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#D4AF65]/50 bg-black/60 backdrop-blur-md mb-2 shadow-[0_0_15px_rgba(212,175,101,0.3)]">
                <Sparkles size={11} className="text-[#FF9D32] animate-pulse" />
                <span className="text-[9px] font-semibold tracking-[2.5px] uppercase text-[#F4D28C]">
                  A SPECIAL DIWALI GREETING
                </span>
                <Sparkles size={11} className="text-[#FF9D32] animate-pulse" />
              </div>

              {/* OPENLY WRITTEN: Happy Diwali! */}
              <h1 className="font-heading text-5xl font-bold tracking-tight text-[#FFF8E7] leading-[1.08] drop-shadow-[0_4px_25px_rgba(0,0,0,1)]">
                Happy{" "}
                <span className="gold-gradient italic font-serif block drop-shadow-[0_0_35px_rgba(255,160,50,0.95)]">
                  Diwali!
                </span>
              </h1>

              {/* OPENLY WRITTEN: From Manish Kumar */}
              <div className="mt-2.5 mb-1.5 flex items-center justify-center gap-2.5">
                <span className="h-[1px] w-6 bg-gradient-to-r from-transparent via-[#D4AF65] to-[#D4AF65]" />
                <p className="font-elegant text-2xl text-[#FFE3A0] tracking-wide font-medium drop-shadow-[0_2px_15px_rgba(0,0,0,1)]">
                  From <span className="text-[#FFF2C6] font-bold underline decoration-[#FF9D32] underline-offset-4 decoration-2 drop-shadow-[0_0_20px_rgba(255,180,60,0.9)]">Manish Kumar</span>
                </p>
                <span className="h-[1px] w-6 bg-gradient-to-l from-transparent via-[#D4AF65] to-[#D4AF65]" />
              </div>

              {/* OPENLY WRITTEN: Message */}
              <p className="font-elegant italic text-base text-[#F8F0E3] max-w-xs mx-auto mt-2 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] leading-relaxed">
                &ldquo;A little light, a lot of happiness, and some special surprises just for you.&rdquo;
              </p>

              {/* Open Floating CTA Buttons */}
              <div className="flex flex-col items-center justify-center gap-2.5 mt-5 w-full max-w-xs pointer-events-auto">
                <button
                  type="button"
                  onClick={() => scrollTo("#gifts")}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#D4AF65] via-[#F4D28C] to-[#D4AF65] text-[#080808] text-xs font-semibold tracking-wider uppercase shadow-[0_0_25px_rgba(212,175,101,0.7)] active:scale-95 transition-all cursor-pointer"
                >
                  <Gift size={16} />
                  <span>Here Are Your Gifts</span>
                </button>

                <button
                  type="button"
                  onClick={() => scrollTo("#light-a-diya")}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-[#D4AF65]/70 bg-black/60 backdrop-blur-md text-[#F4D28C] text-xs font-medium tracking-wider uppercase active:scale-95 transition-all cursor-pointer"
                >
                  <Flame size={15} className="text-[#FF9D32]" />
                  <span>Light a Diya</span>
                </button>
              </div>
            </motion.div>

            {/* Tap Screen Hint */}
            <div className="text-center pointer-events-auto">
              <button
                type="button"
                onClick={() => scrollTo("#gifts")}
                className="inline-flex flex-col items-center gap-1 text-[#D4AF65]/90 hover:text-[#D4AF65] transition-colors cursor-pointer"
              >
                <span className="text-[9px] tracking-[2px] uppercase font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
                  Tap Photo To Change • Scroll Down
                </span>
                <ArrowDown size={14} className="text-[#D4AF65] animate-bounce" />
              </button>
            </div>
          </div>
        </ApertureCarousel>
      </div>
    </section>
  );
}

export default Hero;