import Navbar from "./components/layout/Navbar";
import Hero from "./sections/Hero";
import Gifts from "./sections/Gifts";
import LightADiya from "./sections/LightADiya";
import FinalWish from "./sections/FinalWish";

function App() {
    return (
        <div className="min-h-screen bg-[#080808] text-[#F8F0E3] selection:bg-[#D4AF65] selection:text-[#080808]">
            <Navbar />
            <main>
                <Hero />
                <Gifts />
                <LightADiya />
                <FinalWish />
            </main>
        </div>
    );
}

export default App;
