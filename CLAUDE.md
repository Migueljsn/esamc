# ESA MasterClass — Project Bible

## Stack
- Next.js 15 (App Router, TypeScript)
- Tailwind CSS v4
- GSAP + ScrollTrigger — all element animations
- Lenis (`@studio-freight/lenis`) — all smooth scrolling

## Animation rules (NON-NEGOTIABLE)
- Every scroll animation uses Lenis + ScrollTrigger together
- Minimum transition duration: 0.6s
- Allowed eases: `power3.out`, `power3.inOut`, `expo.out`, `expo.inOut`
- Sequential element reveals: 0.2s stagger between items
- No animation under 0.6s — the goal is elegance, not speed

## Lenis + ScrollTrigger integration
```ts
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => { lenis.raf(time * 1000) })
gsap.ticker.lagSmoothing(0)
```

## Color palette
- bg-primary: #050B18
- bg-secondary: #0A1628
- accent: #2563EB
- accent-light: #60A5FA
- text: #F0F4FF
- muted: #94A3B8

## Project info
- School: Escola Santa Angélica (ESA)
- Product: Matrícula geral da escola (Educação Infantil ao Ensino Médio)
- Focus: captação de matrículas para todos os segmentos — não mais um curso preparatório isolado para o ENEM. O histórico de aprovação em universidades segue sendo usado como prova social, mas não é o produto.
- Price: sob consulta — mensalidade varia por segmento/série, CTA é "fale conosco" em vez de valor fixo
- Location: Av. União, 2853 - Memorare, Teresina - PI, 64009-500
- Active since: 1984
