import styles from "./home-hero-story.module.css";
import type {HomeHeroVariant} from "./home-hero-story";

const visualNodes = {
  ai: ["LLM", "IMAGE", "VIDEO"],
  compute: ["COMPUTE", "STORAGE", "NETWORK", "POWER", "COOLING"],
  xinchang: ["硬件", "系统", "应用", "数据"],
  link: ["站点", "接入", "传输", "目标"],
  energy: ["负荷", "绿电", "储能", "管理"],
} as const;

const visualLabels: Record<HomeHeroVariant, string> = {
  ai: "AI",
  compute: "COMPUTE",
  xinchang: "XINCHUANG",
  link: "LINK",
  energy: "ENERGY",
};

export function HomeHeroVisual({variant, active}: {variant: HomeHeroVariant; active: boolean}): React.ReactElement {
  return (
    <figure aria-label={`${visualLabels[variant]}业务动态图形`} className={`${styles.visual} ${styles[variant]}`} data-active={active}>
      <span
        aria-hidden="true"
        className={styles.visualRing}
        data-motion-kind={variant === "ai" ? "ai-orbit" : variant === "compute" ? "compute-track-forward" : undefined}
        data-motion-layer={variant === "ai" || variant === "compute" ? "" : undefined}
      />
      <span
        aria-hidden="true"
        className={styles.visualRingInner}
        data-motion-kind={variant === "compute" ? "compute-track-reverse" : variant === "xinchang" ? "xinchang-system" : undefined}
        data-motion-layer={variant === "compute" || variant === "xinchang" ? "" : undefined}
      />
      {(variant === "ai" || variant === "energy") && (
        <span
          aria-hidden="true"
          className={styles.visualCore}
          data-motion-kind={variant === "ai" ? "ai-core" : "energy-core"}
          data-motion-layer
        />
      )}
      {variant === "link" && <span aria-hidden="true" className={styles.visualSignal} data-motion-kind="link-signal" data-motion-layer />}
      {variant === "energy" && <span aria-hidden="true" className={styles.visualFlow} data-motion-kind="energy-flow" data-motion-layer />}
      <ul className={styles.visualNodes}>
        {visualNodes[variant].map((node, index) => (
          <li className={styles.visualNode} data-motion-layer data-visual-node key={node} style={{"--node-index": index} as React.CSSProperties}>
            {node}
          </li>
        ))}
      </ul>
    </figure>
  );
}
