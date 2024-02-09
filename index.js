const { IntentsBitField } = require('discord.js');
const bitfield = new IntentsBitField();

const intents = bitfield.add(1, 2);

const Client = require("./App/Classes/CustomClient"); require("dotenv").config();
const { Intents } = require('discord.js');

const client = new Client({
    intents: intents,
    presence: {
        status: `online`,
        afk: false,
        activities: [{ name: "This is a test.", type: 4 }]
    }
});

[`events`].forEach(h => require(`./App/Handlers/${h}`)(client));

client.login(process.env.BOT_TOKEN);