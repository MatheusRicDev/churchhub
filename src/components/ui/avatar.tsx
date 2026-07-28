interface AvatarProps {
  name: string
  image?: string | null
  size?: "sm" | "md" | "lg"
}

const sizeStyles = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function Avatar({ name, image, size = "md" }: AvatarProps) {
  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className={`${sizeStyles[size]} rounded-full object-cover`}
      />
    )
  }

  return (
    <div
      className={`${sizeStyles[size]} rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center font-medium text-neutral-600 dark:text-neutral-300`}
    >
      {getInitials(name)}
    </div>
  )
}
