export function SkipLink() {
  return (
    <a
      className="sr-only fixed left-4 top-4 z-50 rounded-lg bg-foreground px-4 py-3 text-background focus:not-sr-only focus:outline-2 focus:outline-offset-2 focus:outline-accent"
      href="#main-content"
    >
      跳转到主要内容
    </a>
  );
}
