import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

function SectionHeading({ eyebrow, title, highlight, description, align = "center" }) {
    const isCenter = align === "center";

    return (
        <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className={`max-w-2xl mb-12 sm:mb-16 ${isCenter ? "mx-auto text-center" : "text-left"}`}
        >
            {eyebrow && (
                <div className={`flex items-center gap-2 mb-3 ${isCenter ? "justify-center" : "justify-start"}`}>
                    <Sparkles size={13} className="text-[#D4AF65]" />
                    <span className="text-[#D4AF65] text-[11px] font-medium uppercase tracking-[3.5px]">
                        {eyebrow}
                    </span>
                    <Sparkles size={13} className="text-[#D4AF65]" />
                </div>
            )}

            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight text-[#F8F0E3]">
                {title}{" "}
                {highlight && (
                    <span className="gold-gradient italic font-serif">
                        {highlight}
                    </span>
                )}
            </h2>

            <div className={`gold-divider my-4 ${isCenter ? "mx-auto" : ""}`} />

            {description && (
                <p className="text-[#B8A99A] text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
                    {description}
                </p>
            )}
        </motion.div>
    );
}

export default SectionHeading;
