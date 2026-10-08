import React, { useEffect, useRef } from "react";
import DOMPurify from "dompurify";
import tables from "./data/tables.json";
import { prefersReducedMotion, useCountUp, useInView, useScrollReveal } from "./motion.js";
import HeroScene from "./HeroScene.jsx";
import NetworkCanvas from "./NetworkCanvas.jsx";
import { CredentialsStrip, GlobalCoverage, MissionVision, TechnologiesWeTest, WhyChooseUs } from "./Sections.jsx";

const UPLOAD_PATH = /https?:\/\/[^/]+\/wp-content\/uploads\//gi;
const SOURCE_HOST = /https?:\/\/(?:www\.)?testoryxetech\.com/gi;

function localMediaUrl(url) {
  return typeof url === "string" ? url.replace(UPLOAD_PATH, "/wp-content/uploads/") : "";
}

function localPageUrl(value) {
  if (!value || typeof value !== "string") return "/";
  if (value.startsWith("#") || /^(mailto:|tel:|https?:\/\/)/i.test(value)) {
    try {
      const url = new URL(value, "https://testoryxetech.com");
      if (url.hostname.endsWith("testoryxetech.com")) {
        return `${url.pathname}${url.search}${url.hash}`;
      }
    } catch {
      return value;
    }
    return value;
  }
  return value;
}

function safeHtml(value) {
  if (!value || typeof value !== "string") return "";
  const localized = value
    .replace(UPLOAD_PATH, "/wp-content/uploads/")
    .replace(SOURCE_HOST, "");
  return DOMPurify.sanitize(localized);
}

// Text typed as "• item" lines (in paragraphs or <br>-separated headings)
// becomes a real list so it can be styled as a checklist.
function bulletPoints(value) {
  if (typeof value !== "string" || (value.match(/•/g) || []).length < 2) return null;
  const container = document.createElement("div");
  container.innerHTML = safeHtml(value.replace(/<br\s*\/?>|<\/(?:p|h[1-6]|div|li)>/gi, " "));
  const [intro, ...items] = container.textContent.split("•");
  const clean = (text) => text.replace(/\s+/g, " ").trim();
  const list = items.map(clean).filter(Boolean);
  return list.length > 1 ? { intro: clean(intro), items: list } : null;
}

function RichText({ value, className, style }) {
  const html = safeHtml(value);
  return html ? (
    <div className={className} style={style} dangerouslySetInnerHTML={{ __html: html }} />
  ) : null;
}

function InquiryForm({ career = false }) {
  const [message, setMessage] = React.useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    setMessage("Form validated locally only. Nothing was sent or saved.");
    form.reset();
  }

  return (
    <form className="inquiry-form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor={career ? "career-name" : "contact-name"}>Your name</label>
        <input id={career ? "career-name" : "contact-name"} name="name" autoComplete="name" required />
      </div>
      <div className="form-field">
        <label htmlFor={career ? "career-email" : "contact-email"}>Email address</label>
        <input
          id={career ? "career-email" : "contact-email"}
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>
      {career && (
        <div className="form-field">
          <label htmlFor="career-role">Role you are interested in</label>
          <input id="career-role" name="role" required />
        </div>
      )}
      <div className="form-field">
        <label htmlFor={career ? "career-message" : "contact-message"}>
          {career ? "Tell us about yourself" : "How can we help?"}
        </label>
        <textarea
          id={career ? "career-message" : "contact-message"}
          name="message"
          rows="5"
          required
        />
      </div>
      <button className="site-button" type="submit">Validate form</button>
      <p className="form-note" aria-live="polite">{message}</p>
    </form>
  );
}

const HERO_STATS = [
  { value: "14+", label: "Years in chipset testing" },
  { value: "50+", label: "Countries served" },
  { value: "3", label: "Chipset tiers covered" },
];

const HERO_SLIDES = [
  { src: "/wp-content/uploads/2025/11/121.png", label: "Conformance testing" },
  { src: "/wp-content/uploads/2025/11/212.png", label: "Field trials" },
  { src: "/wp-content/uploads/2025/11/313.png", label: "BIS certification" },
];

function SiteHero() {
  const artRef = useRef(null);
  const [slide, setSlide] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  // Rotate the slides from the original site's hero slider.
  useEffect(() => {
    if (paused || prefersReducedMotion()) return undefined;
    const timer = setInterval(() => setSlide((current) => (current + 1) % HERO_SLIDES.length), 4500);
    return () => clearInterval(timer);
  }, [paused]);

  useEffect(() => {
    const art = artRef.current;
    if (!art || prefersReducedMotion()) return undefined;
    let frame = 0;
    const update = () => {
      frame = 0;
      art.style.setProperty("--parallax", `${Math.min(window.scrollY, 700) * 0.15}px`);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className="site-hero">
      <div className="aurora" aria-hidden="true"><i /><i /><i /></div>
      <div className="hero-grid" aria-hidden="true" />
      <NetworkCanvas />
      <div className="site-hero-copy">
        <span className="hero-eyebrow"><i aria-hidden="true" />Welcome to Testoryx Etech</span>
        <h1>
          <span className="hero-line">14 years of experience</span>
          <span className="hero-line">in <em>chipset testing</em></span>
        </h1>
        <p>
          We have a dedicated team specialized in chipset testing, successfully ensuring quality
          outcomes backed by outstanding customer reviews and setting a benchmark for many flagship,
          mid-level and entry-level chipsets.
        </p>
        <div className="hero-actions">
          <a className="site-button" href="/contact-us/">Contact Now <span aria-hidden="true">→</span></a>
          <a className="site-button site-button-ghost" href="/about-us/">About us</a>
        </div>
        <dl className="hero-stats">
          {HERO_STATS.map((stat) => (
            <div key={stat.label}>
              <dt>{stat.label}</dt>
              <dd>{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div
        className="site-hero-art"
        ref={artRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <span className="hero-glow" aria-hidden="true" />
        <HeroScene slides={HERO_SLIDES} active={slide} animate={!prefersReducedMotion()} />
        <div className="hero-dots">
          {HERO_SLIDES.map((item, index) => (
            <button
              key={item.src}
              type="button"
              className={index === slide ? "is-active" : ""}
              aria-label={`Show slide ${index + 1}: ${item.label}`}
              aria-current={index === slide}
              onClick={() => setSlide(index)}
            />
          ))}
        </div>
        <span className="hero-chip hero-chip-one" aria-hidden="true"><i className="chip-dot" />Human + automated testing</span>
        <span className="hero-chip hero-chip-two" aria-hidden="true">✓ Test passed · 5G · LTE · IoT</span>
      </div>
    </section>
  );
}

function embedUrl(url) {
  const youtube = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  if (youtube) return `https://www.youtube-nocookie.com/embed/${youtube[1]}?autoplay=1&rel=0`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1`;
  return url;
}

// Shows the poster with a play button and only loads the player on demand.
function VideoEmbed({ url, poster }) {
  const [playing, setPlaying] = React.useState(!poster);
  const src = url ? embedUrl(url) : "";
  if (!src) return null;
  return (
    <div className="site-video">
      {playing ? (
        <iframe
          src={poster ? src : src.replace(/[?&]autoplay=1/, "")}
          title="Embedded video"
          loading="lazy"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button type="button" className="video-poster" onClick={() => setPlaying(true)}>
          <img src={localMediaUrl(poster)} alt="" loading="lazy" />
          <span className="video-play" aria-hidden="true" />
          <span className="visually-hidden">Play video</span>
        </button>
      )}
    </div>
  );
}

function AnimatedCounter({ end, prefix, suffix, title }) {
  const target = Number(end) || 0;
  const [ref, inView] = useInView();
  const value = useCountUp(target, inView);
  return (
    <div className="site-counter" ref={ref}>
      <strong>{prefix || ""}{Math.round(value).toLocaleString()}{suffix || ""}</strong>
      <span>{title}</span>
    </div>
  );
}

function imagesIn(value, result = []) {
  if (Array.isArray(value)) {
    value.forEach((item) => imagesIn(item, result));
  } else if (value && typeof value === "object") {
    if (typeof value.url === "string" && value.url.includes("/wp-content/uploads/")) {
      result.push(value);
    }
    Object.values(value).forEach((item) => imagesIn(item, result));
  }
  return result;
}

function ElementorImage({ image, alt = "" }) {
  if (!image?.url) return null;
  return (
    <div className="elementor-image">
      <img src={localMediaUrl(image.url)} alt={image.alt || alt} loading="lazy" />
    </div>
  );
}

function ButtonLink({ text, link, className = "elementor-button" }) {
  const href = localPageUrl(link?.url || link || "/contact-us/");
  const external = link?.is_external === "on";
  return (
    <a
      className={className}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
    >
      <span className="elementor-button-content-wrapper">
        <span className="elementor-button-text">{text || "Learn more"}</span>
      </span>
    </a>
  );
}

function TablePress({ tableId }) {
  const table = tables[String(tableId)];
  if (!table?.data?.length) return null;
  const [head, ...body] = table.data;
  return (
    <div className="table-scroll">
      <table className={`tablepress tablepress-id-${tableId}`}>
        <thead><tr>{head.map((cell, index) => <th key={index}>{cell}</th>)}</tr></thead>
        <tbody>
          {body.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>
                  <RichText value={String(cell).replace(/\n/g, "<br />")} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function WidgetContent({ node, pageSlug }) {
  const settings = node.settings || {};
  const image = settings.image;
  const heading = settings.title || settings.ekit_heading_title || settings.title_text || "";
  const description = settings.editor || settings.description_text || settings.ekit_heading_extra_title || "";

  switch (node.widgetType) {
    case "heading":
      return (
        <h2
          className={`elementor-heading-title elementor-size-${settings.size || "default"}`}
          style={colorStyle(settings.title_color)}
        >
          <span dangerouslySetInnerHTML={{ __html: safeHtml(settings.title) }} />
        </h2>
      );
    case "elementskit-heading":
      return (
        <div className="elementskit-heading">
          {settings.ekit_heading_sub_title && <span>{settings.ekit_heading_sub_title}</span>}
          <h2><RichText value={settings.ekit_heading_title} /></h2>
          <RichText value={settings.ekit_heading_extra_title} />
        </div>
      );
    case "text-editor": {
      const points = bulletPoints(settings.editor);
      if (points) {
        return (
          <div className="elementor-text-editor elementor-clearfix" style={colorStyle(settings.text_color)}>
            {points.intro && <p>{points.intro}</p>}
            <ul className="site-points">
              {points.items.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
          </div>
        );
      }
      return (
        <RichText
          className="elementor-text-editor elementor-clearfix"
          style={colorStyle(settings.text_color)}
          value={settings.editor}
        />
      );
    }
    case "image":
      return <ElementorImage image={image} />;
    case "image-carousel": {
      const images = imagesIn(settings);
      return (
        <div className="site-image-carousel">
          {images.map((item, index) => <ElementorImage key={`${item.url}-${index}`} image={item} />)}
        </div>
      );
    }
    case "button":
      return (
        <div className="elementor-button-wrapper">
          <ButtonLink text={settings.text} link={settings.link} />
        </div>
      );
    case "wpr-button":
      return (
        <div className="wpr-button-wrap">
          <ButtonLink
            text={settings.button_text}
            link={settings.button_link}
            className="wpr-button"
          />
        </div>
      );
    case "icon-box":
      return (
        <div className="elementor-icon-box-wrapper">
          <span className="elementor-icon-box-icon" aria-hidden="true">✦</span>
          <div className="elementor-icon-box-content">
            <h3 className="elementor-icon-box-title">{settings.title_text}</h3>
            <RichText className="elementor-icon-box-description" value={settings.description_text} />
          </div>
        </div>
      );
    case "wpr-flip-box":
      return (
        <div className="site-flip-card" tabIndex={0}>
          <div className="flip-card-inner">
            <div className={`flip-card-face flip-card-front${settings.front_image?.url ? " has-image" : ""}`}>
              {settings.front_image?.url && (
                <img className="flip-card-image" src={localMediaUrl(settings.front_image.url)} alt="" loading="lazy" />
              )}
              <span className="flip-card-icon" aria-hidden="true">✦</span>
              <h3>{settings.front_title}</h3>
              <RichText value={settings.front_description} />
              <span className="flip-card-hint" aria-hidden="true">Hover to explore ↻</span>
            </div>
            <div className="flip-card-face flip-card-back">
              <h3>{settings.back_title || settings.front_title}</h3>
              <RichText value={settings.back_description || settings.front_description} />
              {settings.back_btn_text && !/^backend button$/i.test(settings.back_btn_text.trim()) && (
                <span className="flip-card-action">{settings.back_btn_text}</span>
              )}
            </div>
          </div>
        </div>
      );
    case "counter":
      return (
        <AnimatedCounter
          end={settings.ending_number ?? settings.starting_number}
          prefix={settings.prefix}
          suffix={settings.suffix}
          title={settings.title}
        />
      );
    case "spacer":
      return <div className="elementor-spacer"><div className="elementor-spacer-inner" /></div>;
    case "divider":
      return <div className="elementor-divider"><span className="elementor-divider-separator" /></div>;
    case "elementskit-dual-button":
      return (
        <div className="site-dual-buttons">
          {["one", "two"]
            .filter((which) => settings[`ekit_button_${which}_text`]?.trim())
            .map((which) => (
              <ButtonLink
                key={which}
                text={settings[`ekit_button_${which}_text`]}
                link={settings[`ekit_button_${which}_link`]}
                className="site-button"
              />
            ))}
        </div>
      );
    case "elementskit-tablepress":
      return <TablePress tableId={settings.ekit_tablepress_table_id} />;
    case "tablepress-table":
      return <TablePress tableId={settings.table_id} />;
    case "metform":
      return <InquiryForm career={pageSlug === "career"} />;
    case "shortcode":
      if (/smartslider3/i.test(settings.shortcode || "")) return <SiteHero />;
      if (/wpforms|metform/i.test(settings.shortcode || "")) return <InquiryForm career={pageSlug === "career"} />;
      return null;
    case "icon-list":
      return (
        <ul className="site-points">
          {(settings.icon_list || []).filter((item) => item.text?.trim()).map((item, index) => (
            <li key={item._id || index}>{item.text}</li>
          ))}
        </ul>
      );
    case "elementskit-client-logo": {
      const logos = imagesIn(settings);
      return (
        <div className="site-client-logos">
          <div className="marquee-track">
            {[...logos, ...logos].map((item, index) => (
              <div className="marquee-item" key={`${item.url}-${index}`} aria-hidden={index >= logos.length || undefined}>
                <ElementorImage image={item} />
              </div>
            ))}
          </div>
        </div>
      );
    }
    case "wpr-team-member":
      return (
        <article className="site-profile-card">
          <ElementorImage image={image || imagesIn(settings)[0]} />
          <h3>{settings.member_name || settings.name || settings.title || heading}</h3>
          <p>{settings.member_job || settings.job || settings.position || ""}</p>
          <RichText value={settings.member_description || settings.description || description} />
        </article>
      );
    case "wpr-testimonial": {
      const items = settings.testimonial_items?.length
        ? settings.testimonial_items
        : [{ testimonial_content: settings.testimonial_content || description, testimonial_author: settings.author_name }];
      const filled = items.filter((item) => item.testimonial_content?.trim());
      if (!filled.length) return null;
      return (
        <div className="site-testimonials">
          {filled.map((item, index) => (
            <blockquote className="site-testimonial" key={item._id || index}>
              <RichText value={item.testimonial_content} />
              <footer>
                {item.testimonial_image?.url && (
                  <img src={localMediaUrl(item.testimonial_image.url)} alt="" loading="lazy" />
                )}
                <span>
                  <cite>{item.testimonial_author}</cite>
                  {item.testimonial_job && <small>{item.testimonial_job}</small>}
                </span>
              </footer>
            </blockquote>
          ))}
        </div>
      );
    }
    case "video":
      return (
        <VideoEmbed
          url={settings.youtube_url || settings.vimeo_url || ""}
          poster={settings.show_image_overlay === "yes" ? settings.image_overlay?.url : ""}
        />
      );
    case "wpr-dual-color-heading":
      return (
        <div className="site-dual-heading" style={{ textAlign: settings.text_align || "center" }}>
          <h2 className="elementor-heading-title">
            {settings.primary_heading}
            {settings.secondary_heading && <> <em>{settings.secondary_heading}</em></>}
          </h2>
          {settings.show_description === "yes" && <RichText value={settings.description} />}
        </div>
      );
    case "wpr-charts":
      return (
        <div className="site-chart">
          <h3>{settings.chart_title || "Testing results"}</h3>
          <div className="chart-bars" aria-hidden="true"><i /><i /><i /><i /></div>
          <p>{settings.charts_labels_data || ""}</p>
        </div>
      );
    default: {
      const text = Object.entries(settings)
        .filter(([key, value]) => /title|description|text|content|name/i.test(key) && typeof value === "string")
        .map(([, value]) => value)
        .find((value) => value.trim() && !value.startsWith("#"));
      return text ? <RichText value={text} /> : null;
    }
  }
}

function ElementorNode({ node, pageSlug, depth = 0 }) {
  if (!node) return null;
  const settings = node.settings || {};
  const idClass = `elementor-element elementor-element-${node.id || "unknown"}`;

  if (node.elType === "widget") {
    const widgetClass = `elementor-widget elementor-widget-${node.widgetType || "unknown"}`;
    return (
      <div className={`${idClass} ${widgetClass}`} data-id={node.id} data-element_type="widget">
        <div className="elementor-widget-container">
          <WidgetContent node={node} pageSlug={pageSlug} />
        </div>
      </div>
    );
  }

  if (node.elType === "section") {
    return (
      <section className={`${idClass} elementor-section elementor-top-section elementor-section-boxed`} data-id={node.id} data-element_type="section">
        <div className="elementor-container elementor-column-gap-default">
          {(node.elements || []).map((child) => <ElementorNode key={child.id} node={child} pageSlug={pageSlug} depth={depth + 1} />)}
        </div>
      </section>
    );
  }

  if (node.elType === "column") {
    const width = Number(settings._column_size);
    return (
      <div
        className={`${idClass} elementor-column elementor-col-${Number.isFinite(width) ? width : 100}`}
        data-id={node.id}
        data-element_type="column"
        style={Number.isFinite(width) ? { width: `${width}%` } : undefined}
      >
        <div className="elementor-widget-wrap elementor-element-populated">
          {(node.elements || []).map((child) => <ElementorNode key={child.id} node={child} pageSlug={pageSlug} depth={depth + 1} />)}
        </div>
      </div>
    );
  }

  if (node.elType === "container") {
    const isFull = settings.content_width === "full";
    const layout = settings.container_type === "grid" ? "e-grid" : "e-flex";
    const hasImage = Boolean(settings.background_image?.url);
    const hasBand = settings.background_background === "gradient" ||
      (settings.background_background === "classic" && isDarkColor(settings.background_color));
    const isSurface = depth > 0 && !hasImage &&
      settings.background_background === "classic" && /^#f{6}$/i.test(settings.background_color || "");
    const children = (node.elements || []).map((child) => <ElementorNode key={child.id} node={child} pageSlug={pageSlug} depth={depth + 1} />);
    return (
      <div
        className={`${idClass} e-con ${layout} ${isFull ? "e-con-full" : "e-con-boxed"}${hasBand ? " has-band" : ""}${isSurface ? " is-surface" : ""}${hasImage ? " has-bg-image" : ""}`}
        data-id={node.id}
        data-element_type="container"
      >
        {isFull ? children : <div className="e-con-inner">{children}</div>}
      </div>
    );
  }

  return (
    <div className={idClass} data-id={node.id}>
      {(node.elements || []).map((child) => <ElementorNode key={child.id} node={child} pageSlug={pageSlug} depth={depth + 1} />)}
    </div>
  );
}

// Coloured bands (dark or saturated backgrounds) get extra breathing room.
function isDarkColor(color) {
  const hex = typeof color === "string" ? color.replace("#", "") : "";
  if (!/^[0-9a-f]{6}$/i.test(hex)) return false;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return 0.299 * r + 0.587 * g + 0.114 * b < 160;
}

function containsInquiryForm(nodes) {
  return (nodes || []).some((node) => {
    const shortcode = node.settings?.shortcode || "";
    return node.widgetType === "metform" ||
      (node.widgetType === "shortcode" && /wpforms|metform/i.test(shortcode)) ||
      containsInquiryForm(node.elements);
  });
}

// Maps the original WordPress palette and fonts onto the site theme tokens.
const THEME_REPLACEMENTS = [
  [/box-shadow:0px 0px 10px 0px rgba\(0,0,0,0\.5\)/gi, "box-shadow:var(--shadow)"],
  [/box-shadow:0px 0px 10px 0px #3D8E4F/gi, "box-shadow:var(--shadow),var(--shadow-glow)"],
  // Section backgrounds use the deeper logo green so white text stays readable.
  [/background-color:#(?:01723A|066A42)\b/gi, "background-color:var(--c-primary-600)"],
  [/#(?:3D8E4F|01723A|066A42|605BE5)\b/gi, "var(--c-primary)"],
  [/#22492A\b/gi, "var(--c-primary-deep)"],
  [/#(?:015AF2|4482FF)\b/gi, "var(--c-accent)"],
  [/#(?:000000|00092A|0F2A47|00090D|000320)\b/gi, "var(--c-ink)"],
  [/#(?:F0F0F0|E8E8E8|EBEBEB)\b/gi, "var(--c-surface-2)"],
  [/#(?:F9F9F9|F7F7F7|F5F9FC|EEF8FF)\b/gi, "var(--c-bg)"],
  [/#FF7F46\b/gi, "var(--c-warm)"],
  [/#FFDECF\b/gi, "var(--c-warm-soft)"],
  [/#(?:666666|5D5D5D|545454|6A6A6A|777777|3A3A3A|333333)\b/gi, "var(--c-text)"],
  [/#(?:9C9C9C|77899C|6C7495)\b/gi, "var(--c-muted)"],
  [/font-family:"(?:Kanit|Montserrat)",\s*Sans-serif/gi, "font-family:var(--font-display)"],
  [/font-family:"(?:Roboto|Poppins|Lato|Muli)",\s*Sans-serif/gi, "font-family:var(--font-body)"],
];

function themeCss(css) {
  return THEME_REPLACEMENTS.reduce((result, [pattern, value]) => result.replace(pattern, value), css);
}

function colorStyle(color) {
  return typeof color === "string" && color ? { color: themeCss(color) } : undefined;
}

function usePageStyles(pageId) {
  useEffect(() => {
    const controller = new AbortController();
    const style = document.createElement("style");
    style.dataset.pageStyles = pageId;
    document.head.appendChild(style);
    fetch(`/wp-content/uploads/elementor/css/post-${pageId}.css`, { signal: controller.signal })
      .then((response) => (response.ok ? response.text() : ""))
      .then((css) => { style.textContent = themeCss(css); })
      .catch(() => {});
    return () => {
      controller.abort();
      style.remove();
    };
  }, [pageId]);
}

const SPOTLIGHT_SELECTOR = ".elementor-icon-box-wrapper, .site-profile-card, .site-testimonial, .site-counter";

// Cards get a soft light that follows the pointer.
function useSpotlight(rootRef) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    function onPointerMove(event) {
      const card = event.target.closest?.(SPOTLIGHT_SELECTOR);
      if (!card || !root.contains(card)) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      card.style.setProperty("--my", `${event.clientY - rect.top}px`);
    }
    root.addEventListener("pointermove", onPointerMove);
    return () => root.removeEventListener("pointermove", onPointerMove);
  }, [rootRef]);
}

// Hand-built sections that replace template filler (or are inserted after a
// section), keyed by page slug and Elementor section id.
const PAGE_SECTIONS = {
  home: {
    after: { "4e82319": CredentialsStrip },
    replace: { "4135b5d3": TechnologiesWeTest, "37ee3d5c": WhyChooseUs },
    remove: ["770d0f33", "4a42a99b"],
  },
  "about-us": {
    replace: { "7b6f3ff1": MissionVision, "2719bd1e": GlobalCoverage },
    remove: ["4682f8d", "5d2e153", "575d08d2"],
  },
};

function renderPageNodes(nodes, pageSlug) {
  const config = PAGE_SECTIONS[pageSlug] || {};
  return nodes.flatMap((node) => {
    if (config.remove?.includes(node.id)) return [];
    const Replacement = config.replace?.[node.id];
    const After = config.after?.[node.id];
    const rendered = Replacement
      ? <Replacement key={node.id} />
      : <ElementorNode key={node.id} node={node} pageSlug={pageSlug} />;
    return After ? [rendered, <After key={`${node.id}-after`} />] : [rendered];
  });
}

// Most inner pages open with a section that only repeats the page title over a
// photo. The site banner replaces it and borrows its background image.
export function pageIntro(page) {
  const first = page?.elementor?.[0];
  if (!first || page.slug === "home") return { image: "", replaced: false };
  const image = localMediaUrl(first.settings?.background_image?.url || "");
  return { image, replaced: !containsInquiryForm([first]) };
}

export default function ElementorRenderer({ page }) {
  const rootRef = useRef(null);
  const intro = pageIntro(page);
  const nodes = (page.elementor || []).slice(intro.replaced ? 1 : 0);
  usePageStyles(page.id);
  useScrollReveal(rootRef, [page.id]);
  useSpotlight(rootRef);

  return (
    <main
      ref={rootRef}
      className={`page-canvas page-enter elementor elementor-${page.id}`}
      data-elementor-id={page.id}
    >
      {renderPageNodes(nodes, page.slug)}
      {page.slug === "career" && !containsInquiryForm(page.elementor) && (
        <section className="career-form-section"><InquiryForm career /></section>
      )}
    </main>
  );
}
