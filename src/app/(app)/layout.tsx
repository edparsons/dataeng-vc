import { getUser } from "@/src/lib/supabase-server";
import { redirect } from "next/navigation";

export default async function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getUser();
  if (!user) {
    return redirect("/sign-in");
  }
  return (
    <>
      {children}
    </>
  );
}
