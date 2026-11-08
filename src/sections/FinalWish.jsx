import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp, Sparkles, Heart } from "lucide-react";

// Video and photo assets
import bgVideo from "../assets/videos/6112861-hd_1920_1068_30fps.mp4";
import bgVideo2 from "../assets/videos/12001746_2160_3840_30fps.mp4";
import manishPortrait from "../assets/images/slider/manish-portrait.jpg";

/*
 * Auto-load every photo placed in /src/assets/images/slider/.
 * Drop more of your photos in that folder and they appear in the collage
 * automatically (the portrait is always first, max 3 are shown).
 */
const sliderModules = import.meta.glob(
    "../assets/images/slider/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}",
    { eager: true, import: "default" }
);

const photos = [
    manishPortrait,
    ...Object.values(sliderModules).filter((src) => src !== manishPortrait),
].slice(0, 3);

// Collage slots: main arch photo + two accent photos
const slots = [
    {
        wrap: "right-0 top-0 w-[58%] h-[78%] rounded-t-[999px] rounded-b-3xl",
        rotate: 0,
        delay: 0.2,
        pos: "object-[center_20%]",
    },
    {
        wrap: "left-0 top-[14%] w-[40%] h-[46%] rounded-3xl",
        rotate: -6,
        delay: 0.35,
        pos: "object-center",
    },
    {
        wrap: "left-[14%] bottom-[16%] w-[34%] h-[34%] rounded-full",
        rotate: 5,
        delay: 0.5,
        pos: "object-center",
    },
];

/*
 * Picks the background video by screen size:
 * - phones / small devices (< 1024px) -> bgVideo2 (portrait)
 * - laptops / desktops (>= 1024px)    -> bgVideo  (landscape)
 * Only ONE video is mounted at a time, so the other is never downloaded.
 */
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

function FinalWish() {
    const isLargeScreen = useIsLargeScreen();
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <section
            id="wishes"
            className="relative w-full min-h-screen overflow-hidden flex flex-col justify-between items-center bg-[#080808]"
        >
            {/* Background Festive Video — full brightness, no dimming filter */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <video
                    key={isLargeScreen ? "desktop" : "mobile"}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="w-full h-full object-cover"
                >
                    <source src={isLargeScreen ? bgVideo : bgVideo2} type="video/mp4" />
                </video>

                {/* Very light edge vignette only — the video stays vivid */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_55%,_rgba(8,8,8,0.55)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#080808]/90 to-transparent" />
            </div>

            {/* Top spacer */}
            <div className="h-12 sm:h-16 z-10" />

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 py-10 my-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                    {/* RIGHT: Photo collage combined with the wishes */}
                    <div className="lg:col-start-7 lg:col-span-6 w-full max-w-xl mx-auto">
                        {/* Collage */}
                        <div className="relative w-full h-[340px] sm:h-[420px]">
                            {/* Decorative gold ring behind main photo */}
                            <div className="absolute right-[-2%] top-[-3%] w-[62%] h-[82%] rounded-t-[999px] rounded-b-[2rem] border border-[#D4AF65]/60" />

                            {photos.map((src, i) => {
                                const slot = slots[i];
                                return (
                                    <motion.div
                                        key={src + i}
                                        initial={{ opacity: 0, y: 30, rotate: slot.rotate * 2 }}
                                        whileInView={{ opacity: 1, y: 0, rotate: slot.rotate }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.9, delay: slot.delay }}
                                        whileHover={{ scale: 1.03, rotate: 0 }}
                                        className={`absolute ${slot.wrap} overflow-hidden border-[3px] border-[#F4D28C] shadow-[0_18px_50px_rgba(0,0,0,0.7),0_0_35px_rgba(255,157,50,0.45)] group`}
                                        style={{ zIndex: i === 0 ? 1 : 2 }}
                                    >
                                        <img
                                            src={src}
                                            alt="Manish Kumar"
                                            className={`w-full h-full object-cover ${slot.pos} transition-transform duration-700 group-hover:scale-110`}
                                        />
                                        <div className="absolute inset-0 ring-1 ring-inset ring-white/20 pointer-events-none" />
                                    </motion.div>
                                );
                            })}

                            {/* Floating sparkle accents */}
                            <motion.div
                                animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.15, 0.9] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="absolute right-[2%] bottom-[18%] z-10 text-[#FFE3A0]"
                            >
                                <Sparkles size={22} />
                            </motion.div>
                            <motion.div
                                animate={{ opacity: [1, 0.4, 1], scale: [1.1, 0.9, 1.1] }}
                                transition={{ duration: 3.4, repeat: Infinity }}
                                className="absolute left-[44%] top-[2%] z-10 text-[#FF9D32]"
                            >
                                <Sparkles size={16} />
                            </motion.div>
                        </div>

                        {/* Wishes written over/below the collage */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.9, delay: 0.6 }}
                            className="relative -mt-10 sm:-mt-12 z-20 mx-2 sm:mx-6 rounded-2xl border border-[#D4AF65]/50 bg-gradient-to-br from-[#140a08]/80 to-[#080808]/70 backdrop-blur-md px-6 sm:px-8 py-6 shadow-[0_20px_60px_rgba(0,0,0,0.65)] text-center"
                        >
                            <div className="inline-flex items-center gap-1.5 text-[#FF9D32] text-[11px] font-semibold tracking-[3px] uppercase mb-2">
                                <Sparkles size={12} className="text-[#D4AF65]" />
                                <span>From My Heart</span>
                            </div>

                            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#FFF8E7] leading-tight">
                                Best Wishes to You &amp;{" "}
                                <span className="gold-gradient italic font-serif">Your Entire Family</span>
                            </h3>

                            <p className="font-elegant text-base sm:text-lg text-[#F8F0E3] leading-relaxed italic mt-3">
                                &ldquo;May this Diwali bring endless happiness, new opportunities, beautiful
                                memories and countless reasons to smile. May the divine glow of diyas brighten
                                every corner of your home with good health, boundless success, and peace.&rdquo;
                            </p>

                            <div className="mt-4 pt-4 border-t border-[#D4AF65]/30 flex items-center justify-center gap-3">
                                <Heart size={14} className="fill-[#FF9D32] text-[#FF9D32]" />
                                <span className="text-[11px] uppercase tracking-[2.5px] font-semibold text-[#D4AF65]">
                                    With Love &amp; Respect,
                                </span>
                                <span className="font-heading text-lg font-bold gold-gradient tracking-wide">
                                    Manish Kumar
                                </span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Bottom Actions & Footer */}
            <div className="relative z-10 w-full flex flex-col items-center pb-8 pt-4">
                

                <footer className="text-center w-full px-4 border-t border-white/10 pt-4">
                    <p className="font-heading text-xs tracking-[3px] gold-gradient font-bold">
                        DEEPOTSAV
                    </p>
                    <p className="text-[11px] text-[#CDBFAE] tracking-wider mt-1">
                        A Diwali Surprise from Manish Kumar • Festival of Lights
                    </p>
                </footer>
            </div>
        </section>
    );
}

export default FinalWish;