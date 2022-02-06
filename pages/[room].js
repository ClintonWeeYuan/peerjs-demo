import React, { useEffect } from "react";
import { isClient } from "../libs/utils";
import RTC from "../libs/rtc";
import dynamic from "next/dynamic";

const Room = dynamic(() => import("../components/Room"), {
  ssr: false,
});

export default class extends React.Component {
  render() {
    return (
      <div>
        <Room />
      </div>
    );
  }
}
