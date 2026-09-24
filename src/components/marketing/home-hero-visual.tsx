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
      <span aria-hidden="true" className={styles.visualRing} />
      <span aria-hidden="true" className={styles.visualRingInner} />
      <ul className={styles.visualNodes}>
        {visualNodes[variant].map((node, index) => (
          <li className={styles.visualNode} data-motion-layer key={node} style={{"--node-index": index} as React.CSSProperties}>
            {node}
          </li>
        ))}
      </ul>
    </figure>
  );
}
