import { Octokit, App } from "octokit"; 

async function testWebHook(): Promise<void> {
    const repo = "cy2550";

    // Placeholder... need to figure out how to get access token
    const accessToken = process.env.GITHUB_ACCESS_TOKEN;
    const owner = "wyattchris"

    const app = new App({
        appId: "892635",
        privateKey: 'private-key.pem',
    });

    await app.octokit.request("/app");

    try {
        const response = await app.octokit.request(`POST /repos/${owner}/${repo}/hooks`, {
            owner: 'wyattchris',
            repo: 'cy2550',
            name: 'web',
            active: true,
            events: [
                'push',
                'pull_request'
            ],
            config: {
                url: 'https://example.com/webhook',
                content_type: 'json',
                insecure_ssl: '1'
            },
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        })

        // Assuming successful creation of webhook
        console.log(response.data);
        return response.data;
    } catch (error) {
        throw new Error("Failed to create webhook: " + error);
    }
}

testWebHook().then(() => console.log("Webhook created!")).catch((error) => console.error(error));