type LoginTitleProps = {
  title: string;
  subtitle?: string;
};

export function LoginTitle({ title, subtitle }: LoginTitleProps) {
  return (
    <header className="mb-8 text-center">
      <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
      {subtitle ? (
        <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
      ) : null}
    </header>
  );
}
