export const metadata = {
  title: "SafeCheck - AI Scam Safety Assistant",
  description: "Paste a suspicious message and understand why it's risky before you act.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#f6f7fb" }}>
        {children}
      </body>
    </html>
  );
}
