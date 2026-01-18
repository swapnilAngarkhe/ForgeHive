import type { SVGProps } from 'react';

export function ForgeHiveLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* The main 'U' shape / cauldron */}
      <path d="M5 19v-4l2-2h10l2 2v4" />

      {/* The upward arrows from the corners */}
      <path d="M3 15 l2-2 2 2" />
      <path d="M17 15 l2-2 2 2" />

      {/* The 'magic'/'sparks' coming out */}
      <path d="M9 12V8" />
      <path d="M12 12V6" />
      <path d="M15 12V8" />

      {/* The sparkle star and dot */}
      <path d="M18 3 l2 2" />
      <path d="M20 3 l-2 2" />
      <circle cx="17" cy="2.5" r="0.75" fill="currentColor" strokeWidth="0" />
    </svg>
  );
}
