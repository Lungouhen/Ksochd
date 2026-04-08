// ─── CMS Page Builder Block Registry ────────────────────────────────────
// Defines all available block types, their metadata, default content/settings,
// and categories for the drag-and-drop page builder.

export type BlockDefinition = {
  type: string;
  label: string;
  icon: string; // Lucide icon name
  category: string;
  description: string;
  defaultContent: string;
  defaultSettings: Record<string, unknown>;
};

export const BLOCK_CATEGORIES = [
  "Content",
  "Media",
  "Layout",
  "Interactive",
  "Marketing",
  "Data Display",
  "Social & Forms",
] as const;

export const blockRegistry: BlockDefinition[] = [
  // ─── Content ──────────────────────────────────────────────
  {
    type: "HEADING",
    label: "Heading",
    icon: "Heading",
    category: "Content",
    description: "Section heading with configurable level (H1-H6)",
    defaultContent: "Section Heading",
    defaultSettings: { level: "h2", align: "left" },
  },
  {
    type: "PARAGRAPH",
    label: "Paragraph",
    icon: "AlignLeft",
    category: "Content",
    description: "Rich text paragraph block",
    defaultContent: "Enter your text here...",
    defaultSettings: { align: "left" },
  },
  {
    type: "QUOTE",
    label: "Blockquote",
    icon: "Quote",
    category: "Content",
    description: "Styled quotation block with attribution",
    defaultContent: "Your quote here",
    defaultSettings: { author: "", style: "bordered" },
  },
  {
    type: "CODE",
    label: "Code Block",
    icon: "Code",
    category: "Content",
    description: "Syntax-highlighted code snippet",
    defaultContent: "// Your code here",
    defaultSettings: { language: "javascript", showLineNumbers: true },
  },
  {
    type: "TABLE",
    label: "Table",
    icon: "Table",
    category: "Content",
    description: "Data table with configurable rows and columns",
    defaultContent: "[]",
    defaultSettings: { columns: 3, rows: 3, headerRow: true, striped: true },
  },
  {
    type: "ALERT",
    label: "Alert / Notice",
    icon: "AlertCircle",
    category: "Content",
    description: "Colored alert box (info, warning, success, error)",
    defaultContent: "Important notice here",
    defaultSettings: { variant: "info" },
  },
  {
    type: "ICON_LIST",
    label: "Icon List",
    icon: "List",
    category: "Content",
    description: "List with custom icons for each item",
    defaultContent: "[]",
    defaultSettings: { iconColor: "#0ea5a6", spacing: "normal" },
  },
  // ─── Media ────────────────────────────────────────────────
  {
    type: "IMAGE",
    label: "Image",
    icon: "Image",
    category: "Media",
    description: "Image block with alt text and caption",
    defaultContent: "",
    defaultSettings: { alt: "", caption: "", fit: "cover", rounded: true },
  },
  {
    type: "VIDEO",
    label: "Video",
    icon: "Video",
    category: "Media",
    description: "Embedded video (YouTube, Vimeo, or direct URL)",
    defaultContent: "",
    defaultSettings: { autoplay: false, controls: true, aspectRatio: "16:9" },
  },
  {
    type: "GALLERY",
    label: "Gallery",
    icon: "Images",
    category: "Media",
    description: "Multi-image gallery with lightbox",
    defaultContent: "[]",
    defaultSettings: { columns: 3, gap: 8, lightbox: true },
  },
  {
    type: "CAROUSEL",
    label: "Carousel",
    icon: "GalleryHorizontalEnd",
    category: "Media",
    description: "Image/content carousel with auto-play",
    defaultContent: "[]",
    defaultSettings: { autoplay: true, interval: 5000, dots: true, arrows: true },
  },
  {
    type: "MAP_EMBED",
    label: "Map Embed",
    icon: "MapPin",
    category: "Media",
    description: "Embedded Google Maps or OpenStreetMap",
    defaultContent: "",
    defaultSettings: { zoom: 14, height: 400 },
  },
  // ─── Layout ───────────────────────────────────────────────
  {
    type: "HERO",
    label: "Hero Banner",
    icon: "Maximize",
    category: "Layout",
    description: "Full-width hero section with CTA",
    defaultContent: "Welcome to Our Organization",
    defaultSettings: {
      subtitle: "Join us today",
      bgImage: "",
      bgColor: "#0f172a",
      ctaText: "Learn More",
      ctaLink: "#",
      overlay: true,
      height: "500px",
    },
  },
  {
    type: "DIVIDER",
    label: "Divider",
    icon: "Minus",
    category: "Layout",
    description: "Horizontal line separator",
    defaultContent: "",
    defaultSettings: { style: "solid", color: "#334155", spacing: 32 },
  },
  {
    type: "SPACER",
    label: "Spacer",
    icon: "MoveVertical",
    category: "Layout",
    description: "Vertical spacing block",
    defaultContent: "",
    defaultSettings: { height: 48 },
  },
  {
    type: "TABS",
    label: "Tabs",
    icon: "SquareStack",
    category: "Layout",
    description: "Tabbed content sections",
    defaultContent: "[]",
    defaultSettings: { variant: "underline" },
  },
  {
    type: "ACCORDION",
    label: "Accordion",
    icon: "ChevronDown",
    category: "Layout",
    description: "Expandable/collapsible content sections",
    defaultContent: "[]",
    defaultSettings: { allowMultiple: false },
  },
  {
    type: "CUSTOM_HTML",
    label: "Custom HTML",
    icon: "Code2",
    category: "Layout",
    description: "Raw HTML block for advanced customization",
    defaultContent: "<div>Custom content</div>",
    defaultSettings: {},
  },
  // ─── Interactive ──────────────────────────────────────────
  {
    type: "BUTTON",
    label: "Button",
    icon: "MousePointerClick",
    category: "Interactive",
    description: "Call-to-action button with link",
    defaultContent: "Click Me",
    defaultSettings: { href: "#", variant: "primary", size: "md", fullWidth: false },
  },
  {
    type: "FORM",
    label: "Form",
    icon: "FileText",
    category: "Interactive",
    description: "Embeddable form with configurable fields",
    defaultContent: "[]",
    defaultSettings: { submitText: "Submit", successMessage: "Thank you!" },
  },
  {
    type: "NEWSLETTER_FORM",
    label: "Newsletter Signup",
    icon: "Mail",
    category: "Interactive",
    description: "Email subscription form",
    defaultContent: "Subscribe to our newsletter",
    defaultSettings: {
      buttonText: "Subscribe",
      placeholder: "Enter your email",
      compact: false,
    },
  },
  {
    type: "FAQ_ACCORDION",
    label: "FAQ Section",
    icon: "HelpCircle",
    category: "Interactive",
    description: "Frequently asked questions with expandable answers",
    defaultContent: "[]",
    defaultSettings: { title: "Frequently Asked Questions" },
  },
  // ─── Marketing ────────────────────────────────────────────
  {
    type: "CTA_BANNER",
    label: "CTA Banner",
    icon: "Megaphone",
    category: "Marketing",
    description: "Call-to-action banner with heading, text, and button",
    defaultContent: "Ready to get started?",
    defaultSettings: {
      description: "Join thousands of members today",
      ctaText: "Join Now",
      ctaLink: "/register",
      bgColor: "#0ea5a6",
    },
  },
  {
    type: "TESTIMONIAL",
    label: "Testimonial",
    icon: "MessageSquareQuote",
    category: "Marketing",
    description: "Customer/member testimonial card",
    defaultContent: "This organization changed my life!",
    defaultSettings: { author: "", role: "", avatar: "", rating: 5 },
  },
  {
    type: "PRICING_TABLE",
    label: "Pricing Table",
    icon: "CreditCard",
    category: "Marketing",
    description: "Membership/pricing comparison table",
    defaultContent: "[]",
    defaultSettings: { columns: 3, highlightIndex: 1, currency: "₹" },
  },
  {
    type: "LOGO_GRID",
    label: "Logo Grid",
    icon: "LayoutGrid",
    category: "Marketing",
    description: "Grid of partner/sponsor logos",
    defaultContent: "[]",
    defaultSettings: { columns: 4, grayscale: true, title: "Our Partners" },
  },
  // ─── Data Display ─────────────────────────────────────────
  {
    type: "STATS_COUNTER",
    label: "Stats Counter",
    icon: "BarChart3",
    category: "Data Display",
    description: "Animated number counters for key stats",
    defaultContent: "[]",
    defaultSettings: { columns: 4, animate: true },
  },
  {
    type: "FEATURE_GRID",
    label: "Feature Grid",
    icon: "Grid3x3",
    category: "Data Display",
    description: "Grid of feature cards with icons",
    defaultContent: "[]",
    defaultSettings: { columns: 3, iconStyle: "rounded" },
  },
  {
    type: "TEAM_GRID",
    label: "Team / Members Grid",
    icon: "Users",
    category: "Data Display",
    description: "Grid of team member cards with photos and roles",
    defaultContent: "[]",
    defaultSettings: { columns: 4, showSocial: true },
  },
  {
    type: "TIMELINE",
    label: "Timeline",
    icon: "GitBranch",
    category: "Data Display",
    description: "Vertical timeline for history/milestones",
    defaultContent: "[]",
    defaultSettings: { lineColor: "#0ea5a6", alternating: true },
  },
  // ─── Social & Forms ───────────────────────────────────────
  {
    type: "SOCIAL_FEED",
    label: "Social Feed",
    icon: "Share2",
    category: "Social & Forms",
    description: "Embedded social media feed",
    defaultContent: "",
    defaultSettings: { platform: "twitter", handle: "", count: 5 },
  },
];

// ─── Helper functions ───────────────────────────────────────────────────

export function getBlockByType(type: string): BlockDefinition | undefined {
  return blockRegistry.find((b) => b.type === type);
}

export function getBlocksByCategory(category: string): BlockDefinition[] {
  return blockRegistry.filter((b) => b.category === category);
}

export function getAllBlockTypes(): string[] {
  return blockRegistry.map((b) => b.type);
}

export function createBlockInstance(
  type: string,
  order: number,
): {
  type: string;
  content: string;
  settings: Record<string, unknown>;
  order: number;
} {
  const def = getBlockByType(type);
  return {
    type,
    content: def?.defaultContent ?? "",
    settings: def?.defaultSettings ?? {},
    order,
  };
}
