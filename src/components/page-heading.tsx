export function PageHeading({
  eyebrow,
  title,
  description
}: {
  eyebrow?: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6 max-w-3xl animate-fade-up">
      {eyebrow && <p className="text-sm font-semibold text-primary">{eyebrow}</p>}
      <h1 className="mt-2 text-3xl font-semibold tracking-normal text-balance sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">{description}</p>
    </div>
  );
}
