import { FadeIn } from '@/components/motion/fade-in';

type ContentPageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function ContentPageHero({
  eyebrow,
  title,
  description,
}: ContentPageHeroProps) {
  return (
    <header className="border-b border-border pb-10 md:pb-14">
      <FadeIn>
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted">
          {eyebrow}
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl text-balance md:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-muted leading-relaxed">
          {description}
        </p>
      </FadeIn>
    </header>
  );
}
