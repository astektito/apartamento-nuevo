import "./globals.css";

export const metadata = {
  title: "¡Felicidades por tu nuevo apartamento! 🌻",
  description: "Una pequeña sorpresa para celebrar tu nuevo hogar.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
