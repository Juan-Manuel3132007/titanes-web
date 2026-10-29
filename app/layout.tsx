import type { Metadata } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import { AuthProvider } from "@/features/auth/hooks/useAuth";
import { Navbar } from "@/features/common/components/Navbar";
import { Footer } from "@/features/common/components/Footer";
import "./globals.css";

const barlow = Barlow_Condensed({ variable: "--font-barlow", subsets: ["latin"], weight: ["600", "700"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: {
    default: "Titanes — Escuela de Baloncesto en Medellín",
    template: "%s · Titanes",
  },
  description:
    "Escuela de baloncesto Titanes en la Unidad Deportiva de Belén, Medellín. Formación desde los 10 años hasta categoría mayores.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${barlow.variable} ${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}