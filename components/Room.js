import RTC from "../libs/rtc";
import Peer from "peerjs";
import { Input, Button, Container, Grid } from "@mui/material";
import randomWords from "random-words";

import { useState, useEffect, useRef, useReducer } from "react";
import io from "socket.io-client";

let socket;
export default function Room(props) {
  const currentUserVideoRef = useRef(null);
  const [peerId, setPeerId] = useState(randomWords({ exactly: 1 })[0]);
  const [remoteId, setRemoteId] = useState([]);

  const remoteUserVideoRef = useRef([]);

  const [isCaller, setIsCaller] = useState(false);
  const peerInstance = useRef(null);
  const [remotePeerIdValue, setRemotePeerIdValue] = useState("");

  //Initialize Socket.io
  useEffect(() => socketInitializer(), [socket]);

  const socketInitializer = async () => {
    await fetch("/api/socket");
    socket = io();

    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("incoming-peer", (msg) => {
      console.log(msg);
      setRemoteId((prev) => [...prev, msg]);
      console.log(remoteId);
    });
  };

  useEffect(() => {
    if (socket) {
    }
  });

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
      peerId && socket && socket.emit("new-peer", peerId);
    });

    peer.on("call", async function (call) {
      console.log("Someone is attempting to call you");
      const stream = await getMedia();
      call.answer(stream);
      call.on("stream", function (remoteStream) {
        const video = document.createElement("video");
        video.srcObject = remoteStream;
        video.autoplay = true;
        video.width = "500px";
        video.height = "200px";

        const container = document.getElementById("container");
        container.appendChild(video);
      });
    });
  }, [peerId]);

  //Call Function

  const call = async (remotePeerId, remoteRef) => {
    console.log("Calling " + remotePeerId);
    setIsCaller(true);
    const stream = await getMedia();
    const call = peerInstance.current.call(remotePeerId, stream);
    call.on("stream", function (remoteStream) {
      remoteUserVideoRef.push(remoteStream);
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
      <Button onClick={() => addStuff()}>Add Stuff</Button>\
      {remoteId.map((thing) => (
        <div>
          <video
            playsInline
            ref={currentUserVideoRef}
            width="500px"
            height="200px"
            autoPlay="true"
            controls={false}
            muted
          />
        </div>
      ))}
      <div style={{ border: "1px solid red" }} id="container">
        <video
          id="userVideo"
          playsInline
          ref={currentUserVideoRef}
          width="500px"
          height="200px"
          autoPlay="true"
          controls={false}
          muted
        />
      </div>
      {/* <Grid container spacing={2}>
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
      </Grid> */}
    </>
  );
}
