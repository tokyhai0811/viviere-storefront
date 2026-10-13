/* Thin-stroke icons matching the theme's `icon_stroke: thin` setting. */

type IconProps = { className?: string }

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1,
  viewBox: "0 0 24 24",
  "aria-hidden": true,
} as const

export const MenuIcon = ({ className = "size-5" }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M3 7h18M3 12h18M3 17h18" />
  </svg>
)

export const CloseIcon = ({ className = "size-5" }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M5 5l14 14M19 5L5 19" />
  </svg>
)

export const SearchIcon = ({ className = "size-5" }: IconProps) => (
  <svg {...base} className={className}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="M15.5 15.5L20 20" />
  </svg>
)

export const CartIcon = ({ className = "size-5" }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M5 8h14l-1 12H6L5 8z" />
    <path d="M9 8V6a3 3 0 016 0v2" />
  </svg>
)

export const AccountIcon = ({ className = "size-5" }: IconProps) => (
  <svg {...base} className={className}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
  </svg>
)

export const CaretIcon = ({ className = "size-3" }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M6 9l6 6 6-6" />
  </svg>
)

export const MinusIcon = ({ className = "size-3" }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M5 12h14" />
  </svg>
)

export const PlusIcon = ({ className = "size-3" }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M5 12h14M12 5v14" />
  </svg>
)
