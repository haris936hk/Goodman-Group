"use client";

import { useId, useState } from "react";
import { ArrowUpRight, Layers3, Maximize2 } from "lucide-react";

const layers = [
  { id: "interface", label: "Interface", detail: "Responsive interfaces. Thoughtful interactions. Built for the people who use them.", tools: "React.js / Next.js / Tailwind CSS" },
  { id: "application", label: "Application", detail: "Business logic and connected APIs, engineered around your requirements.", tools: "Node.js / Python / FastAPI" },
  { id: "data", label: "Data & delivery", detail: "Structured data and a considered path from development to deployment.", tools: "PostgreSQL / Docker" },
] as const;

function ArchitecturePlane({ kind }: { kind: "interface" | "application" | "data" }) {
  const gradientId = useId();
  const isData = kind === "data";

  return (
    <div className={`technologies-plane technologies-plane-${kind}`}>
      <svg className="technologies-plane-surface" width="1440" height="1200" viewBox="0 0 360 300" preserveAspectRatio="none" fill="none" focusable="false" shapeRendering="geometricPrecision">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="360" y2="300" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--plane-start)" />
            <stop offset="1" stopColor="var(--plane-end)" />
          </linearGradient>
        </defs>
        <rect x="1" y="7" width="358" height="292" rx="14" fill="var(--showcase-edge-fill)" stroke="var(--showcase-edge-stroke)" strokeWidth="1.5" />
        <rect x="1" y="1" width="358" height="292" rx="14" fill={`url(#${gradientId})`} stroke={isData ? "var(--technologies-cyan)" : "var(--technologies-accent)"} strokeWidth="1.5" />
        {kind === "interface" && <>
          <path d="M2 43H358M72 43V292" stroke="var(--showcase-ui-divider)" strokeWidth="1.5" />
          <g fill="var(--technologies-accent)"><circle cx="24" cy="23" r="3" /><circle cx="36" cy="23" r="3" /><circle cx="48" cy="23" r="3" /></g>
          <path d="M22 81H50M22 105H50M22 129H50M22 153H50" stroke="var(--technologies-accent)" strokeWidth="4" strokeLinecap="round" />
          <rect x="100" y="73" width="64" height="6" rx="3" fill="var(--technologies-cyan)" />
          <rect x="100" y="96" width="216" height="21" rx="4" fill="var(--technologies-accent)" />
          <g fill="var(--showcase-cyan-fill)" stroke="var(--technologies-cyan)" strokeWidth="1.5"><rect x="100" y="142" width="60" height="65" rx="5" /><rect x="178" y="142" width="60" height="65" rx="5" /><rect x="256" y="142" width="60" height="65" rx="5" /></g>
          <rect x="100" y="232" width="94" height="27" rx="4" fill="#683fc1" stroke="var(--technologies-accent)" strokeWidth="1.5" />
        </>}
        {kind === "application" && <>
          <path d="M103 105H145M215 105H257" stroke="var(--technologies-cyan)" strokeWidth="2" />
          <g fill="var(--showcase-purple-fill)" stroke="var(--technologies-accent)" strokeWidth="1.5"><rect x="33" y="70" width="70" height="70" rx="9" /><rect x="145" y="70" width="70" height="70" rx="9" /><rect x="257" y="70" width="70" height="70" rx="9" /></g>
          <path d="M36 182H254M36 205H181M36 228H254M36 251H181" stroke="var(--technologies-accent)" strokeWidth="5" strokeLinecap="round" />
          <path d="M36 205H181M36 251H181" stroke="var(--technologies-cyan)" strokeWidth="5" strokeLinecap="round" />
        </>}
        {isData && <>
          <g fill="var(--showcase-cyan-fill)" stroke="var(--technologies-cyan)" strokeWidth="1.5">{Array.from({ length: 12 }, (_, index) => <rect key={index} x={34 + (index % 4) * 79} y={51 + Math.floor(index / 4) * 57} width="55" height="35" rx="4" />)}</g>
          <path d="M38 254H104M146 254H212M254 254H320" stroke="var(--technologies-cyan)" strokeWidth="7" strokeLinecap="round" />
        </>}
      </svg>
    </div>
  );
}

export function TechnologiesShowcase() {
  const [selected, setSelected] = useState<(typeof layers)[number]>(layers[0]);
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="technologies-showcase" data-layer={selected.id} data-expanded={expanded}>
      <div className="technologies-showcase-bar"><span><span className="technologies-status-dot" /> Software, in every dimension</span><Layers3 size={18} aria-hidden="true" /></div>
      <div className="technologies-art">
        <div className="technologies-scene-motion">
          <div className="technologies-scene" aria-hidden="true">
            <div className="technologies-stack">
              <ArchitecturePlane kind="data" />
              <ArchitecturePlane kind="application" />
              <ArchitecturePlane kind="interface" />
            </div>
          </div>
        </div>
      </div>
      <div className="technologies-art-footer">
        <span className="technologies-art-coordinate" aria-hidden="true">WEB / MOBILE / DESKTOP</span>
        <button className="technologies-assembly-toggle" type="button" onClick={() => setExpanded(!expanded)} aria-pressed={expanded} aria-label="Separate architecture layers"><Maximize2 size={16} aria-hidden="true" />{expanded ? "Assemble" : "Separate"}</button>
      </div>
      <div className="technologies-layer-controls" role="group" aria-label="Explore software architecture">
        {layers.map((layer, index) => <button key={layer.id} type="button" aria-pressed={selected.id === layer.id} aria-controls="technologies-layer-detail" onClick={() => setSelected(layer)}><span>0{index + 1}</span>{layer.label}<ArrowUpRight size={14} aria-hidden="true" /></button>)}
      </div>
      <div className="technologies-layer-detail" id="technologies-layer-detail" aria-live="polite"><p>{selected.detail}</p><span>{selected.tools}</span></div>
    </div>
  );
}
