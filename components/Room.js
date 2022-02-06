import RTC from "../libs/rtc";
import Peer from "peerjs";
import { Input, Button } from "@mui/material";
import randomWords from "random-words";

import { useState, useEffect, useRef } from "react";

export default function Room(props) {
  const currentUserVideoRef = useRef(null);
  const [peerId, setPeerId] = useState("");
  const remoteUserVideoRef = useRef(null);
  const [isCaller, setIsCaller] = useState(false);
  const peerInstance = useRef(null);
  const [remotePeerIdValue, setRemotePeerIdValue] = useState("");

  //Define getUserMedia function

  async function getMedia() {
    let stream = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      return stream;
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    async function startMedia() {
      const stream = await getMedia();
      currentUserVideoRef.current.srcObject = stream;
    }
    startMedia();
  }, []);

  //Creates new Peer
  useEffect(() => {
    let newPeerId = randomWords({ exactly: 1 });
    setPeerId(newPeerId);
    const peer = new Peer(newPeerId);
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

    navigator.mediaDevices.getUserMedia(
      { video: true, audio: true },
      function (stream) {
        const call = peerInstance.current.call(remotePeerId, stream);
        call.on("stream", function (remoteStream) {
          remoteUserVideoRef.current.srcObject = remoteStream;
        });
      },
      function (err) {
        console.log("Failed to get local stream", err);
      }
    );
  };

  return (
    <div>
      <h3>My Peer id is {peerId}</h3>
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
        muted
      />
    </div>
  );
}
