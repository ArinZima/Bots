const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const colors = require('colors');
colors.enable();

/**
 * @param {import("../../classes/CustomClient")} client 
 */
module.exports = async (client) => {
    // Loads commands into cache
    client.commands.load();
    console.log(`${colors.brightGreen('Successfully logged in!')}`);
};