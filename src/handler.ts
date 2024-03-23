import wixToRG from "./wixToRg";

export const handler = async (event) => {
  const results = await wixToRG({
    username: String(process.env.username),
    password: String(process.env.password),
    token: String(process.env.token),
    collection: String(process.env.collection),
    accountId: String(process.env.accountId),
  })
  const response = {
    statusCode: 200,
    body: JSON.stringify('Finished'),
  };
  return response;
};