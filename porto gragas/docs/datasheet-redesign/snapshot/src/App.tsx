import { useEffect } from "react";
import Contents from "./components/Contents";
import HeaderBand from "./components/HeaderBand";
import FeaturesApplications, { GeneralDescription } from "./components/FeaturesApplications";
import TypicalApplication from "./components/TypicalApplication";
import Characteristics from "./components/Characteristics";
import Curves from "./components/Curves";
import PinConfiguration from "./components/PinConfiguration";
import Package from "./components/Package";
import ApplicationNotes from "./components/ApplicationNotes";
import RevisionHistory from "./components/RevisionHistory";
import Ordering from "./components/Ordering";
import SheetFooter from "./components/SheetFooter";
import { destroyLenis, initLenis } from "./lib/motion";

export const PAGES = 6;

export default function App() {
  useEffect(() => {
    initLenis();
    return () => destroyLenis();
  }, []);

  return (
    <>
      <a href="#features" className="skip-link">
        Skip to features
      </a>
      <Contents />
      <main className="sheet" id="sheet">
        <HeaderBand />
        {/* page 1: features, applications, general description, typical application */}
        <div className="sheet-page">
          <div className="page-1">
            <FeaturesApplications />
            <TypicalApplication />
          </div>
          <GeneralDescription />
          <SheetFooter page={1} />
          {/* page 2 */}
          <Characteristics />
          <SheetFooter page={2} />
          {/* page 3 */}
          <Curves />
          <SheetFooter page={3} />
          {/* page 4 */}
          <PinConfiguration />
          <Package />
          <SheetFooter page={4} />
          {/* page 5 */}
          <ApplicationNotes />
          <RevisionHistory />
          <SheetFooter page={5} />
          {/* page 6 */}
          <Ordering />
        </div>
      </main>
    </>
  );
}
