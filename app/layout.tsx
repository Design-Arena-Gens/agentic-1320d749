import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Friday AI Assistant',
  description: 'Voice-first AI agent for mobile',
  manifest: '/manifest.json',
  themeColor: '#22c55e'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className="min-h-screen bg-slate-900 text-slate-100">
        {children}
        <script dangerouslySetInnerHTML={{__html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
              navigator.serviceWorker.register('/sw.js').catch(()=>{});
            });
          }
        `}} />
      </body>
    </html>
  );
}
