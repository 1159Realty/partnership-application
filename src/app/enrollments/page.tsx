export const dynamic = "force-dynamic";

import { Enrollments } from "@/modules/enrollments";

interface Props {
  searchParams: Promise<{ enrollmentId: string }>;
}
async function EnrollmentsPage({ searchParams }: Props) {
  const { enrollmentId } = await searchParams;

  return <Enrollments enrollmentId={enrollmentId} />;
}

export default EnrollmentsPage;
