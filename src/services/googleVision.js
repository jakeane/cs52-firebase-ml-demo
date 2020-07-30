const vision = require('@google-cloud/vision');
const auth = require('google-auth-library');
const config = require('./service-account-file.json');
const image = require('./output.txt');

// const oauth2client = new auth.OAuth2Client(
//   config.client_id,
//   config.client_secret,
//   config.callback_uri
// );
// const authUrl = oauth2client.generateAuthUrl({
//   access_type: 'offline',
//   scope: [
//     // scopes for Dialogflow
//     'https://www.googleapis.com/auth/cloud-platform',
//     'https://www.googleapis.com/auth/cloud-vision',
//   ],
// });
// // redirect user to authUrl and wait for them coming back to callback_uri

// // in callback_uri handler, get the auth code from query string and obtain a token:
// const tokenResponse = await oauth2client.getToken(code);
// oauth2client.setCredentials(tokenResponse.tokens);
// process.env.GOOGLE_APPLICATION_CREDENTIALS =
//   '/Users/jackkeane/CS_Assignments/cs52/eli5/react-firebase/src/services/service-account-file.json';
// const client = new vision.ImageAnnotatorClient();

export const labelImage = async () => {
  console.log('labelling image');
  //   const [result] = await client.labelDetection(
  //     'https://static01.nyt.com/images/2020/04/13/nyregion/00nyvirus-streets001/00nyvirus-streets001-videoSixteenByNineJumbo1600.jpg'
  //   );
  //   const labels = result.labelAnnotations;
  //   console.log('Labels:', labels);
  const body = {
    requests: [
      {
        image: {
          content: image,
        },
        features: [
          {
            maxResults: 5,
            type: 'LABEL_DETECTION',
          },
        ],
      },
    ],
  };

  const requests = {
    body: JSON.stringify(body),
    mode: 'no-cors',
    method: 'POST',
  };
  fetch('https://vision.googleapis.com/v1/images:annotate', requests).then(
    (res) => {
      console.log(res.json);
    }
  );
};
