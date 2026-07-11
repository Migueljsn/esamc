const INSTAGRAM_PROFILE = "https://www.instagram.com/escolasantaangelicapi/";

export function InstagramCTA() {
  return (
    <section className="border-y border-border bg-secondary/50 py-14 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div className="flex items-center gap-4">
          <span className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="5" stroke="#60A5FA" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="4" stroke="#60A5FA" strokeWidth="1.5" />
              <circle cx="17.5" cy="6.5" r="1.1" fill="#60A5FA" />
            </svg>
          </span>
          <div>
            <p className="font-display font-bold text-text text-lg">@escolasantaangelicapi</p>
            <p className="text-muted text-sm">Acompanhe o dia a dia da nossa escola no Instagram</p>
          </div>
        </div>

        <a
          href={INSTAGRAM_PROFILE}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-display font-semibold rounded-xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-accent-light hover:scale-105"
        >
          Seguir no Instagram →
        </a>
      </div>
    </section>
  );
}
