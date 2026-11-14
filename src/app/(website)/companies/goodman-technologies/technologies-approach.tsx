import { ClipboardCheck, Code2, Compass, LifeBuoy, Package, PenTool } from "lucide-react";

import { goodmanTechnologiesProfile } from "@/data/goodman-technologies";
import { TechnologiesApproachArt } from "./technologies-approach-art";
import { TechnologiesApproachMotion } from "./technologies-approach-motion";

const stageIcons = [Compass, PenTool, Code2, ClipboardCheck, Package, LifeBuoy];

export function TechnologiesApproach() {
  return (
    <div className="technologies-approach">
      <TechnologiesApproachMotion />
      <nav className="technologies-approach-nav" aria-label="Explore our approach">
        {goodmanTechnologiesProfile.process.map((step, index) => {
          const Icon = stageIcons[index];
          return <a key={step.title} id={`technologies-approach-tab-${index}`} href={`#technologies-approach-panel-${index}`}><span className="technologies-approach-stage-number" aria-hidden="true">0{index + 1}</span><Icon size={20} aria-hidden="true" /><span className="technologies-approach-stage-label">{step.title}</span></a>;
        })}
      </nav>
      <div className="technologies-approach-panels">
        {goodmanTechnologiesProfile.process.map((step, index) => (
          <section className="technologies-approach-panel" id={`technologies-approach-panel-${index}`} aria-labelledby={`technologies-approach-title-${index}`} key={step.title}>
            <div className="technologies-approach-panel-copy"><span className="technologies-approach-caption" aria-hidden="true">Stage / 0{index + 1}</span><h3 id={`technologies-approach-title-${index}`}>{step.title}</h3><p>{step.description}</p></div>
            <div className="technologies-approach-illustration"><TechnologiesApproachArt stage={index} /></div>
          </section>
        ))}
      </div>
    </div>
  );
}
