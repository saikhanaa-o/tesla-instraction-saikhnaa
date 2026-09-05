"use client";

import { useState, type FormEvent } from "react";
import { Arrow } from "./arrow";
import { BookingLink } from "./booking-link";

type Field = "name" | "email" | "phone";
type Errors = Partial<Record<Field, string>>;

const fields = [
  { name: "name", label: "Таны нэр", type: "text", autoComplete: "name", placeholder: "Нэрээ оруулна уу", hint: "Тантай хэрхэн хандаж харилцах вэ?", maxLength: 100 },
  { name: "email", label: "Имэйл хаяг", type: "email", autoComplete: "email", placeholder: "name@example.com", hint: "Холбоо барих имэйл хаягаа оруулна уу.", maxLength: 254 },
  { name: "phone", label: "Утасны дугаар", type: "tel", autoComplete: "tel", placeholder: "+976 9911 2233", hint: "Гадаад дугаар бол улсын кодоо хамт оруулна уу.", maxLength: 30 },
] as const;

function validate(name: Field, value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return { name: "Нэрээ оруулна уу.", email: "Имэйл хаягаа оруулна уу.", phone: "Утасны дугаараа оруулна уу." }[name];
  if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return "Имэйл хаягаа шалгана уу. Жишээ: name@example.com";
  if (name === "phone" && (!/^\+?[\d\s()-]+$/.test(trimmed) || !/^\d{8,15}$/.test(trimmed.replace(/\D/g, "")))) return "8–15 оронтой утасны дугаар оруулна уу.";
}

export function ContactSection() {
  const [errors, setErrors] = useState<Errors>({});
  const [unavailable, setUnavailable] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const nextErrors: Errors = {};
    for (const field of fields) {
      const error = validate(field.name, String(data.get(field.name) ?? ""));
      if (error) nextErrors[field.name] = error;
    }
    setErrors(nextErrors);
    setUnavailable(false);
    const firstInvalid = fields.find((field) => nextErrors[field.name]);
    if (firstInvalid) {
      event.currentTarget.querySelector<HTMLInputElement>(`[name="${firstInvalid.name}"]`)?.focus();
      return;
    }
    // No submission service is configured. Never report a successful send or
    // persist personal information locally while this is a design-only form.
    setUnavailable(true);
  }

  return (
    <section id="contact" aria-labelledby="contact-heading" className="page-width py-20 lg:py-28">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div className="lg:pt-8">
          <p className="eyebrow mb-4 text-muted">06 / Холбоо барих</p>
          <h2 id="contact-heading" className="section-title">Таны дараагийн алхмыг<br className="hidden sm:block" /> хамтдаа ярилцъя.</h2>
          <p className="mt-6 max-w-md text-base leading-7 text-muted">Загвар сонгох, цэнэглэлт эсвэл жолоодож үзэх талаар асуулт байна уу? Холбоо барих мэдээллээ энд оруулаарай.</p>
          <div className="mt-8 flex items-start gap-4 border-t border-black/10 pt-7">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-surface text-ink" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H5l-3 3V11.5A7.5 7.5 0 0 1 9.5 4h3A7.5 7.5 0 0 1 20 11.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M7 10h8M7 14h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </span>
            <div><p className="text-sm font-semibold">Биечлэн танилцахыг хүсэж байна уу?</p><BookingLink className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm text-muted underline decoration-black/20 underline-offset-4 hover:text-ink">Жолоодож үзэх цаг сонгох <Arrow /></BookingLink></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate aria-label="Холбоо барих мэдээлэл" aria-describedby="contact-required" className="rounded-xl border border-black/5 bg-surface p-6 sm:p-9 lg:p-10">
          <h3 className="text-xl font-medium tracking-tight sm:text-2xl">Холбоо барих мэдээлэл</h3>
          <p id="contact-required" className="mt-2 text-sm text-muted">Доорх бүх талбарыг бөглөнө үү.</p>
          <div className="mt-7 space-y-6">
            {fields.map((field) => (
              <div key={field.name}>
                <label htmlFor={`contact-${field.name}`} className="mb-2 block text-sm font-semibold">{field.label} <span className="text-muted" aria-hidden="true">*</span></label>
                <input
                  id={`contact-${field.name}`}
                  name={field.name}
                  type={field.type}
                  autoComplete={field.autoComplete}
                  inputMode={field.name === "phone" ? "tel" : field.name === "email" ? "email" : "text"}
                  maxLength={field.maxLength}
                  placeholder={field.placeholder}
                  required
                  aria-invalid={Boolean(errors[field.name])}
                  aria-describedby={`contact-${field.name}-hint${errors[field.name] ? ` contact-${field.name}-error` : ""}`}
                  onBlur={(event) => {
                    const error = validate(field.name, event.currentTarget.value);
                    setErrors((previous) => ({ ...previous, [field.name]: error }));
                  }}
                  onChange={() => {
                    setErrors((previous) => ({ ...previous, [field.name]: undefined }));
                    setUnavailable(false);
                  }}
                  className={`min-h-13 w-full rounded-md border bg-white px-4 py-3 text-base text-ink outline-none transition placeholder:text-muted/75 focus:border-accent focus:ring-3 focus:ring-accent/15 ${errors[field.name] ? "border-red-600" : "border-black/15 hover:border-black/30"}`}
                />
                <p id={`contact-${field.name}-hint`} className="mt-2 text-xs leading-5 text-muted">{field.hint}</p>
                {errors[field.name] && <p id={`contact-${field.name}-error`} className="mt-1 text-xs leading-5 text-red-700">{errors[field.name]}</p>}
              </div>
            ))}
          </div>
          <button type="submit" className="action action-dark mt-8 w-full">Холбоо барих хүсэлт илгээх <Arrow /></button>
          <div role="status" aria-live="polite" aria-atomic="true">
            {unavailable && <p className="mt-4 rounded-md border border-black/10 bg-white p-4 text-sm leading-6 text-muted">Одоогоор хүсэлт илгээх боломжгүй байна. Таны мэдээлэл илгээгдээгүй. Та <BookingLink className="font-semibold text-ink underline underline-offset-4">эндээс уулзалтын цаг сонгох</BookingLink> боломжтой.</p>}
          </div>
        </form>
      </div>
    </section>
  );
}
