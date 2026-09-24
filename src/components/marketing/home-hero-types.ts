import type {PublicPath} from "@/content";

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
