import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { Toaster } from "sonner";
import { Github } from "lucide-react";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SOAP Note Q3 Project",
  description: "AI-powered SOAP note generation from patient encounters",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} antialiased`}
      >
        <Toaster richColors />
        {children}
        
        {/* Footer */}
        <footer className="mt-16 py-8 border-t border-white/20">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center">
              <a 
                href="https://github.com/sidoody/proj-soap" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/60 hover:text-yellow-400 transition-colors"
              >
                <Github size={20} />
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
