import Link from "next/link";

export default function NotFound() {
  return (
    <section aria-labelledby="not-found-title">
      <h1 id="not-found-title">页面未找到</h1>
      <p>您访问的页面不存在，或地址已发生变化。请返回首页继续浏览光波互联的服务。</p>
      <Link href="/">返回首页</Link>
    </section>
  );
}
