'use client'
import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <main
      role="main"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #eef2ff 0%, #ffffff 40%, #f5f3ff 100%)',
        padding: '0 16px',
      }}
    >
      {/* Decorative gradients */}
      <div
        style={{
          pointerEvents: 'none',
          position: 'absolute',
          top: -96,
          left: -96,
          height: 288,
          width: 288,
          borderRadius: '50%',
          background: 'rgba(129, 140, 248, 0.2)',
          filter: 'blur(48px)',
        }}
      />
      <div
        style={{
          pointerEvents: 'none',
          position: 'absolute',
          bottom: -96,
          right: -96,
          height: 288,
          width: 288,
          borderRadius: '50%',
          background: 'rgba(192, 132, 252, 0.2)',
          filter: 'blur(48px)',
        }}
      />

      {/* Header section */}
      <section style={{ width: '100%', textAlign: 'center', padding: '40px 0 24px' }}>
        <div style={{ marginBottom: 16 }} aria-hidden="true">
          <div
            style={{
              margin: '0 auto',
              height: 96,
              width: 96,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 12px 24px rgba(99,102,241,0.25)',
            }}
          >
            <svg style={{ height: 48, width: 48 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 7h16M4 12h10M4 17h7" strokeLinecap="round" />
            </svg>
          </div>
        </div>
        <p style={{ fontSize: 12, letterSpacing: '0.2em', color: '#6366f1', fontWeight: 600, textTransform: 'uppercase', margin: 0 }}>Error 404</p>
        <h1 style={{ fontSize: 40, fontWeight: 800, color: '#0f172a', margin: '8px 0 8px' }}>This page went missing</h1>
        <p style={{ color: '#475569', margin: '0 auto 20px', maxWidth: 900 }}>The link might be broken or the page may have been moved. You can continue exploring the marketplace below.</p>

        {/* Go back home button */}
        <div style={{ marginTop: 8 }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              backgroundImage: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff',
              padding: '12px 26px',
              borderRadius: 9999,
              textDecoration: 'none',
              boxShadow: '0 8px 18px rgba(99,102,241,0.25)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Go back home</span>
          </Link>
        </div>
      </section>

      {/* Cards grid section - full width */}
      <section
        style={{
          width: '100%',
          padding: '0 16px 40px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 20,
          }}
        >
          {/* Browse products card */}
          <Link href="/products" style={{ textDecoration: 'none' }}>
            <div
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: 16,
                overflow: 'hidden',
                background: '#ffffff',
                boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
                position: 'relative',
              }}
            >
              <Image
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=60"
                alt="Browse products"
                width={600}
                height={900}
                style={{ width: '100%', height: 320, objectFit: 'cover', display: 'block' }}
                priority
              />
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  padding: '12px 14px',
                  background: 'linear-gradient(0deg, rgba(0,0,0,0.5), rgba(0,0,0,0))',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ fontWeight: 800, fontSize: 16 }}>Browse products</div>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.8">
                  <path d="M8 5l8 7-8 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Electronics card */}
          <Link href="/category/electronics" style={{ textDecoration: 'none' }}>
            <div
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: 16,
                overflow: 'hidden',
                background: '#ffffff',
                boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
                position: 'relative',
              }}
            >
              <Image
                src="https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=1200&q=60"
                alt="Electronics"
                width={600}
                height={900}
                style={{ width: '100%', height: 320, objectFit: 'cover', display: 'block' }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  padding: '12px 14px',
                  background: 'linear-gradient(0deg, rgba(0,0,0,0.5), rgba(0,0,0,0))',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ fontWeight: 800, fontSize: 16 }}>Electronics</div>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.8">
                  <path d="M8 5l8 7-8 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Fashion card */}
          <Link href="/category/fashion" style={{ textDecoration: 'none' }}>
            <div
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: 16,
                overflow: 'hidden',
                background: '#ffffff',
                boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
                position: 'relative',
              }}
            >
              <Image
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=60"
                alt="Fashion"
                width={600}
                height={900}
                style={{ width: '100%', height: 320, objectFit: 'cover', display: 'block' }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  padding: '12px 14px',
                  background: 'linear-gradient(0deg, rgba(0,0,0,0.5), rgba(0,0,0,0))',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ fontWeight: 800, fontSize: 16 }}>Fashion</div>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.8">
                  <path d="M8 5l8 7-8 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}