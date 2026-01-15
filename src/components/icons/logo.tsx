import type { SVGProps } from 'react';

export function ForgeHiveLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2l8 4.5v9l-8 4.5-8-4.5v-9L12 2z" />
      <path d="M12 2v20" />
      <path d="M4 6.5l8 4.5 8-4.5" />
      <path d="M4 17.5l8-4.5 8 4.5" />
      <path d="M12 11.5v-5" />
      <path d="M12 22v-6.5" />
    </svg>
  );
}
