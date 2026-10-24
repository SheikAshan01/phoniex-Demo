import { StoreLocation } from "@/types";

export const STORE_CONTACT = {
  name: "PHONEX",
  tagline: "Sales | Services | Gadgets",
  phone: "088075 74880",
  phoneInternational: "+91 88075 74880",
  whatsapp: "918807574880",
  email: "phonex.net.in@gmail.com",
  operatingHours: "Monday – Sunday: 9:30 AM – 9:30 PM IST",
  socials: {
    facebook: "https://www.facebook.com/share/1EHFzPod4K/",
    instagram: "https://www.instagram.com/phonex_gadgets/",
    youtube: "https://youtube.com/@phonexdotnetdotin?si=gCuz28e-YvYFZSj6",
    pinterest: "https://pin.it/5lqJ7qio7",
  },
};

export const VERIFIED_LOCATIONS: StoreLocation[] = [
  {
    id: "loc-coimbatore",
    name: "PHONEX — Coimbatore Flagship",
    tagline: "Experience Center & Gadget Lounge",
    address: "Cross Cut Road, Gandhipuram",
    city: "Coimbatore, Tamil Nadu 641012",
    phone: "088075 74880",
    hours: "9:30 AM – 9:30 PM (All 7 Days)",
    servicesOffered: [
      "Custom Mobile Skin Laser Cutting & Heat Application",
      "Unbreakable Tempered Glass Application (₹99)",
      "Screen Glass OCA Replacement & Gadget Diagnosis",
      "Instant In-Store Pickups",
    ],
  },
  {
    id: "loc-annur",
    name: "PHONEX — Annur Branch",
    tagline: "Retail & Service Hub",
    address: "Main Road, Near Bus Stand",
    city: "Annur, Tamil Nadu 641653",
    phone: "088075 74880",
    hours: "9:30 AM – 9:00 PM (All 7 Days)",
    servicesOffered: [
      "Precision 3M Mobile Skins",
      "Tempered Glass Installation",
      "Chargers, Audio Accessories & Cables",
      "Fast Device Servicing",
    ],
  },
  {
    id: "loc-pulampatti",
    name: "PHONEX — P. Puliam patti Branch",
    tagline: "Gadget Store & Express Fit",
    address: "Bhavani Sagar Road",
    city: "P. Puliam patti, Tamil Nadu 638459",
    phone: "088075 74880",
    hours: "10:00 AM – 9:00 PM (All 7 Days)",
    servicesOffered: [
      "Custom Mobile Wraps & Vinyl Fitting",
      "Tempered Glass Fitting",
      "Mobile Accessories Sales",
    ],
  },
];
