import React, { useEffect } from "react";
import { isClient } from "../libs/utils";
import RTC from "../libs/rtc";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

const Room = dynamic(() => import("../components/Room"), {
  ssr: false,
});

export default function Channel() {
  const router = useRouter();
  let roomId = router.query.room;
  console.log(roomId);
  return (
    <div>
      <Room roomId={roomId} />
      <p>The room id is {roomId}</p>
    </div>
  );
}
