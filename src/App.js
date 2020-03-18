import React from 'react';
import './webcams.css'
import Webcam from "react-webcam";
 

const AWS = require('aws-sdk')
const REGION='eu-west-1';

const CAMERA_WIDTH=480;
const CAMERA_HEIGHT=640;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      screenshot: null,
      tab: 0
    };
  }

componentWillMount(){
  this.AnonLog();
}


//Provides anonymous log on to AWS services
 AnonLog() {
    
  // Configure the credentials provider to use your identity pool
  AWS.config.region = REGION; // Region
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: '<Your identity pool>',
  });
  // Make the call to obtain credentials
  AWS.config.credentials.get(function () {
    // Credentials will be available when this function is called.
    var accessKeyId = AWS.config.credentials.accessKeyId;
    var secretAccessKey = AWS.config.credentials.secretAccessKey;
    var sessionToken = AWS.config.credentials.sessionToken;
  });
}

//Calls DetectFaces API and shows estimated ages of detected faces
 DetectFaces(imageData) {
  var rekognition = new AWS.Rekognition();
  var params = {
    Image: {
      Bytes: imageData
    },
    Attributes: [
      'ALL',
    ]
  };
  let parent = this;
  rekognition.detectFaces(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else {
       var result = JSON.stringify(data);
       //console.log(data.FaceDetails[0]['BoundingBox']);

       var bounding={
        'display':'none',
          };
        
       if (data.FaceDetails[0]!==undefined){
        var top = (CAMERA_HEIGHT*data.FaceDetails[0]['BoundingBox'].Top) + 'px';
        var left = (CAMERA_WIDTH*data.FaceDetails[0]['BoundingBox'].Left) + 'px';
        var height = (CAMERA_HEIGHT*data.FaceDetails[0]['BoundingBox'].Height)/2 + 'px';
        var width = (CAMERA_WIDTH*data.FaceDetails[0]['BoundingBox'].Width) + 'px';
  
         bounding={
          'position':'absolute',
          'top': top,
          'left': left,
          'height': height,
          'width': width,
          'border': '1px solid #ff0000',
          'backgroundColor': 'transparent'
        };
       }
       
      }
      parent.setState({boxStyle:bounding});
      document.getElementById("opResult").innerHTML = result;
    
  });
}

//Loads selected image and unencodes image bytes for Rekognition DetectFaces API
 ProcessImage(screenshot) {

  var image = atob(screenshot.split("data:image/jpeg;base64,")[1]);

  //unencode image bytes for Rekognition DetectFaces API 
  var length = image.length;
  var imageBytes = new ArrayBuffer(length);
  var ua = new Uint8Array(imageBytes);
  for (var i = 0; i < length; i++) {
    ua[i] = image.charCodeAt(i);
  }
  //Call Rekognition  
  this.DetectFaces(imageBytes);

}


  handleStart = () => {

    let parent = this;
    this.counter = setInterval(function(){

    const screenshot = parent.webcam.getScreenshot();
    parent.ProcessImage(screenshot);
    parent.setState({ screenshot });

    }, 333);
   
  }

  handleStop = () => {
    clearInterval(this.counter);
  }

  render() {
    return (
      <div>
        <h1>react-webcam-rekognition</h1>
        <div className='webcams'>
        <button onClick={this.handleStart}>Start</button>
        <button onClick={this.handleStop}>Stop</button>
        <table>
          <tr>
            <td>
                <Webcam
                  audio={false}
                  screenshotFormat="image/jpeg"
                  width={CAMERA_WIDTH}
                  height={CAMERA_HEIGHT}
                  ref={node => this.webcam = node}
                />
          </td>
            <td>
              <div id="output">
              {this.state.screenshot ? <img src={this.state.screenshot} alt=""/> : null}
              <div style={this.state.boxStyle}></div>
              </div>
          </td>
            </tr>
        </table>
       
        </div>
        <div id="opResult"></div>
      </div>
    );
  }
}

export default App;
