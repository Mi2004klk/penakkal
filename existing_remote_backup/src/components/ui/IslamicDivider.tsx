export default function IslamicDivider() {
  return (
    <div className="flex items-center justify-center py-8 opacity-70">
      <div className="h-px w-16 md:w-32 bg-[color:var(--color-border-default)]"></div>
      <div className="px-4 text-[color:var(--color-moss)] dark:text-[color:var(--color-lime-sprout)]">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" />
        </svg>
      </div>
      <div className="h-px w-16 md:w-32 bg-[color:var(--color-border-default)]"></div>
    </div>
  );
}

