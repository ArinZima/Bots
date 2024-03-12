const { IntentsBitField, GatewayIntentBits } = require('discord.js');
const bitfield = new IntentsBitField();
const mysql = require('mysql');

const gate = GatewayIntentBits;
const intents = bitfield.add(gate.Guilds, gate.GuildMembers);

const Client = require("./App/Classes/CustomClient"); require("dotenv").config();

const client = new Client({
    intents: intents,
    presence: {
        status: `online`,
        afk: false
    }
});

client.mysql = mysql.createPool({
    multipleStatements: true,
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

[`events`].forEach(h => require(`./App/Handlers/${h}`)(client));

client.checkDev = async (client, member) => {
    if(!client.config.owners.includes(member.id)) {
        return false;
    }
    return true;
};

client.noPerm = async (data, embed, perm = "Administrator") => {
    embed.setColor(`#FF0000`)
    .setTitle(`Uh oh!`)
    .setDescription(`You don't have access to this command.${perm == 'Developer' ? "\n\nYou need to be my Developer to use this." : `\n\n${perm}`}`);

    data.int?.reply({
        embeds: [ embed ]
    });
};

client.now = async () => {
    return Math.floor(Date.now() / 1000);
};

client.errorEmbed = (data, embed, errorCode) => {
    embed.setColor('#FF0000')
    .setTitle(`Whoopsies!`)
    .setDescription(`Something went wrong whilst executing this command.\n\nPlease create a ticket in [KudosRP](https://discord.gg/kudosrp) if this error persists.\n\n**Error code**: ${errorCode}`);

    data.int?.reply({
        embeds: [ embed ],
        ephemeral: true
    });
};

client.login(process.env.BOT_TOKEN);