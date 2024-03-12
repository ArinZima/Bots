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
    const isDev = client.checkDev(client, member);

    const args = data.int?.options._hoistedOptions;
    const id = args.find(arg => arg.name == 'shardid').value;

    if(!isDev) {
        const embed = new EmbedBuilder();
        client.noPerm(data, embed, "Developer");
    } else {
        await data.int?.reply({
            content: "Respawning...",
            ephemeral: true
        });

        client.shard.broadcastEval(() => {
            process.exit();
        }, {
            shard: id
        });
    }
};