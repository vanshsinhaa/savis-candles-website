export function FooterGradient() {
  return (
    <footer className="relative h-96 overflow-hidden">
      {/* Blurred rainbow gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,0,0,0.3) 0%, rgba(255,127,0,0.3) 16.67%, rgba(255,255,0,0.3) 33.33%, rgba(0,255,0,0.3) 50%, rgba(0,0,255,0.3) 66.67%, rgba(75,0,130,0.3) 83.33%, rgba(148,0,211,0.3) 100%)",
          filter: "blur(80px)",
        }}
      />

      {/* Content overlay */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-foreground/60">© {new Date().getFullYear()} savis candles. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
