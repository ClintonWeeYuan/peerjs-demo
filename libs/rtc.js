import { isClient } from "./utils";

var Peer;
if (isClient) {
  Peer = require("peerjs");
}

let peer;
let connections = [];

export default class RTC {
  static async initChannel(roomID) {
    if (isClient) {
      peer = await RTC.getID(roomID);
      console.log("[RTC] My ID is " + peer.id);
      return peer;
    }
  }

  static getEvents() {
    if (isClient) {
      return events;
    }
  }

  static getID = async (roomID) => {
    // Need to rewrite with loops
    return new Promise(function (resolve, reject) {
      var peerNumber = 0;
      var tryCreateId = () => {
        var tryId = `${roomID}-${peerNumber}`;
        var peer = new Peer();
        var errorFn = (e) => {
          if (e.type === "unavailable-id") {
            peer.destroy();
            peerNumber++;
            tryCreateId();
          }
        };
        var openFn = () => {
          peer.off("open", openFn);
          peer.off("error", errorFn);
          resolve(peer);
        };
        peer.on("error", errorFn);
        peer.on("open", openFn);
      };
      tryCreateId();
    });
  };
}
