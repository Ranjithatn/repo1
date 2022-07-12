import React, { Fragment } from 'react';
import Button from "../Button/Button";


class Webcam extends React.Component {


	constructor() {
		super();
		this.state = {
			constraints: {
				audio: false,
				video: { width: 300, height: 300 }
			},
			play: true,
			image: "",
      device: undefined,
		};
		this.cameraStream = null;
		this.canvas = null;
		this.initWebcam = this.initWebcam.bind(this);

		this.captureImage = this.captureImage.bind(this);
		this.playVideo = this.playVideo.bind(this);
		this.startWebcamVideo = this.startWebcamVideo.bind(this);

		// this.handleStartClick = this.handleStartClick.bind(this);
		// this.takePicture = this.takePicture.bind(this);
		// this.clearPhoto = this.clearPhoto.bind(this);
	}



	componentDidMount() {
		// console.log("componentDidMount");
		this.initWebcam();
		this.playVideo();
	}

  componentWillUnmount() {
    // console.log("Webcam::componentWillUnmount");
    if ( this.streamTracks && this.streamTracks.length > 0 ) {
      this.streamTracks.forEach( item => item.stop() );
    }
  }


	componentWillReceiveProps(nextProps) {
		// console.log("componentWillReceiveProps", nextProps);
		if ( nextProps.capture ) {
			this.captureImage();
		}
		else {
			// console.log("elsessssssssss");
			// this.initWebcam();
			this.playVideo();
		}
	}

	componentDidUpdate() {
		// console.log("componentDidUpdate");
		if ( this.state.play ) {
			// console.log("inside if.f..f.f.f.f")
			this.initWebcam();
			this.playVideo();
		}
	}


	startWebcamVideo() {
		// console.log("startWebcamVideo")
		this.setState({ play: true, image: "" });
		// this.initWebcam();
		// this.playVideo();
	}


	initWebcam() {
		// console.log("initWebcam", this.cameraStream);

		navigator.getUserMedia(
			{ video: true },
			// Success Callback
			(stream) => {
				// console.log("inside stream");
        this.streamTracks = stream.getTracks();
        // console.log("stream.getTracks()[0]; ", stream.getTracks()[0] );
        // console.log("this.streamTracks",this.streamTracks);
        if ( this.streamTracks.length > 0 ) {
          // Create an object URL for the video stream and
          // set it as src of our HTLM video element.
          this.cameraStream.src = window.URL.createObjectURL(stream);
          // this.setState({ device: true });
          // Play the video element to show the stream to the user.
        } else {
          if ( this.state.device !== false ) {
            this.setState({ device: false });
            this.props.noDeviceFound();
          }
        }
			},
			// Error Callback
			(err) => {
				// Most common errors are PermissionDenied and DevicesNotFound.
				console.error("error occoured", err);
        this.setState({ device: false });
        this.props.noDeviceFound();
			}
		);



	}



	playVideo() {
		// console.log("playVideo")
		this.cameraStream && this.cameraStream.play();
	}



	captureImage() {
		// console.log("captureImage", this.cameraStream);

		if ( ! this.state.play ) {
			return;
		}



    const hidden_canvas = this.canvas,
        context = hidden_canvas.getContext('2d');

    const width = this.cameraStream.videoWidth,
        height = this.cameraStream.videoHeight;

    if (width && height) {

        // Setup a canvas with the same dimensions as the video.
        hidden_canvas.width = width;
        hidden_canvas.height = height;

        // Make a copy of the current frame in the video on the canvas.
        context.drawImage(this.cameraStream, 0, 0, width, height);

        const image = hidden_canvas.toDataURL('image/png');;
        this.setState({ image: image, play: false });

        this.props && this.props.onCapture && this.props.onCapture(image);

        if ( this.streamTracks.length > 0 ) {
          this.streamTracks.forEach( item => item.stop() );
        }
        // this.streamTracks.stop();

        // Turn the canvas image into a dataURL that can be used as a src for our photo.
        // return hidden_canvas.toDataURL('image/png');
        // console.log("hidden_canvas",hidden_canvas.toDataURL('image/png'));
    }




		// this.setState({ play: false });
	}







	render() {

		// console.log("render", this.state, this.props, this.cameraStream);
    const { formatMessage } = this.props;



		return (
			<div className="component--webcam">


        { this.state.device === false &&
          <div style={{ textAlign: "center", fontSize: 20, color: "#FF0000" }}>{ formatMessage({ id: "cameraNotFound" }) }</div>
        }

        <Fragment>
  				{ this.state.play &&
  				<div>
  					<video id="camera-stream" ref={ (stream) => { this.cameraStream = stream } }></video>
  				</div>
  				}

  				{ ! this.state.play &&
  					<div>
  						<div>
  							<img src={`${this.state.image}`} alt="Captured Image" style={{ widht: "400px", height: "300px" }} />
  						</div>
                <Button
                  className="is-primary"
                  leftIcon="camera"
                  id="capturebtn"
                  text="Restart Video"
                  onClick={ () => { this.startWebcamVideo(); } }
                />
  					</div>
  				}

  				<canvas ref={ canvas => this.canvas = canvas } style={{ display: 'none' }}></canvas>
        </Fragment>


			</div>
		);

	}



}



export default Webcam;
