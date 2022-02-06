import RTC from "../libs/rtc";
import Peer from "peerjs";
import randomWords from "random-words";

export default function Room() {
  let newId = randomWords({ exactly: 3, join: "-" });
  let peer = new Peer(newId);
  console.log(peer.id);

  return <div>Yoyyo</div>;
}
