import {ArrowUpRight} from "lucide-react";
import Link from "next/link";

const footerGroups = [
  {title: "大模型", links: [["能力总览", "/ai"], ["语言与多模态", "/ai/llm"], ["图像生成", "/ai/image"], ["视频生成", "/ai/video"]]},
  {title: "基础设施", links: [["IDC与算力", "/idc"], ["GPU算力", "/idc/gpu"], ["机柜与托管", "/idc/colocation"], ["全国专线", "/network"]]},
  {title: "企业服务", links: [["信创与数字化", "/madeinchina"], ["绿电与能源", "/energy"], ["关于我们", "/about"]]},
] as const;

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-container site-footer__top">
        <nav aria-label="页脚导航" className="site-footer__nav">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h2>{group.title}</h2>
              <ul>
                {group.links.map(([label, href]) => <li key={href}><Link href={href}>{label}</Link></li>)}
              </ul>
            </div>
          ))}
        </nav>
        <div className="site-footer__brand">
          <p>连接模型、算力、网络与能源，支持企业把技术能力落到真实业务。</p>
        </div>
      </div>
      <div className="site-container site-footer__bottom">
        <Link href="/about">了解公司 <ArrowUpRight aria-hidden="true" /></Link>
      </div>
      <div aria-hidden="true" className="site-footer__wordmark">
        <strong>光波互联</strong>
        <div className="site-footer__wordmark-meta">
          <span>AI</span>
          <span>Connected.</span>
        </div>
      </div>
      <div className="site-container site-footer__legal">
        <p>Copyright © {new Date().getFullYear()} 成都光波互联科技有限公司</p>
        <span className="site-footer__legal-item">
          <span aria-hidden="true">·</span>
          <a href="https://beian.miit.gov.cn">蜀ICP备2026064955号-1</a>
        </span>
        <span className="site-footer__legal-item">
          <span aria-hidden="true">·</span>
          <span>增值电信业务经营许可证编号 A2.B1-20201540</span>
        </span>
      </div>
    </footer>
  );
}
