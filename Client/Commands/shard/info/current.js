const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    /**
     * Handles an application command (e.g. /help)
     * @param {import("../../../App/Classes/CustomClient")} client
     * @param {import("discord.js").CommandInteraction} int
     * @param {import("../../../App/Classes/Command")} cmd
     */
    slash: async (client, int, args, cmd) => {
        return global(client, { int: int, args: args, cmd: cmd });
    }
}

/**
 * Runs the main functionality of the command
 * @param {import("../../../App/Classes/CustomClient")} client
 * @param {Object} data
 * @param {import("discord.js").CommandInteraction} [data.int]
 * @param {import("discord.js").Message} [data.msg]
 * @param {Any[]} data.args
 * @param {import("../../../App/Classes/Command")} data.cmd
 */
async function global(client, data) {
    const member = data.int?.member;
    const guild = data.int?.guild;
    const shardId = guild.shardId;
    const isDev = client.checkDev(client, member);

    if(!isDev) {
        const embed = new EmbedBuilder();
        client.noPerm(data, embed, "Developer");
    } else {
        const guildSize = await client.shard.fetchClientValues('guilds.cache.size', shardId);
        const userSize = await client.shard.fetchClientValues('users.cache.size', shardId);
        const shardMode = await client.shard.fetchClientValues('shard.mode', shardId);
        const shardCount = await client.shard.fetchClientValues('shard.count', shardId);

        const embed = new EmbedBuilder()
            .setColor(client.config.embed_color)
            .setTitle(`Shard ${shardId + 1}/${shardCount}`)
            .setDescription(`This shard's current mode is \`${shardMode}\`\n\nThis shard contains ${guildSize} guilds and ${userSize} users.`)
        
        data.int?.reply({
            embeds: [ embed ]
        });
    }
};