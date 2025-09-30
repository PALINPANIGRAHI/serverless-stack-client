const config = {
    s3: {
    REGION: "us-east-1",
    BUCKET: "palin-note-upload",
    },
    apiGateway: {
    REGION: "us-east-1",
    URL: "https://fnot7nxyzk.execute-api.us-east-1.amazonaws.com/prod",
},
cognito: {
REGION: "us-east-1",
USER_POOL_ID: "us-east-1_6rzmEx27T",
APP_CLIENT_ID: "cp9jv72pe9cjsi6lt8tpsossk",
IDENTITY_POOL_ID: "us-east-1:46519a4d-38c1-4778-bb7e-d7db06667388",
},
MAX_ATTACHMENT_SIZE: 5000000, // 5MB
};
export default config;
