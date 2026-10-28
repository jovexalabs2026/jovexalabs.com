export const packages = [
  {
    id: 'starter',
    name: 'Starter Website',
    priceUsd: 149,
    summary: 'A focused first website for a small business or new idea.',
    includes: [
      '1–3 pages',
      'Responsive design',
      'Contact form',
      'Social media links',
      'WhatsApp integration when requested',
      'Basic on-page SEO',
      'Deployment assistance',
      'One revision round',
    ],
  },
  {
    id: 'professional',
    name: 'Professional Business Website',
    priceUsd: 399,
    summary: 'A polished multi-page website for an established business.',
    includes: [
      'Up to 7 pages',
      'Custom business design',
      'CMS integration where appropriate',
      'Contact and inquiry forms',
      'Basic SEO configuration',
      'Analytics integration, subject to consent and configuration',
      'Social media integration',
      'Business email setup assistance',
      'Two revision rounds',
    ],
  },
  {
    id: 'ecommerce',
    name: 'E-commerce Website',
    priceUsd: 799,
    startingAt: true,
    summary: 'A product storefront with an agreed catalog and checkout platform.',
    includes: [
      'Online storefront and product catalog for up to 20 initial product listings',
      'Shopping cart',
      'One supported payment integration, subject to provider and country eligibility',
      'Order management',
      'Responsive design',
      'Basic SEO',
      'Store administration guidance',
    ],
  },
  {
    id: 'custom',
    name: 'Custom Web Platform',
    priceUsd: 1499,
    startingAt: true,
    summary: 'A project-specific application scoped and quoted for your requirements.',
    includes: [
      'Custom dashboards',
      'User accounts',
      'Database integration',
      'API development',
      'Booking systems and customer portals',
      'Business automation',
      'Advanced web applications',
      'Project-specific written quotation',
    ],
  },
];

export const maintenance = {
  priceUsd: 29,
  includes: [
    'Up to 30 minutes of agreed minor content updates per month',
    'Routine checks of agreed public pages and links',
    'Basic technical support by email',
  ],
  excludes: [
    'New features, redesigns, or development work',
    'Third-party subscription, hosting, and domain fees',
    'Guaranteed uptime monitoring or emergency response',
  ],
};

export const templates = [
  {
    slug: 'restaurant',
    name: 'Restaurant & Cafe',
    category: 'Food & hospitality',
    packageId: 'professional',
    brand: 'Saffron & Stone',
    headline: 'A table worth gathering around.',
    description: 'A warm neighborhood dining concept with an editable menu and reservation inquiry.',
    sectionTitle: 'From our kitchen',
    items: [
      { title: 'Seasonal menu', detail: 'Small plates · locally inspired' },
      { title: 'Sunday table', detail: 'Lunch · 11:30 am–3:00 pm' },
      { title: 'Private dining', detail: 'Gatherings for 8–24 guests' },
    ],
    action: 'Ask about a table',
    feedback: 'Sample reservation selected. No booking was sent.',
    color: '#b85739',
    soft: '#f4e9dc',
    ink: '#39231d',
  },
  {
    slug: 'hotel-resort',
    name: 'Hotel & Resort',
    category: 'Food & hospitality',
    packageId: 'professional',
    brand: 'Tide House',
    headline: 'A slower kind of escape.',
    description: 'A coastal stay concept with sample rooms, amenities, and a booking inquiry.',
    sectionTitle: 'Find your kind of stay',
    items: [
      { title: 'Garden room', detail: 'Queen bed · private terrace' },
      { title: 'Ocean suite', detail: 'King bed · sunrise balcony' },
      { title: 'House amenities', detail: 'Breakfast · pool · beach access' },
    ],
    action: 'Check sample dates',
    feedback: 'Sample booking inquiry selected. No reservation was made.',
    color: '#217c80',
    soft: '#e5f1ed',
    ink: '#173c40',
  },
  {
    slug: 'real-estate',
    name: 'Real Estate Agency',
    category: 'Property & construction',
    packageId: 'professional',
    brand: 'Northline Homes',
    headline: 'Find a place to call yours.',
    description: 'A property agency concept with example listings and an inquiry-first experience.',
    sectionTitle: 'Featured properties',
    items: [
      { title: 'The Courtyard House', detail: '3 bedrooms · 2 baths · sample listing' },
      { title: 'Harbor View Flat', detail: '2 bedrooms · city district · sample listing' },
      { title: 'Willow Lane Lot', detail: 'Residential land · sample listing' },
    ],
    action: 'Ask about a listing',
    feedback: 'Sample property inquiry selected. No message was sent.',
    color: '#55705c',
    soft: '#e9eee5',
    ink: '#26392c',
  },
  {
    slug: 'clothing-store',
    name: 'Online Clothing Store',
    category: 'Retail & commerce',
    packageId: 'ecommerce',
    brand: 'Common Thread',
    headline: 'Everyday pieces, made to last.',
    description: 'A small apparel storefront with sample categories, product cards, and a demo cart.',
    sectionTitle: 'New season, familiar favorites',
    items: [
      { title: 'Relaxed linen shirt', detail: 'Apparel · sample price $48', category: 'Apparel' },
      { title: 'Everyday tote', detail: 'Accessories · sample price $24', category: 'Accessories' },
      { title: 'Weekend overshirt', detail: 'Apparel · sample price $72', category: 'Apparel' },
    ],
    action: 'Add sample item',
    feedback: 'Sample item added to this demo only. No checkout or payment is available.',
    color: '#8a573e',
    soft: '#f4ece2',
    ink: '#382b25',
  },
  {
    slug: 'corporate',
    name: 'Corporate Business',
    category: 'Business & professional',
    packageId: 'professional',
    brand: 'Meridian Advisory',
    headline: 'Clarity for your next chapter.',
    description: 'A professional services concept with clear capabilities and a consultation CTA.',
    sectionTitle: 'Where we can help',
    items: [
      { title: 'Business strategy', detail: 'Practical plans for complex decisions' },
      { title: 'Operations', detail: 'Thoughtful systems for everyday work' },
      { title: 'Research', detail: 'Evidence-led insight and analysis' },
    ],
    action: 'Request a conversation',
    feedback: 'Sample consultation selected. No appointment was scheduled.',
    color: '#365e9d',
    soft: '#e8eef8',
    ink: '#1e3150',
  },
  {
    slug: 'dental-clinic',
    name: 'Medical & Dental Clinic',
    category: 'Health & education',
    packageId: 'professional',
    brand: 'Harbor Dental',
    headline: 'Care that feels considered.',
    description: 'A calm clinic concept with service information and an appointment inquiry.',
    sectionTitle: 'Care for every smile',
    items: [
      { title: 'Preventive care', detail: 'Checkups · cleaning · guidance' },
      { title: 'Restorative care', detail: 'A considered plan for your needs' },
      { title: 'First visit', detail: 'What to expect and how to prepare' },
    ],
    action: 'Request an appointment',
    feedback: 'Sample appointment request selected. No appointment was booked.',
    color: '#2c7776',
    soft: '#e5f2f0',
    ink: '#183f40',
  },
  {
    slug: 'school',
    name: 'School & Education',
    category: 'Health & education',
    packageId: 'professional',
    brand: 'Brightpath Academy',
    headline: 'Curiosity has room to grow.',
    description: 'A school website concept for programs, family information, and admissions inquiries.',
    sectionTitle: 'A path for every learner',
    items: [
      { title: 'Early years', detail: 'A welcoming start to school life' },
      { title: 'Middle grades', detail: 'Learning through questions and projects' },
      { title: 'Family guide', detail: 'Term dates · campus · admissions' },
    ],
    action: 'Ask about admissions',
    feedback: 'Sample admissions inquiry selected. No application was submitted.',
    color: '#b2762e',
    soft: '#f5efdf',
    ink: '#44341e',
  },
  {
    slug: 'portfolio',
    name: 'Personal Portfolio',
    category: 'Business & professional',
    packageId: 'starter',
    brand: 'Mika Reyes',
    headline: 'Designing useful things for real life.',
    description: 'A personal portfolio concept with sample projects, services, and contact details.',
    sectionTitle: 'Selected work',
    items: [
      { title: 'Fieldnotes', detail: 'Editorial identity · 2026' },
      { title: 'Open House', detail: 'Digital product concept · 2025' },
      { title: 'Local Grounds', detail: 'Brand system · 2025' },
    ],
    action: 'Start a project inquiry',
    feedback: 'Sample project inquiry selected. No message was sent.',
    color: '#73569a',
    soft: '#eee9f5',
    ink: '#342844',
  },
  {
    slug: 'construction',
    name: 'Construction Company',
    category: 'Property & construction',
    packageId: 'professional',
    brand: 'Fieldwork Build Co.',
    headline: 'Built with care. Made to last.',
    description: 'A construction company concept with service areas and illustrative project cards.',
    sectionTitle: 'Work we stand behind',
    items: [
      { title: 'Thoughtful renovation', detail: 'Residential · sample project' },
      { title: 'A new family home', detail: 'New build · sample project' },
      { title: 'Small commercial spaces', detail: 'Fit-out · sample project' },
    ],
    action: 'Discuss a project',
    feedback: 'Sample project inquiry selected. No quote was requested.',
    color: '#9a5d2f',
    soft: '#f2eade',
    ink: '#412d20',
  },
  {
    slug: 'technology-startup',
    name: 'Technology Startup',
    category: 'Business & professional',
    packageId: 'custom',
    brand: 'Northstar',
    headline: 'Make the work flow.',
    description: 'A software startup concept with product benefits and a guided product inquiry.',
    sectionTitle: 'Small steps, clearer work',
    items: [
      { title: 'One shared workspace', detail: 'Bring the moving pieces together' },
      { title: 'Useful automation', detail: 'Spend less time repeating tasks' },
      { title: 'A view of what matters', detail: 'Keep decisions grounded in context' },
    ],
    action: 'Explore the product',
    feedback: 'Product overview selected. This is a fictional demonstration.',
    color: '#3e69a9',
    soft: '#e8eff8',
    ink: '#203452',
  },
];

export function validateServiceCatalog() {
  const packageIds = new Set();
  for (const servicePackage of packages) {
    if (!servicePackage.id || packageIds.has(servicePackage.id)) {
      throw new Error('Service package IDs must be present and unique.');
    }
    if (!Number.isSafeInteger(servicePackage.priceUsd) || servicePackage.priceUsd <= 0) {
      throw new Error(`Package ${servicePackage.id} must have a positive integer USD price.`);
    }
    packageIds.add(servicePackage.id);
  }

  const templateSlugs = new Set();
  for (const template of templates) {
    if (!template.slug || templateSlugs.has(template.slug)) {
      throw new Error('Template slugs must be present and unique.');
    }
    if (!packageIds.has(template.packageId) || template.items.length < 3) {
      throw new Error(`Template ${template.slug} must reference a package and have sample content.`);
    }
    templateSlugs.add(template.slug);
  }
}

validateServiceCatalog();
