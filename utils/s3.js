import AWS from 'aws-sdk';
import dotenv from "dotenv"
import { nanoid } from 'nanoid'
dotenv.config();
// Enter copied or downloaded access ID and secret key here
const ID = process.env.AWS_ID;
const SECRET = process.env.AWS_SECRET_KEY;
const BUCKET_NAME = 'kanmusic';

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET,
    version: 'latest',
    region: 'eu-west-2',
    signatureVersion: 'v4',
});

const uploadFile = async (imageData,Key) => {


// Uploading files to the bucket
try {
    const uploadResult = await s3.putObject({
        Bucket: BUCKET_NAME,
        Key:Key,
        Body: imageData,
    }).promise()


    console.log(uploadResult);
    // return ({`URL: https://${BUCKET_NAME}.s3.eu-west-2.amazonaws.com/${fileKey}, res: await uploadResult` });

}
catch (e) {
    console.log(e);
    return;

}
}

export default uploadFile