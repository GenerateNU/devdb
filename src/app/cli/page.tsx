import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import SignInScreen from "../_components/SignInScreen";
import Navbar from "../_components/NavBar";

export default async function CLIInfo() {
    const session = await getServerAuthSession();
    const token = await api.token();

    return session ? <>
        <Navbar />
        <div className="min-h-screen min-x-screen">
            <div className="px-4 sm:px-12 md:px-24 lg:px-48 py-12 min-x-screen min-h-screen bg-gradient-to-b from-generate-dark to-black from-33 text-white">
                <div className=" text-lg">How to run:</div>
                <div>
                    <div className=" text-white">npx generate-devdb</div>
                    <div className=" text-white">bunx generate-devdb</div>
                </div>
                <div className=" text-lg">Token: {token ? token.sessionToken : "You aren't supposed to see this"}</div>
            </div>
        </div>
    </> : <SignInScreen />
    //return <>Token: {token ? token.sessionToken : "You aren't supposed to see this"}</>;
}
