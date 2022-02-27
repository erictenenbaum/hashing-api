const { success, error } = require("./shared");
const { DocumentClient } = require("aws-sdk/clients/dynamodb");
const { v4 } = require("uuid");

const documentClient = new DocumentClient({
  region: process.env.region || "localhost",
  endpoint: process.env.endpoint || "http://localhost:8000",
});

exports.handler = async (event, context) => {
  if (!event.body) {
    return error(["Missing Event Body"]);
  }

  const payload = JSON.parse(event.body);

  //   You could add RegEx here or in a helper function to validate supported file types...
  if (!payload.file || payload.file === "") {
    return error(["Missing or Invalid File"]);
  }

  try {
    const savedFile = await saveFile(payload.file);
    return success(savedFile, 201);
  } catch (e) {
    console.log("Error: ", e);
    return error(["Internal Server Error"], 500);
  }
};

// DAO:
async function saveFile(file) {
  const Item = {
    id: v4(),
    file,
    createdAt: new Date(Date.now()).toISOString(),
  };

  const params = {
    TableName: process.env.TableName || "Hashes",
    Item,
  };

  await documentClient.put(params).promise();
  return Item;
}
