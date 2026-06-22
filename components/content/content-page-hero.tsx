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
    <header className="border-b border-border pb-8 min-[375px]:pb-10 md:pb-14">
      <FadeIn>
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted">
          {eyebrow}
        </p>
        <h1 className="page-title mt-3 max-w-3xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base text-muted leading-relaxed min-[375px]:mt-5 min-[375px]:text-lg">
          {description}
        </p>
      </FadeIn>
    </header>
  );
}
