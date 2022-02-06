import RTC from "../libs/rtc";
import Peer from "peerjs";

export default function Room() {
  let peer = new Peer("123");
  console.log(peer.id);
  return <div>Hello</div>;
}
