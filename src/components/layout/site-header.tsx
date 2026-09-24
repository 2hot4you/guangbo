import {Button} from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import {DesktopNavigation} from "./desktop-navigation";
import {MobileNavigation} from "./mobile-navigation";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner flex min-h-20 items-center justify-between gap-4">
        <Link
          aria-label="光波互联，返回首页"
          className="inline-flex shrink-0 items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          href="/"
        >
          <Image alt="" className="site-header__logo h-auto w-36 sm:w-40" height={111} priority src="/brand/guangbo-logo.png" width={407} />
        </Link>
        <div className="site-header__desktop hidden items-center gap-3 xl:flex">
          <DesktopNavigation />
          <div aria-label="账户入口预留" className="site-header__auth">
            <Button aria-label="登录" className="site-header__login" isDisabled size="sm" variant="ghost">登录</Button>
            <Button aria-label="注册" className="site-header__register" isDisabled size="sm">注册</Button>
          </div>
        </div>
        <MobileNavigation />
      </div>
    </header>
  );
}
