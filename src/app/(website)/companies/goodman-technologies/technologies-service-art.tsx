import type { ReactNode } from "react";

function ServiceArtFrame({ kind, children }: { kind: "web" | "mobile" | "desktop"; children: ReactNode }) {
  return (
    <svg className="technologies-service-art" viewBox="0 0 360 220" fill="none" aria-hidden="true" focusable="false" shapeRendering="geometricPrecision">
      <defs>
        <linearGradient id={`technologies-${kind}-surface`} x1="40" y1="20" x2="300" y2="200" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--service-art-raised)" />
          <stop offset="1" stopColor="var(--service-art-frame)" />
        </linearGradient>
        <linearGradient id={`technologies-${kind}-accent`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="var(--technologies-accent)" />
          <stop offset="1" stopColor="var(--technologies-cyan)" />
        </linearGradient>
      </defs>
      <path d="M40 204H320" stroke="var(--service-art-line)" strokeWidth="1" />
      <path d="M40 201V207M320 201V207" stroke="var(--service-art-line)" strokeWidth="1" />
      {children}
    </svg>
  );
}

export function WebServiceArt() {
  return (
    <ServiceArtFrame kind="web">
      <path d="M54 177L290 158L324 187L96 204Z" fill="var(--service-art-shadow)" />
      <g className="technologies-art-device">
        <g transform="rotate(-5 173 107)">
          <rect x="39" y="31" width="268" height="156" rx="12" fill="var(--service-art-edge)" />
          <rect className="technologies-art-outline" x="35" y="25" width="268" height="156" rx="12" fill="url(#technologies-web-surface)" stroke="var(--service-art-edge)" strokeWidth="1.2" />
          <path d="M36 49H302" stroke="var(--service-art-line)" />
          <g fill="var(--technologies-accent)"><circle cx="49" cy="37" r="2.5" /><circle cx="59" cy="37" r="2.5" /><circle cx="69" cy="37" r="2.5" /></g>
          <rect x="112" y="33" width="111" height="8" rx="4" fill="var(--service-art-well)" />
          <path d="M280 33V41M276 37H284" stroke="var(--service-art-muted)" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="51" y="66" width="27" height="5" rx="2.5" fill="var(--technologies-cyan)" />
          <rect x="51" y="82" width="102" height="10" rx="3" fill="var(--technologies-accent)" />
          <rect x="51" y="98" width="78" height="10" rx="3" fill="var(--technologies-accent)" />
          <path d="M51 121H137M51 129H114" stroke="var(--service-art-muted)" strokeWidth="3" strokeLinecap="round" />
          <rect x="51" y="145" width="55" height="17" rx="5" fill="var(--technologies-accent)" />
          <path d="M91 151L95 154L91 157" stroke="var(--service-art-frame)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="177" y="65" width="107" height="97" rx="9" fill="var(--service-art-well)" />
          <path d="M194 139V97L226 79L259 97V139L226 154Z" fill="var(--service-art-violet-soft)" />
          <path d="M194 97L226 116L259 97M226 116V154" stroke="var(--technologies-accent)" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M226 79L259 97L226 116L194 97Z" fill="url(#technologies-web-accent)" fillOpacity=".8" />
          <circle cx="266" cy="76" r="5" fill="var(--technologies-cyan)" />
        </g>
      </g>
      <g className="technologies-art-secondary">
        <rect x="268" y="106" width="55" height="94" rx="10" fill="var(--service-art-edge)" />
        <rect className="technologies-art-outline" x="264" y="102" width="55" height="94" rx="10" fill="var(--service-art-frame)" stroke="var(--service-art-edge)" strokeWidth="1.2" />
        <rect x="281" y="108" width="20" height="4" rx="2" fill="var(--service-art-muted)" />
        <rect x="272" y="122" width="39" height="34" rx="5" fill="var(--service-art-cyan-soft)" />
        <path d="M280 145L288 133L296 139L303 128" stroke="var(--technologies-cyan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M273 166H302M273 173H293" stroke="var(--service-art-muted)" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="272" y="181" width="24" height="7" rx="3.5" fill="var(--technologies-accent)" />
      </g>
    </ServiceArtFrame>
  );
}

export function MobileServiceArt() {
  return (
    <ServiceArtFrame kind="mobile">
      <path d="M92 187L244 179L286 199L134 211Z" fill="var(--service-art-shadow)" />
      <g className="technologies-art-secondary">
        <g transform="rotate(12 235 113)">
          <rect className="technologies-art-outline" x="193" y="34" width="85" height="162" rx="17" fill="url(#technologies-mobile-surface)" stroke="var(--service-art-edge)" strokeWidth="1.2" />
          <rect x="202" y="45" width="67" height="140" rx="11" fill="var(--service-art-screen)" />
          <rect x="222" y="49" width="28" height="5" rx="2.5" fill="var(--service-art-muted)" />
          <rect x="211" y="69" width="49" height="41" rx="8" fill="var(--service-art-cyan-soft)" />
          <path d="M223 90L232 99L249 80" stroke="var(--technologies-cyan)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M212 126H250M212 135H242M212 155H250M212 164H238" stroke="var(--service-art-muted)" strokeWidth="3" strokeLinecap="round" />
        </g>
      </g>
      <g className="technologies-art-device">
        <g transform="rotate(-9 153 109)">
          <rect x="108" y="17" width="105" height="190" rx="21" fill="var(--service-art-edge)" />
          <rect className="technologies-art-outline" x="103" y="12" width="105" height="190" rx="21" fill="url(#technologies-mobile-surface)" stroke="var(--service-art-edge)" strokeWidth="1.4" />
          <rect x="111" y="20" width="89" height="174" rx="15" fill="var(--service-art-screen)" />
          <rect x="139" y="25" width="34" height="7" rx="3.5" fill="var(--service-art-edge)" />
          <path d="M120 47H139M120 54H151" stroke="var(--service-art-muted)" strokeWidth="3" strokeLinecap="round" />
          <circle cx="185" cy="49" r="7" fill="var(--service-art-violet-soft)" />
          <rect x="120" y="66" width="71" height="55" rx="10" fill="var(--service-art-violet-soft)" />
          <path d="M143 101V83L159 74L175 83V101L159 110Z" fill="url(#technologies-mobile-accent)" />
          <path d="M143 83L159 92L175 83M159 92V110" stroke="var(--service-art-screen)" strokeWidth="1.2" strokeLinejoin="round" />
          <rect x="120" y="131" width="17" height="17" rx="5" fill="var(--service-art-cyan-soft)" />
          <path d="M145 135H183M145 143H170" stroke="var(--service-art-muted)" strokeWidth="3" strokeLinecap="round" />
          <rect x="120" y="155" width="17" height="17" rx="5" fill="var(--service-art-violet-soft)" />
          <path d="M145 159H183M145 167H175" stroke="var(--service-art-muted)" strokeWidth="3" strokeLinecap="round" />
          <path d="M143 184H168" stroke="var(--service-art-edge)" strokeWidth="3" strokeLinecap="round" />
          <path d="M101 58V77M210 63V91" stroke="var(--technologies-accent)" strokeWidth="2" strokeLinecap="round" />
        </g>
      </g>
    </ServiceArtFrame>
  );
}

export function DesktopServiceArt() {
  return (
    <ServiceArtFrame kind="desktop">
      <path d="M89 197L247 187L288 204H119Z" fill="var(--service-art-shadow)" />
      <g className="technologies-art-device">
        <path d="M164 162H199L204 191H158Z" fill="url(#technologies-desktop-surface)" stroke="var(--service-art-edge)" strokeWidth="1.2" />
        <path d="M151 191H210L225 198V202H136V198Z" fill="var(--service-art-raised)" stroke="var(--service-art-edge)" strokeWidth="1.2" strokeLinejoin="round" />
        <rect x="41" y="23" width="284" height="153" rx="12" fill="var(--service-art-edge)" />
        <rect className="technologies-art-outline" x="36" y="18" width="284" height="153" rx="12" fill="url(#technologies-desktop-surface)" stroke="var(--service-art-edge)" strokeWidth="1.4" />
        <rect x="45" y="27" width="266" height="126" rx="6" fill="var(--service-art-screen)" />
        <path d="M45 47H311M89 47V153M235 47V153" stroke="var(--service-art-line)" />
        <g fill="var(--technologies-accent)"><circle cx="55" cy="37" r="2" /><circle cx="64" cy="37" r="2" /><circle cx="73" cy="37" r="2" /></g>
        <rect x="102" y="33" width="46" height="7" rx="3.5" fill="var(--service-art-violet-soft)" />
        <path d="M56 61H76M56 77H72M56 93H76M56 109H69M56 125H74" stroke="var(--service-art-muted)" strokeWidth="3" strokeLinecap="round" />
        <rect x="50" y="69" width="33" height="15" rx="4" fill="var(--service-art-violet-soft)" />
        <path d="M56 77H72" stroke="var(--technologies-accent)" strokeWidth="3" strokeLinecap="round" />
        <rect x="103" y="61" width="118" height="51" rx="6" fill="var(--service-art-well)" />
        <rect x="112" y="71" width="31" height="31" rx="7" fill="url(#technologies-desktop-accent)" />
        <path d="M153 78H207M153 87H192M153 96H202" stroke="var(--service-art-muted)" strokeWidth="3" strokeLinecap="round" />
        <path d="M104 127H153M104 137H135M170 127H219M170 137H203" stroke="var(--service-art-muted)" strokeWidth="3" strokeLinecap="round" />
        <rect x="246" y="62" width="53" height="7" rx="3.5" fill="var(--service-art-violet-soft)" />
        <path d="M247 82H295M247 103H295M247 124H295" stroke="var(--service-art-line)" />
        <g fill="var(--technologies-cyan)"><circle cx="250" cy="91" r="3" /><circle cx="250" cy="112" r="3" /><circle cx="250" cy="133" r="3" /></g>
        <path d="M261 91H290M261 112H282M261 133H286" stroke="var(--service-art-muted)" strokeWidth="3" strokeLinecap="round" />
        <circle cx="178" cy="162" r="2.5" fill="var(--technologies-cyan)" />
      </g>
    </ServiceArtFrame>
  );
}
