import { getServerAuthSession } from "~/server/auth";
import SignInScreen from "./_components/SignInScreen";
import Dashboard from "./_components/Dashboard";

export default async function HomePage() {
  const session = await getServerAuthSession();
  return <>{session ? <Dashboard /> : <SignInScreen />}</>;
}
