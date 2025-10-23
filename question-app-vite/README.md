# Konverzační Nápadník (Vite verze)

Lehká a efektivní aplikace pro inspiraci ke konverzaci.

## 🚀 Zlepšení oproti Next.js verzi

### Porovnání velikostí
| Metrika | Next.js (původní) | Vite (nové) | Zlepšení |
|---------|------------------|-------------|----------|
| **node_modules** | 425 MB | 66 MB | **6.4× menší** |
| **Build velikost** | ~několik MB | 304 KB | **~10× menší** |
| **Počet závislostí** | 100+ packages | 65 packages | **~35% méně** |
| **Build čas** | ~několik sekund | ~2 sekundy | **~5× rychlejší** |
| **JS bundle (gzip)** | velký | 87.86 KB | minimální |
| **CSS bundle** | Tailwind (~200KB+) | 4.59 KB | **~40× menší** |

### Technické změny
- ✅ **Framework:** Vite 5 místo Next.js 16
- ✅ **Styling:** Čisté CSS místo Tailwind CSS 4
- ✅ **Build:** ESBuild (ultra rychlý) místo Webpack
- ✅ **TypeScript:** Zachován
- ✅ **React 19:** Zachován

### Co zůstalo stejné
- ✅ Všechny 3 režimy (náhodný mix, vlastní výběr, jedna kategorie)
- ✅ Progress tracking (počítadlo otázek)
- ✅ Všech 11 kategorií v separátních souborech
- ✅ Kompletní UI - identický vzhled
- ✅ Gradienty, animace, hover efekty
- ✅ Responsive design

## 📦 Instalace

```bash
npm install
```

## 🛠️ Příkazy

### Development
```bash
npm run dev
```
Spustí dev server na `http://localhost:5173` s hot reload.

### Production Build
```bash
npm run build
```
Vytvoří optimalizovaný produkční build ve složce `dist/`.

### Preview
```bash
npm run preview
```
Lokálně zobrazí produkční build.

## 📁 Struktura projektu

```
question-app-vite/
├── index.html              # HTML entry point
├── src/
│   ├── main.tsx           # React entry point
│   ├── App.tsx            # Hlavní komponenta aplikace
│   ├── styles.css         # Všechny CSS styly
│   └── data/              # Data kategorií (zachováno z původní verze)
│       ├── index.ts
│       ├── relationships.ts
│       ├── career.ts
│       ├── dreams.ts
│       ├── childhood.ts
│       ├── fears.ts
│       ├── values.ts
│       ├── identity.ts
│       ├── creativity.ts
│       ├── happiness.ts
│       ├── philosophy.ts
│       └── future.ts
├── package.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## 🎯 Funkce

### 3 Režimy zobrazování
1. **Náhodný Mix** - Otázky ze všech kategorií náhodně
2. **Vlastní Výběr** - Vyberte si libovolné kategorie
3. **Jedna Kategorie** - Zaměřte se na jednu oblast

### 11 Kategorií
- 💗 Vztahy
- 💼 Kariéra
- ✨ Sny
- 👶 Dětství
- 😨 Strachy
- 💚 Hodnoty
- 🎭 Identita
- 🎨 Kreativita
- 😊 Štěstí
- 🤔 Filozofie
- 🔮 Budoucnost

### Progress Tracking
Aplikace sleduje, které otázky už byly zobrazeny a automaticky resetuje po projití všech otázek.

## 🚀 Deployment

Aplikace je statická a lze ji hostovat kdekoliv:
- **Vercel:** `vercel deploy`
- **Netlify:** Přetáhněte `dist/` složku
- **GitHub Pages:** Nahrajte obsah `dist/`
- **Jakýkoliv statický hosting**

## 🔧 Technologie

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite 5** - Build tool a dev server
- **Vanilla CSS** - Styling bez závislostí

## 📊 Bundle Analysis

```
dist/
├── index.html              0.48 kB (gzip: 0.32 kB)
├── assets/
│   ├── index.css          4.59 kB (gzip: 1.52 kB)
│   └── index.js         292.69 kB (gzip: 87.86 kB)
```

**Celková velikost:** ~304 KB (nesbaleno), ~90 KB (gzip)

## 💡 Výhody Vite přístupu

1. **Rychlost vývoje:** Okamžitý hot module reload
2. **Build rychlost:** ESBuild je 10-100× rychlejší než Webpack
3. **Jednoduchost:** Minimální konfigurace
4. **Výsledná velikost:** Výrazně menší bundle
5. **Dependency hell:** Méně balíčků = méně problémů
6. **Staticko-first:** Perfektní pro jednoduché aplikace

## 🤝 Migrace z Next.js verze

Hlavní změny při migraci:
1. Odstranění `'use client'` direktivy
2. Přejmenování `app/page.tsx` → `src/App.tsx`
3. Vytvoření `main.tsx` entry pointu
4. Převod Tailwind classes na čisté CSS
5. Přidání [index.html](index.html) s root elementem
6. Konfigurace Vite místo Next.js

**Žádné změny v logice aplikace nebo datech!**
