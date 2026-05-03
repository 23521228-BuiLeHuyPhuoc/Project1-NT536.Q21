import { Navbar }         from "./components/Navbar";
import { ScrollProgress } from "./components/ScrollProgress";
import { CursorGlow }     from "./components/CursorGlow";
import { Hero }           from "./components/Hero";
import { ArtistMarquee }  from "./components/ArtistMarquee";
import { VR360 }          from "./components/VR360";
import { SeatMap }        from "./components/SeatMap";
import { Lineup }         from "./components/Lineup";
import { Gallery }        from "./components/Gallery";
import { VideoShowcase }  from "./components/VideoShowcase";
import { Contact }        from "./components/Contact";
import { Footer }         from "./components/Footer";
import { ScrollToTop }    from "./components/ScrollToTop";

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Global FX */}
      <ScrollProgress />
      <CursorGlow />
      <ScrollToTop />

      {/* Layout */}
      <Navbar />
      <Hero />
      <ArtistMarquee />
      <VR360 />
      <SeatMap />
      <Lineup />
      <Gallery />
      <VideoShowcase />
      <Contact />
      <Footer />
    </div>
  );
}