type PageHeaderProps = {
    eyebrow?: string;
    title: string;
    description?: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
    return (
        <header className="space-y-3">
            {eyebrow ? (
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    {eyebrow}
                </p>
            ) : null}
            <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
            {description ? (
                <p className="max-w-2xl text-sm leading-6 text-slate-600">{description}</p>
            ) : null}
        </header>
    );
}
