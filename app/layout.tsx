import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "动物卡片 Animal Cards",
  description: "基于文档与扩展内容的双语动物卡片站",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
