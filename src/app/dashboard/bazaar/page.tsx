import { redirect } from "next/navigation";

export default async function DashboardBazaarRedirect({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const nextParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    const firstValue = Array.isArray(value) ? value[0] : value;

    if (!firstValue) {
      return;
    }

    nextParams.set(key === "search" ? "searchTerm" : key, firstValue);
  });

  const query = nextParams.toString();
  redirect(query ? `/bazaar?${query}` : "/bazaar");
}
