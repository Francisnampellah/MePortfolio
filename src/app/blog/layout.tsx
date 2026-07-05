export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "#fbf4ea",
        backgroundImage: "radial-gradient(#ecdcc6 1.1px, transparent 1.1px)",
        backgroundSize: "22px 22px",
      }}
    >
      {children}
    </div>
  );
}
