import { DynamoDBClient, ListTablesOutput } from "@aws-sdk/client-dynamodb";
// import AWS from "aws-sdk";

// AWS.config.update({
//   region: "eu-central-1",
// });

const db = new DynamoDBClient({
  region: "us-east-2",
  // credentials: {
  //   accessKeyId: process.env.TIMECHECK_ACCESS_KEY_ID,
  //   secretAccessKey: process.env.TIMECHECK_SECRET_ACCESS_KEY,
  // },
});

export default db;
