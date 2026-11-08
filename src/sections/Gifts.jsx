import { Sparkles } from "lucide-react";
import SectionHeading from "../components/common/SectionHeading";
import GiftCard from "../components/cards/GiftCard";
import greetingFrame from "../assets/images/cards/greeting-frame.svg";

function Gifts() {
    return (
        <section
            id="gifts"
            className="relative w-full overflow-hidden bg-[#0d0709] scroll-mt-20"
            style={{ paddingTop: "clamp(5rem, 8vw, 7rem)", paddingBottom: "clamp(5rem, 8vw, 7rem)" }}
        >
            {/* Ambient lighting */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#2a121e_0%,_transparent_65%)] pointer-events-none" />
            <div className="absolute top-1/3 -left-40 w-[520px] h-[520px] rounded-full bg-[#D4AF65]/10 blur-[150px] pointer-events-none" />
            <div className="absolute bottom-0 -right-40 w-[520px] h-[520px] rounded-full bg-[#FF9D32]/10 blur-[150px] pointer-events-none" />

            {/* Decorative frame watermark */}
            <div className="absolute top-8 -right-24 w-96 h-96 opacity-[0.06] pointer-events-none rotate-12">
                <img src={greetingFrame} alt="" className="w-full h-full object-contain" />
            </div>
            <div className="absolute bottom-8 -left-24 w-80 h-80 opacity-[0.05] pointer-events-none -rotate-12">
                <img src={greetingFrame} alt="" className="w-full h-full object-contain" />
            </div>

            {/* Content */}
            {/* Inline styles for centering/padding so a global CSS reset can't override them */}
            <div
                className="relative z-10 w-full max-w-7xl flex flex-col items-center gap-10 sm:gap-12 lg:gap-14"
                style={{
                    marginLeft: "auto",
                    marginRight: "auto",
                    paddingLeft: "clamp(1rem, 3vw, 2rem)",
                    paddingRight: "clamp(1rem, 3vw, 2rem)",
                }}
            >
                {/* Heading */}
                <div className="w-full max-w-3xl text-center" style={{ marginLeft: "auto", marginRight: "auto" }}>
                    <SectionHeading
                        eyebrow="Interactive Surprise"
                        title="Here Are Your"
                        highlight="Gifts"
                        description="Diwali is about sharing happiness. Tap or scroll to part the curtain and unveil your personal Diwali gifts from Manish Kumar!"
                    />
                </div>

                {/* Curtain gift stage */}
                <div className="w-full">
                    <GiftCard />
                </div>

                {/* Closing flourish */}
                <div className="flex items-center gap-4 text-[#D4AF65]/80">
                    <span className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-[#D4AF65]/70" />
                    <Sparkles size={16} />
                    <span className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-[#D4AF65]/70" />
                </div>
            </div>
        </section>
    );
}

export default Gifts;