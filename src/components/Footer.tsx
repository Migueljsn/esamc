export function Footer() {
  return (
    <footer className="border-t border-border bg-primary py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-muted/50 text-sm">
        <div className="flex items-center gap-3">
          <span className="font-display font-bold text-text/70">ESA</span>
          <span className="text-border">|</span>
          <span>Escola Santa Angélica</span>
        </div>
        <p>© {new Date().getFullYear()} Escola Santa Angélica. Todos os direitos reservados.</p>
        <p className="text-xs">CNPJ 07.239.791/0001-56 · Teresina, PI</p>
      </div>
    </footer>
  );
}
