import React, { Fragment, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Camera } from "./camera";
import { Root, Preview, Footer, GlobalStyle } from "./styles";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Jumbotron from "react-bootstrap/Jumbotron";
import * as SpotifyWebApi from "spotify-web-api-node";
import TrackSearchResult from "./TrackSearchResult"; 
import Player from "./Player"; 
import Form from "react-bootstrap/Form";

const Dashboard = (props) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cardImage, setCardImage] = useState();
  const [base64Image, setBase64Image] = useState("");
  const [emotionRes, setEmotionRes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [accessToken, setToken] = useState(props.code);
  
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [playingTrack, setPlayingTrack] = useState(); 

  const chooseTrack = (track) =>{
        setPlayingTrack(track);
  }


  const spotifyApi = new SpotifyWebApi({
    clientId: "18c397c8958e454789b576afa476a2b1",
  });

  useEffect(() => {
    // redirect user to login page once auth token expires
    window.setTimeout(function () {
      window.location.replace("http://localhost:3000");
    }, props.timeout * 1000);

    if (!accessToken) {
        return
    }
    console.log(accessToken); 

  }, [accessToken]);

  useEffect(() => {
    spotifyApi.setAccessToken(accessToken); 
    if (!search) return setSearchResults([])
    if (!accessToken) return

    let cancel = false
    spotifyApi.searchTracks(search).then(res => {
      if (cancel) return
      setSearchResults(
        res.body.tracks.items.map(track => {
          const smallestAlbumImage = track.album.images.reduce(
            (smallest, image) => {
              if (image.height < smallest.height) return image
              return smallest
            },
            track.album.images[0]
          )

          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: smallestAlbumImage.url,
          }
        })
      )
    })

    return () => (cancel = true)
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
      .then(() => {
        setIsLoading(false);
      });
  };

  return (
    <Container>
      <Row>
          <Col>
          <Form.Control
        type="search"
        placeholder="Search Songs/Artists"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="flex-grow-1 my-2" style={{ overflowY: "auto", height:"60vh"}}>
        {searchResults.map(track => {
          return <TrackSearchResult
            track={track}
            key={track.uri}
            chooseTrack={chooseTrack}
          /> }
        )}
        
      </div>

      <div>
          <Player accessToken={accessToken} trackUri={playingTrack?.uri}/>

      </div>
          
          </Col>
        <Col>
          {isCameraOpen && (
            <Camera
              onCapture={(blob) => handleCapture(blob)}
              onClear={() => {
                setCardImage(undefined);
                setEmotionRes("");
              }}
            />
          )}

          {cardImage && (
            <Button onClick={() => sendPictureToServer()}>
              {" "}
              Send Photo for Recommendation{" "}
            </Button>
          )}

          {isLoading ? (
            <Spinner animation="border" />
          ) : (
            emotionRes && <h1> Result: {emotionRes} </h1>
          )}

          {/* {cardImage && (
          <div>
            <h2>Preview</h2>
            <Preview src={cardImage && URL.createObjectURL(cardImage)} />
          </div>
        )} */}

          <Footer>
            <Button onClick={() => setIsCameraOpen(true)}>Open Camera</Button>
            <Button
              onClick={() => {
                setIsCameraOpen(false);
                setCardImage(undefined);
              }}
            >
              Close Camera
            </Button>
          </Footer>
        </Col>

      </Row>
    </Container>
  );
};

export default Dashboard;
