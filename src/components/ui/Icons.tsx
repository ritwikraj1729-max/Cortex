import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const base = (props: IconProps) => ({
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  ...props,
});

export const IconDashboard = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3" y="3" width="7" height="9" rx="1.5" />
    <rect x="14" y="3" width="7" height="5" rx="1.5" />
    <rect x="14" y="12" width="7" height="9" rx="1.5" />
    <rect x="3" y="16" width="7" height="5" rx="1.5" />
  </svg>
);

export const IconQuest = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
  </svg>
);

export const IconStreak = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 2c2 4-2 5-2 8a4 4 0 008 0c0-2-1-3-1-3s1 5-2 5a2.5 2.5 0 01-2.5-2.5c0-2.5 2.5-3.5 1.5-7.5C15 5 18 8 18 13a6 6 0 11-12 0c0-4 3-6 6-11z" />
  </svg>
);

export const IconCalendar = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
);

export const IconJourney = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M9 3 3 6v15l6-3 6 3 6-3V3l-6 3-6-3z" />
    <path d="M9 3v15M15 6v15" />
  </svg>
);

export const IconReportings = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 21h18" />
    <rect x="5" y="12" width="3" height="7" />
    <rect x="11" y="7" width="3" height="12" />
    <rect x="17" y="3" width="3" height="16" />
  </svg>
);

export const IconPlus = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconX = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

export const IconTrash = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6h16z" />
  </svg>
);

export const IconPencil = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
  </svg>
);

export const IconPin = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 2a5 5 0 00-5 5c0 3 2 4.5 2 7H8l-1 2h10l-1-2h-1c0-2.5 2-4 2-7a5 5 0 00-5-5z" />
    <path d="M12 17v5" />
  </svg>
);

export const IconGrip = (p: IconProps) => (
  <svg {...base(p)} strokeWidth={0} fill="currentColor">
    {[0, 1, 2].map((row) =>
      [0, 1].map((col) => <circle key={`${row}-${col}`} cx={9 + col * 6} cy={6 + row * 6} r="1.6" />)
    )}
  </svg>
);

export const IconChevronLeft = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

export const IconChevronRight = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M9 18l6-6-6-6" />
  </svg>
);

export const IconChevronDown = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export const IconActivity = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

export const IconCheck = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const IconStar = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.8L5.8 21l1.6-7-5.4-4.7 7.1-.6z" />
  </svg>
);

export const IconBolt = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
  </svg>
);

export const IconHeart = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 21s-7-4.6-9.5-9A5.5 5.5 0 0112 5.5 5.5 5.5 0 0121.5 12c-2.5 4.4-9.5 9-9.5 9z" />
  </svg>
);

export const IconCrown = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 8l4 4 5-7 5 7 4-4-2 11H5L3 8z" />
  </svg>
);

export const IconGem = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 3h12l3 5-9 13L3 8z" />
    <path d="M3 8h18M9 3l-2 5 5 13 5-13-2-5" />
  </svg>
);

export const IconDatabase = (p: IconProps) => (
  <svg {...base(p)}>
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
  </svg>
);

export const IconDownload = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
  </svg>
);

export const IconUpload = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
  </svg>
);

export const IconRefresh = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M21 12a9 9 0 11-2.64-6.36M21 3v6h-6" />
  </svg>
);

export const LEVEL_ICONS = [IconStar, IconBolt, IconHeart, IconCrown, IconGem];

export function levelIconFor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) % 1000003;
  return LEVEL_ICONS[hash % LEVEL_ICONS.length];
}
