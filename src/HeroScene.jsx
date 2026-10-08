import React from "react";

// Network links drawn behind the lab; packets travel along these paths.
const NETWORK_PATHS = [
  "M20 90 L140 60 L250 20 L420 50 L540 110",
  "M20 90 L60 170 L30 260",
  "M540 110 L520 190",
  "M250 20 L280 0",
];

const NETWORK_NODES = [
  [20, 90], [140, 60], [250, 20], [420, 50], [540, 110], [60, 170], [30, 260], [520, 190],
];

// Animated lab: an engineer and a robot test a smartphone on a connected bench,
// while the monitor cycles through the service slides.
export default function HeroScene({ slides, active, animate = true }) {
  return (
    <svg
      className="hero-scene"
      viewBox="0 0 560 520"
      role="img"
      aria-label="An engineer and a robot testing a smartphone in a connected test lab"
    >
      <defs>
        <clipPath id="hs-screen-clip">
          <rect x="152" y="42" width="256" height="176" rx="12" />
        </clipPath>
        <linearGradient id="hs-frame" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#15402c" />
          <stop offset="1" stopColor="#0a1f16" />
        </linearGradient>
        <linearGradient id="hs-phone-screen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#17a84b" />
          <stop offset="1" stopColor="#14b8a6" />
        </linearGradient>
        <linearGradient id="hs-robot" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3f8f5" />
          <stop offset="1" stopColor="#bccbc3" />
        </linearGradient>
        <linearGradient id="hs-laser" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#5eead4" stopOpacity="0" />
          <stop offset=".5" stopColor="#5eead4" />
          <stop offset="1" stopColor="#5eead4" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="hs-floor" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#17a84b" stopOpacity=".45" />
          <stop offset="1" stopColor="#17a84b" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Network backdrop */}
      <g className="hs-network">
        {NETWORK_PATHS.map((path) => <path key={path} d={path} />)}
        {NETWORK_NODES.map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="4" />)}
        {animate && NETWORK_PATHS.slice(0, 2).map((path, index) => (
          <circle key={path} className="hs-packet" r="3.5">
            <animateMotion dur={`${4 + index * 1.5}s`} repeatCount="indefinite" path={path} />
          </circle>
        ))}
      </g>

      <ellipse cx="290" cy="470" rx="250" ry="34" fill="url(#hs-floor)" />

      {/* Monitor showing the service slides */}
      <g className="hs-monitor">
        <rect x="140" y="30" width="280" height="200" rx="20" fill="url(#hs-frame)" />
        <g clipPath="url(#hs-screen-clip)">
          <rect x="152" y="42" width="256" height="176" fill="#fff" />
          {slides.map((slide, index) => (
            <image
              key={slide.src}
              href={slide.src}
              x="152"
              y="42"
              width="256"
              height="176"
              preserveAspectRatio="xMidYMid slice"
              className={index === active ? "is-active" : ""}
            />
          ))}
          <rect className="hs-scanline" x="152" y="42" width="256" height="3" />
        </g>
        <circle cx="280" cy="36" r="2" fill="#5eead4" />
        <rect x="268" y="230" width="24" height="30" fill="#0f2e20" />
        <rect x="232" y="258" width="96" height="8" rx="4" fill="#15402c" />
      </g>

      {/* Robot */}
      <g className="hs-robot">
        <line x1="470" y1="150" x2="470" y2="172" stroke="#bccbc3" strokeWidth="3" />
        <circle className="hs-antenna" cx="470" cy="146" r="6" />
        <rect x="440" y="172" width="60" height="48" rx="15" fill="url(#hs-robot)" />
        <rect x="448" y="184" width="44" height="22" rx="11" fill="#0a1f16" />
        <g className="hs-eyes">
          <circle cx="460" cy="195" r="4.5" />
          <circle cx="480" cy="195" r="4.5" />
        </g>
        <rect x="462" y="220" width="16" height="10" fill="#9fb5aa" />
        <rect x="428" y="230" width="84" height="120" rx="20" fill="url(#hs-robot)" />
        <rect x="446" y="252" width="48" height="30" rx="7" fill="#0a1f16" />
        <g className="hs-lights">
          <circle cx="458" cy="267" r="4" />
          <circle cx="470" cy="267" r="4" />
          <circle cx="482" cy="267" r="4" />
        </g>
        <line x1="506" y1="254" x2="532" y2="318" stroke="#cbd8d1" strokeWidth="13" strokeLinecap="round" />
        <g className="hs-robot-arm">
          <line x1="436" y1="254" x2="378" y2="300" stroke="#e2ebe6" strokeWidth="14" strokeLinecap="round" />
          <circle cx="378" cy="300" r="10" fill="#9fb5aa" />
          <line x1="378" y1="300" x2="324" y2="322" stroke="#e2ebe6" strokeWidth="11" strokeLinecap="round" />
          <circle className="hs-probe" cx="318" cy="324" r="6" />
        </g>
      </g>

      {/* Engineer */}
      <g className="hs-human">
        <path d="M50 390 L58 274 Q61 250 84 246 L108 246 Q130 250 133 274 L140 390 Z" fill="#f6faf7" />
        <path d="M86 246 L96 274 L106 246 Z" fill="#17a84b" />
        <rect x="89" y="230" width="14" height="18" rx="5" fill="#c98b6b" />
        <g className="hs-head">
          <circle cx="96" cy="212" r="22" fill="#d99a78" />
          <path d="M73 210 Q70 184 96 184 Q122 184 120 208 Q112 196 97 197 Q82 197 73 210 Z" fill="#2b1d2e" />
          <circle cx="89" cy="214" r="2" fill="#2b1d2e" />
          <circle cx="104" cy="214" r="2" fill="#2b1d2e" />
          <path d="M90 223 Q96 228 102 223" stroke="#2b1d2e" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
        <rect x="112" y="290" width="14" height="18" rx="3" fill="#17a84b" />
        <path d="M66 268 Q56 300 60 336" stroke="#eef4f0" strokeWidth="13" fill="none" strokeLinecap="round" />
        <path d="M124 266 Q140 290 156 300" stroke="#eef4f0" strokeWidth="13" fill="none" strokeLinecap="round" />
        <g className="hs-tablet">
          <rect x="150" y="262" width="54" height="70" rx="8" fill="#0a1f16" />
          <rect x="155" y="268" width="44" height="58" rx="5" fill="#123526" />
          <g className="hs-bars">
            <rect x="160" y="298" width="7" height="22" rx="2" />
            <rect x="170" y="290" width="7" height="30" rx="2" />
            <rect x="180" y="304" width="7" height="16" rx="2" />
            <rect x="190" y="284" width="7" height="36" rx="2" />
          </g>
          <path d="M159 280 L172 276 L184 282 L196 272" stroke="#5eead4" strokeWidth="2" fill="none" />
        </g>
      </g>

      {/* Test bench and device under test */}
      <rect x="96" y="384" width="392" height="18" rx="9" fill="#15402c" />
      <rect x="96" y="384" width="392" height="5" rx="2.5" fill="#1d5a3c" />
      <rect x="130" y="402" width="12" height="62" rx="4" fill="#0f2e20" />
      <rect x="442" y="402" width="12" height="62" rx="4" fill="#0f2e20" />

      <g className="hs-phone">
        <g className="hs-waves">
          <path d="M276 278 Q290 266 304 278" />
          <path d="M268 268 Q290 248 312 268" />
          <path d="M260 258 Q290 230 320 258" />
        </g>
        <rect x="258" y="372" width="64" height="12" rx="4" fill="#1d5a3c" />
        <rect x="266" y="288" width="48" height="88" rx="10" fill="#0a1f16" />
        <rect x="270" y="296" width="40" height="72" rx="6" fill="url(#hs-phone-screen)" />
        <circle cx="290" cy="330" r="13" fill="rgb(255 255 255 / 20%)" />
        <path className="hs-check" d="M283 330 L288.5 335.5 L298 325" />
        <rect className="hs-laser" x="258" y="294" width="64" height="3" rx="1.5" fill="url(#hs-laser)" />
      </g>
    </svg>
  );
}
