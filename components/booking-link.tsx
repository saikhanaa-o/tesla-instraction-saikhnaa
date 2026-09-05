import type { ReactNode } from "react";

export function BookingLink({ children = "Жолоодож үзэх", className = "action action-blue" }: { children?: ReactNode; className?: string }) {
  return (
    <a
      href="https://cal.com/otgonsaikhan-ulziibadrakh-hzizze/webdev20"
      data-cal-link="otgonsaikhan-ulziibadrakh-hzizze/webdev20"
      data-cal-namespace="webdev20"
      data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
      aria-haspopup="dialog"
      className={className}
    >{children}</a>
  );
}
