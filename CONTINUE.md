# 📋 CONTINUE.md - Pokračování vývoje aplikace

Tento dokument obsahuje kompletní přehled aplikace "Konverzační Nápadník" pro pokračování vývoje.

**Datum poslední aktualizace:** 2025-10-23
**Verze aplikace:** 2.0 (Vite migration + History tracking)
**Repository:** https://github.com/MrInfernal/konverzacni-napadnik.git
**Live URL:** [Vercel deployment]

---

## 📊 Aktuální stav projektu

### ✅ Hotové milníky:

#### Milestone 1: Základní funkcionalita
- Next.js aplikace s 11 kategoriemi otázek
- 3 režimy zobrazování (Náhodný Mix, Vlastní Výběr, Jedna Kategorie)
- Základní UI s Tailwind CSS
- ~2,141 otázek v češtině

#### Milestone 2: Rozšíření otázek
- Vylepšení českých překladů
- Rozšíření na 2,200+ otázek
- Aktualizace kategorií (fears +15, future +21)

#### Milestone 3: Vite migrace ⚡
- **Nahrazení Next.js za Vite 5**
- **Snížení node_modules: 425 MB → 66 MB (84% ↓)**
- **Build čas: ~5s → ~2s (60% ↓)**
- **Bundle size: ~3 MB → 304 KB (90% ↓)**
- Nahrazení Tailwind CSS za vanilla CSS (4.59 KB)
- 100% zachování funkčnosti

#### Milestone 4: Persistent History 💾
- **Trvalé sledování viděných otázek v localStorage**
- **Nikdy se nezobrazí stejná otázka dvakrát**
- Smart detekce nových otázek po updatech (hash-based)
- Progress tracking (X/2,227 otázek viděno)
- Export/Import historie
- Manuální reset s potvrzením
- Modal při vyčerpání všech otázek

---

## 🏗️ Technická architektura

### Stack:
- **Framework:** Vite 5 + React 19 + TypeScript
- **Styling:** Vanilla CSS (7.88 KB)
- **Build:** ESBuild (ultra rychlý)
- **Deployment:** Vercel (automatický)
- **Storage:** localStorage pro historii

### Struktura projektu:
```
question-app/
├── src/
│   ├── App.tsx                    # Hlavní komponenta (377 řádků)
│   ├── main.tsx                   # React entry point
│   ├── styles.css                 # Všechny styly (721 řádků)
│   ├── components/
│   │   └── HistoryControls.tsx   # UI pro historii otázek
│   ├── hooks/
│   │   └── useQuestionHistory.ts # localStorage management
│   ├── utils/
│   │   └── hashHelper.ts         # Detekce změn v otázkách
│   └── data/                     # 11 kategorií otázek
│       ├── index.ts              # Export všech kategorií
│       ├── relationships.ts      # 199 otázek
│       ├── career.ts             # 191 otázek
│       ├── dreams.ts             # 223 otázek
│       ├── childhood.ts          # 192 otázek
│       ├── fears.ts              # 215 otázek
│       ├── values.ts             # 199 otázek
│       ├── identity.ts           # 199 otázek
│       ├── creativity.ts         # 141 otázek
│       ├── happiness.ts          # 199 otázek
│       ├── philosophy.ts         # 199 otázek
│       └── future.ts             # 220 otázek
├── index.html                    # HTML entry
├── vite.config.ts               # Vite konfigurace
├── vercel.json                  # Vercel SPA config
├── package.json                 # 65 packages
├── question-app-nextjs/         # Záloha Next.js verze
└── question-app-vite/           # Původní Vite složka
```

### Klíčové soubory:

**App.tsx** - Hlavní logika aplikace
- State management pro režimy a otázky
- Integrace useQuestionHistory hook
- 3 režimy zobrazování
- Modal pro vyčerpání otázek

**useQuestionHistory.ts** - Správa historie
- `loadHistory()` - Načte z localStorage
- `markQuestionAsSeen()` - Označí otázku jako viděnou
- `getUnseenQuestions()` - Vrátí neviděné otázky
- `resetHistory()` - Vymaže historii
- `getStats()` - Statistiky
- Hash-based detekce změn

**HistoryControls.tsx** - UI komponenta
- Progress bar
- Statistiky (viděno/celkem/zbývá)
- Tlačítko reset
- Export/Import funkce
- Notifikace o nových otázkách

---

## 📦 Aktuální statistiky

**Celkem otázek:** 2,227 (napříč 11 kategoriemi)
**Bundle size:** 306 KB (~94 KB gzip)
**CSS:** 7.88 KB (2.29 KB gzip)
**Build čas:** ~2 sekundy
**node_modules:** 66 MB
**Dependencies:** 65 packages

---

## 🚀 Jak začít pracovat

### 1. Klonování a instalace:
```bash
git clone https://github.com/MrInfernal/konverzacni-napadnik.git
cd question-app
npm install  # ~66 MB, rychlé
```

### 2. Development:
```bash
npm run dev     # Spustí Vite dev server na http://localhost:5173
npm run build   # Produkční build (~2 sekundy)
npm run preview # Preview produkčního buildu
```

### 3. Git workflow:
```bash
git status              # Zkontrolovat změny
git add .              # Stage změny
git commit -m "..."    # Commit
git push               # Push na GitHub → automatický Vercel deployment
```

### 4. Testování v prohlížeči:
- Otevřít http://localhost:5173
- Zkontrolovat localStorage: DevTools → Application → Local Storage
- Klíč: `konverzacni-napadnik-history`

---

## 💡 Nápady pro další vývoj

### Priority 1 - Quick Wins (1-2 hodiny):

#### 1.1 Dark Mode 🌙
**Proč:** Moderní aplikace, uživatelsky přívětivé
**Implementace:**
- Přidat toggle tlačítko do menu
- CSS variables pro barvy
- Uložit preference do localStorage
- Odhadovaný čas: 1-2 hodiny

#### 1.2 Keyboard Shortcuts ⌨️
**Proč:** Rychlejší navigace pro power users
**Shortcuts:**
- `Space` - Další otázka
- `Escape` - Zpět
- `R` - Resetovat historii
- `?` - Zobrazit nápovědu
- Odhadovaný čas: 1 hodina

#### 1.3 Sdílení otázek 🔗
**Proč:** Uživatelé mohou sdílet zajímavé otázky
**Implementace:**
- Tlačítko "Sdílet" u každé otázky
- Copy to clipboard
- Možnost sdílet na sociální sítě
- Odhadovaný čas: 1-2 hodiny

---

### Priority 2 - Střední features (3-5 hodin):

#### 2.1 Oblíbené otázky ⭐
**Proč:** Uživatelé si mohou označit zajímavé otázky
**Implementace:**
- Tlačítko "Přidat do oblíbených"
- Seznam oblíbených v menu
- Filtr "Pouze oblíbené"
- localStorage: `favorites` array
- Odhadovaný čas: 3-4 hodiny

#### 2.2 Statistiky a achievements 🏆
**Proč:** Gamifikace, motivace projít všechny otázky
**Features:**
- Počet otázek za den/týden/měsíc
- Nejaktivnější kategorie
- Série (streak) - X dní po sobě
- Odznaky (100 otázek, 500 otázek, atd.)
- Grafy progress over time
- Odhadovaný čas: 4-5 hodin

#### 2.3 Multijazyčnost 🌍
**Proč:** Rozšíření pro mezinárodní publikum
**Implementace:**
- i18n knihovna (react-i18next)
- Angličtina jako druhý jazyk
- Language switcher v menu
- Překlad UI + otázek
- Odhadovaný čas: 5-8 hodin (záleží na kvalitě překladů)

---

### Priority 3 - Velké features (1-2 dny):

#### 3.1 Backend + Databáze 🗄️
**Proč:** Synchronizace mezi zařízeními, lepší analytics
**Stack návrh:**
- Firebase (nejjednodušší) nebo Supabase
- User authentication (Google, Email)
- Sync historie mezi zařízeními
- Cloud backup
- Odhadovaný čas: 1-2 dny

#### 3.2 Tematické kolekce 📚
**Proč:** Kurátorované sady otázek pro specifické situace
**Příklady:**
- "První rande" (30 otázek)
- "Dlouhá cesta autem" (50 otázek)
- "Rodinná večeře" (40 otázek)
- "Hluboké poznání" (60 otázek)
- Odhadovaný čas: 1 den (+ čas na kurátorství)

#### 3.3 Komunitní funkce 👥
**Proč:** User-generated content, růst databáze
**Features:**
- Uživatelé mohou přidávat vlastní otázky
- Hodnocení otázek (upvote/downvote)
- Moderace obsahu
- Veřejné vs. soukromé otázky
- Odhadovaný čas: 2-3 dny

---

## 🔧 Technické poznámky

### localStorage struktura:
```json
{
  "konverzacni-napadnik-history": {
    "seenQuestions": {
      "relationships-0": 1234567890,
      "career-5": 1234567891,
      ...
    },
    "questionHashes": {
      "relationships": "abc123",
      "career": "def456",
      ...
    },
    "stats": {
      "totalSeen": 145,
      "lastReset": 1234567890,
      "sessionCount": 5
    }
  }
}
```

### Jak funguje detekce nových otázek:
1. Při načtení aplikace se spočítá hash každé kategorie
2. Hash = kombinace všech otázek v kategorii
3. Porovnání s uloženým hashem v localStorage
4. Pokud se hash liší = nové/změněné otázky
5. Notifikace uživateli

### Přidání nových otázek:
```typescript
// src/data/novakategorie.ts
export const novaKategorie = [
  "Otázka 1?",
  "Otázka 2?",
  ...
];

// src/data/index.ts
import { novaKategorie } from './novakategorie';

export const categories: Category[] = [
  ...
  {
    id: 'nova-kategorie',
    name: 'Nová Kategorie',
    description: 'Popis kategorie',
    questions: novaKategorie,
    color: 'bg-cyan-500'
  }
];
```

### Dostupné barvy pro kategorie:
```
bg-pink-500, bg-blue-500, bg-purple-500, bg-yellow-500,
bg-red-500, bg-green-500, bg-indigo-500, bg-orange-500,
bg-amber-500, bg-slate-500, bg-teal-500, bg-cyan-500
```

---

## 🐛 Troubleshooting

### Build selhává:
```bash
# Smazat node_modules a cache
rm -rf node_modules dist .vite
npm install
npm run build
```

### TypeScript chyby:
```bash
# Zkontrolovat typy
npx tsc --noEmit

# Často pomůže restart TS serveru ve VS Code:
# Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

### localStorage issues:
```javascript
// V browser console:
localStorage.getItem('konverzacni-napadnik-history')  // Zobrazit
localStorage.removeItem('konverzacni-napadnik-history')  // Smazat
localStorage.clear()  // Smazat vše
```

### Vercel deployment selhává:
1. Zkontrolovat `vercel.json` konfiguraci
2. Ověřit že `package.json` má správné scripty
3. Zkontrolovat build logy ve Vercel dashboard
4. Framework preset musí být `null` (ne Next.js!)

### Hot reload nefunguje:
```bash
# Restartovat dev server
# Ctrl+C → npm run dev

# Nebo vyčistit cache:
rm -rf .vite node_modules/.vite
npm run dev
```

---

## 📚 Užitečné příkazy

### Git:
```bash
git log --oneline -10              # Poslední commity
git diff                          # Změny
git checkout -b feature/nova-vec  # Nová branch
git stash                         # Odložit změny
git stash pop                     # Vrátit změny
```

### NPM:
```bash
npm outdated                      # Zastaralé packages
npm audit                         # Security issues
npm audit fix                     # Opravit security issues
du -sh node_modules              # Velikost node_modules
```

### Vite:
```bash
npx vite --debug                  # Debug mode
npx vite build --mode production # Produkční build
npx vite preview --port 4173     # Preview na jiném portu
```

---

## 📝 Changelog

### 2025-10-23 - v2.0 (Vite + History)
**Major Update:**
- ✅ Migrace z Next.js na Vite
- ✅ Persistent history tracking v localStorage
- ✅ Smart detekce nových otázek
- ✅ Progress tracking a statistiky
- ✅ Export/Import historie
- ✅ Modal při vyčerpání otázek
- ✅ Bundle size: 90% menší (304 KB)
- ✅ Build čas: 60% rychlejší (~2s)

**Git tags:** `milestone-3`
**Commits:** 4 (včetně Vercel fix)

### 2025-10-22 - v1.1 (Question Updates)
- Rozšíření otázek v fears.ts (+15)
- Rozšíření otázek v future.ts (+21)
- Celkem 2,227 otázek

### 2025-10-20 - v1.0 (Initial Release)
- Základní Next.js aplikace
- 11 kategorií, ~2,141 otázek
- 3 režimy zobrazování
- Tailwind CSS styling

---

## 🎯 Současné priority (doporučené)

### Nejbližší kroky:
1. **Dark Mode** - Rychlé, viditelné zlepšení UX
2. **Keyboard Shortcuts** - Pro power users
3. **Sdílení otázek** - Virální potenciál

### Dlouhodobě:
- Backend + Auth pro sync mezi zařízeními
- Tematické kolekce pro specifické use-cases
- Komunitní funkce (user-generated content)

---

## 📞 Kontakt & Odkazy

**Repository:** https://github.com/MrInfernal/konverzacni-napadnik.git
**Live URL:** [Vercel deployment URL zde]
**Documentation:** README.md, MIGRATION_SUMMARY.md

### Vercel:
- Dashboard: https://vercel.com/dashboard
- Projekt: konverzacni-napadnik
- Auto-deploy: main branch → produkce

### Užitečná dokumentace:
- Vite: https://vitejs.dev/
- React 19: https://react.dev/
- TypeScript: https://www.typescriptlang.org/
- Vercel: https://vercel.com/docs

---

## ✨ Finální poznámky

### Co funguje skvěle:
- ⚡ Rychlost buildu a načítání
- 💾 Persistence historie
- 🎨 Čisté, moderní UI
- 📱 Responsive design
- 🔄 Automatický deployment

### Co by se dalo vylepšit:
- 🌙 Chybí dark mode
- ⌨️ Žádné keyboard shortcuts
- 🔗 Není možnost sdílení
- 📊 Žádné pokročilé statistiky
- 🌍 Pouze čeština

### Testování:
```bash
# Otestovat před commitem:
npm run build        # Musí projít bez chyb
npm run preview      # Otestovat produkční build
```

### Před pushem na GitHub:
1. ✅ Build prošel bez chyb
2. ✅ Otestováno v prohlížeči
3. ✅ Commit message je popisná
4. ✅ Žádné console.log v kódu
5. ✅ Žádné TODO komentáře

---

**Hodně štěstí s dalším vývojem! 🚀**

**Vytvořeno Claude Code - 2025-10-23**

