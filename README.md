# DeployHQ Discord Webhook

This is a small project that sends notifications to a Discord channel via a webhook when a deployment is made via DeployHQ.

## Setup

1. Clone the repository.
2. Install the dependencies with `npm install`.
3. Rename `.env_EXAMPLE` to `.env` and fill in your Discord webhook URL and the port you want the server to listen on.

## Usage

Start the server with `node index.js`. It will listen for POST requests on the `/deployed` endpoint.

Now you need to configure the IP and port in your DeployHQ application as a HTTP POST integration.

When a request is received, the server will verify the signature using the DeployHQ public key. If the signature is valid, a message will be sent to the Discord channel associated with the webhook URL.

## Dependencies

- [body-parser](https://www.npmjs.com/package/body-parser)
- [discord-webhook-node](https://www.npmjs.com/package/discord-webhook-node)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [express](https://www.npmjs.com/package/express)
