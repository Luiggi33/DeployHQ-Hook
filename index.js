require('dotenv').config()

const crypto = require('crypto');
const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser');
const { Webhook, MessageBuilder } = require('discord-webhook-node');

const pubKey = fs.readFileSync('deployhq.pub').toString()

const getSignatureVerifyResult = (payload, sig) => {
	let sigBuf = Buffer.from(sig, "base64")
	const verifier = crypto.createVerify("RSA-SHA256")
	verifier.update(payload)
	return verifier.verify(pubKey, sigBuf)
}

const hook = new Webhook(process.env.WEBHOOK_URL);
hook.setUsername('DeployHQ')
hook.setAvatar("https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png")

const app = express()
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/deployed', (req, res) => {
	const signature = req.body.signature;
	const payload = req.body.payload;
	const jsonBody = JSON.parse(payload)

	if (!getSignatureVerifyResult(payload, signature)) {
		console.log('Invalid signature')
		res.status(400)
		res.send('Invalid signature')
		return
	}

	const embed = new MessageBuilder()

	embed.setTitle('Deploy Notification')
	embed.setThumbnail("https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png")
	if (jsonBody.status === 'completed') {
		embed.setColor('#06b000')
		embed.setDescription('Deployed successfully!')
	} else {
		embed.setColor('#ed1607')
		embed.setDescription('Deploy failed!')
	}

	embed.addField('Branch', jsonBody.project.repository.branch)
	embed.addField('Status', jsonBody.status)
	embed.addField('Queued At', jsonBody.timestamps.queued_at)
	embed.addField('Started At', jsonBody.timestamps.started_at)
	embed.addField('Completed At', jsonBody.timestamps.completed_at)

	embed.setFooter('Deployed by ' + (jsonBody.deployer || 'automatic deploy'), "https://archive.org/download/discordprofilepictures/discordblue.png")
	embed.setTimestamp()

	hook.send(embed)

	res.send('OK')
})

app.listen(process.env.PORT || 8080)
console.log('Listening on port ' + (process.env.PORT || 8080))
