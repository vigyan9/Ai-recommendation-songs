import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { PlayArrow, Share } from "@mui/icons-material";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import PauseIcon from "@mui/icons-material/Pause";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
// id: 2179187047;
// readable: true;
// title: "Sad Song";
// title_short: "Sad Song";
// title_version: "";
// link: "https://www.deezer.com/track/2179187047";
// duration: 154;
// rank: 100000;
// explicit_lyrics: false;
// explicit_content_lyrics: 0;
// explicit_content_cover: 0;
// preview: "https://cdns-preview-8.dzcdn.net/stream/c-86f5660b90b3661dee9c13986cc3af74-6.mp3";
// md5_image: "944af3579cc7733647ce3d406fc8f891";
// AIzaSyC6GDc1xGilTZ4D - cw2bg2o_tCL0KORwV8;
const Item = styled(Paper)(({ theme = "dark" }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? "#1A2027" : "rgba(240, 187, 146,1)",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
export default function AlignItemsList({ emo }) {
  const apiKey = "AIzaSyC6GDc1xGilTZ4D-cw2bg2o_tCL0KORwV8";
  // const cx = "017576662512468239146:omuauf_lfve";
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(new Audio());
  const [img, setImg] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const audioRef = useRef(null);

  const toggleSong = (id, url) => {
    if (id === currentSong && isPlaying) {
      setIsPlaying(false);
      audioRef.current.pause();
    } else if (id !== currentSong) {
      setCurrentSong(id);
      setIsPlaying(true);
      audioRef.current.src = url;
      audioRef.current.play();
    } else {
      setIsPlaying(true);
      audioRef.current.play();
    }
  };
  React.useMemo(() => {
    console.log(emo, "emotion");
    async function fetchData() {
      try {
        const playlists = await fetchPlaylists();
        console.log(playlists);
        setPlaylists(playlists.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [emo?.emo]);
  // const uri = "https://api.deezer.com/search?q=%20songs&redirect_uri=http%253A%252F%252Fguardian.mashape.com%252Fcallback&index=25"
  async function fetchPlaylists() {
    const options = {
      method: "GET",
      url: "https://deezerdevs-deezer.p.rapidapi.com/search",
      params: { q: `${emo.emo} songs` },
      headers: {
        "X-RapidAPI-Key": "53fa27b24amsh4434edb036ce8fdp1240ddjsnf833a435c871",
        "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com",
      },
    };
    const response = await axios.request(options);
    return response.data;
  }
  // console.log(playlists, "songs");

  function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutes} min : ${formattedSeconds} sec`;
  }
  // console.log(playlists, "---> play");
  return (
    <div style={{ height: 400, overflow: "auto" }}>
      <List
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "100%",
          maxWidth: 360,
          bgcolor: "background.paper",
        }}
      >
        <h1
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            backgroundColor: "white",
          }}
        >{`${emo.emo} Song List`}</h1>
        {playlists &&
          playlists.map((item, i) => (
            <React.Fragment key={item?.id}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar
                    alt={item?.title}
                    src={item?.artist?.picture_medium}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={item?.title}
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {"Duration : "}
                      </Typography>
                      {formatTime(item?.duration)}
                      <div />
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {"Artist : "}
                      </Typography>
                      {item?.artist?.name}
                    </React.Fragment>
                  }
                />
                <IconButton
                  aria-label="play"
                  onClick={() => toggleSong(item?.id, item?.preview)}
                >
                  {isPlaying && item?.id === currentSong ? (
                    <PauseIcon />
                  ) : (
                    <PlayArrow />
                  )}
                </IconButton>
                <IconButton aria-label="share">
                  <Share />
                </IconButton>
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        <ListItem
          alignItems="flex-start"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "sticky",
            bottom: 0,
            zIndex: 1,
            backgroundColor: "white",
            height: "48px",
            opacity: 0.8,
          }}
        >
          <IconButton aria-label="pre">
            <ArrowBackIosIcon fontSize="medium" />
          </IconButton>
          <IconButton aria-label="next">
            <ArrowForwardIosIcon fontSize="medium" />
          </IconButton>
        </ListItem>
        <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
        {/* {currentSong && (
          <audio controls autoPlay>
            <source src={currentSong} type="audio/mpeg" />
          </audio>
        )} */}
      </List>
    </div>
  );
}
