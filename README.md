# Tesla — Next.js + Tailwind CSS

Монгол хэлтэй, responsive Tesla танилцуулгын сайт. Next.js App Router, React, TypeScript болон Tailwind CSS v4 ашигласан.

## Ажиллуулах

Node.js 22 буюу түүнээс шинэ хувилбар шаардлагатай.

```bash
npm install
npm run dev
```

Хөтөч дээр http://localhost:3000 нээнэ. `index.html`-ийг шууд нээвэл хуучин статик загвар харагдана; шинэ сайт `app/page.tsx`-ээс ажиллана.

## Шалгах, production build

```bash
npm run lint
npm run typecheck
npm run build
npm start
```

## Бүтэц

- `app/page.tsx` — нүүр, жолоодлогын туршилт, танилцуулга, цэнэглэлт, эрчим хүчний хэсгүүд.
- `app/layout.tsx` — Монгол хэл, metadata, нэг удаа ачаалах Cal.com embed.
- `app/globals.css` — Tailwind theme, суурь хэв маяг, reduced-motion тохиргоо.
- `components/header.tsx` — responsive navigation, гар утасны цэс.
- `components/vehicle-showcase.tsx` — React state ашигласан автомашин сонголт; keyboard arrow, Home, End удирдлагатай tabs.
- `components/booking-link.tsx` — давтан ашиглах Cal.com pop-up холбоос.
- `lib/cal-embed.ts` — хэрэглэгчийн өгсөн Cal.com bootstrap.
- `public/assets/` — Next.js-ийн ашиглах эх зургууд.

`index.html`, `styles.css`, `assets/`, `motion/` нь өмнөх статик хувилбарын архив бөгөөд шинэ Next.js сайтад ачаалагдахгүй. Шинэ сайт React state болон Tailwind hover/animation ашиглана. Захиалга амжилттай болсон мэт харуулдаг хуучин demo товчнуудыг цаг захиалгын холбоосоор сольсон.

## Цаг захиалга

Жолоодож үзэх холбоосууд `otgonsaikhan-ulziibadrakh-hzizze/webdev20` захиалгыг `webdev20` namespace-тай Cal.com modal-д нээнэ. Сарын харагдац, жижиг дэлгэцийн slots харагдац, query parameter дамжуулалт хадгалагдсан. JavaScript байхгүй эсвэл embed ачаалагдаагүй үед холбоос нь Cal.com захиалгын хуудас руу шууд очно. Бодит цаг захиалах хүсэлтийг Cal.com боловсруулна.

Өмнөх загварын үнэ, санхүүжилт, цэнэглэгчийн тоо зэрэг баталгаажаагүй тоон мэдээллийг шинэ загварт ашиглаагүй. Газрын зураг нь статик тойм зураг; байршлын холбоос нь Tesla-ийн газрын зургийг нээнэ.
