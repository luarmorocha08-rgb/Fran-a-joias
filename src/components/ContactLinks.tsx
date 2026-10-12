"use client";

import { track } from "@/lib/analytics";
import { whatsappUrl } from "@/lib/whatsapp";
import { useSite } from "./SiteProvider";

type Base = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  source: string;
  children: React.ReactNode;
};

/** Link real para o WhatsApp (wa.me) com registro de evento. */
export function WhatsAppLink({
  message,
  source,
  product,
  children,
  onClick,
  ...rest
}: Base & { message?: string; product?: { code: string; name: string } }) {
  const { whatsapp_number } = useSite();
  return (
    <a
      href={whatsappUrl(whatsapp_number, message)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        track("whatsapp_click", { source, product_code: product?.code, product_name: product?.name });
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

export function InstagramLink({ source, children, onClick, ...rest }: Base) {
  const { instagram_url } = useSite();
  return (
    <a
      href={instagram_url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        track("instagram_click", { source });
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
