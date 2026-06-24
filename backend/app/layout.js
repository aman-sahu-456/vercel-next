export const metadata = {
  title: "Backend - Next.js API",
  description: "API-only Next.js backend",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
