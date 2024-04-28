import Navbar from "@/src/components/Navbar/Navbar";
import { createServiceSupabaseClient, getUser } from "@/src/lib/supabase-server";
import { redirect } from "next/navigation";

export default async function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getUser();
  const supabaseService = createServiceSupabaseClient();

  if (!user) {
    return redirect("/sign-in");
  }
  if (!user.organization) {
    const domain = user.email.split("@")[1];
    const { data: org } = await supabaseService.from("organizations").select("*").eq('domain', domain).single();
    if (!org) {
      return redirect("/request-org");
    } else {
      await supabaseService.from("users").update({ organization_id: org.id }).eq("id", user.id);
      user.organization_id = org.id;
      user.organization = org;
    }
  }

  if (user.organization.status === "pending") {
    return redirect(`/pending-org`);
  }

  // if (!user.organization.public_key) {
  //   return redirect(`/create-public-key`)
  // }

  return (
    <>
      <Navbar />
      <main
        className="min-h-[calc(100dvh-4rem)] md:min-h[calc(100dvh-5rem)]"
        id="skip">
        {children}
      </main>
    </>
  );
}
