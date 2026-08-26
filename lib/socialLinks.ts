export interface SocialLink {
  name: string;
  url: string;
  handle: string;
  isExternal: boolean;
}

export const socialLinks: Record<string, SocialLink> = {
  github: {
    name: "GitHub",
    url: "https://github.com/JayantOlhyan/WDS-website",
    handle: "JayantOlhyan/WDS-website",
    isExternal: true,
  },
  msit: {
    name: "MSIT Official",
    url: "https://msit.in",
    handle: "msit.in",
    isExternal: true,
  },
  bugHunt: {
    name: "WDS Bug Hunt",
    url: "https://wds-bug-hunt.netlify.app/bug-hunt",
    handle: "wds-bug-hunt.netlify.app",
    isExternal: true,
  },
  email: {
    name: "Email",
    url: "mailto:hello@wds.msit",
    handle: "hello@wds.msit",
    isExternal: false,
  },
};
