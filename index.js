const { Intents } = require('discord.js');
const LinkNSync = require('./Utils/linknsync');

const client = new LinkNSync({ intents: [Intents.ALL] }, { allowedMentions: { parse: ['users', 'roles'], repliedUser: false } });
client.start();