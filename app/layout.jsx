import './globals.css';

export const metadata = {
  title: 'Link Checker App',
  description: 'Check if domains are already in your referring domains',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
