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

Одоогийн хувилбар JavaScript, transition, animation агуулаагүй. Carousel controls нь design-ийн static дүрслэл бөгөөд interaction дараа нь тусад нь нэмэхэд зориулагдсан.
