import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500", "700"]
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kimsilalahi.vercel.app"),
  title: {
    default: "Kimsang Silalahi — AI Engineer & Software Developer",
    template: "%s | Kimsang Silalahi",
  },
  description: "Portfolio of Kimsang Silalahi: AI Engineer, Generative AI Specialist, LLM Apps, Agentic Systems, and Full Stack Developer in Indonesia.",
  keywords: [
    "Kimsang Silalahi",
    "AI Engineer",
    "Machine Learning Engineer",
    "Software Engineer",
    "Backend Developer",
    "Full Stack Developer",
    "RAG",
    "LLM",
    "Generative AI",
    "Next.js",
    "Python",
    "Indonesia",
    "Jakarta",
    "Medan"
  ],
  authors: [{ name: "Kimsang Silalahi", url: "https://kimsilalahi.vercel.app" }],
  creator: "Kimsang Silalahi",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://kimsilalahi.vercel.app",
    title: "Kimsang Silalahi — AI Engineer & Software Developer",
    description: "Portfolio of Kimsang Silalahi: AI Engineer, Generative AI Specialist, LLM Apps, Agentic Systems, and Full Stack Developer in Indonesia.",
    siteName: "Kimsang Silalahi Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kimsang Silalahi — AI Engineer & Software Developer",
    description: "Portfolio of Kimsang Silalahi: AI Engineer, Generative AI Specialist, LLM Apps, Agentic Systems, and Full Stack Developer in Indonesia.",
  },
  verification: {
    google: "RLpGbDo1TveCwQGVpMm_qP7g1aiEx3D5Nz278nzDTIA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Kimsang Silalahi",
    jobTitle: "AI Engineer & Software Developer",
    url: "https://kimsilalahi.vercel.app",
    image: "https://kimsilalahi.vercel.app/kimsang-silalahi-ai-engineer.jpg",
    description: "Kimsang Silalahi is an AI Engineer and Fullstack Software Developer based in Indonesia. He specializes in Large Language Models (LLMs), Retrieval-Augmented Generation (RAG), Agentic AI systems, and Generative Engine Optimization (GEO).",
    sameAs: [
      "https://github.com/kim40404",
      "https://www.linkedin.com/in/kimsang-silalahi",
      "https://huggingface.co/kim40404"
    ],
    alumniOf: {
      "@type": "CollegeOrUniversity",
      "name": "Universitas Sumatera Utara"
    },
    knowsAbout: ["Artificial Intelligence", "Machine Learning", "Software Engineering", "Generative AI", "Retrieval-Augmented Generation", "LLM Evaluation"]
  };

  return (
    <html lang="en" suppressHydrationWarning className={jetbrainsMono.variable}>
      <body className="antialiased min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
