import * as Bluebird from "bluebird";
import * as Req from "reqwest";

export default class Client
{
    constructor(private apiKey: string)
    {

    }

    public uploadBase64(base64: string)
    {
        const request = Req({
            url: "https://pet-eternal-api.azurewebsites.net/api/v1/images",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({base64: base64}),
            headers: {
                "Content-Type": "application/json",
                "x-pet-eternal-api-key": this.apiKey,
            }
        });

        return Bluebird.resolve<{filename: string; fullAzureUrl: string; thumbnailAzureUrl: string;}>(request);
    } 
}