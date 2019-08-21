interface UploadResponse {
    filename: string;
    fullAzureUrl: string;
    thumbnailAzureUrl: string
}

export default class Client {
    constructor(private apiKey: string) {
    }

    public async uploadBase64(base64: string): Promise<UploadResponse> {
        const result = await fetch("https://pet-eternal-api.azurewebsites.net/api/v1/images", {
            method: "POST",
            body: JSON.stringify({base64: base64}),
            headers: {
                "Content-Type": "application/json",
                "x-pet-eternal-api-key": this.apiKey
            },
        });

        if (result.status !== 200 && result.status !== 201) {
            const body = await result.text();
            console.error("Failed to upload image.", {text: body, result: result});
            throw new Error(`Failed to upload image. Response returned ${result.status} ${result.status}`);
        }

        return result.json();
    }
}
