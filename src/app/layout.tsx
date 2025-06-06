// app/layout.tsx
import "@/styles/jupeta-ec-v1.global.css";
import "@/styles/Loginpage.css"
import { CartProvider } from "@/context/CartContext";
import NavWrapper from "@/components/NavWrapper";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <NavWrapper>{children}</NavWrapper>
        </CartProvider>
      </body>
    </html>
  );
}

