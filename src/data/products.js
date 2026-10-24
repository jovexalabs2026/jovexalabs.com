export const products = [
  {
    slug: 'dash-rush',
    name: 'Dash Rush: Endless Run & Jump',
    category: 'Mobile Game / Arcade / Endless Runner',
    description:
      'A fast-paced arcade endless runner focused on timing, jumping, movement, progression, and replayability. Family-friendly and built for quick, satisfying sessions.',
    status: 'In Testing · Coming Soon on Google Play',
    platforms: ['Android'],
  },
  {
    slug: 'jovexa-learn',
    name: 'Jovexa Learn',
    category: 'Educational Technology / Web Platform',
    description:
      'A free programming education platform with tutorials, examples, exercises, quizzes, and interactive coding tools. No account needed; source-code licensing is separate from free access.',
    status: 'Live · Free',
    platforms: ['Web'],
    link: '/learn',
    cta: 'Start Learning',
    projectPath: '/products/jovexa-learn',
    capabilities: [
      'Browse programming courses, lessons, exercises, and course quizzes.',
      'Try HTML, CSS, and JavaScript in the isolated Code Lab.',
      'Review learning progress saved on the current browser.',
    ],
    limitations: [
      'Learning progress and Code Lab drafts are device-only, not account-synchronized.',
      'Clearing browser storage can remove progress and saved drafts.',
      'No authoritative completion certificates or accreditation are offered in this release.',
      'Python, SQL, Git, and Flutter lessons do not provide their own executable runtimes.',
    ],
  },
  {
    slug: 'digital2030',
    name: 'Jovexa Digital 2030',
    category: 'Public Education / Browser Tools',
    description:
      'An independent initiative connecting free learning, official public-service links, online-safety guidance, and browser-only business drafts.',
    status: 'Limited Public Preview',
    platforms: ['Web'],
    link: '/digital2030',
    cta: 'Explore Public Preview',
    projectPath: '/products/digital2030',
    capabilities: [
      'Explore existing Jovexa Learn lessons without an account.',
      'Find official Philippine agency homepages; links are not agency integrations.',
      'Check text for heuristic warning signs without opening submitted URLs.',
      'Create local business-plan outlines, quotation drafts, and invoice drafts.',
    ],
    limitations: [
      'Live AI, accounts, administration, and cloud synchronization are unavailable.',
      'No PHBIN issuance, private-document upload, or business verification is provided.',
      'Warning checks cannot certify that a message is safe or fraudulent.',
      'Business drafts are not BIR-authorized tax invoices or professional advice.',
      'This is not a government, UN, or World Bank program or endorsed service.',
    ],
  },
];
