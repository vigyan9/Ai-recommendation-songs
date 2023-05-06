import { useRef, useEffect, useState } from "react";
import "./App.css";
import APIKit from "../../spotify";
import * as faceapi from "face-api.js";
import { useDispatch } from "react-redux";
import Slider from "../../components/slide/index.tsx";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import axios from "axios";
import SongList from "../../components/List";
import Emoji from "../../components/emoji";

const Item = styled(Paper)(({ theme = "dark" }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function App() {
  let mx = 0;
  let emotion = "";
  const videoRef = useRef();
  const canvasRef = useRef();
  const dispatch = useDispatch();
  const [isEpressionMode, setIsEpressionMode] = useState(true);
  const [emo, setEmo] = useState({
    emo: "",
    confi: 0,
  });

  useEffect(() => {
    startVideo();

    isEpressionMode && videoRef && loadModels();
    // return stopVideo();
  }, [isEpressionMode]);

  const loadModels = () => {
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models"),
    ]).then(() => {
      if (isEpressionMode) {
        faceDetection();
      }
    });
  };

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: isEpressionMode ? true : false })
      .then((currentStream) => {
        videoRef.current.srcObject = currentStream;
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const stopVideo = () => {
    const stream = videoRef?.current?.srcObject;
    if (!stream) {
      return;
    }

    const tracks = stream.getTracks();
    tracks.forEach((track) => {
      track.stop();
    });

    videoRef.current.srcObject = null;
  };

  const faceDetection = async () => {
    const intervalId = setInterval(async () => {
      console.log(" yanah gadbad");
      const stream = videoRef?.current?.srcObject;
      if (!stream) {
        clearInterval(intervalId); // stop the interval
        return;
      }
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(
        videoRef.current
      );
      faceapi.matchDimensions(canvasRef.current, {
        width: 480,
        height: 360,
      });

      const resized = faceapi.resizeResults(detections, {
        width: 480,
        height: 360,
      });

      faceapi.draw.drawDetections(canvasRef.current, resized);
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);
      faceapi.draw.drawFaceExpressions(canvasRef.current, resized);

      if (detections[0]?.expressions) {
        Object.keys(detections[0].expressions).map((item) => {
          if (detections[0].expressions[item] * 100 > mx) {
            mx = detections[0].expressions[item] * 100;
            emotion = item;
          }
        });

        dispatch({
          type: "expression",
          emotion,
        });
        stopVideo();
        setIsEpressionMode(false);
        setEmo({
          emo: emotion,
          confi: mx,
        });
        clearInterval(intervalId); // stop the interval
      }
    }, 1000);
  };

  return (
    <div className="app">
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Item>
              <h1> AI FACE DETECTION WITH SONG RECOMMENDATION (BETA)</h1>
            </Item>
          </Grid>
          <Grid item xs={8}>
            <Grid container justifyContent="center" alignItems="center">
              <Item>
                {isEpressionMode ? (
                  <>
                    <div className="app__video">
                      <video
                        crossOrigin="anonymous"
                        ref={videoRef}
                        autoPlay
                      ></video>
                    </div>
                    <canvas
                      ref={canvasRef}
                      width="940"
                      height="650"
                      className="app__canvas"
                    />
                  </>
                ) : (
                  // <SongList emo={emo} />
                  <SongList emo={emo} />
                )}
                {/* {!isEpressionMode ? <Emoji /> : null} */}
              </Item>
            </Grid>
          </Grid>
          <Grid item xs={4}>
            <Item>
              <>
                <h1>{`Your emotion is ${
                  emo.emo
                } and confidence ${emo.confi.toFixed(2)}%`}</h1>
              </>
            </Item>
          </Grid>
          {/* <Grid item xs={4}>
            <Item></Item>
          </Grid>
          <Grid item xs={6}>
            <Item>xs=8</Item>
          </Grid> */}
        </Grid>
      </Box>
      {/* <SongList emo={emo} /> */}
    </div>
  );
}

export default App;
