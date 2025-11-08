import Image from "next/image"
import Link from "next/link"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  href?: string
}

export function Logo({ size = "md", href }: LogoProps) {
  const dimensionMap: Record<"sm" | "md" | "lg", number> = {
    sm: 72,
    md: 96,
    lg: 128,
  }

  const image = (
    <Image
      src="/icon.png"
      alt="QuickMail logo"
      width={dimensionMap[size]}
      height={dimensionMap[size]}
      className="object-contain"
      priority
    />
  )

  if (href) {
    return (
      <Link href={href} aria-label="QuickMail" className="inline-flex items-center hover:opacity-85 transition-opacity">
        {image}
      </Link>
    )
  }

  return <div className="inline-flex items-center">{image}</div>
}
