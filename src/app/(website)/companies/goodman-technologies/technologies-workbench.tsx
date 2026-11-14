import { goodmanTechnologiesProfile } from "@/data/goodman-technologies";
import { TechnologiesCardMotion } from "./technologies-card-motion";

const layerDescriptions = [
  "Code and web foundations",
  "Interfaces, applications, and APIs",
  "Data storage and persistence",
  "Version control, deployment, and automation",
] as const;

function LayerGlyph({ index }: { index: number }) {
  return (
    <svg viewBox="0 0 72 72" fill="none" aria-hidden="true" focusable="false" strokeLinecap="round" strokeLinejoin="round">
      {index === 0 && <>
        <rect x="20" y="10" width="44" height="39" rx="6" fill="var(--workbench-glyph-well)" stroke="var(--workbench-glyph-line)" />
        <rect x="8" y="23" width="47" height="38" rx="6" fill="var(--workbench-face)" stroke="var(--technologies-accent)" strokeWidth="1.5" />
        <path d="M9 34H54" stroke="var(--workbench-glyph-line)" />
        <circle cx="15" cy="29" r="1.5" fill="var(--technologies-cyan)" /><circle cx="21" cy="29" r="1.5" fill="var(--technologies-accent)" />
        <path d="M23 42L18 47L23 52M40 42L45 47L40 52M34 40L29 54" stroke="var(--technologies-cyan)" strokeWidth="1.8" />
        <path d="M29 18H54" stroke="var(--technologies-accent)" strokeWidth="2" />
      </>}
      {index === 1 && <>
        <rect x="10" y="12" width="52" height="46" rx="6" fill="var(--workbench-face)" stroke="var(--technologies-accent)" strokeWidth="1.5" />
        <path d="M11 25H61" stroke="var(--workbench-glyph-line)" />
        <path d="M18 19H31" stroke="var(--technologies-cyan)" strokeWidth="2" />
        <rect x="17" y="34" width="14" height="14" rx="3" fill="var(--workbench-glyph-well)" stroke="var(--technologies-accent)" strokeWidth="1.5" />
        <rect x="41" y="34" width="14" height="14" rx="3" fill="var(--workbench-glyph-well)" stroke="var(--technologies-cyan)" strokeWidth="1.5" />
        <path d="M31 41H41M37 37L41 41L37 45" stroke="var(--technologies-cyan)" strokeWidth="1.5" />
      </>}
      {index === 2 && <>
        <path d="M18 21V51C18 57 26 62 36 62C46 62 54 57 54 51V21" fill="var(--workbench-glyph-well)" stroke="var(--technologies-accent)" strokeWidth="1.5" />
        <ellipse cx="36" cy="21" rx="18" ry="9" fill="var(--workbench-face)" stroke="var(--technologies-cyan)" strokeWidth="1.5" />
        <path d="M18 35C18 41 26 46 36 46C46 46 54 41 54 35M18 47C18 53 26 58 36 58C46 58 54 53 54 47" stroke="var(--technologies-accent)" strokeWidth="1.5" />
        <path d="M28 21H44M36 17V25" stroke="var(--technologies-cyan)" strokeWidth="1.5" />
        <circle cx="46" cy="36" r="2" fill="var(--technologies-cyan)" /><circle cx="46" cy="49" r="2" fill="var(--technologies-cyan)" />
      </>}
      {index === 3 && <>
        <rect x="32" y="9" width="25" height="39" rx="6" fill="var(--workbench-glyph-well)" stroke="var(--workbench-glyph-line)" />
        <path d="M40 15H49M41 41H48" stroke="var(--technologies-accent)" strokeWidth="1.5" />
        <path d="M13 35L33 24L53 35V57L33 68L13 57Z" fill="var(--workbench-face)" stroke="var(--technologies-accent)" strokeWidth="1.5" />
        <path d="M13 35L33 46L53 35M33 46V68" stroke="var(--technologies-cyan)" strokeWidth="1.5" />
        <path d="M23 30L43 41V49" stroke="var(--technologies-accent)" strokeWidth="1.5" />
        <path d="M39 56L47 52" stroke="var(--technologies-cyan)" strokeWidth="2" />
      </>}
    </svg>
  );
}

export function TechnologiesWorkbench() {
  return (
    <div className="technologies-workbench">
      <TechnologiesCardMotion />
      <div className="technologies-workbench-intro">
        <div className="technologies-heading">
          <p className="technologies-eyebrow">02 / Technology</p>
          <h2 id="technology-heading">The right tools. Built around your needs.</h2>
          <p>From responsive websites and e-commerce to custom software and cloud-based applications, the technology follows the task.</p>
        </div>
        <ol className="technologies-stack-rail" aria-label="Technology layers">
          {goodmanTechnologiesProfile.technologyGroups.map((group, index) => <li key={group.title}><span aria-hidden="true">0{index + 1}</span>{group.title}</li>)}
        </ol>
        <p className="technologies-stack-hint" aria-hidden="true">Scroll to explore <span>↓</span></p>
      </div>
      <div className="technologies-card-stage">
        {goodmanTechnologiesProfile.technologyGroups.map((group, index) => (
          <article className="technologies-stack-card" key={group.title} aria-labelledby={`technologies-card-${index}`}>
            <div className="technologies-stack-card-surface">
              <span className="technologies-stack-index" aria-hidden="true">Layer / 0{index + 1}</span>
              <div className="technologies-stack-card-heading">
                <div><h3 id={`technologies-card-${index}`}>{group.title}</h3><p>{layerDescriptions[index]}</p></div>
                <div className="technologies-stack-glyph"><LayerGlyph index={index} /></div>
              </div>
              <ul className="technologies-tool-tiles" aria-label={`${group.title} technologies`}>
                {group.items.map((item) => <li key={item}><span>{item}</span></li>)}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
