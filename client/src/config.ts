// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'tdhwyrken8'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  domain: 'dev-p5dw3dkqxkjsxfkf.us.auth0.com',            // Auth0 domain
  clientId: 'swIuwTcaO4OFEIElpLd3dXF5tBW2UTIy',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
