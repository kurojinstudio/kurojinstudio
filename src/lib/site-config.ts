/**
 * ─────────────────────────────────────────────────────────────
 * KUROJIN SITE CONFIG — paste your real links here.
 * Every page/component reads from this single file.
 * ─────────────────────────────────────────────────────────────
 */
export const siteConfig = {
  name: "Kurojin",
  legalName: "Kurojin Studio",
  tagline: "A full-spectrum creative partner for modern brands.",
  japaneseMark: "黒人",

  contact: {
    // TODO: paste your real contact details
    email: "hello@kurojin.studio",
    phone: "+91 00000 00000",
    location: "India",
    // Form submissions go here. Options:
    //  - Formspree:  https://formspree.io/f/YOUR_ID
    //  - Web3Forms:  https://api.web3forms.com/submit  (+ accessKey below)
    //  - Your own API route: /api/contact
    formEndpoint: "/api/contact",
    web3formsAccessKey: "", // only needed if using web3forms
  },

  socials: [
    // Minimal set — only these two show in the footer
    { label: "Instagram", href: "https://instagram.com/kurojin.studio" },
    { label: "LinkedIn", href: "https://linkedin.com/company/kurojin-studio" },
  ],

  nav: [
    { label: "Home", href: "/" },
    { label: "Work", href: "/work" },
    { label: "Services", href: "/service" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
};

export type SiteConfig = typeof siteConfig;
