import SupabaseProvider from './SupabaseProvider';
import QueryProvider from './QueryProvider';
import { Toaster } from '@/src/components/ui/Toaster';
import { TooltipProvider } from '@/src/components/ui/tooltip';

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
  <>
      <SupabaseProvider>
        <QueryProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </QueryProvider>
      </SupabaseProvider>
      <Toaster />
    </>
  );
}
