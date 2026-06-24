import "./globals.css";

export const metadata = {
  title: "Hello World - Next.js Frontend",
  description: "Next.js frontend that talks to the Next.js backend",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
