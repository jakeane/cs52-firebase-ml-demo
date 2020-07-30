const vision = require('@google-cloud/vision');
const auth = require('google-auth-library');
const config = require('./service-account-file.json');
const image = require('./output.txt');

// Creates a client
const client = new vision.ImageAnnotatorClient();

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
// const bucketName = 'Bucket where the file resides, e.g. my-bucket';
// const fileName = 'Path to file within bucket, e.g. path/to/image.png';

// Performs label detection on the gcs file
export const labelImage = async () => {
  const [result] = await client.labelDetection(
    `gs://cloud-samples-data/vision/label/setagaya.jpeg`
  );
  const labels = result.labelAnnotations;
  console.log('Labels:');
  labels.forEach((label) => console.log(label.description));
};

// export const labelImage = async () => {
//   console.log('labelling image');
//   //   const [result] = await client.labelDetection(
//   //     'https://static01.nyt.com/images/2020/04/13/nyregion/00nyvirus-streets001/00nyvirus-streets001-videoSixteenByNineJumbo1600.jpg'
//   //   );
//   //   const labels = result.labelAnnotations;
//   //   console.log('Labels:', labels);
//   const body = {
//     requests: [
//       {
//         image: {
//           content: image,
//         },
//         features: [
//           {
//             maxResults: 5,
//             type: 'LABEL_DETECTION',
//           },
//         ],
//       },
//     ],
//   };

//   const requests = {
//     body: JSON.stringify(body),
//     mode: 'no-cors',
//     method: 'POST',
//     header: {
//         "Authorization": "Bearer"
//     }
//   };
//   fetch('https://vision.googleapis.com/v1/images:annotate', requests).then(
//     (res) => {
//       console.log(res.json);
//     }
//   );
// };
