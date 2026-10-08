import React from "react";

// Hand-built sections modelled on the structure of marquistech.com, written
// only with facts already published on the Testoryx Etech site.

const ICONS = {
  chip: "M9 3v2M15 3v2M9 19v2M15 19v2M3 9h2M3 15h2M19 9h2M19 15h2M7 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM9 9h6v6H9z",
  users: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  signal: "M2 20h.01M7 20v-4M12 20v-8M17 20V8M22 4v16",
  globe: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
  layers: "M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4",
  truck: "M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM18.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  target: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  sim: "M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM8 12h8v6H8z",
  route: "M6 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM9 16h6a3 3 0 0 0 0-6h-1",
  box: "M21 16V8l-9-5-9 5v8l9 5 9-5zM3.3 7 12 12l8.7-5M12 22V12",
};

function Icon({ name }) {
  return (
    <svg className="section-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}

const CREDENTIALS = [
  { icon: "chip", value: "14+ years", label: "Chipset testing experience" },
  { icon: "users", value: "27+ OEMs/ODMs", label: "In our customer portfolio" },
  { icon: "signal", value: "5G NSA & SA", label: "First-hand test plan expertise" },
  { icon: "globe", value: "Global teams", label: "Engineers across the world" },
  { icon: "layers", value: "Every tier", label: "Flagship to entry-level chipsets" },
];

export function CredentialsStrip() {
  return (
    <section className="credentials-strip" aria-label="Testoryx Etech at a glance">
      <ul>
        {CREDENTIALS.map((item) => (
          <li key={item.value} className="credential">
            <Icon name={item.icon} />
            <span>
              <strong>{item.value}</strong>
              <small>{item.label}</small>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

const TECHNOLOGIES = [
  { logo: "2g.webp", name: "2G", tag: "GSM networks" },
  { logo: "3g.webp", name: "3G", tag: "UMTS / WCDMA" },
  { logo: "5g-1.webp", name: "5G", tag: "NSA & SA" },
  { logo: "vo-lte.webp", name: "VoLTE", tag: "Voice over LTE" },
  { logo: "vo-wifi.webp", name: "VoWiFi", tag: "Voice over Wi-Fi" },
  { logo: "vonr.webp", name: "VoNR", tag: "Voice over 5G NR" },
];

export function TechnologiesWeTest() {
  return (
    <section className="tech-section">
      <div className="section-head">
        <span className="section-eyebrow">Network coverage</span>
        <h2>Technologies <em>we test</em></h2>
        <p>From legacy 2G to 5G voice, we validate devices across every generation of mobile network.</p>
      </div>
      <div className="tech-track">
        <span className="tech-line" aria-hidden="true"><i /></span>
        <ul className="tech-grid">
          {TECHNOLOGIES.map((tech) => (
            <li key={tech.name} className="tech-card">
              <span className="tech-node" aria-hidden="true" />
              <div className="tech-logo">
                <img src={`/wp-content/uploads/2025/12/${tech.logo}`} alt={`${tech.name} logo`} loading="lazy" />
              </div>
              <strong>{tech.name}</strong>
              <small>{tech.tag}</small>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const REASONS = [
  {
    icon: "chip",
    title: "14 years in chipset testing",
    text: "Quality outcomes for flagship, mid-level and entry-level chipsets, backed by outstanding customer reviews.",
  },
  {
    icon: "users",
    title: "Experienced engineers worldwide",
    text: "A large pool of skilled engineers and business strategists from diverse cultures and perspectives.",
  },
  {
    icon: "shield",
    title: "Dependable test leadership",
    text: "Test quality leads and managers with 15+ years of experience across 20+ ODM, OEM and chipset vendors.",
  },
  {
    icon: "signal",
    title: "Latest 5G know-how",
    text: "First-hand knowledge of 5G testing and the latest test plans for 5G NSA as well as 5G SA.",
  },
  {
    icon: "truck",
    title: "End-to-end logistics",
    text: "SIM cards, test vans, device shipment and customs clearance handled so field tests start on time.",
  },
  {
    icon: "eye",
    title: "Flexible and transparent",
    text: "A cost-effective, flexible approach with full transparency into team strength and capability.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="why-us">
      <div className="why-us-inner">
        <div className="why-us-intro">
          <span className="section-eyebrow">Why choose us</span>
          <h2>Built on trust, <em>driven by precision</em></h2>
          <p>
            Testoryx Etech pairs a global team of experienced engineers with proven test leadership, so
            every device, network and chipset we validate is ready for the real world.
          </p>
          <figure className="why-us-visual">
            <img src="/wp-content/uploads/2025/11/team.png" alt="Testoryx Etech engineers testing devices" loading="lazy" />
            <figcaption>
              <strong>27+</strong>
              <span>OEMs/ODMs, chipset makers and telecom operators served</span>
            </figcaption>
          </figure>
        </div>
        <ul className="why-us-grid">
          {REASONS.map((reason, index) => (
            <li key={reason.title} className="why-us-card" style={{ "--i": index }}>
              <Icon name={reason.icon} />
              <h3>{reason.title}</h3>
              <p>{reason.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const PURPOSE = [
  {
    icon: "target",
    label: "Our Mission",
    image: "/wp-content/uploads/2025/12/mission.jpg",
    text: "To deliver innovative, reliable, and scalable technology solutions that enable seamless connectivity and optimized performance across global networks. We are committed to supporting our partners through expert testing, intelligent systems, and unwavering dedication to quality and efficiency.",
  },
  {
    icon: "eye",
    label: "Our Vision",
    image: "/wp-content/uploads/2025/12/vision.webp",
    text: "To be a global leader in next-generation connectivity and device intelligence—driving technological advancement, enhancing user experiences, and shaping a smarter, faster, and more connected world.",
  },
];

export function MissionVision() {
  return (
    <section className="mission-vision">
      <div className="section-head">
        <span className="section-eyebrow">Who we are</span>
        <h2>Mission &amp; <em>Vision</em></h2>
        <p>
          A team of skilled engineers and business strategists focused on one goal: testing devices and
          technologies to the highest standard.
        </p>
      </div>
      <div className="mission-vision-grid">
        {PURPOSE.map((item) => (
          <article key={item.label} className="purpose-card">
            <div className="purpose-media">
              <img src={item.image} alt="" loading="lazy" />
            </div>
            <div className="purpose-body">
              <span className="purpose-label"><Icon name={item.icon} />{item.label}</span>
              <p>{item.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

const COVERAGE = [
  { icon: "users", title: "Field engineers worldwide", text: "Experienced engineers for field trials, drive tests and end-user testing." },
  { icon: "route", title: "Drive routes in major cities", text: "Updated knowledge of bands, locations and drive routes in all major countries." },
  { icon: "sim", title: "SIM cards & test vans", text: "Postpaid and prepaid SIM cards and mobility vans available locally." },
  { icon: "box", title: "Shipment & customs", text: "Device shipment tracking and customs clearance support for every project." },
];

// Points on the globe (x, y in a 400×400 box) linked as a network.
const GLOBE_POINTS = [[120, 140], [200, 110], [285, 150], [250, 230], [150, 250], [210, 300], [310, 260]];
const GLOBE_LINKS = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [1, 3], [3, 5], [3, 6], [4, 5]];

function arcPath([x1, y1], [x2, y2]) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 - Math.hypot(x2 - x1, y2 - y1) * 0.3;
  return `M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`;
}

export function GlobalCoverage() {
  return (
    <section className="coverage">
      <div className="coverage-inner">
        <div className="coverage-globe" aria-hidden="true">
          <svg viewBox="0 0 400 400">
            <defs>
              <radialGradient id="globe-fill" cx=".35" cy=".3" r=".8">
                <stop offset="0" stopColor="#14603a" />
                <stop offset="1" stopColor="#0a1f16" />
              </radialGradient>
            </defs>
            <circle cx="200" cy="200" r="170" fill="url(#globe-fill)" />
            <g className="globe-grid">
              <ellipse cx="200" cy="200" rx="170" ry="60" />
              <ellipse cx="200" cy="200" rx="170" ry="120" />
              <line x1="30" y1="200" x2="370" y2="200" />
              <g className="globe-meridians">
                <ellipse cx="200" cy="200" rx="60" ry="170" />
                <ellipse cx="200" cy="200" rx="120" ry="170" />
                <line x1="200" y1="30" x2="200" y2="370" />
              </g>
            </g>
            <g className="globe-links">
              {GLOBE_LINKS.map(([a, b]) => (
                <path key={`${a}-${b}`} d={arcPath(GLOBE_POINTS[a], GLOBE_POINTS[b])} />
              ))}
            </g>
            {GLOBE_LINKS.slice(0, 4).map(([a, b], index) => (
              <circle key={`p-${a}-${b}`} className="globe-packet" r="3.5">
                <animateMotion dur={`${2.6 + index * 0.7}s`} repeatCount="indefinite" path={arcPath(GLOBE_POINTS[a], GLOBE_POINTS[b])} />
              </circle>
            ))}
            {GLOBE_POINTS.map(([x, y], index) => (
              <g key={`${x}-${y}`} className="globe-node" style={{ "--i": index }}>
                <circle className="globe-ping" cx={x} cy={y} r="6" />
                <circle cx={x} cy={y} r="5" />
              </g>
            ))}
            <circle cx="200" cy="200" r="170" fill="none" stroke="rgb(134 239 172 / 35%)" strokeWidth="1.5" />
          </svg>
        </div>
        <div className="coverage-copy">
          <span className="section-eyebrow">Global coverage</span>
          <h2>Testing wherever <em>your devices launch</em></h2>
          <p>
            Our field teams and logistics support let us test devices on live networks around the
            world, with everything arranged locally.
          </p>
          <ul className="coverage-list">
            {COVERAGE.map((item) => (
              <li key={item.title}>
                <Icon name={item.icon} />
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.text}</small>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
