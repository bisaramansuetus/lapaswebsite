export function LogoMark({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="36" height="36" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 28V14C12 11.7909 13.7909 10 16 10H24C26.2091 10 28 11.7909 28 14V28"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M20 10V30" stroke="currentColor" strokeWidth="1.25" />
      <path d="M12 24C14.5 22.5 17.5 22.5 20 24C22.5 22.5 25.5 22.5 28 24" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}
