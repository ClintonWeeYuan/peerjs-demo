import RTC from "../libs/rtc";
import Peer from "peerjs";
import { Input, Button, Container } from "@mui/material";
import randomWords from "random-words";

import { useState, useEffect, useRef } from "react";

export default function Room(props) {
  const currentUserVideoRef = useRef(null);
  const [peerId, setPeerId] = useState(randomWords({ exactly: 1 })[0]);
  const remoteUserVideoRef = useRef(null);
  const [isCaller, setIsCaller] = useState(false);
  const peerInstance = useRef(null);
  const [remotePeerIdValue, setRemotePeerIdValue] = useState("");

  //Define getUserMedia function

  async function getMedia() {
    let stream = null;
    var getUserMedia =
      navigator.mediaDevices.getUserMedia ||
      navigator.mediaDevices.webkitGetUserMedia ||
      navigator.mediaDevices.mozGetUserMedia;
    try {
      stream = await getUserMedia({
        video: true,
        audio: true,
      });
      return stream;
    } catch (err) {
      console.log(err);
    }
  }

  //Starts own camera and microphone

  useEffect(() => {
    async function startMedia() {
      const stream = await getMedia();
      currentUserVideoRef.current.srcObject = stream;
    }
    startMedia();
  }, []);

  //Creates new Peer
  useEffect(() => {
    const peer = new Peer(peerId);
    peerInstance.current = peer;

    peer.on("open", () => {
      console.log(peer.id);
    });

    peer.on("call", async function (call) {
      console.log("Someone is attempting to call you");
      const stream = await getMedia();
      call.answer(stream);
      call.on("stream", function (remoteStream) {
        remoteUserVideoRef.current.srcObject = remoteStream;
      });
    });
  }, []);

  //Call Function

  const call = async (remotePeerId) => {
    console.log("Calling " + remotePeerId);
    setIsCaller(true);
    const stream = await getMedia();
    const call = peerInstance.current.call(remotePeerId, stream);
    call.on("stream", function (remoteStream) {
      remoteUserVideoRef.current.srcObject = remoteStream;
    });
  };

  //Updates Room to contain PeerId in DynamoDB

  useEffect(async () => {
    try {
      if (props.roomId) {
        const res = await fetch(`/api/rooms/${props.roomId}`, {
          method: "PUT",
          body: JSON.stringify({ personId: peerId }),
        });
      }
    } catch (err) {
      console.log(err);
    }
  }, [props.roomId]);

  return (
    <>
      <h3>My Peer id is {peerId}</h3>
      <h2>My room Id is {props.roomId}</h2>
      <Input
        value={remotePeerIdValue}
        onChange={(e) => {
          setRemotePeerIdValue(e.target.value);
        }}
        type="text"
      ></Input>
      <Button onClick={() => call(remotePeerIdValue)}>Call</Button>
      <video
        playsInline
        ref={currentUserVideoRef}
        width="500px"
        height="200px"
        autoPlay="true"
        controls={false}
        muted
      />
      <video
        playsInline
        ref={remoteUserVideoRef}
        width="500px"
        height="200px"
        autoPlay="true"
        controls={false}
      />
    </>
  );
}
