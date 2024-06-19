import inquirer from "inquirer";
import axios from "axios";
import { GetCredentials } from "../utils/getCredentials";
import updateExistingEnvVariable from "../utils/updateEnv";

type SetupAnswers = {
  useGenerateBackend: boolean;
  alternateBackendUrl?: string;
  sessionToken: string;
};

async function GetSetupAnswers(): Promise<SetupAnswers> {
  return (await inquirer.prompt([
    {
      type: "confirm",
      name: "useGenerateBackend",
      message: "Do you want to use the hosted GenerateNU DevDB backend?",
    },
    {
      type: "input",
      name: "alternateBackendUrl",
      message: "Please enter the alternate DevDB URL:",
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      when: (answers) => answers.useGenerateBackend === false,
    },
    {
      type: "input",
      name: "sessionToken",
      message: "Please enter your DevDB token to authenticate:",
    },
  ])) as SetupAnswers;
}

export default async function SetupCLI() {
  const { alternateBackendUrl, sessionToken } = await GetSetupAnswers();

  const backendUrl = alternateBackendUrl ?? "https://routes-orcin.vercel.app";

  // Create an Axios instance
  const axiosInstance = axios.create({
    withCredentials: true, // Ensure credentials are sent with every request
  });

  // Verify you can connect to backend
  try {
    console.log(`Attempting to reach ${backendUrl}`);
    const { status } = await axiosInstance.get(`${backendUrl}/api/health`);
    if (status !== 200) {
      console.error("DevDB backend url not healthy, exiting...");
      process.exit(1);
    } else {
      await updateExistingEnvVariable("DEVDB_URL", backendUrl);
      console.log("Successfully reached the backend");
    }
  } catch (error) {
    console.error("DevDB backend url not healthy, exiting...");
    process.exit(1);
  } finally {
  }

  // Verify session token is valid
  try {
    console.log(`Attempting to authenticated token`);
    const credentials = await GetCredentials(backendUrl, sessionToken);
    // Add a request interceptor to include the cookie in the headers
    axiosInstance.interceptors.request.use(
      (config) => {
        // Set the cookie in the header
        config.headers.Cookie = credentials;

        return config;
      },
      (error) => {
        // Do something with request error
        return Promise.reject(error);
      },
    );

    const { status } = await axiosInstance.get(`${backendUrl}/api/trpc/health`);
    if (status !== 200) {
      console.error("Token not authenticated, exiting...");
      process.exit(1);
    } else {
      await updateExistingEnvVariable("DEVDB_TOKEN", sessionToken);
      console.log("Successfully authenticated the token");
    }
  } catch (error) {
    console.log(error);
    console.error("Token not authenticated, exiting...");
    process.exit(1);
  }
}
