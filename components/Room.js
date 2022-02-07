import RTC from "../libs/rtc";
import Peer from "peerjs";
import { Input, Button, Container, Grid } from "@mui/material";
import randomWords from "random-words";

import { useState, useEffect, useRef } from "react";

export default function Room(props) {
  const currentUserVideoRef = useRef(null);
  const [peerId, setPeerId] = useState(randomWords({ exactly: 1 })[0]);
  const remoteUserVideoRef = [];
  for (const i = 0; i < 10; i++) {
    remoteUserVideoRef[i] = useRef(null);
  }

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
        remoteUserVideoRef[0].current.srcObject = remoteStream;
      });
    });
  }, []);

  //Call Function

  const call = async (remotePeerId, remoteRef) => {
    console.log("Calling " + remotePeerId);
    setIsCaller(true);
    const stream = await getMedia();
    const call = peerInstance.current.call(remotePeerId, stream);
    call.on("stream", function (remoteStream) {
      remoteRef.current.srcObject = remoteStream;
    });
  };

  //Updates DynamoDB to update RoomId with Attribute PersonId, adding this PersonID to the string set

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

  //Calls everyone in the room
  const callEveryone = async () => {
    console.log("Calling Everyonne in the Room");
    const res = await fetch(`/api/rooms/${props.roomId}`, { method: "GET" });
    const peopleId = await res.json();

    for (let i = 0; i < peopleId.length; i++) {
      if (peopleId[i] != peerId) {
        call(peopleId[i], remoteUserVideoRef[i]);
      }
    }
  };

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
      <Button onClick={() => callEveryone()}>Call Everyone</Button>

      <Grid container spacing={2}>
        <Grid item xs={4}>
          <video
            playsInline
            ref={currentUserVideoRef}
            width="500px"
            height="200px"
            autoPlay="true"
            controls={false}
            muted
          />
        </Grid>
        <Grid item xs={4}>
          <video
            playsInline
            ref={remoteUserVideoRef[0]}
            width="500px"
            height="200px"
            autoPlay="true"
            controls={false}
          />
        </Grid>
        <Grid item xs={4}>
          <video
            playsInline
            ref={remoteUserVideoRef[1]}
            width="500px"
            height="200px"
            autoPlay="true"
            controls={false}
          />
        </Grid>
        <Grid item xs={4}>
          <video
            playsInline
            ref={remoteUserVideoRef[2]}
            width="500px"
            height="200px"
            autoPlay="true"
            controls={false}
          />
        </Grid>
        <Grid item xs={4}>
          <video
            playsInline
            ref={remoteUserVideoRef[3]}
            width="500px"
            height="200px"
            autoPlay="true"
            controls={false}
          />
        </Grid>
        <Grid item xs={4}>
          <video
            playsInline
            ref={remoteUserVideoRef[4]}
            width="500px"
            height="200px"
            autoPlay="true"
            controls={false}
          />
        </Grid>
      </Grid>
    </>
  );
}
