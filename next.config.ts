import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js inline scripts + dev eval + React hydration
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      // Tailwind utilities + Next.js inline styles
      "style-src 'self' 'unsafe-inline'",
      // Product images, uploaded files, Next.js image optimization, data URIs
      "img-src 'self' data: blob: https:",
      // Google Fonts (Geist, Bebas Neue)
      "font-src 'self' https://fonts.gstatic.com",
      // API calls: self + Resend email service
      "connect-src 'self' https://api.resend.com",
      // Disallow framing entirely (clickjacking protection)
      "frame-ancestors 'none'",
      // Form submissions only to self
      "form-action 'self'",
      // No plugin content
      "object-src 'none'",
      // Base URI restricted to self
      "base-uri 'self'",
    ].join("; "),
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: [
      "camera=()",
      "microphone=()",
      "geolocation=()",
      "interest-cohort=()",
    ].join(", "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
