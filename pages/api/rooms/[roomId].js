// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import db from "../../../db";
import {
  GetItemCommand,
  GetItemCommandInput,
  UpdateItemCommand,
  UpdateItemCommandOutput,
} from "@aws-sdk/client-dynamodb";

export default async function handler(req, res) {
  //Gets personId from room
  if (req.method === "GET") {
    const params = {
      TableName: "rooms",
      Key: {
        roomName: { S: req.query.roomId },
      },
      ProjectionExpression: "personId",
    };

    try {
      const Item = await db.send(new GetItemCommand(params));

      res.status(200).send(Item.Item);
    } catch (err) {
      console.log(err);
      res.statusCode = 500;
    }
  } else if (req.method === "PUT") {
    //Adds new personId to room
    const { personId } = JSON.parse(req.body);

    const params = {
      TableName: "rooms",
      Key: {
        roomName: { S: req.query.roomId },
      },
      UpdateExpression: "add personId :p",
      ExpressionAttributeValues: {
        ":p": { SS: [personId] },
      },
      ReturnValues: "ALL_NEW",
    };
    try {
      const Item = await db.send(new UpdateItemCommand(params));
      res.send(Item.Attributes && Item.Attributes);
    } catch (err) {
      console.log(err);
      res.statusCode = 500;
    }
  }
}
