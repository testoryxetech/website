import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import pages from "./data/pages-index.json";
import ElementorRenderer, { pageIntro } from "./ElementorRenderer.jsx";
import { useScrollState } from "./motion.js";
import NetworkCanvas from "./NetworkCanvas.jsx";
import HeroScene from "./HeroScene.jsx";
import { prefersReducedMotion } from "./motion.js";

const pageBySlug = new Map(pages.map((page) => [page.slug, page]));
const homePage = pageBySlug.get("home") || pages[0];
const servicePages = pages.filter((page) =>
  !["home", "about-us", "contact-us", "career", "logistic-security"].includes(page.slug));
const LOGO = "/wp-content/uploads/2025/11/Untitled-design-13-1.png";
const USEFUL_LINKS = ["home", "about-us", "career", "contact-us", "automotive-testing", "gcf-certification",
  "camera-testing", "gps-tracker-testing"];

function decodeTitle(title) {
  return title.replace(/&amp;/g, "&");
}

function slugFromPath(pathname) {
  return pathname.replace(/^\/+|\/+$/g, "") || "home";
}

function currentPage() {
  return pageBySlug.get(slugFromPath(window.location.pathname)) || homePage;
}

function PageLink({ page, children, onNavigate, className }) {
  const href = page.slug === "home" ? "/" : `/${page.slug}/`;
  const active = typeof window !== "undefined" && slugFromPath(window.location.pathname) === page.slug;
  return (
    <a
      className={className}
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
    >
      {children || decodeTitle(page.title)}
    </a>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrolled, hidden } = useScrollState();
  const dropdownRef = useRef(null);
  const home = pageBySlug.get("home");
  const about = pageBySlug.get("about-us");
  const contact = pageBySlug.get("contact-us");
  const career = pageBySlug.get("career");
  const logistics = pageBySlug.get("logistic-security");

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    dropdownRef.current?.removeAttribute("open");
  }, []);

  useEffect(() => {
    function onPointerDown(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        dropdownRef.current.removeAttribute("open");
      }
    }
    function onKeyDown(event) {
      if (event.key === "Escape") closeMenu();
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [closeMenu]);

  const headerClass = [
    "site-header",
    scrolled && "is-scrolled",
    hidden && !menuOpen && "is-hidden",
    menuOpen && "menu-open",
  ].filter(Boolean).join(" ");

  return (
    <header className={headerClass}>
      <div className="header-inner">
        <PageLink page={home} onNavigate={closeMenu} className="brand-link">
          <img className="brand-logo" src={LOGO} alt="Testoryx Etech" width="1499" height="332" />
        </PageLink>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span /><span /><span />
        </button>
        <nav className={`site-nav ${menuOpen ? "is-open" : ""}`} aria-label="Main navigation">
          <PageLink page={home} onNavigate={closeMenu}>Home</PageLink>
          {about && <PageLink page={about} onNavigate={closeMenu}>About Us</PageLink>}
          <details className="nav-dropdown" ref={dropdownRef}>
            <summary>Services</summary>
            <div className="dropdown-menu">
              <p className="dropdown-label">What we test</p>
              <div className="dropdown-grid">
                {servicePages.map((page) => <PageLink key={page.id} page={page} onNavigate={closeMenu} />)}
              </div>
            </div>
          </details>
          {logistics && <PageLink page={logistics} onNavigate={closeMenu}>Logistic &amp; Security</PageLink>}
          {career && <PageLink page={career} onNavigate={closeMenu}>Career</PageLink>}
          {contact && (
            <PageLink page={contact} onNavigate={closeMenu} className="nav-contact">
              Contact Us <span aria-hidden="true">→</span>
            </PageLink>
          )}
        </nav>
      </div>
    </header>
  );
}

function ScrollChrome() {
  const { progress } = useScrollState();
  const circumference = 2 * Math.PI * 22;
  return (
    <>
      <div className="scroll-progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
      <button
        type="button"
        className={`back-to-top ${progress > 0.08 ? "is-visible" : ""}`}
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <svg viewBox="0 0 50 50" aria-hidden="true">
          <circle cx="25" cy="25" r="22" className="ring-track" />
          <circle
            cx="25"
            cy="25"
            r="22"
            className="ring-progress"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
          />
        </svg>
        <span aria-hidden="true">↑</span>
      </button>
    </>
  );
}

function PageBanner({ title, image }) {
  return (
    <div className={`page-heading${image ? " has-image" : ""}`}>
      {image && (
        <div className="page-heading-photo" aria-hidden="true">
          <img src={image} alt="" />
        </div>
      )}
      <div className="aurora" aria-hidden="true"><i /><i /><i /></div>
      <div className="page-heading-grid" aria-hidden="true" />
      <NetworkCanvas density={0.8} />
      <div className="page-heading-inner">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span aria-hidden="true">/</span>
          <span>{title}</span>
        </nav>
        <h1>
          {title.split(" ").map((word, index) => (
            <span className="word" style={{ "--i": index }} key={`${word}-${index}`}>{word}&nbsp;</span>
          ))}
        </h1>
        <p>Precision testing and certification by Testoryx Etech.</p>
      </div>
      <div className="page-heading-scene" aria-hidden="true">
        <HeroScene
          slides={[{ src: image || "/wp-content/uploads/2025/11/121.png" }]}
          active={0}
          animate={!prefersReducedMotion()}
        />
      </div>
    </div>
  );
}

function CtaBand() {
  return (
    <section className="cta-band">
      <div className="cta-band-inner">
        <NetworkCanvas density={0.7} tone="white" />
        <div>
          <span className="eyebrow">Let&rsquo;s work together</span>
          <h2>Ready to make your devices launch-ready?</h2>
          <p>Tell us about your product and our test engineers will map out the right plan.</p>
        </div>
        <a className="site-button site-button-light" href="/contact-us/">
          Start a conversation <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
}

function SubscribeForm() {
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    setMessage("Thanks! (Validated locally only, nothing was sent.)");
    form.reset();
  }

  return (
    <form className="subscribe-form" onSubmit={handleSubmit}>
      <label className="visually-hidden" htmlFor="subscribe-email">Email address</label>
      <input id="subscribe-email" name="email" type="email" placeholder="Your email address" autoComplete="email" required />
      <button type="submit" aria-label="Subscribe">→</button>
      <p className="form-note" aria-live="polite">{message}</p>
    </form>
  );
}

function Footer() {
  const usefulLinks = USEFUL_LINKS.map((slug) => pageBySlug.get(slug)).filter(Boolean);
  return (
    <footer className="site-footer">
      <div className="footer-glow" aria-hidden="true" />
      <div className="footer-content">
        <div className="footer-about">
          <a className="footer-brand" href="/">
            <img className="brand-logo" src={LOGO} alt="Testoryx Etech" width="1499" height="332" loading="lazy" />
          </a>
          <p>
            We are a team of skilled Engineers and Business Strategists coming from diverse cultures
            and having unique perspectives.
          </p>
        </div>
        <div className="footer-col">
          <h3>Useful Links</h3>
          {usefulLinks.map((page) => (
            <PageLink key={page.id} page={page}>{page.slug === "home" ? "Home" : undefined}</PageLink>
          ))}
        </div>
        <div className="footer-col footer-services">
          <h3>Services</h3>
          <div>
            {servicePages.slice(0, 10).map((page) => <PageLink key={page.id} page={page} />)}
          </div>
        </div>
        <div className="footer-col footer-subscribe">
          <h3>Subscribe Now</h3>
          <p>Don&rsquo;t miss our future updates! Get Subscribed Today!</p>
          <SubscribeForm />
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Testoryx Etech. All rights reserved.</span>
      </div>
    </footer>
  );
}

function LoadingSkeleton() {
  return (
    <main className="content-loading" aria-live="polite" aria-busy="true">
      <span className="visually-hidden">Loading page content…</span>
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-line" />
      <div className="skeleton skeleton-line short" />
      <div className="skeleton-grid">
        <div className="skeleton skeleton-card" />
        <div className="skeleton skeleton-card" />
        <div className="skeleton skeleton-card" />
      </div>
    </main>
  );
}

// Same-origin links to known pages are handled client side so pages can
// animate in without a full reload.
function internalPageFor(anchor) {
  if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return null;
  const url = new URL(anchor.href, window.location.href);
  if (url.origin !== window.location.origin) return null;
  const page = pageBySlug.get(slugFromPath(url.pathname));
  return page ? { page, url } : null;
}

export default function App() {
  const [page, setPage] = useState(currentPage);
  const [pageContent, setPageContent] = useState(null);
  const [loadError, setLoadError] = useState("");
  const title = useMemo(() => decodeTitle(page.title), [page]);
  const isHome = page.slug === "home";
  const contentReady = pageContent?.slug === page.slug;
  const bannerImage = contentReady ? pageIntro(pageContent).image : "";

  useEffect(() => {
    function syncPage() {
      setPage(currentPage());
    }
    function onClick(event) {
      if (event.defaultPrevented || event.button !== 0 ||
          event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const match = internalPageFor(event.target.closest?.("a[href]"));
      if (!match) return;
      const samePage = match.url.pathname === window.location.pathname;
      if (samePage && match.url.hash) return;
      event.preventDefault();
      if (!samePage) {
        window.history.pushState({}, "", `${match.url.pathname}${match.url.search}${match.url.hash}`);
        setPage(match.page);
      }
      window.scrollTo({ top: 0, behavior: samePage ? "smooth" : "auto" });
    }
    window.addEventListener("popstate", syncPage);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("popstate", syncPage);
      document.removeEventListener("click", onClick);
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setPageContent(null);
    setLoadError("");
    fetch(`/content/${page.slug}.json`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Page content request failed (${response.status}).`);
        return response.json();
      })
      .then(setPageContent)
      .catch((error) => {
        if (error.name !== "AbortError") setLoadError(error.message);
      });
    return () => controller.abort();
  }, [page.slug]);

  useEffect(() => {
    document.title = `${title} | Testoryx Etech`;
  }, [title]);

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <ScrollChrome />
      <Header />
      {!isHome && <PageBanner key={page.slug} title={title} image={bannerImage} />}
      <div id="main-content">
        {loadError ? (
          <main className="content-error" role="alert">
            The page content could not be loaded. {loadError}
          </main>
        ) : contentReady ? (
          <ElementorRenderer key={page.slug} page={pageContent} />
        ) : (
          <LoadingSkeleton />
        )}
      </div>
      {page.slug !== "contact-us" && <CtaBand />}
      <Footer />
    </>
  );
}
