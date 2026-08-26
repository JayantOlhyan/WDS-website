export interface SiteConfig {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  url: string;
  ogImage: string;
  campusHq: {
    room: string;
    department: string;
    institution: string;
    address: string;
    city: string;
    pincode: string;
  };
  contact: {
    email: string;
    collaborationEmail: string;
  };
  navItems: {
    name: string;
    href: string;
    isExternal?: boolean;
    badge?: string;
  }[];
}

export const siteConfig: SiteConfig = {
  name: "Web Development Society — MSIT",
  shortName: "WDS MSIT",
  tagline: "Build. Maintain. Ship.",
  description:
    "Official website of Web Development Society at Maharaja Surajmal Institute of Technology. A student-led technology organization building, maintaining, and shipping real digital platforms.",
  url: "https://wds-website-five.vercel.app", // Fallback or production domain
  ogImage: "/images/wds-logo.png",
  campusHq: {
    room: "Room No. 201",
    department: "Near CSE Department",
    institution: "Maharaja Surajmal Institute of Technology",
    address: "C-4 Janakpuri",
    city: "New Delhi",
    pincode: "110058",
  },
  contact: {
    email: "hello@wds.msit",
    collaborationEmail: "partnerships@wds.msit",
  },
  navItems: [
    { name: "ABOUT", href: "/about" },
    { name: "PROJECTS", href: "/projects" },
    { name: "BUG HUNT", href: "https://wds-bug-hunt.netlify.app/bug-hunt", isExternal: true, badge: "LIVE" },
    { name: "OPPORTUNITIES", href: "/opportunities" },
    { name: "RECRUITMENT", href: "/recruitment", badge: "2026" },
    { name: "TEAM", href: "/team" },
    { name: "TERMINAL", href: "/terminal" },
    { name: "HUB", href: "/hub" },
    { name: "CONTACT", href: "/contact" },
  ],
};
