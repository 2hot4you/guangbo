"use client";

/* eslint-disable @next/next/no-img-element -- LogoLoop accepts arbitrary external SVG sources and keeps native image sizing. */

import {memo, useEffect, useRef, useState} from "react";
import type {CSSProperties, Key, ReactElement, ReactNode} from "react";
import styles from "./logo-loop.module.css";

export interface LogoLoopImageItem {
  src: string;
  alt: string;
  title: string;
  width?: number;
  height?: number;
}

export interface LogoLoopNodeItem {
  node: ReactNode;
  title: string;
  ariaLabel?: string;
}

export type LogoLoopItem = LogoLoopImageItem | LogoLoopNodeItem;

export interface LogoLoopProps {
  logos: readonly LogoLoopItem[];
  speed?: number;
  direction?: "left" | "right" | "up" | "down";
  width?: number | string;
  logoHeight?: number;
  gap?: number;
  hoverSpeed?: number;
  fadeOut?: boolean;
  fadeOutColor?: string;
  scaleOnHover?: boolean;
  renderItem?: (item: LogoLoopItem, key: Key) => ReactNode;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
}

type Direction = NonNullable<LogoLoopProps["direction"]>;

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reduced;
}

function useTrackMeasurements(
  rootRef: React.RefObject<HTMLDivElement | null>,
  listRef: React.RefObject<HTMLUListElement | null>,
  direction: Direction,
) {
  const [measurements, setMeasurements] = useState({sequence: 0, viewport: 0});

  useEffect(() => {
    const root = rootRef.current;
    const list = listRef.current;
    if (!root || !list) return;

    const vertical = direction === "up" || direction === "down";
    const update = () => {
      const sequence = vertical ? list.getBoundingClientRect().height : list.getBoundingClientRect().width;
      const viewport = vertical ? root.getBoundingClientRect().height : root.getBoundingClientRect().width;
      setMeasurements((previous) => previous.sequence === sequence && previous.viewport === viewport
        ? previous
        : {sequence, viewport});
    };

    update();
    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(update);
      observer.observe(root);
      observer.observe(list);
      return () => observer.disconnect();
    }

    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [rootRef, listRef, direction]);

  return measurements;
}

function useAnimationLoop(
  trackRef: React.RefObject<HTMLDivElement | null>,
  sequence: number,
  direction: Direction,
  speed: number,
  hoverSpeed: number,
  isSlowed: boolean,
  disabled: boolean,
) {
  const offsetRef = useRef(0);
  const currentSpeedRef = useRef(speed);
  const timestampRef = useRef<number | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    const prefersReducedMotion = typeof window.matchMedia === "function"
      && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!track || disabled || prefersReducedMotion || sequence <= 0
      || typeof requestAnimationFrame !== "function") {
      timestampRef.current = null;
      return;
    }

    let frame = 0;
    const vertical = direction === "up" || direction === "down";
    const reverse = direction === "right" || direction === "down";
    if (reverse && offsetRef.current === 0) offsetRef.current = -sequence;

    const tick = (timestamp: number) => {
      const previous = timestampRef.current;
      timestampRef.current = timestamp;
      if (previous !== null) {
        const delta = Math.min((timestamp - previous) / 1000, 0.1);
        const targetSpeed = Math.max(0, isSlowed ? hoverSpeed : speed);
        currentSpeedRef.current += (targetSpeed - currentSpeedRef.current) * (1 - Math.exp(-8 * delta));
        offsetRef.current += (reverse ? 1 : -1) * currentSpeedRef.current * delta;
        offsetRef.current = -(((-offsetRef.current % sequence) + sequence) % sequence);
        track.style.transform = vertical
          ? `translate3d(0, ${offsetRef.current}px, 0)`
          : `translate3d(${offsetRef.current}px, 0, 0)`;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      timestampRef.current = null;
    };
  }, [trackRef, sequence, direction, speed, hoverSpeed, isSlowed, disabled]);
}

function LogoLoopComponent({
  logos,
  speed = 120,
  direction = "left",
  width,
  logoHeight = 28,
  gap = 32,
  hoverSpeed = 0,
  fadeOut = false,
  fadeOutColor,
  scaleOnHover = false,
  renderItem,
  ariaLabel = "Logo loop",
  className,
  style,
}: LogoLoopProps): ReactElement {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const reducedMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const isSlowed = hovered || focused;
  const {sequence, viewport} = useTrackMeasurements(rootRef, listRef, direction);
  const copies = sequence > 0 && viewport > 0 ? Math.max(2, Math.ceil(viewport / sequence) + 1) : 2;

  useAnimationLoop(trackRef, sequence, direction, speed, hoverSpeed, isSlowed, reducedMotion || logos.length === 0);

  const vertical = direction === "up" || direction === "down";
  const rootClassName = [
    styles.root,
    vertical ? styles.vertical : styles.horizontal,
    fadeOut && styles.fadeOut,
    scaleOnHover && styles.scaleOnHover,
    reducedMotion && styles.reducedMotion,
    className,
  ].filter(Boolean).join(" ");
  const containerStyle = {
    ...style,
    width: width ?? style?.width ?? "100%",
    "--logoloop-gap": `${gap}px`,
    "--logoloop-logo-height": `${logoHeight}px`,
    "--logoloop-fade-color": fadeOutColor ?? "#fff",
  } as CSSProperties;

  const renderList = (copy: number) => (
    <div key={copy} className={styles.copy} aria-hidden={copy === 0 ? undefined : true}>
      <ul ref={copy === 0 ? listRef : undefined} className={styles.list}>
        {logos.map((item, index) => {
          const key: Key = index;
          return (
            <li key={key} className={styles.item} title={item.title}>
              <div className={styles.content} inert={copy === 0 ? undefined : true}>
                {renderItem ? renderItem(item, key) : "node" in item
                  ? <span aria-label={item.ariaLabel}>{item.node}</span>
                  : <img src={item.src} alt={item.alt} width={item.width} height={item.height} loading="lazy" />}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <div
      ref={rootRef}
      aria-label={ariaLabel}
      className={rootClassName}
      data-direction={direction}
      data-hover-speed={hoverSpeed}
      data-motion-state={reducedMotion ? "reduced" : isSlowed ? "slowed" : "running"}
      data-speed={speed}
      role="region"
      style={containerStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
      }}
    >
      <div ref={trackRef} className={styles.track}>
        {Array.from({length: copies}, (_, copy) => renderList(copy))}
      </div>
    </div>
  );
}

export const LogoLoop = memo(LogoLoopComponent);
