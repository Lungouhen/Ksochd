"use client";

import { useEffect } from "react";

type GTMProps = {
  containerId: string;
  dataLayer?: Record<string, unknown>[];
};

export function GTMScript({ containerId, dataLayer = [] }: GTMProps) {
  useEffect(() => {
    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];

    // Add custom dataLayer items
    dataLayer.forEach((item) => {
      window.dataLayer.push(item);
    });

    // Load GTM script
    const script = document.createElement("script");
    script.innerHTML = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${containerId}');
    `;
    document.head.appendChild(script);

    return () => {
      // Cleanup
      const scripts = document.querySelectorAll(`script[src*="googletagmanager.com/gtm.js?id=${containerId}"]`);
      scripts.forEach((s) => s.remove());
    };
  }, [containerId, dataLayer]);

  return null;
}

export function GTMNoScript({ containerId }: { containerId: string }) {
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${containerId}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}

// Type extension for window.dataLayer
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}
