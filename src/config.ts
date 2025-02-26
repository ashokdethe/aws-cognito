// src/config.ts
export const awsConfig = {
    Auth:{
    userPoolId: 'ap-south-1_cB1IhxagR', // Replace with your User Pool ID
    userPoolWebClientId: '7f1ga34l1giudj579f6dnnpc6o', // Replace with your App Client ID
    region: 'ap-south-1', // Replace with your AWS region (e.g., us-east-1)
    oauth: {
        domain: "auth.mailio.ai",
        scope: ["openid", "email", "profile"],
        redirectSignIn: "http://localhost:3000",
        redirectSignOut: "http://localhost:3000",
        responseType: "code",
    },  
}
};