/* Thin-stroke icons matching the theme's `icon_stroke: thin` setting. */

type IconProps = { className?: string }

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1,
  viewBox: "0 0 24 24",
  "aria-hidden": true,
} as const

export const MenuIcon = ({ className = "size-3.5" }: IconProps) => (
  <svg {...base} viewBox="0 0 14 14" strokeLinecap="round" className={className}>
    <path d="M1 3.5H13M1 10.5H13" />
  </svg>
)

export const CloseIcon = ({ className = "size-5" }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M5 5l14 14M19 5L5 19" />
  </svg>
)

export const SearchIcon = ({ className = "size-[22px]" }: IconProps) => (
  <svg {...base} viewBox="0 0 20 20" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="9" cy="9" r="4.75" />
    <path d="m12.5 12.5 3.25 3.25" />
  </svg>
)

export const CartIcon = ({ className = "size-[22px]" }: IconProps) => (
  <svg {...base} viewBox="0 0 20 20" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3.392 6.875h13.216v8.016c0 .567-.224 1.112-.624 1.513-.4.402-.941.627-1.506.627H5.522a2.13 2.13 0 0 1-1.506-.627 2.15 2.15 0 0 1-.624-1.513zM8.818 2.969h2.333c.618 0 1.211.247 1.649.686a2.35 2.35 0 0 1 .683 1.658v1.562H6.486V5.313c0-.622.246-1.218.683-1.658a2.33 2.33 0 0 1 1.65-.686" />
  </svg>
)

export const CartPlusIcon = ({ className = "size-5" }: IconProps) => (
  <svg {...base} viewBox="0 0 20 20" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16.608 9.421V6.906H3.392v8.016c0 .567.224 1.112.624 1.513.4.402.941.627 1.506.627H8.63M8.818 3h2.333c.618 0 1.212.247 1.649.686a2.35 2.35 0 0 1 .683 1.658v1.562H6.486V5.344c0-.622.246-1.218.683-1.658A2.33 2.33 0 0 1 8.82 3" />
    <path d="M14.608 12.563v5m2.5-2.5h-5" />
  </svg>
)

export const AccountIcon = ({ className = "size-[22px]" }: IconProps) => (
  <svg {...base} viewBox="0 0 20 20" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="10" cy="6.5" r="2.75" />
    <path d="m5.172 14.591-.437.786a.588.588 0 0 0 .514.873h9.502a.588.588 0 0 0 .514-.873l-.437-.786a5.523 5.523 0 0 0-9.656 0" />
  </svg>
)

export const CaretIcon = ({ className = "size-3.5" }: IconProps) => (
  <svg {...base} viewBox="0 0 14 14" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M11 5.5L7 9.5L3 5.5" />
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
