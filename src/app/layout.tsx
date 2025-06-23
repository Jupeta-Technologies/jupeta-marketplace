// app/layout.tsx
import "@/styles/jupeta-ec-v1.global.css";
import "@/styles/Loginpage.css"
import { CartProvider } from "@/context/CartContext";
import { FavoriteProvider } from "@/context/FavoriteContext";
import { WatchlistProvider } from "@/context/WatchlistContext";
import NavWrapper from "@/components/NavWrapper";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Jupeta Marketplace - Your One-Stop Shopping Destination',
    template: '%s | Jupeta Marketplace'
  },
  description: 'Discover amazing products across electronics, fashion, home & kitchen, and automobiles. Shop the latest trends with great deals and fast delivery.',
  keywords: 'marketplace, shopping, electronics, fashion, home, kitchen, automobiles, online store',
  authors: [{ name: 'Jupeta Marketplace' }],
  openGraph: {
    title: 'Jupeta Marketplace - Your One-Stop Shopping Destination',
    description: 'Discover amazing products across electronics, fashion, home & kitchen, and automobiles.',
    type: 'website',
    locale: 'en_US',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <FavoriteProvider>
            <WatchlistProvider>
              <NavWrapper>{children}</NavWrapper>
            </WatchlistProvider>
          </FavoriteProvider>
        </CartProvider>
      </body>
    </html>
  );
}

