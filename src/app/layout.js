import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import 'primereact/resources/themes/saga-purple/theme.css'; // o el theme que quieras
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

import 'bootstrap/dist/css/bootstrap.min.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair'
})
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Pole Dual",
  description: "Estudio Dual",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`p-component ${geistSans.variable} ${geistMono.variable} ${playfair.variable}`}>
        {children}
      </body>
    </html>
  );
}
