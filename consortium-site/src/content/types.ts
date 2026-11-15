// Every visible sentence of the consortium site, per language.
// ko.ts and ja.ts must have the same shape; the page and nav read only from here.

export type Locale = 'ko' | 'ja';

export type Content = {
  locale: Locale;
  meta: { title: string; description: string; siteName: string; ogLocale: string };
  ui: {
    skip: string;
    menu: string;
    close: string;
    navLabel: string;
    brandAria: string;
    brandName: string;
    brandSub: string;
    instituteHome: string;
    otherLanguage: { label: string; aria: string };
    scrollAria: string;
    footerNavLabel: string;
  };
  nav: [label: string, href: string][];
  hero: { keysAria: string; keys: [string, string, string]; lines: [string, string] };
  about: {
    no: string;
    label: string;
    statement: [string, string];
    intro: string;
    factsToggle: string;
    facts: [term: string, value: string][];
    keywords: { word: string; en: string; text: string }[];
  };
  research: {
    no: string;
    label: string;
    title: string;
    axes: { no: string; kind: string; title: string; places: string; text: string }[];
    planToggle: string;
    stages: {
      step: string;
      name: string;
      tag: string;
      question: string;
      years: [year: string, goal: string][];
    }[];
    methodsTitle: string;
    methods: [name: string, text: string][];
    shiftTitle: string;
    shiftFrom: string;
    shiftTo: string;
    shifts: [from: string, to: string][];
  };
  band: {
    label: string;
    title: [string, string];
    lead: string;
    steps: [string, string, string];
    words: { place: string; word: string; reading: string; text: string }[];
  };
  programs: {
    no: string;
    label: string;
    title: string;
    groups: { group: string; items: [name: string, text: string][] }[];
    note: string;
  };
  archive: {
    no: string;
    label: string;
    title: string;
    filmAria: string;
    filmPlay: string;
    filmType: string;
    filmTitle: string;
    outputs: { type: string; status: string; title: string; text: string }[];
    newsTitle: string;
    news: { date: string; kind: string; title: string; href: string }[];
  };
  people: {
    no: string;
    label: string;
    title: string;
    partners: { name: string; role: string; text: string; home?: boolean }[];
    leadRole: string;
    leadName: string;
    leadLines: [string, string];
    teamLabel: string;
    researchers: [name: string, place: string, field: string][];
  };
  footer: {
    name: string;
    institute: string;
    address: string;
    links: [label: string, href: string][];
    funding: string;
    copyright: string;
  };
};
