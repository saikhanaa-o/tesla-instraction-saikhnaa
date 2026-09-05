"use client";

import Image from "next/image";
import { useState } from "react";
import { Arrow } from "./arrow";
import { BookingLink } from "./booking-link";

const vehicles = [
  { name: "Model 3", type: "Цахилгаан спорт седан", image: "vehicle-model-3.png", description: "Цэвэрхэн шугам. Чимээгүй хүч.", detail: "Минимал интерьер, мэдрэгчтэй дэлгэц, өдөр тутмын аялалд зориулсан цахилгаан жолоодлогыг нэг дор мэдрээрэй.", features: ["Седан", "Минимал интерьер", "Бүрэн цахилгаан"] },
  { name: "Model Y", type: "Олон талт цахилгаан SUV", image: "vehicle-model-y.png", description: "Өдөр тутмаас адал явдал руу.", detail: "Гэр бүл, ажил, амралтын аялалдаа тохирох уужим орон зай болон уян хатан ачааны хэсэгтэй танилцаарай.", features: ["SUV", "Уужим орон зай", "Бүрэн цахилгаан"] },
  { name: "Model Y L", type: "Premium · Урт тэнхлэгтэй SUV", image: "vehicle-model-yl.png", description: "Илүү их орон зай. Илүү их боломж.", detail: "Урт тэнхлэгтэй загварын тав тух, зорчигчдын орон зай, интерьерийн шийдлүүдийг биечлэн үзэж сонирхоорой.", features: ["Premium SUV", "Урт тэнхлэг", "Бүрэн цахилгаан"] },
];

export function VehicleShowcase() {
  const [selected, setSelected] = useState(0);
  const vehicle = vehicles[selected];
  function select(index: number, focus = false) {
    const next = (index + vehicles.length) % vehicles.length;
    setSelected(next);
    if (focus) document.getElementById(`vehicle-tab-${next}`)?.focus();
  }
  return (
    <section id="vehicles" className="page-width py-20 lg:py-28" aria-labelledby="vehicles-heading">
      <div className="mb-9 flex flex-col justify-between gap-7 md:flex-row md:items-end">
        <div><p className="eyebrow mb-3 text-muted">01 / Автомашин</p><h2 id="vehicles-heading" className="section-title">Таны хэмнэлд тохирох Tesla.</h2></div>
        <div role="tablist" aria-label="Автомашины загвар" className="flex w-fit max-w-full gap-1 rounded-lg bg-surface p-1">
          {vehicles.map((item, index) => <button key={item.name} type="button" role="tab" id={`vehicle-tab-${index}`} aria-controls="vehicle-panel" aria-selected={selected === index} tabIndex={selected === index ? 0 : -1} onClick={() => select(index)} onKeyDown={(event) => {
            if (["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) {
              event.preventDefault();
              select(event.key === "Home" ? 0 : event.key === "End" ? vehicles.length - 1 : selected + (event.key === "ArrowRight" ? 1 : -1), true);
            }
          }} className={`min-h-11 whitespace-nowrap rounded-md px-4 text-sm font-medium transition sm:px-6 ${selected === index ? "bg-white text-ink shadow-sm" : "text-muted hover:text-ink"}`}>{item.name}</button>)}
        </div>
      </div>
      <div role="tabpanel" id="vehicle-panel" aria-labelledby={`vehicle-tab-${selected}`} tabIndex={0}>
        <div className="relative min-h-[520px] overflow-hidden rounded-xl bg-ink text-white sm:min-h-[600px]">
          <Image key={vehicle.image} src={`/assets/${vehicle.image}`} alt={vehicle.name} fill sizes="(max-width: 1440px) 100vw, 1312px" className="object-cover object-center" />
          <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/5 to-black/15" />
          <div className="absolute top-6 right-6 rounded-full border border-white/35 bg-black/15 px-4 py-2 text-[10px] tracking-[0.15em] backdrop-blur-md">БҮРЭН ЦАХИЛГААН</div>
          <div className="absolute inset-x-0 bottom-0 flex flex-col justify-between gap-7 p-6 sm:p-10 lg:flex-row lg:items-end lg:p-12">
            <div><p className="mb-2 text-sm text-white/80">{vehicle.type}</p><h3 className="text-5xl font-medium tracking-[-0.04em] sm:text-6xl">{vehicle.name}</h3><p className="mt-4 text-sm text-white/85 sm:text-base">{vehicle.description}</p></div>
            <div className="flex flex-col gap-3 sm:flex-row"><BookingLink className="action action-light" /><a href="#vehicle-details" className="action border border-white/50 bg-black/15 text-white backdrop-blur-sm hover:bg-white/15">Дэлгэрэнгүй <Arrow /></a></div>
          </div>
        </div>
        <div className="mt-5 flex items-center justify-between gap-4">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted sm:text-sm">{vehicle.features.map((feature) => <span key={feature}>{feature}</span>)}</div>
          <div className="flex shrink-0 items-center gap-2"><span className="mr-3 hidden text-xs tabular-nums text-muted sm:block">0{selected + 1} / 03</span><button type="button" aria-label="Өмнөх автомашин" onClick={() => select(selected - 1)} className="grid size-11 place-items-center rounded-full border border-black/10 hover:bg-surface"><Arrow direction="left" /></button><button type="button" aria-label="Дараах автомашин" onClick={() => select(selected + 1)} className="grid size-11 place-items-center rounded-full border border-black/10 hover:bg-surface"><Arrow /></button></div>
        </div>
        <div id="vehicle-details" className="mt-8 border-t border-black/10 pt-6"><p className="max-w-3xl text-sm leading-7 text-muted"><span className="font-semibold text-ink">{vehicle.name} — </span>{vehicle.detail}</p></div>
      </div>
    </section>
  );
}
