import RTC from "../libs/rtc";
import Peer from "peerjs";
import randomWords from "random-words";

export default function Room(props) {
  let peer = new Peer(props.roomId);
  peer.on("open", () => {
    console.log("Peer is opened. The id is " + peer.id);
  });

  return <div>Yoyyo</div>;
}
