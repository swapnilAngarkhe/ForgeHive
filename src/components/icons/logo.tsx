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
      {/* The main 'U' shape / cauldron. */}
      <path d="M5 12v5a7 7 0 0 0 14 0v-5" strokeWidth="3.5" />

      {/* Sparks on the left */}
      <path d="M8 8L6 6" />
      <path d="M9 11L7 9" />
      <path d="M6 11L4 9" />

      {/* Dot in the middle */}
      <circle cx="12" cy="6" r="1.2" fill="currentColor" stroke="none" />

      {/* Star on the right */}
      <path
        d="M18.5 2.5 L20 5 L18.5 7.5 L17 5 Z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}
