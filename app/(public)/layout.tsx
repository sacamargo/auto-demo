import { CompareBar } from '@/components/compare/compare-bar';
import { CompareProvider } from '@/components/compare/compare-context';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CompareProvider>
      <Header />
      <main className="w-full overflow-x-clip pb-28 min-[425px]:pb-24">{children}</main>
      <Footer />
      <CompareBar />
    </CompareProvider>
  );
}
