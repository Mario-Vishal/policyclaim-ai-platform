import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PolicyClaim AI Platform",
  description: "Claims, underwriting, payment review, RAG, agent tools, evals, and deployment-ready insurance AI demo."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
