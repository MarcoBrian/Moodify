import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import SpotifyLogo from "./assets/images/spotify.png";
import Jumbotron from "react-bootstrap/Jumbotron"; 

const AUTH_URL =
  "https://accounts.spotify.com/authorize?\
client_id=18c397c8958e454789b576afa476a2b1&\
response_type=token&\
redirect_uri=http://localhost:3000&\
scope=streaming%20user-read-email%20user-read-private%20\
user-library-read%20user-library-modify%20user-top-read%20user-read-playback-state\
%20user-modify-playback-state";

export default function SpotifyLogin() {
  return (
    
    <Container style={{"margin-top":"5%"}}>
        <Jumbotron>
            
  <img src={SpotifyLogo}
          style={{"display": "block", 
            "max-width": "100%", 
            "max-height": "100%", 
            "width": "auto",
            "height": "100px"}}/>
  <h1>Spotify Recommendation Based on Emotion Facial Recognition</h1>
  <br/> 
  <p style={{"font-size":"30px"}}>
    Log in to your spotify account and we will try to recommend songs based on your current emotion!
  </p>
  
</Jumbotron>
    
      <Row>
        
      </Row>
      <a href={AUTH_URL}>
        <Button
          style={{ "margin-top": "auto", "margin-bottom": "auto" }}
          variant="success"
          size="lg"
          block
        >
          Login With Spotify
        </Button>
      </a>

      
    </Container>
  );
}
