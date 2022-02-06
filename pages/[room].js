import React, { useEffect } from "react";
import { isClient } from "../libs/utils";
import RTC from "../libs/rtc";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Container } from "@mui/material";

const Room = dynamic(() => import("../components/Room"), {
  ssr: false,
});

export default function Channel() {
  const router = useRouter();
  let roomId = router.query.room;
  console.log(roomId);
  return (
    <Container>
      <Room roomId={roomId} />
    </Container>
  );
}
