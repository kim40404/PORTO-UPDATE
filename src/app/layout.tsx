import type { Metadata } from "next";
import { Bebas_Neue, Syne, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/ui/SmoothScroll";

const bebasNeue = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-display" });
const syne = Syne({ subsets: ["latin"], variable: "--font-body" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
    title: "Kimsang Silalahi — Full Stack Engineer · AI Specialist · Game Developer",
    description: "Award-worthy portfolio of Kimsang Silalahi: Full Stack Engineer, AI/ML Engineer, Web3 Specialist, and Game Developer from Indonesia. Dark Molten Liquid Metal experience.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`dark ${bebasNeue.variable} ${syne.variable} ${jetbrainsMono.variable}`}>
            <body className="antialiased">
                <SmoothScroll>
                    {children}
                </SmoothScroll>
                {/* Grain Overlay */}
                <div className="grain-overlay" aria-hidden="true" />
            </body>
        </html>
    );
}
