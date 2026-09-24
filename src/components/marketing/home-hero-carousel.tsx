"use client";

import {ArrowLeft, ArrowRight, ArrowUpRight} from "lucide-react";
import Link from "next/link";
import {useEffect, useRef, useState} from "react";
import type {KeyboardEvent, PointerEvent} from "react";
import type {HomeHeroSlideContent} from "./home-hero-types";
import {HomeHeroVisual} from "./home-hero-visual";
import styles from "./home-hero-carousel.module.css";

interface HomeHeroCarouselProps {
  slides: readonly HomeHeroSlideContent[];
  autoplayMs?: number;
}

export function HomeHeroCarousel({slides, autoplayMs = 6000}: HomeHeroCarouselProps): React.ReactElement {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const pointerStart = useRef<{x: number; y: number; id: number} | null>(null);
  const slide = slides[activeIndex] ?? slides[0];
  const paused = hovered || focusWithin;

  useEffect(() => {
    const updateVisibility = () => setPageVisible(!document.hidden);
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  useEffect(() => {
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!media) return;
    const updateMotion = () => setReducedMotion(media.matches);
    updateMotion();
    media.addEventListener?.("change", updateMotion);
    return () => media.removeEventListener?.("change", updateMotion);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion || !pageVisible || document.hidden || slides.length < 2) return;
    const timer = window.setTimeout(() => setActiveIndex((index) => (index + 1) % slides.length), autoplayMs);
    return () => window.clearTimeout(timer);
  }, [activeIndex, autoplayMs, paused, reducedMotion, slides.length, pageVisible]);

  function go(delta: number): void {
    if (slides.length < 2) return;
    setActiveIndex((index) => (index + delta + slides.length) % slides.length);
  }

  function onKeyDown(event: KeyboardEvent<HTMLElement>): void {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      go(1);
    }
  }

  function onPointerDown(event: PointerEvent<HTMLElement>): void {
    pointerStart.current = {x: event.clientX, y: event.clientY, id: event.pointerId};
  }

  function onPointerUp(event: PointerEvent<HTMLElement>): void {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start || start.id !== event.pointerId) return;
    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    if (Math.abs(deltaX) >= 48 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
      go(deltaX < 0 ? 1 : -1);
    }
  }

  return (
    <section
      aria-label="光波互联业务轮播"
      aria-roledescription="carousel"
      className={styles.carousel}
      data-domain={slide?.variant}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocusWithin(false);
      }}
      onFocus={() => setFocusWithin(true)}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onPointerCancel={() => { pointerStart.current = null; }}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      role="region"
      tabIndex={0}
    >
      {slide && (
        <div className={`${styles.layout} site-container`}>
          <div className={styles.copy}>
            <p className={styles.eyebrow}><span>{slide.index} / 05</span><span>{slide.label}</span></p>
            <h1 className={styles.title}>{slide.title}</h1>
            <p className={styles.body}>{slide.body}</p>
            <Link className={styles.cta} href={slide.href}>{slide.cta}<ArrowUpRight aria-hidden="true" /></Link>
          </div>
          <HomeHeroVisual active variant={slide.variant} />
        </div>
      )}
      <div className={`${styles.controls} site-container`}>
        <button aria-label="上一项" className={styles.arrow} onClick={() => go(-1)} type="button"><ArrowLeft aria-hidden="true" /></button>
        <nav aria-label="业务领域进度" className={styles.progress}>
          {slides.map((item, index) => (
            <button
              aria-current={index === activeIndex ? "true" : undefined}
              aria-label={`转到 ${item.label} 业务`}
              className={styles.dot}
              key={item.index}
              onClick={() => setActiveIndex(index)}
              type="button"
            />
          ))}
        </nav>
        <button aria-label="下一项" className={styles.arrow} onClick={() => go(1)} type="button"><ArrowRight aria-hidden="true" /></button>
      </div>
    </section>
  );
}
