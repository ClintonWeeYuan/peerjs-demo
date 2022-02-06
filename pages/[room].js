import React, { useEffect } from "react";
import { isClient } from "../libs/utils";
import RTC from "../libs/rtc";

// let Peer;
// if (isClient) {
//   console.log("Hello");
//   Peer = require("peerjs");
// }

// const openPeerConnection = () => {
//   if (isClient) {
//     console.log("Try to create new Peer");
//     let peer = new Peer();
//   }
// };
export default class extends React.Component {
  componentDidMount() {
    RTC.initChannel();
  }

  render() {
    return <div>Hello</div>;
  }
}
