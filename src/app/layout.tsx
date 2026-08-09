import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CostTracker — Construction Cost Management",
  description:
    "Track construction project budgets, log expenses, and monitor budget vs. actual costs in real time. Built for contractors, project managers, and construction firms.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${roboto.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
