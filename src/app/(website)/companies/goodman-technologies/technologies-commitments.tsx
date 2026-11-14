import { ArrowUpRight, CalendarDays, MessageSquare } from "lucide-react";

import { goodmanTechnologiesProfile } from "@/data/goodman-technologies";

function CodeHandoverArt() {
  return (
    <svg className="technologies-handover-art" viewBox="0 0 360 240" fill="none" aria-hidden="true" focusable="false" shapeRendering="geometricPrecision" strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <linearGradient id="technologies-handover-surface" x1="54" y1="48" x2="302" y2="209" gradientUnits="userSpaceOnUse"><stop stopColor="var(--commitment-surface)" /><stop offset="1" stopColor="var(--commitment-raised)" /></linearGradient>
      </defs>
      <path d="M44 207L273 182L321 211L92 233Z" fill="var(--commitment-shadow)" />
      <g data-handover-layer>
        <g transform="rotate(6 219 98)">
          <rect x="120" y="31" width="194" height="126" rx="12" fill="var(--commitment-raised)" stroke="var(--commitment-line)" strokeWidth="1.5" />
          <path d="M121 56H313" stroke="var(--commitment-line)" />
          <path d="M137 44H163" stroke="var(--technologies-cyan)" strokeWidth="4" />
          <path d="M141 79H194M141 92H176M141 114H270M141 127H243" stroke="var(--commitment-ink)" strokeWidth="4" />
        </g>
      </g>
      <g data-handover-layer>
        <g className="technologies-handover-front">
          <g transform="rotate(-7 164 140)">
            <rect x="53" y="77" width="229" height="134" rx="12" fill="var(--commitment-line)" />
            <rect x="47" y="71" width="229" height="134" rx="12" fill="url(#technologies-handover-surface)" stroke="var(--technologies-accent)" strokeWidth="1.5" />
            <path d="M48 98H275" stroke="var(--commitment-line)" />
            <g fill="var(--technologies-accent)"><circle cx="63" cy="85" r="2.5" /><circle cx="73" cy="85" r="2.5" /><circle cx="83" cy="85" r="2.5" /></g>
            <path d="M148 83H254" stroke="var(--commitment-faint)" strokeWidth="4" />
            <path d="M119 124L102 142L119 160M202 124L219 142L202 160M174 116L151 169" stroke="var(--technologies-accent)" strokeWidth="3.5" />
            <path d="M69 183H105M119 183H141" stroke="var(--technologies-cyan)" strokeWidth="3" />
          </g>
        </g>
      </g>
      <g data-handover-layer>
        <g className="technologies-handover-file">
          <path d="M258 130H296L317 151V214H258Z" fill="var(--commitment-line)" />
          <path d="M253 125H291L312 146V209H253Z" fill="var(--commitment-surface)" stroke="var(--technologies-cyan)" strokeWidth="1.5" />
          <path d="M291 125V146H312" fill="var(--commitment-cyan-fill)" stroke="var(--technologies-cyan)" strokeWidth="1.5" />
          <path d="M270 161L264 168L270 175M294 161L300 168L294 175M285 158L278 178" stroke="var(--technologies-accent)" strokeWidth="1.8" />
          <path d="M266 191H294" stroke="var(--commitment-ink)" strokeWidth="3" />
        </g>
      </g>
    </svg>
  );
}

export function TechnologiesCommitments() {
  const [communication, planning, ownership, support] = goodmanTechnologiesProfile.differentiators;
  const supportWindow = goodmanTechnologiesProfile.support;

  return (
    <div className="technologies-commitment-board">
      <article className="technologies-commitment technologies-commitment-ownership" aria-labelledby="technologies-ownership-heading">
        <div className="technologies-commitment-copy"><span className="technologies-commitment-caption">Code handover</span><h3 id="technologies-ownership-heading">{ownership.title}</h3><p>{ownership.description}</p></div>
        <div className="technologies-commitment-art"><CodeHandoverArt /></div>
        <p className="technologies-ownership-signature">Your software.<br />Your code.</p>
      </article>
      <article className="technologies-commitment technologies-commitment-communication" aria-labelledby="technologies-communication-heading">
        <div className="technologies-commitment-top"><MessageSquare size={24} aria-hidden="true" /><span>01 / Collaborate</span></div>
        <h3 id="technologies-communication-heading">{communication.title}</h3><p>{communication.description}</p>
      </article>
      <article className="technologies-commitment technologies-commitment-planning" aria-labelledby="technologies-planning-heading">
        <div className="technologies-commitment-top"><CalendarDays size={24} aria-hidden="true" /><span>02 / Plan</span></div>
        <h3 id="technologies-planning-heading">{planning.title}</h3><p>{planning.description}</p>
      </article>
      <article className="technologies-commitment technologies-commitment-support" aria-labelledby="technologies-support-heading">
        <strong className="technologies-support-value" aria-hidden="true">{supportWindow.value}</strong>
        <div className="technologies-commitment-support-copy"><span className="technologies-commitment-caption">{support.title}</span><h3 id="technologies-support-heading" aria-label={`${supportWindow.value} ${supportWindow.label}`}>{supportWindow.label}</h3><p>{support.description}</p></div>
        <a className="technologies-button technologies-commitment-contact" href="#contact">Let&apos;s talk <ArrowUpRight size={18} aria-hidden="true" /></a>
      </article>
    </div>
  );
}
