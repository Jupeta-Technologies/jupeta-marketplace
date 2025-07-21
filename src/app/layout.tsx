// app/layout.tsx
import "@/styles/jupeta-ec-v1.global.css";
import "@/styles/Loginpage.css"
import "@/styles/ProductDetail.css"
import "@/styles/Checkoutpage.css"
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from '@fortawesome/fontawesome-svg-core';
import { CartProvider } from "@/context/CartContext";
import { FavoriteProvider } from "@/context/FavoriteContext";
import { HeroContentProvider } from "@/context/HeroContentContext";
import { AuthProvider } from "@/context/AuthContext";
import NavWrapper from "@/components/NavWrapper";
import { Metadata } from 'next';

// Prevent FontAwesome from adding its CSS since we did it manually above
config.autoAddCss = false;

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
        <AuthProvider>
          <HeroContentProvider>
            <CartProvider>
              <FavoriteProvider>
                <NavWrapper>{children}</NavWrapper>
              </FavoriteProvider>
            </CartProvider>
          </HeroContentProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

