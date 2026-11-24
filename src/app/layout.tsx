import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "To-do",
  description: "Internal to-do list",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
