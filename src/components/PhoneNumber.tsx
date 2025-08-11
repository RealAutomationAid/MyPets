import React from "react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_E164, WHATSAPP_LINK } from "@/config/contact";

type PhoneNumberProps = {
  className?: string;
  linkClassName?: string;
  showWhatsApp?: boolean;
  whatsappTitle?: string;
  size?: "sm" | "md" | "lg";
};

const sizeToIcon = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

const gapBySize = {
  sm: "gap-1.5",
  md: "gap-2",
  lg: "gap-2.5",
};

const PhoneNumber: React.FC<PhoneNumberProps> = ({
  className,
  linkClassName,
  showWhatsApp = true,
  whatsappTitle = "WhatsApp",
  size = "md",
}) => {
  return (
    <span className={["inline-flex items-center", gapBySize[size], className].filter(Boolean).join(" ")}> 
      <a
        href={`tel:${CONTACT_PHONE_E164}`}
        className={["hover:underline", linkClassName].filter(Boolean).join(" ")}
      >
        {CONTACT_PHONE_DISPLAY}
      </a>
      {showWhatsApp && (
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={whatsappTitle}
          title={whatsappTitle}
          className="text-green-500 hover:text-green-600 transition-colors"
        >
          <WhatsAppIcon className={sizeToIcon[size]} />
        </a>
      )}
    </span>
  );
};

export default PhoneNumber;





