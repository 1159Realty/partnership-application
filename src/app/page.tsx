import { Home } from "@/modules/home";

interface Props {
  searchParams: Promise<{ propertyId: string }>;
}

export default async function HomePage({ searchParams }: Props) {
  const { propertyId } = await searchParams;

  return <Home propertyId={propertyId} />;
}
