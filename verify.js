const { success, error } = require("./shared");
const { DocumentClient } = require("aws-sdk/clients/dynamodb");

const documentClient = new DocumentClient({
  region: process.env.region || "localhost",
  endpoint: process.env.endpoint || "http://localhost:8000",
});

exports.handler = async (event, context) => {
  if (!event.body) {
    return error(["Missing Event Body"]);
  }

  const payload = JSON.parse(event.body);

  //   data validation:
  if (!payload.id || payload.id === "" || typeof payload.id !== "string") {
    return error(["Valid id needed for verification"]);
  }

  try {
    const verifiedHash = await verifyHashId(payload.id);

    // If it exists, return the data to the client;
    if (verifiedHash?.length) {
      return success(verifiedHash[0]);
    }

    // If it doesn't exist, return a 404 Not Found
    return error(["Not Found"], 404);
  } catch (e) {
    console.log("Error: ", e);
    return error(["Internal Server Error"], 500);
  }
};

// DAO

async function verifyHashId(id) {
  const params = {
    TableName: process.env.TableName || "Hashes",
    KeyConditionExpression: "id = :id",
    ExpressionAttributeValues: {
      ":id": id,
    },
  };

  const result = await documentClient.query(params).promise();
  return result.Items;
}
