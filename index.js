// Import required modules using ES module syntax
import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

// Define a function to send a response to the user via the Interakt-like API
async function sendResponseToUser(user, response) {
  const apiUrl = 'https://graph.facebook.com/v17.0/143093392211528/messages';

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user: user,
      message: response,
    }),
  };

  try {
    const response = await fetch(apiUrl, requestOptions);

    if (response.ok) {
      console.log('Response sent successfully');
    } else {
      console.error('Failed to send response:', response.statusText);
    }
  } catch (error) {
    console.error('Error sending response:', error);
  }
}

// Define an endpoint to handle incoming messages from the Interakt-like API
// Define an endpoint to handle incoming messages from the Interakt-like API
app.post('/incoming', async (req, res) => {
  try {
    const incomingMessage = req.body;

    if (!incomingMessage || typeof incomingMessage.message !== 'string') {
      // Handle the case where the incoming message is missing or not a string
      throw new Error('Invalid or missing message in the incoming request');
    }

    const user = incomingMessage.user;
    const userMessage = incomingMessage.message.toLowerCase();

    const responses = {
      hi: 'Hello! How can I assist you today?',
      hello: 'Hi there! How can I help?',
      'how are you': 'I am just a chatbot, but I am here to help you!',
      default: "I'm sorry, I didn't understand that. Can you please rephrase?",
    };

    const response = responses[userMessage] || responses.default;

    await sendResponseToUser(user, response);
    res.status(200).json({ success: true, message: response });
    console.log("Hello From Bot");
  } catch (error) {
    console.error('Error handling incoming request:', error);
    res.status(500).json({ success: false, error: 'Failed to handle request' });
  }
});


// Start your server to listen for incoming messages from the Interakt-like API
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
