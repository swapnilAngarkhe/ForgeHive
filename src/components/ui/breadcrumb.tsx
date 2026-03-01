import * as React from "react"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export interface BreadcrumbItem {
  title: React.ReactNode
  href?: string
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  separator?: React.ReactNode
  className?: string
}

export function Breadcrumb({
  items,
  separator = <ChevronRight className="h-4 w-4" />,
  className,
}: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center text-sm text-muted-foreground", className)}
    >
      <ol className="flex items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <React.Fragment key={index}>
              <li className="flex items-center">
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {item.title}
                  </Link>
                ) : (
                  <span className={cn(isLast && "font-medium text-foreground")}>
                    {item.title}
                  </span>
                )}
              </li>
              {!isLast && (
                <li role="presentation" aria-hidden="true">
                  {separator}
                </li>
              )}
            </React.Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
