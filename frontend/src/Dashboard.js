import React, { Fragment, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Camera } from "./camera";
import { Root, Preview, Footer, GlobalStyle } from "./styles";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import * as SpotifyWebApi from "spotify-web-api-node";
import TrackSearchResult from "./TrackSearchResult";
import Player from "./Player";
import Form from "react-bootstrap/Form";
import "./Dashboard.css";
import CameraHandler from "./CameraHandler";
import {
  getPlaylistIDFromBody,
  getResultsFromPlaylist,
} from "./recommenation_utils";

const Dashboard = (props) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cardImage, setCardImage] = useState();
  const [base64Image, setBase64Image] = useState("");
  const [emotionRes, setEmotionRes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [accessToken, setToken] = useState(props.code);
  const [changeRecom, setChangeRecom] = useState(false);

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playingTrack, setPlayingTrack] = useState();
  const [userID, setUserID] = useState("");

  const chooseTrack = (track) => {
    setPlayingTrack(track);
  };

  const spotifyApi = new SpotifyWebApi({
    clientId: "18c397c8958e454789b576afa476a2b1",
  });

  useEffect(() => {
    // redirect user to login page once auth token expires
    window.setTimeout(function () {
      window.location.replace("http://localhost:3000");
    }, props.timeout * 1000);

    if (!accessToken) {
      return;
    }
  }, [accessToken]);

  //Emotion song recommendation logic
  useEffect(() => {
    spotifyApi.setAccessToken(accessToken);
    // spotifyApi.getMe().then(function(data) {
    // setUserID(data.body.id);
    // }, function(err) {
    //   console.log('Something went wrong!', err);
    // });
    console.log(changeRecom);

    switch (emotionRes) {
      case "undetected":
      case "surprise":
        // code block
        spotifyApi
          .getFeaturedPlaylists({ limit: 15, offset: 0 })
          .then(
            function (data) {
              return data.body;
            },
            function (err) {
              console.log("Something went wrong!", err);
            }
          )
          .then((body) => {
            var playlist_id = getPlaylistIDFromBody(body);
            return spotifyApi.getPlaylist(playlist_id);
          })
          .then(
            function (data) {
              var results = getResultsFromPlaylist(data);
              setSearchResults(results);
            },
            function (err) {
              console.log("Something went wrong!", err);
            }
          );

        break;
      case "neutral":
        spotifyApi.getMyTopTracks().then(
          function (data) {
            let topTracks = data.body.items;

            let results = topTracks.map((track) => {
              const smallestAlbumImage = track.album.images.reduce(
                (smallest, image) => {
                  if (image.height < smallest.height) return image;
                  return smallest;
                },
                track.album.images[0]
              );

              return {
                artist: track.artists[0].name,
                title: track.name,
                uri: track.uri,
                albumUrl: smallestAlbumImage.url,
              };
            });

            setSearchResults(results);
          },
          function (err) {
            console.log("Something went wrong!", err);
          }
        );
        break;
      case "fear":
      case "disgust":
        var searchParams = ["relax", "calming", "jazz", "piano"];
        var param =
          searchParams[Math.trunc(Math.random() * searchParams.length)];
        spotifyApi
          .searchPlaylists(param)
          .then(
            function (data) {
              return data.body;
            },
            function (err) {
              console.log("Something went wrong!", err);
            }
          )
          .then((body) => {
            var playlist_id = getPlaylistIDFromBody(body);
            return spotifyApi.getPlaylist(playlist_id);
          })
          .then(
            function (data) {
              var results = getResultsFromPlaylist(data);
              setSearchResults(results);
            },
            function (err) {
              console.log("Something went wrong!", err);
            }
          )
          .catch(() => {
            console.log("Error catched");
          });
        // code block
        break;
      default:
        spotifyApi
          .searchPlaylists(emotionRes)
          .then(
            function (data) {
              return data.body;
            },
            function (err) {
              console.log("Something went wrong!", err);
            }
          )
          .then((body) => {
            var playlist_id = getPlaylistIDFromBody(body);
            return spotifyApi.getPlaylist(playlist_id);
          })
          .then(
            function (data) {
              var results = getResultsFromPlaylist(data);
              setSearchResults(results);
            },
            function (err) {
              console.log("Something went wrong!", err);
            }
          )
          .catch(() => {
            console.log("Error catched");
          });
        break;
    }
  }, [emotionRes, changeRecom]);

  useEffect(() => {
    spotifyApi.setAccessToken(accessToken);
    if (!search) return setSearchResults([]);
    if (!accessToken) return;

    let cancel = false;
    spotifyApi.searchTracks(search).then((res) => {
      if (cancel) return;

      setSearchResults(
        res.body.tracks.items.map((track) => {
          const smallestAlbumImage = track.album.images.reduce(
            (smallest, image) => {
              if (image.height < smallest.height) return image;
              return smallest;
            },
            track.album.images[0]
          );

          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track?.uri,
            albumUrl: smallestAlbumImage.url,
          };
        })
      );
    });

    return () => (cancel = true);
  }, [search, accessToken]);

  const blobToBase64 = (blob) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    return new Promise((resolve) => {
      reader.onloadend = () => {
        resolve(reader.result);
      };
    });
  };

  const handleCapture = (blob) => {
    setCardImage(blob);
    blobToBase64(blob).then((res) => {
      // res is base64 now
      var base64notag = res.substr(res.indexOf(",") + 1);

      setBase64Image(base64notag);
    });
  };

  const sendPictureToServer = () => {
    setIsLoading(true);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: base64Image }),
    };

    fetch("http://localhost:5000/api/face_predict", requestOptions)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        var result = data.message;
        setEmotionRes(result);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Container
      fluid
      style={{
        "overflow-y": "auto",
        "background-color": "white",
        padding: "20px",
        "margin-top": "20px",
        height: "90vh",
      }}
    >
      <Row>
        <Col>
          <Form.Control
            type="search"
            placeholder="Search Songs/Artists"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div
            className="flex-grow-1 my-2"
            style={{ overflowY: "auto", height: "60vh" }}
          >
            {searchResults.map((track) => {
              return (
                <TrackSearchResult
                  track={track}
                  key={track.uri}
                  chooseTrack={chooseTrack}
                />
              );
            })}
          </div>
          <div>
            <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
          </div>
        </Col>

        <Col>
          <CameraHandler
            isCameraOpen={isCameraOpen}
            setIsCameraOpen={setIsCameraOpen}
            setCardImage={setCardImage}
            setEmotionRes={setEmotionRes}
          />

          {isCameraOpen && (
            <Camera
              onCapture={(blob) => handleCapture(blob)}
              onClear={() => {
                setCardImage(undefined);
                setEmotionRes(null);
              }}
            />
          )}

          <Row>
            <Col>
              {cardImage && (
                <Button
                  variant="outline-info"
                  onClick={() => {
                    sendPictureToServer();
                    setChangeRecom(!changeRecom);
                  }}
                >
                  {" "}
                  Get Emotion Recommendation{" "}
                </Button>
              )}
            </Col>

            <Col>
              {isLoading ? (
                <Spinner animation="border" variant="info" />
              ) : (
                emotionRes && (
                  <div
                    style={{
                      padding: "15px",
                      "background-color": "#181818",
                      "border-radius": "5px",
                    }}
                  >
                    <h2
                      style={{
                        "font-family": "Montserrat, sans-serif",
                        color: "white",
                      }}
                    >
                      {" "}
                      You are feeling {emotionRes}{" "}
                    </h2>
                  </div>
                )
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
