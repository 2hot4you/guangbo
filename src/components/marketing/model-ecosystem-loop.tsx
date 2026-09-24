"use client";

/* eslint-disable @next/next/no-img-element -- Catalog marks use LobeHub's external SVG CDN with an onError fallback. */

import {getLobeIconCDN} from "@lobehub/icons/es/features/getLobeIconCDN";
import {useState} from "react";
import type {LogoLoopItem} from "@/components/ui/logo-loop";
import {LogoLoop} from "@/components/ui/logo-loop";
import type {LobeCatalogItem} from "@/content/lobe-icon-catalog";
import {lobeModelCatalog, lobeProviderCatalog} from "@/content/lobe-icon-catalog";
import styles from "./model-ecosystem-loop.module.css";

function CatalogMark({item}: {item: LobeCatalogItem}) {
  const [imageStage, setImageStage] = useState<"color" | "mono" | "name">("color");
  const src = imageStage === "name" ? undefined : getLobeIconCDN(item.id, {
    cdn: "unpkg",
    format: "svg",
    type: imageStage,
  });

  return (
    <span className={styles.mark} title={item.name}>
      {src && (
        <img
          alt=""
          decoding="async"
          height={120}
          loading="lazy"
          onError={() => setImageStage((stage) => stage === "color" ? "mono" : "name")}
          src={src}
          width={120}
        />
      )}
      <span className={styles.name}>{item.name}</span>
    </span>
  );
}

function toLogoItems(catalog: readonly LobeCatalogItem[]): LogoLoopItem[] {
  return catalog.map((item) => ({node: <CatalogMark item={item} />, title: item.name}));
}

const providerLogos = toLogoItems(lobeProviderCatalog);
const modelLogos = toLogoItems(lobeModelCatalog);

export function ModelEcosystemLoop(): React.ReactElement {
  return (
    <section aria-label="AI Model Ecosystem" className={styles.ecosystem}>
      <div className={styles.lane}>
        <p className={styles.label}>PROVIDERS / {lobeProviderCatalog.length}</p>
        <LogoLoop
          ariaLabel="AI Providers"
          className={styles.loop}
          direction="left"
          fadeOut
          fadeOutColor="#080808"
          gap={80}
          hoverSpeed={80}
          logoHeight={120}
          logos={providerLogos}
          scaleOnHover
          speed={160}
        />
      </div>
      <div className={styles.lane}>
        <p className={styles.label}>MODELS / {lobeModelCatalog.length}</p>
        <LogoLoop
          ariaLabel="AI Models"
          className={styles.loop}
          direction="right"
          fadeOut
          fadeOutColor="#080808"
          gap={80}
          hoverSpeed={80}
          logoHeight={120}
          logos={modelLogos}
          scaleOnHover
          speed={160}
        />
      </div>
    </section>
  );
}
