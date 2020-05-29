const axios = require('axios');
const notificationServer = 'http://localhost:5000/';

const mailjet = require('node-mailjet')
  .connect('8ca9c3bae3b85541be09f4a771c0c174', '61062170f628c4deac656950ec6432da');
const { MongoClient } = require("mongodb");
// database info
const url = "mongodb+srv://dillon:BirdDillon123@dillon-atyhs.mongodb.net/test?retryWrites=true&w=majority";
const clientMongo = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
let collection = null;

async function connectMongo() {
  console.log('connecting to Mongo...');
  await clientMongo.connect();
  console.log("Connected correctly to server");
  const db = clientMongo.db("dillon");
  collection = db.collection("subscriptions");
}

module.exports.disconnectMongo = async () => {
  if (!collection) return null;
  await clientMongo.close();
}

module.exports.saveSubscription = async ({ subscription }) => {
  try {
    if (!collection) await connectMongo();
    const newSubscription = await collection.updateOne(
      { username: subscription.username },
      { $set: { subscription } },
      { upsert: true }
    );
    console.log('saved!');

  } catch (err) {
    console.log(err.stack);
  }
}

module.exports.getSubscription = async ({ username }) => {
  try {
    if (!collection) await connectMongo();
    const subscriptionData = await collection.findOne({ username });
    console.log('retrieved from db: ');
    console.log(subscriptionData);

    return subscriptionData;

  } catch (err) {
    console.log(err.stack);
  }
}


module.exports.sendEmail = ({ mailFrom, nameFrom, mailTo, nameTo, subject, messageText, messageHTML }) => {
  const request = mailjet
    .post("send", { 'version': 'v3.1' })
    .request({
      "Messages": [
        {
          "From": {
            "Email": mailFrom,
            "Name": nameFrom
          },
          "To": [
            {
              "Email": mailTo,
              "Name": nameTo
            }
          ],
          "Subject": subject,
          // "TextPart": messageText,
          "HTMLPart": messageHTML
        }
      ]
    });

  return request;
}

module.exports.sendNotification = async ({ username, message }) => {

  axios.post(notificationServer + 'sendNotification', { username, message })
    .then((res) => {
      console.log(`Status: ${res.status}`);
      console.log('Body: ', res.data);
    }).catch((err) => {
      console.error(err);
    });
}

