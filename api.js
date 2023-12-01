const db = require("./db");
const {
  ScanCommand,
  GetItemCommand,
  PutItemCommand,
  DeleteItemCommand,
  UpdateItemCommand,
} = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const getHotel = async (event) => {
  const response = { statusCode: 200 };
  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: marshall({ hotel_id: event.pathParameters.hotel_id }),
    };
    const { Item } = await db.send(new GetItemCommand(params));
    console.log({ Item });
    response.body = JSON.stringify({
      message: "successfully retrieved hotel.",
      data: Item ? unmarshall(Item) : {},
      rawData: Item,
    });
  } catch (e) {
    console.error(e);
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "Failed to get Hotel",
      errorMsg: e.message,
      errorStack: e.stack,
    });
  }
  return response;
};

const createHotel = async (event) => {
  const body = JSON.parse(event.body);
  const response = { statusCode: 200 };
  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Item: marshall(body || {}),
    };
    const createResult = await db.send(new PutItemCommand(params));
    console.log({ createResult });
    response.body = JSON.stringify({
      message: "successfully created hotel.",
      createResult,
    });
  } catch (e) {
    console.error(e);
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "Failed to create Hotel",
      errorMsg: e.message,
      errorStack: e.stack,
    });
  }
  return response;
};

const updateHotel = async (event) => {
  const body = JSON.parse(event.body);
  const objKeys = Object.keys(body);
  const response = { statusCode: 200 };
  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: marshall({ hotel_id: event.pathParameters.hotel_id }),
      UpdateExpression: `SET ${objKeys.map(
        (key, index) => `#key${index} = :values${index}`
      )}`,
      ExpressionAttributeNames: objKeys.reduce(
        (acc, key, index) => ({
          ...acc,
          [`#key${index}`]: key,
        }),
        {}
      ),
      ExpressionAttributeValues: marshall(
        objKeys.reduce(
          (acc, key, index) => ({
            ...acc,
            [`:value${index}`]: body[key],
          }),
          {}
        )
      ),
    };
    updateResult = await db.send(new UpdateItemCommand(params));
    console.log({ updateResult });
    response.body = JSON.stringify({
      message: "successfully updated hotel.",
      updateResult,
    });
  } catch (e) {
    console.error(e);
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "Failed to update Hotel",
      errorMsg: e.message,
      errorStack: e.stack,
    });
  }
  return response;
};

const deleteHotel = async (event) => {
  const response = { statusCode: 200 };
  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: marshall({ hotel_id: event.pathParameters.hotel_id }),
    };
    deleteResult = await db.send(new DeleteItemCommand(params));
    console.log({ deleteResult });
    response.body = JSON.stringify({
      message: "successfully deleted hotel.",
      deleteResult,
    });
  } catch (e) {
    console.error(e);
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "Failed to deleted Hotel",
      errorMsg: e.message,
      errorStack: e.stack,
    });
  }
  return response;
};

const getAllHotels = async (event = null) => {
  const response = { statusCode: 200 };
  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
    };
    const { Items } = await db.send(new ScanCommand(params));
    console.log({ Items });
    response.body = JSON.stringify({
      message: "successfully retrieved hotels.",
      data: Items.map((item) => unmarshall(item)),
      rawData: Items,
    });
  } catch (e) {
    console.error(e);
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "Failed to retrieve all Hotels",
      errorMsg: e.message,
      errorStack: e.stack,
    });
  }
  return response;
};

module.exports = {
  createHotel,
  updateHotel,
  getHotel,
  deleteHotel,
  getAllHotels,
};
