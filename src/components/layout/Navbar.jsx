import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Flame, Sparkles } from "lucide-react";

const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Gifts", href: "#gifts" },
    { name: "Light a Diya", href: "#light-a-diya" },
    { name: "Wishes", href: "#wishes" },
];

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("home");
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 40);

            const sections = ["home", "gifts", "light-a-diya", "wishes"];
            const scrollPosition = window.scrollY + 200;

            for (const sectionId of sections) {
                const element = document.getElementById(sectionId);
                if (element) {
                    const top = element.offsetTop;
                    const height = element.offsetHeight;
                    if (scrollPosition >= top && scrollPosition < top + height) {
                        setActiveSection(sectionId);
                        break;
                    }
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollTo = (e, href) => {
        e.preventDefault();
        setIsOpen(false);
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <motion.header
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${
                scrolled
                    ? "bg-[#080808]/90 backdrop-blur-xl border-[#D4AF65]/20 shadow-[0_4px_30px_rgba(0,0,0,0.8)]"
                    : "bg-[#080808]/60 backdrop-blur-md border-[#D4AF65]/10"
            }`}
        >
            <nav className="section-container h-20 flex items-center justify-between">
                {/* Brand / Logo */}
                <a
                    href="#home"
                    onClick={(e) => scrollTo(e, "#home")}
                    className="flex items-center gap-3 group"
                >
                    <div className="relative flex items-center justify-center w-10 h-10 rounded-full border border-[#D4AF65]/40 bg-[#211018]/60 group-hover:border-[#D4AF65] group-hover:shadow-[0_0_15px_#D4AF6550] transition-all duration-300">
                        <Flame
                            size={22}
                            className="text-[#D4AF65] group-hover:text-[#FF9D32] transition-colors"
                        />
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#FF9D32] animate-ping" />
                    </div>

                    <div>
                        <h1 className="font-heading text-lg sm:text-xl font-bold tracking-[3px] gold-gradient">
                            DEEPOTSAV
                        </h1>
                        <p className="text-[8px] sm:text-[9px] tracking-[3px] text-[#D4AF65]/80 font-medium">
                            A DIWALI SURPRISE
                        </p>
                    </div>
                </a>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => {
                        const isActive = activeSection === link.href.replace("#", "");
                        return (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={(e) => scrollTo(e, link.href)}
                                className={`relative text-sm tracking-wide transition-all duration-300 py-1 ${
                                    isActive
                                        ? "text-[#F4D28C] font-semibold"
                                        : "text-[#D7C8B5]/80 hover:text-[#D4AF65]"
                                }`}
                            >
                                {link.name}
                                {isActive && (
                                    <motion.span
                                        layoutId="activeNavIndicator"
                                        className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#D4AF65] to-transparent shadow-[0_0_8px_#D4AF65]"
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </a>
                        );
                    })}
                </div>

                {/* Right CTA */}
                <div className="hidden md:flex items-center gap-3">
                    <a
                        href="#gifts"
                        onClick={(e) => scrollTo(e, "#gifts")}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#D4AF65]/60 text-[#F4D28C] text-xs uppercase tracking-[2px] hover:bg-[#D4AF65] hover:text-[#080808] hover:shadow-[0_0_20px_#D4AF6560] transition-all duration-300 font-medium"
                    >
                        <Sparkles size={14} />
                        Open Gifts
                    </a>
                </div>

                {/* Mobile Menu Button */}
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden p-2 text-[#D4AF65] hover:text-[#F4D28C] transition-colors focus:outline-none"
                    aria-label={isOpen ? "Close menu" : "Open menu"}
                    aria-expanded={isOpen}
                >
                    {isOpen ? <X size={26} /> : <Menu size={26} />}
                </button>
            </nav>

            {/* Mobile Navigation Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden border-b border-[#D4AF65]/20 bg-[#080808]/95 backdrop-blur-2xl overflow-hidden"
                    >
                        <div className="section-container py-6 flex flex-col gap-4">
                            {navLinks.map((link) => {
                                const isActive = activeSection === link.href.replace("#", "");
                                return (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        onClick={(e) => scrollTo(e, link.href)}
                                        className={`flex items-center justify-between py-2 text-base tracking-wider border-b border-white/5 transition-colors ${
                                            isActive
                                                ? "text-[#F4D28C] font-semibold"
                                                : "text-[#D7C8B5]/80 hover:text-[#D4AF65]"
                                        }`}
                                    >
                                        <span>{link.name}</span>
                                        {isActive && <Sparkles size={16} className="text-[#D4AF65]" />}
                                    </a>
                                );
                            })}
                            <a
                                href="#gifts"
                                onClick={(e) => scrollTo(e, "#gifts")}
                                className="mt-2 text-center py-3 rounded-full bg-gradient-to-r from-[#D4AF65] to-[#F4D28C] text-[#080808] text-xs uppercase tracking-[2px] font-semibold shadow-[0_0_15px_#D4AF6550]"
                            >
                                Open Your Gifts ✨
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}

export default Navbar;
