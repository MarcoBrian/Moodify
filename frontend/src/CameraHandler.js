import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera,faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/Button";


export default function CameraHandler({
  isCameraOpen,
  setIsCameraOpen,
  setCardImage,
}) {

  const style = {"margin-bottom":"20px"}

  return isCameraOpen ? (
    <Button style={style} variant="warning"
      onClick={() => {
        setIsCameraOpen(false);
        setCardImage(undefined);
      }}
    >
      Close Camera <FontAwesomeIcon icon={faTimesCircle} />
    </Button>
  ) : (
    <Button style={style} variant="info" onClick={() => setIsCameraOpen(true)}>
      {" "}
      Open Camera <FontAwesomeIcon icon={faCamera} />{" "}
    </Button>
  );
}
