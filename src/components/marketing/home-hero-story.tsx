"use client";

import {ArrowUpRight} from "lucide-react";
import Link from "next/link";
import {useEffect, useRef, useState} from "react";
import type {PublicPath} from "@/content";
import {HomeHeroVisual} from "./home-hero-visual";
import styles from "./home-hero-story.module.css";

export type HomeHeroVariant = "ai" | "compute" | "xinchang" | "link" | "energy";

export interface HomeHeroSlideContent {
  index: "01" | "02" | "03" | "04" | "05";
  label: "AI" | "COMPUTE" | "XINCHUANG" | "LINK" | "ENERGY";
  title: string;
  body: string;
  href: PublicPath;
  cta: string;
  variant: HomeHeroVariant;
}

export function HomeHeroStory({slides}: {slides: readonly HomeHeroSlideContent[]}): React.ReactElement {
  const [enhanced, setEnhanced] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(() => {
      setEnhanced(true);
      const viewportCenter = window.innerHeight / 2;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;
      stepRefs.current.forEach((step, index) => {
        if (!step) return;
        const rect = step.getBoundingClientRect();
        const distance = Math.abs((rect.top + rect.bottom) / 2 - viewportCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });
      setActiveIndex(closestIndex);
    }, {threshold: [0, 0.25, 0.5, 0.75, 1]});

    stepRefs.current.forEach((step) => { if (step) observer.observe(step); });
    return () => observer.disconnect();
  }, [slides.length]);

  function goTo(index: number) {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    stepRefs.current[index]?.scrollIntoView({block: "center", behavior: reduced ? "auto" : "smooth"});
  }

  return (
    <section aria-label="业务领域" className={styles.story} data-enhanced={enhanced} data-testid="home-hero-story">
      {enhanced && <h1 className={styles.screenReaderOnly}>{slides[0]?.title}</h1>}
      <div className={styles.stage}>
        <div className={styles.slides}>
          {slides.map((slide, index) => (
            <article
              aria-hidden={enhanced && index !== activeIndex ? true : undefined}
              className={styles.slide}
              data-active={index === activeIndex}
              data-domain={slide.variant}
              data-label={slide.label}
              data-testid="home-hero-slide"
              inert={enhanced && index !== activeIndex}
              key={slide.index}
            >
              <div className={`${styles.layout} site-container`}>
                <div className={styles.copy}>
                  <p className={styles.eyebrow}><span>{slide.index} / 05</span><span>{slide.label}</span></p>
                  {index === 0 && !enhanced
                    ? <h1 className={styles.title}>{slide.title}</h1>
                    : <h2 className={styles.title}>{slide.title}</h2>}
                  <p className={styles.body}>{slide.body}</p>
                  <Link className={styles.cta} href={slide.href}>{slide.cta}<ArrowUpRight aria-hidden="true" /></Link>
                </div>
                <HomeHeroVisual active={index === activeIndex} variant={slide.variant} />
              </div>
            </article>
          ))}
        </div>
        <nav aria-label="业务领域进度" className={styles.progress}>
          <ol className={styles.progressList}>
            {slides.map((slide, index) => (
              <li key={slide.index}>
                <button
                  aria-current={index === activeIndex ? "step" : undefined}
                  className={styles.progressButton}
                  onClick={() => goTo(index)}
                  type="button"
                >
                  <span>{slide.index}</span><span>{slide.label}</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </div>
      <div aria-hidden="true" className={styles.steps}>
        {slides.map((slide, index) => (
          <div
            className={styles.step}
            data-home-hero-step
            key={slide.index}
            ref={(node) => { stepRefs.current[index] = node; }}
          />
        ))}
      </div>
    </section>
  );
}
