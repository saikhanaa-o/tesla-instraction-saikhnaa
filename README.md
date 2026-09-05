# Tesla static website

Figma-ийн `Home • Desktop` (`1:206`) frame-д тулгуурласан responsive static HTML/CSS implementation.

## Ажиллуулах

`index.html`-ийг browser-оор шууд нээх эсвэл дурын static server ашиглана:

```bash
python -m http.server 8000
```

Дараа нь `http://localhost:8000` руу орно.

## Бүтэц ба motion-д бэлэн байдал

- `index.html` — semantic section, navigation, cards, metrics, footer.
- `styles.css` — design tokens, reusable button/card/carousel patterns, responsive breakpoints.
- `assets/` — Figma-аас татсан эх зураг болон icon asset-ууд.
- `data-section` болон `data-motion` attribute-ууд — дараагийн animation/interaction agent-ийн тогтвортой selector hook.
- `data-motion-target` / `data-motion-part` attribute-ууд — тухайн элементэд шууд bind хийгдсэн interaction hook (жишээ нь `magnetic-button`).

Одоогийн хувилбар цөөн хэдэн CTA button дээр Magnetic Button, мөн card-ууд дээр Spotlight Hover interaction-той. Carousel controls нь design-ийн static дүрслэл бөгөөд interaction дараа нь тусад нь нэмэхэд зориулагдсан.

## Motion модулиуд

- `motion/magnetic-button.js`, `motion/magnetic-button.css` — зөвхөн `[data-motion-target~="magnetic-button"]`-д тохирох button-уудад үйлчилнэ. Fine pointer cursor-ыг ойртоход товчийг ≤8px татаж, дотоод label-ийг 40%-иар нь дагуулж depth мэдрэмж үүсгэнэ; `pointerleave` үед 420–520ms spring-ээр анхны байрлалдаа буцна.
- `motion/spotlight-hover.js`, `motion/spotlight-hover.css` — зөвхөн `[data-motion-target~="spotlight-hover"]`-д тохирох card-уудад (FSD card, vehicle/energy showcase-card, promo-card) үйлчилнэ. Идэвхтэй card дотор pointer байрлалыг normalize хийж `--spot-x`/`--spot-y` (%) болгон дамжуулж, `::after` pseudo-element дээрх 260px radial-gradient spotlight-ийг чиглүүлнэ (image card дээр 0.16, light card дээр 0.08 хамгийн их opacity). 180ms fade in / 300ms fade out, нэг дор зөвхөн нэг card идэвхтэй.
- Хоёулаа Touch/coarse pointer болон `prefers-reduced-motion: reduce` үед бүрэн идэвхгүй, тус тусдаа тусгаарлагдсан: харгалзах `.js`/`.css` файл болон `index.html`-ийн `<link>`/`<script>` мөрийг устгахад static хуудас өөрчлөлтгүйгээр сэргэнэ (үлдэх `data-motion-target`/`data-motion-part` attribute болон label `<span>` нь visual-д нөлөөгүй).
