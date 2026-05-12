# Day 25 — Nickname Generator

30 günde 30 proje serisinin 25. günü. Tema bazlı, temiz ve gerçekten kullanılabilir takma adlar üreten bir araç.

---

## Konsept

Slidelarda anlatılan problem: çoğu nickname generator rastgele, cringe sonuçlar veriyor. Çözüm: kullanıcı bir **tema** seçer, biz o temaya özel **elle seçilmiş kelime havuzlarından** üretiriz — random gibberish yok.

---

## Tasarım Dili (seri ile birebir)

Bu seridek diğer projeleri (özellikle en son `timestamp-converter`) inceleyip aynı dili korudum:

- **Dark-first** zemin: `#0a0a0c` + üstte hafif radial gradient
- **Tek aksan rengi**: indigo `#6366f1` (favoriler için ikincil olarak `pink #f472b6` — sadece kalp ikonunda)
- **Surface katmanları**: `--surface`, `--surface-2`, `--surface-hover` — yumuşak border + soft shadow
- **Köşeler**: 20px (büyük kartlar) / 14px (input/segment) / pill (CTA ve etiketler)
- **Tipografi**: Inter (Google Fonts), monospace kart değerleri için system mono
- **Micro-interactions**: 180ms ease — hover'da subtle translateY + glow
- **İkonlar**: thin-line SVG, 12–14px stroke 1.5–1.6
- **Pure CSS + CSS custom properties** (Tailwind YOK — `timestamp-converter` ile aynı yaklaşım)

---

## Stack

| Katman | Seçim | Neden |
|---|---|---|
| Framework | React 19 + Vite 5 | Serideki standart |
| Styling | Pure CSS + design tokens | `timestamp-converter` ile aynı |
| State | `useState` + `useMemo` + `useCallback` | Tek dosyada manage edilebilir |
| Persistence | `localStorage` (favoriler) | Sunucu yok, tam client-side |
| Font | Inter (400/500/600/700) | Seri stack'i |

---

## Özellikler

1. **8 tema** (her biri 30 elle seçilmiş kelime ile)
   - Cyberpunk · Mythic · Cosmic · Nature · Vintage · Gamer · Aesthetic · Minimal
2. **3 uzunluk modu** — Short (1 kelime), Medium (2), Long (2 + sayı)
3. **4 case stili** — `lower`, `Capitalize`, `PascalCase`, `snake_case`
4. **Numbers toggle** — herhangi bir modda 1–99 arası rakam eklenebilir
5. **8'li batch generate** — tek tıkla yenilenir
6. **Favori sistemi** — kalp ikonu ile kaydet, `localStorage`'da kalır
7. **One-tap copy** — her kart üzerinde
8. **Favoriler paneli** — header'dan açılır, count badge ile

---

## Mimari Notlar

### Dosya yapısı
```
nickname-generator/
├── index.html
├── package.json
├── vite.config.js
├── README.md
├── PROJECT_NOTES.md  ← bu dosya
└── src/
    ├── main.jsx        (React mount)
    ├── App.jsx         (tüm UI + üretim mantığı)
    └── styles.css      (design tokens + komponent stilleri)
```

### Üretim algoritması
- `generateOne(words, length, caseMode, withNumbers)` — bir nick üretir
- `generateBatch(...)` — `Set` ile dedup yaparak `COUNT` (8) benzersiz nick üretir
- Long mode otomatik sayı ekler; "Numbers" toggle her modda zorla sayı ekleyebilir
- `applyCase` — case stiline göre birleştirme (snake_case ayrı, ortada `_` ile)

### State şeması
```js
{
  themeId: 'cyberpunk',          // aktif tema
  length: 'medium',              // 'short' | 'medium' | 'long'
  caseMode: 'capitalize',        // 'lower' | 'capitalize' | 'pascal' | 'snake'
  withNumbers: false,
  nicknames: string[],           // mevcut batch
  favorites: string[],           // localStorage senkronu
  copiedKey: string | null,      // copy feedback için
  showFavorites: boolean,
}
```

### Erişilebilirlik
- Tüm butonlarda `aria-label` veya görünür metin
- `role="switch"` + `aria-checked` toggle'da
- `aria-pressed` segment ve theme chip'lerde
- `:focus-visible` ile belirgin focus ring (aksan rengi)

---

## Yapı / Bileşenler

- **Header** — başlık + favoriler toggle (count pill ile)
- **Theme grid** (4×2 desktop, 2×4 mobile) — chip görünümünde tema seçici
- **Options block** — Length segmented, Case segmented, Numbers toggle
- **Generate row** — primary CTA + sayaç hint
- **Nick grid** (2 kolon) — kart başına: nick değeri + heart + copy
- **Favorites panel** (toggle ile açılır) — Clear all + grid
- **Credit footer**

---

## Tamamlandı / Test

- `npm install` — temiz (61 paket)
- `npm run build` — temiz (325ms, 8.42kB CSS gzip 2.25kB, 202.87kB JS gzip 63.69kB)
- `npm run dev` — `localhost:5173` 200 OK döndü
- Responsive: 720px ve 600px breakpoint'leri test edildi
- Klavye ile tam navigasyon mümkün

---

## Sonraki Adımlar (opsiyonel)

- Tema bazlı pastel aksan rengi (her tema kendi rengini açtığında subtle bir hue shift)
- "Avoid words" alanı (üretilen nick'lerde bu kelimeleri hariç tutma)
- Kullanılabilirlik kontrolü — yaygın sosyal platformlarda nick müsait mi (API)
- Slide içerikleri için statik export sayfası
