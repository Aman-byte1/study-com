import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StudyCom - Ethiopia's Premier Tutoring Platform",
  description: "Prepare for Ethiopian national examinations with expert tutors, video lessons, quizzes, and personalized study plans for Grade 9-12 students.",
  keywords: ["Ethiopian education", "national exam prep", "tutoring", "Grade 9-12", "EUEE"],
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#d8a838",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="grain-overlay" />
        {children}
      </body>
    </html>
  );
}
