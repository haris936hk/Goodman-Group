export function TechnologiesApproachArt({ stage }: { stage: number }) {
  const surface = `technologies-approach-surface-${stage}`;
  const accent = `technologies-approach-accent-${stage}`;

  return (
    <svg className="technologies-approach-art" viewBox="0 0 360 240" fill="none" aria-hidden="true" focusable="false" shapeRendering="geometricPrecision" strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <linearGradient id={surface} x1="40" y1="30" x2="300" y2="210" gradientUnits="userSpaceOnUse"><stop stopColor="var(--approach-surface)" /><stop offset="1" stopColor="var(--approach-raised)" /></linearGradient>
        <linearGradient id={accent} x1="0" y1="0" x2="1" y2="1"><stop stopColor="var(--technologies-accent)" /><stop offset="1" stopColor="var(--technologies-cyan)" /></linearGradient>
      </defs>
      <path d="M36 220H324" stroke="var(--approach-faint)" />
      {stage === 0 && <>
        <path d="M142 209L269 196L302 214L175 230Z" fill="var(--approach-shadow)" />
        <path d="M110 120H136M252 82H288M252 161H288" stroke="var(--technologies-cyan)" strokeWidth="1.5" />
        <path d="M136 39H224L254 69V201H136Z" fill="var(--approach-line)" />
        <path d="M130 33H218L248 63V195H130Z" fill={`url(#${surface})`} stroke="var(--approach-line)" strokeWidth="1.5" />
        <path d="M218 33V63H248" fill="var(--approach-violet-fill)" stroke="var(--approach-line)" strokeWidth="1.5" />
        <rect x="148" y="57" width="30" height="7" rx="3.5" fill="var(--technologies-cyan)" />
        <path d="M148 85H228M148 98H209" stroke="var(--technologies-accent)" strokeWidth="5" />
        <path d="M171 126H225M171 148H219M171 170H228" stroke="var(--approach-ink)" strokeWidth="4" />
        <g fill="var(--approach-cyan-fill)" stroke="var(--technologies-cyan)"><rect x="148" y="119" width="12" height="12" rx="3" /><rect x="148" y="141" width="12" height="12" rx="3" /><rect x="148" y="163" width="12" height="12" rx="3" /></g>
        <rect x="30" y="97" width="80" height="48" rx="8" fill={`url(#${surface})`} stroke="var(--technologies-accent)" strokeWidth="1.5" />
        <path d="M45 112H92M45 124H78" stroke="var(--approach-ink)" strokeWidth="4" />
        <rect x="288" y="61" width="47" height="42" rx="8" fill="var(--approach-violet-fill)" stroke="var(--technologies-accent)" />
        <path d="M302 82H321M312 73V91" stroke="var(--technologies-accent)" strokeWidth="2" />
        <rect x="288" y="139" width="47" height="44" rx="8" fill="var(--approach-cyan-fill)" stroke="var(--technologies-cyan)" />
        <path d="M302 155H321M302 165H315" stroke="var(--technologies-cyan)" strokeWidth="3" />
      </>}
      {stage === 1 && <>
        <path d="M55 206L279 191L318 216L94 229Z" fill="var(--approach-shadow)" />
        <rect x="108" y="28" width="214" height="144" rx="11" fill="var(--approach-raised)" stroke="var(--approach-line)" />
        <path d="M109 53H321M125 42H145" stroke="var(--approach-line)" strokeWidth="2" />
        <g transform="rotate(-4 163 133)">
          <rect x="42" y="64" width="252" height="149" rx="11" fill="var(--approach-line)" />
          <rect x="36" y="58" width="252" height="149" rx="11" fill={`url(#${surface})`} stroke="var(--technologies-accent)" strokeWidth="1.5" />
          <path d="M37 84H287" stroke="var(--approach-line)" />
          <g fill="var(--technologies-accent)"><circle cx="51" cy="71" r="2.5" /><circle cx="61" cy="71" r="2.5" /><circle cx="71" cy="71" r="2.5" /></g>
          <rect x="54" y="102" width="104" height="10" rx="3" fill="var(--technologies-accent)" />
          <path d="M54 126H139M54 138H122" stroke="var(--approach-ink)" strokeWidth="4" />
          <g fill="var(--approach-raised)" stroke="var(--approach-line)"><rect x="54" y="158" width="60" height="31" rx="5" /><rect x="126" y="158" width="60" height="31" rx="5" /><rect x="198" y="158" width="71" height="31" rx="5" /></g>
          <path d="M195 111L218 98L241 111V137L218 150L195 137Z" fill={`url(#${accent})`} />
          <path d="M195 111L218 124L241 111M218 124V150" stroke="var(--approach-surface)" strokeWidth="1.2" />
        </g>
      </>}
      {stage === 2 && <>
        <path d="M36 161L155 93L283 167L164 235Z" fill="var(--approach-shadow)" />
        <path d="M35 139L132 83L240 145V166L143 222L35 160Z" fill="var(--approach-raised)" stroke="var(--approach-line)" strokeWidth="1.5" />
        <path d="M35 139L143 201L240 145M143 201V222" stroke="var(--technologies-accent)" strokeWidth="1.5" />
        <path d="M67 127L97 110L127 127V161L97 178L67 161Z" fill="var(--approach-violet-fill)" stroke="var(--technologies-accent)" strokeWidth="1.5" />
        <path d="M67 127L97 144L127 127M97 144V178" stroke="var(--technologies-accent)" strokeWidth="1.5" />
        <path d="M122 95L152 78L182 95V129L152 146L122 129Z" fill="var(--approach-cyan-fill)" stroke="var(--technologies-cyan)" strokeWidth="1.5" />
        <path d="M122 95L152 112L182 95M152 112V146" stroke="var(--technologies-cyan)" strokeWidth="1.5" />
        <g transform="rotate(5 253 101)">
          <rect x="187" y="35" width="142" height="137" rx="11" fill={`url(#${surface})`} stroke="var(--approach-line)" strokeWidth="1.5" />
          <path d="M188 59H328" stroke="var(--approach-line)" />
          <path d="M203 47H224" stroke="var(--technologies-cyan)" strokeWidth="3" />
          <path d="M224 77L213 88L224 99M287 77L298 88L287 99M264 73L253 104" stroke="var(--technologies-accent)" strokeWidth="3" />
          <path d="M207 123H303M207 136H278M207 149H291" stroke="var(--approach-ink)" strokeWidth="4" />
        </g>
      </>}
      {stage === 3 && <>
        <path d="M64 204L272 189L318 217H106Z" fill="var(--approach-shadow)" />
        <g transform="rotate(-3 170 120)">
          <rect x="46" y="40" width="246" height="161" rx="12" fill={`url(#${surface})`} stroke="var(--approach-line)" strokeWidth="1.5" />
          <path d="M47 68H291" stroke="var(--approach-line)" />
          <path d="M63 55H86" stroke="var(--technologies-accent)" strokeWidth="4" />
          <g fill="var(--approach-cyan-fill)" stroke="var(--technologies-cyan)"><circle cx="75" cy="96" r="10" /><circle cx="75" cy="132" r="10" /><circle cx="75" cy="168" r="10" /></g>
          <path d="M70 96L74 100L81 92M70 132L74 136L81 128M70 168L74 172L81 164" stroke="var(--technologies-cyan)" strokeWidth="2" />
          <path d="M102 93H225M102 103H191M102 129H236M102 139H201M102 165H208M102 175H186" stroke="var(--approach-ink)" strokeWidth="4" />
        </g>
        <path d="M282 183L313 215" stroke="var(--approach-line)" strokeWidth="13" />
        <path d="M282 180L313 212" stroke="var(--technologies-accent)" strokeWidth="7" />
        <circle cx="256" cy="155" r="37" fill="var(--approach-surface)" stroke="var(--technologies-accent)" strokeWidth="2" />
        <circle cx="256" cy="155" r="29" fill="var(--approach-violet-fill)" />
        <path d="M241 155L251 165L272 144" stroke="var(--technologies-cyan)" strokeWidth="4" />
      </>}
      {stage === 4 && <>
        <path d="M79 197L214 162L304 201L169 233Z" fill="var(--approach-shadow)" />
        <path d="M79 176L175 122L278 181V200L182 225L79 195Z" fill="var(--approach-raised)" stroke="var(--approach-line)" strokeWidth="1.5" />
        <path d="M79 176L182 207L278 181M182 207V225" stroke="var(--technologies-accent)" strokeWidth="1.5" />
        <path d="M118 114L177 80L236 114V179L177 213L118 179Z" fill="var(--approach-violet-fill)" stroke="var(--technologies-accent)" strokeWidth="1.5" />
        <path d="M118 114L177 148L236 114M177 148V213" stroke="var(--technologies-accent)" strokeWidth="1.5" />
        <path d="M147 97L206 131V159" stroke="var(--technologies-cyan)" strokeWidth="2" />
        <path d="M176 85V24M157 43L176 24L195 43" stroke="var(--technologies-cyan)" strokeWidth="4" />
        <path d="M78 84V53H112M244 53H278V84" stroke="var(--approach-line)" strokeWidth="1.5" />
        <path d="M200 179L222 167" stroke="var(--technologies-cyan)" strokeWidth="3" />
      </>}
      {stage === 5 && <>
        <path d="M62 202L266 181L310 213L106 233Z" fill="var(--approach-shadow)" />
        <path d="M93 61H291V169H253L234 189V169H93Z" fill="var(--approach-raised)" stroke="var(--approach-line)" strokeWidth="1.5" />
        <path d="M43 36H251V145H104L80 169V145H43Z" fill={`url(#${surface})`} stroke="var(--technologies-accent)" strokeWidth="1.5" />
        <circle cx="69" cy="64" r="8" fill="var(--approach-cyan-fill)" stroke="var(--technologies-cyan)" />
        <path d="M89 61H171M89 70H145" stroke="var(--approach-ink)" strokeWidth="4" />
        <path d="M64 95H222M64 109H197M64 123H154" stroke="var(--approach-ink)" strokeWidth="4" />
        <rect x="217" y="129" width="83" height="82" rx="16" fill="var(--approach-surface)" stroke="var(--approach-line)" strokeWidth="1.5" />
        <path d="M246 152A15 15 0 0 1 268 149L258 159L266 167L276 157A15 15 0 0 1 258 179L244 193L234 183L248 169A15 15 0 0 1 246 152Z" fill="var(--approach-violet-fill)" stroke="var(--technologies-accent)" strokeWidth="1.5" />
        <path d="M240 184L244 180" stroke="var(--technologies-cyan)" strokeWidth="3" />
      </>}
    </svg>
  );
}
