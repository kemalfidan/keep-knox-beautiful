import { createClient } from "contentful-management";
import fs from "fs";
import { File } from "formidable";
import { ContentfulImage } from "utils/types";
import format from "date-fns/format";
const client = createClient({
    accessToken: process.env.CONTENTFUL_PERSONAL_TOKEN as string,
});

// mostly from https://github.com/hack4impact-utk/mindversity-website/blob/develop/server/actions/Contentful.ts

/**
 * @param image Image file of type Formidable.File to be uploaded.
 * @returns An object containing the uploaded image's asset ID and url.
 * @throws  Error if resource creation is unsuccessful
 */
export async function uploadImage(image: File) {
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE as string);
    const environment = await space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT as string);
    let asset = await environment.createAssetFromFiles({
        fields: {
            title: {
                "en-US": image.name,
            },
            description: {
                "en-US": "Image description",
            },
            file: {
                "en-US": {
                    contentType: image.type,
                    fileName: image.name,
                    file: fs.readFileSync(image.path),
                },
            },
        },
    });

    asset = await asset.processForAllLocales();
    asset = await asset.publish();

    //Delete image from local storage before ending upload
    fs.unlinkSync(image.path);

    if (!asset || !asset.fields.file["en-US"].url) {
        throw new Error("Asset creation unsuccessful.");
    } else {
        return { url: `https:${asset.fields.file["en-US"].url}`, assetID: asset.sys.id };
    }
}

/**
 * @param ID ID of the Contentful Asset to be deleted.
 */
export async function deleteAssetByID(id: string) {
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE as string);
    const environment = await space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT as string);
    const asset = await environment.getAsset(id);

    //Before an asset can be deleted, it has to be unpublished.
    await asset.unpublish();
    await asset.delete();
}
