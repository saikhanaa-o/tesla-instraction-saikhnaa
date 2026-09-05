import Image from "next/image";
import { Arrow } from "@/components/arrow";
import { BookingLink } from "@/components/booking-link";
import { Header } from "@/components/header";
import { VehicleShowcase } from "@/components/vehicle-showcase";

export default function Home() {
  return (
    <div id="top">
      <Header />
      <main id="main">
        <section className="relative isolate flex min-h-[690px] flex-col items-center overflow-hidden bg-slate-700 text-center text-white sm:min-h-[780px] lg:h-[calc(100svh-72px)] lg:min-h-[720px] lg:max-h-[1000px]" aria-labelledby="hero-heading">
          <Image src="/assets/hero-model-3.png" alt="Уулсын дундах зам дээрх цэнхэр Tesla Model 3" fill priority sizes="100vw" className="-z-20 object-cover object-[50%_58%]" />
          <div className="absolute inset-0 -z-10 bg-linear-to-b from-black/35 via-transparent to-black/65" />
          <div className="enter px-5 pt-14 sm:pt-16">
            <p className="eyebrow mb-4 text-white/85">Ирээдүйг өнөөдөр жолоод</p>
            <h1 id="hero-heading" className="text-7xl font-medium leading-none tracking-[-0.055em] sm:text-8xl lg:text-[112px]">Model 3</h1>
            <p className="mt-5 text-sm text-white/90 sm:text-lg">Цахилгаан хүч. Цоо шинэ мэдрэмж.</p>
          </div>
          <div className="enter-delayed mt-auto w-full px-5 pt-64 pb-8 sm:pb-10">
            <div className="mx-auto flex max-w-lg flex-col justify-center gap-3 sm:flex-row">
              <BookingLink className="action action-blue flex-1" />
              <a href="#vehicles" className="action action-light flex-1">Загваруудтай танилцах</a>
            </div>
            <div className="mx-auto mt-8 flex max-w-lg items-center justify-between border-t border-white/25 pt-5 text-[10px] tracking-wider text-white/80 sm:text-xs"><span>100% ЦАХИЛГААН</span><span>МИНИМАЛ ДИЗАЙН</span><span>ШИНЭ МЭДРЭМЖ</span></div>
          </div>
        </section>

        <VehicleShowcase />

        <section id="drive" className="bg-surface py-16 lg:py-24" aria-labelledby="drive-heading">
          <div className="page-width grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <div>
              <p className="eyebrow mb-5 text-muted">02 / Жолоодлогын туршлага</p>
              <h2 id="drive-heading" className="section-title max-w-md">Өөрөө жолоодоод,<br />ялгааг нь мэдэр.</h2>
              <p className="mt-6 max-w-md text-base leading-7 text-muted">Чимээгүй бүхээг, энгийн удирдлага, цахилгаан хөдөлгүүрийн хариу үйлдэл. Tesla-г өөрийн хэмнэлээр нээж үзээрэй.</p>
              <div className="my-8 grid grid-cols-2 gap-5 border-y border-black/10 py-6"><div><p className="text-sm font-semibold">Танд тохирох цаг</p><p className="mt-2 text-xs leading-5 text-muted">Хуанлиас өдрөө сонгоорой</p></div><div className="border-l border-black/10 pl-5"><p className="text-sm font-semibold">Биечлэн танилцах</p><p className="mt-2 text-xs leading-5 text-muted">Асуултынхаа хариуг аваарай</p></div></div>
              <BookingLink className="action action-dark w-full sm:w-auto">Жолоодож үзэх цаг авах <Arrow /></BookingLink>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-neutral-200 lg:aspect-square">
              <Image src="/assets/fsd.png" alt="Tesla-ийн бүхээг болон жолоодлогын дэлгэц" fill sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/75 to-transparent p-6 pt-24 text-white"><p className="eyebrow mb-2 text-white/75">Технологи таны дэргэд</p><p className="text-xl font-medium">Full Self-Driving (Supervised)</p><p className="mt-2 max-w-sm text-xs leading-5 text-white/80">Жолоочийн байнгын хяналт шаардлагатай. Боломж нь бүс нутаг болон автомашины тохиргооноос хамаарна.</p></div>
            </div>
          </div>
        </section>

        <section id="discover" className="page-width py-20 lg:py-28" aria-labelledby="discover-heading">
          <div className="mb-9"><p className="eyebrow mb-3 text-muted">03 / Дараагийн алхам</p><h2 id="discover-heading" className="section-title">Tesla-тай эхлэх таны зам.</h2></div>
          <div className="grid gap-6 md:grid-cols-2">
            <article className="group grid overflow-hidden rounded-xl bg-surface sm:grid-cols-[1.1fr_0.9fr]">
              <div className="flex flex-col items-start p-7 lg:p-9"><p className="eyebrow text-muted">Танилцах</p><h3 className="mt-5 text-2xl font-medium tracking-tight">Таны дараагийн<br />автомашин.</h3><p className="mt-4 text-sm leading-6 text-muted">Загвар бүрийн онцлогийг харьцуулж, өөрт тохирох Tesla-г олоорой.</p><a href="#vehicles" className="mt-8 inline-flex min-h-11 items-center gap-3 text-sm font-semibold underline decoration-black/20 underline-offset-8 hover:decoration-black">Загвар сонгох <Arrow /></a></div>
              <div className="relative min-h-64"><Image src="/assets/inventory.png" alt="Tesla автомашины гадна дизайн" fill sizes="(max-width: 640px) 100vw, 30vw" className="object-cover transition duration-700 group-hover:scale-105 motion-reduce:transform-none" /></div>
            </article>
            <article className="group grid overflow-hidden rounded-xl bg-surface sm:grid-cols-[1.1fr_0.9fr]">
              <div className="flex flex-col items-start p-7 lg:p-9"><p className="eyebrow text-muted">Биечлэн мэдрэх</p><h3 className="mt-5 text-2xl font-medium tracking-tight">Зурагнаас илүү<br />бодит мэдрэмж.</h3><p className="mt-4 text-sm leading-6 text-muted">Суудалдаа тухалж, дэлгэцтэй танилцаж, жолоодлогыг өөрөө мэдрээрэй.</p><BookingLink className="mt-8 inline-flex min-h-11 items-center gap-3 text-sm font-semibold underline decoration-black/20 underline-offset-8 hover:decoration-black">Цаг захиалах <Arrow /></BookingLink></div>
              <div className="relative min-h-64"><Image src="/assets/offers.png" alt="Tesla автомашины интерьерийн деталь" fill sizes="(max-width: 640px) 100vw, 30vw" className="object-cover transition duration-700 group-hover:scale-105 motion-reduce:transform-none" /></div>
            </article>
          </div>
        </section>

        <section id="charging" className="overflow-hidden bg-[#f4f5f6]" aria-labelledby="charging-heading">
          <div className="page-width grid gap-10 pt-16 pb-10 lg:grid-cols-2 lg:items-end lg:pt-20">
            <div><p className="eyebrow mb-4 text-muted">04 / Цэнэглэлт</p><h2 id="charging-heading" className="section-title">Зам урт.<br />Боломж түүнээс ч их.</h2></div>
            <div className="max-w-md lg:justify-self-end"><p className="text-base leading-7 text-muted">Гэртээ, замдаа, зорьсон газартаа. Tesla-ийн цэнэглэлтийн шийдлүүдтэй танилцаж, аяллаа төлөвлөөрэй.</p><a href="https://www.tesla.com/findus" target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-11 items-center gap-3 text-sm font-semibold">Цэнэглэх байршил харах <Arrow /><span className="sr-only">(шинэ цонхонд)</span></a></div>
          </div>
          <div className="page-width pb-8"><div className="relative h-64 overflow-hidden rounded-xl sm:h-96 lg:h-[460px]"><Image src="/assets/charging-map.png" alt="Tesla цэнэглэх сүлжээний жишээ газрын зураг" fill sizes="100vw" className="object-cover" /><div className="absolute bottom-4 left-4 rounded-md bg-white/95 px-4 py-3 text-xs shadow-sm backdrop-blur-sm"><span className="mr-2 inline-block size-2 rounded-full bg-red-500" />Цэнэглэх сүлжээний тойм зураг</div></div></div>
          <div className="page-width grid gap-6 pb-16 sm:grid-cols-3 lg:pb-20">
            {[{ number: "01", title: "Гэртээ", copy: "Өдрөө цэнэгтэй эхлүүлэх энгийн дадал." }, { number: "02", title: "Замдаа", copy: "Аяллынхаа чиглэлд цэнэглэх цэгээ олох." }, { number: "03", title: "Зорьсон газартаа", copy: "Амрах зуураа дараагийн аялалдаа бэлдэх." }].map((item) => <div key={item.number} className="flex gap-4 border-t border-black/10 pt-6"><span className="pt-1 text-xs text-muted">{item.number}</span><div><h3 className="font-semibold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-muted">{item.copy}</p></div></div>)}
          </div>
        </section>

        <section id="energy" className="page-width py-20 lg:py-28" aria-labelledby="energy-heading">
          <div className="mb-9 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="eyebrow mb-3 text-muted">05 / Эрчим хүч</p><h2 id="energy-heading" className="section-title">Зөвхөн автомашинаас цааш.</h2></div><p className="max-w-xs text-sm leading-6 text-muted">Нарны эрчим хүчийг цуглуулж, хадгалж, өдөр тутамдаа ашигла.</p></div>
          <div className="grid gap-6 md:grid-cols-2">
            {[{ name: "Solar Panels", image: "solar-panels.png", description: "Гэрийнхээ эрчим хүчийг нарнаас.", href: "https://www.tesla.com/solarpanels" }, { name: "Powerwall", image: "powerwall.png", description: "Эрчим хүчээ хадгал. Бэлэн бай.", href: "https://www.tesla.com/powerwall" }].map((item) => <article key={item.name} className="group relative min-h-[440px] overflow-hidden rounded-xl bg-ink text-white lg:min-h-[540px]"><Image src={`/assets/${item.image}`} alt={item.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition duration-700 group-hover:scale-105 motion-reduce:transform-none" /><div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent" /><div className="absolute inset-x-0 bottom-0 p-7 lg:p-10"><h3 className="text-3xl font-medium tracking-tight lg:text-4xl">{item.name}</h3><p className="mt-3 text-sm text-white/85">{item.description}</p><a href={item.href} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex min-h-11 items-center gap-3 border-b border-white/40 text-sm font-semibold hover:border-white">Дэлгэрэнгүй <Arrow /><span className="sr-only">(шинэ цонхонд)</span></a></div></article>)}
          </div>
        </section>

        <section className="bg-surface px-5 py-20 text-center lg:py-24" aria-labelledby="booking-heading"><p className="eyebrow mb-4 text-muted">Таны цахилгаан аялал эндээс</p><h2 id="booking-heading" className="section-title">Унших нэг хэрэг.<br />Жолоодож үзэх өөр.</h2><p className="mx-auto mt-5 max-w-md text-sm leading-7 text-muted">Өөрт тохирох өдрөө сонгоод Tesla-тай танилцах эхний алхмаа хийгээрэй.</p><BookingLink className="action action-dark mt-8 w-full sm:w-auto">Жолоодож үзэх цаг авах <Arrow /></BookingLink></section>
      </main>
      <footer className="page-width py-10"><div className="flex flex-col items-start justify-between gap-7 border-b border-black/10 pb-8 sm:flex-row sm:items-center"><a href="#top" aria-label="Нүүр рүү буцах"><Image src="/assets/logo.png" alt="Tesla" width={108} height={14} className="h-auto" /></a><nav aria-label="Доод цэс" className="flex flex-wrap gap-x-6 gap-y-4 text-xs text-muted"><a href="#vehicles" className="hover:text-ink">Автомашин</a><a href="#charging" className="hover:text-ink">Цэнэглэлт</a><a href="#energy" className="hover:text-ink">Эрчим хүч</a><BookingLink className="hover:text-ink">Цаг захиалах</BookingLink></nav></div><div className="mt-6 flex flex-col justify-between gap-3 text-[11px] text-muted sm:flex-row"><span>Tesla © 2026</span><span>Цахилгаан ирээдүйг хамтдаа.</span></div></footer>
    </div>
  );
}
