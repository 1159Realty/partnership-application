import { ResetPassword } from "@/modules/forgotPassword/Reset";

interface Props {
  searchParams: Promise<{ userId: string; code: string }>;
}

async function ResetPasswordPage({ searchParams }: Props) {
  const { userId, code } = await searchParams;

  const decodedUserId = atob(userId || "");
  const decodedToken = atob(code || "");

  return <ResetPassword userId={decodedUserId} token={decodedToken} />;
}

export default ResetPasswordPage;
