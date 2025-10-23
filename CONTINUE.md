# Konverzační Nápadník - Development Log

## Aktuální stav projektu (23.10.2025)

### Verze: 1.0.0 (Vite) - Experimentální

---

## Poslední dokončené úpravy

### 1. Progress Counter u kategorií 📊
**Implementováno:** 23.10.2025

- Každá kategorie nyní zobrazuje počet zodpovězených otázek
- Formát zobrazení: "Zodpovězeno: X/Y" + procentuální progress "Z%"
- Vizuální progress bar (bílá lišta na barevném pozadí)
- Zobrazuje se pouze u kategorií s alespoň 1 zodpovězenou otázkou
- Funguje ve všech třech režimech:
  - Náhodný Mix
  - Vlastní Výběr
  - Jedna Kategorie

**Soubory upraveny:**
- `src/App.tsx` (řádky 11-29, 54-57, 226-266, 302-336)

---

### 2. Experimentální Disclaimer Modal ⚠️
**Implementováno:** 23.10.2025

- Modal se zobrazuje při prvním otevření aplikace
- Informuje uživatele o experimentální povaze aplikace
- Upozorňuje na možné nepřesnosti ve formulaci otázek
- Po zavření se již nezobrazuje (uloženo v localStorage)
- Moderní design s rozmazaným pozadím (backdrop-blur)

**Obsah disclaimeru:**
- "Tato aplikace je ve fázi experimentálního vývoje"
- Upozornění na možné chyby v otázkách
- Poděkování za pochopení a zpětnou vazbu

**Soubory upraveny:**
- `src/App.tsx` (řádky 16-34, 116-141, 147)

---

### 3. Informace o verzi v patičce ℹ️
**Implementováno:** 23.10.2025

- V hlavním menu se zobrazuje: "Verze 1.0.0 (Vite) • Experimentální"
- Umístěno v patičce, neruší hlavní UI
- Jasně označuje platformu (Vite) a status (Experimentální)

**Soubory upraveny:**
- `src/App.tsx` (řádky 194-196)

---

### 4. Perzistence pokroku (localStorage) 💾
**Implementováno:** 23.10.2025

- Progress otázek se automaticky ukládá do localStorage
- Po zavření a znovuotevření aplikace se zachovává
- Funguje napříč všemi režimy
- Implementováno pomocí React useEffect hooks

**Technické detaily:**
- `usedQuestions` state inicializován z localStorage
- Automatické ukládání při každé změně
- Klíč v localStorage: `usedQuestions`
- Formát: JSON array stringů (např. `["relationships-44", "career-12"]`)

**Soubory upraveny:**
- `src/App.tsx` (řádky 11-29, 36-46, 103-114)

---

## Technické informace

### Build metriky
```
dist/index.html                   0.48 kB │ gzip:  0.32 kB
dist/assets/index-6PhdJwlI.css    4.59 kB │ gzip:  1.52 kB
dist/assets/index-DLAPO71-.js   313.48 kB │ gzip: 98.93 kB
```

**Build čas:** ~1.8s
**Celková velikost (gzip):** ~101 KB

### Použité technologie
- React 19.0.0
- TypeScript 5.6.3
- Vite 5.4.21
- Vanilla CSS (bez frameworků)

---

## Struktura dat v localStorage

### `disclaimerShown`
```json
"true"
```
Indikuje, že disclaimer byl zobrazen a zavřen.

### `usedQuestions`
```json
["relationships-44", "career-12", "dreams-89", ...]
```
Array ID zodpovězených otázek ve formátu `{categoryId}-{questionIndex}`.

---

## Další možná vylepšení (TODO)

### Vysoká priorita
- [ ] Tlačítko pro reset pokroku (smazání localStorage)
- [ ] Export pokroku do souboru
- [ ] Import pokroku ze souboru

### Střední priorita
- [ ] Statistiky (celkový počet zodpovězených otázek, nejaktivnější kategorie)
- [ ] Dark/Light mode toggle
- [ ] Historie zobrazených otázek (možnost vrátit se zpět)
- [ ] Oblíbené otázky (označení a seznam)

### Nízká priorita
- [ ] PWA podpora (offline režim)
- [ ] Animace přechodů mezi otázkami
- [ ] Zvukové efekty
- [ ] Timer/Pomodoro režim
- [ ] Sdílení konkrétní otázky (share link)

---

## Změny v architektuře

### Původní verze (Next.js)
- Framework: Next.js 16
- Styling: Tailwind CSS 4
- node_modules: ~425 MB
- Build: několik MB

### Nová verze (Vite)
- Framework: Vite 5 + React 19
- Styling: Vanilla CSS
- node_modules: ~66 MB (85% menší)
- Build: ~304 KB (97% menší)
- Build čas: ~2s (80% rychlejší)

---

## Testování

### Funkční testy provedeny:
✅ Disclaimer modal - zobrazení při prvním načtení
✅ Disclaimer modal - neuložení při refreshi
✅ Progress counter - zobrazení u zodpovězených kategorií
✅ Progress counter - správné počítání (4/209 = 2%)
✅ Progress counter - vizuální progress bar
✅ LocalStorage - ukládání pokroku
✅ LocalStorage - načítání pokroku po refreshi
✅ Verze v patičce - zobrazení na hlavní obrazovce
✅ Všechny 3 režimy - funkční s novými features
✅ Production build - úspěšný build bez chyb

### Browser kompatibilita
- Testováno v Chrome/Chromium
- localStorage API (podporováno všemi moderními prohlížeči)
- React 19 (moderní prohlížeče)

---

## Poznámky pro další vývoj

### Doporučení:
1. Zvážit přidání tlačítka "Reset pokroku" do nastavení
2. Monitorovat velikost localStorage (limit ~5-10 MB)
3. Případně implementovat export/import pro zálohu pokroku
4. Zvážit přidání verze dat pro budoucí migrace

### Známé limitace:
- LocalStorage se čistí při vymazání dat prohlížeče
- Žádná synchronizace mezi zařízeními
- Maximální limit localStorage (~5MB v některých prohlížečích)

---

## Autor změn
**Datum:** 23. října 2025
**Verzе:** 1.0.0 (Vite)
**Status:** Experimentální - připraveno k testování

---

## Git repozitář
Inicializováno: 23.10.2025
Branch: master (default)

### První commit obsahuje:
- Kompletní Vite aplikace
- Všechny nové funkce (progress, disclaimer, verze)
- LocalStorage persistence
- Production build v `dist/`
- Dokumentace v README.md a CONTINUE.md
