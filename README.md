# react-webcam-rekognition

Demo application showing how to use react-webcam to continuously send images for recognition with Amazon Rekognition.

This demo uses the DetectFaces API to receive bounding box and other characteristics of the detected face.

However it could also be used to send data to the search faces API and identify a face from a collection
https://docs.aws.amazon.com/rekognition/latest/dg/API_SearchFaces.html


## Getting Started

Clone the repository 

```git clone https://github.com/thecraic/webcam-to-rekognition.git ```

## Install

```cd webcam-to-rekognition```

```npm install```

## Set up a cognito identity pool

Follow the instructions here and node the identity pool ID

https://docs.aws.amazon.com/rekognition/latest/dg/image-bytes-javascript.html#image-bytes-javascript-auth

## Configure the application with your identity pool ID

Replace the string in App.js with your identity pool ID. Include the region prefix.

```
 // Configure the credentials provider to use your identity pool
  AWS.config.region = REGION; // Region
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: '<Your identity pool>',
  });
```


## Start the server

``` npm run start ```








