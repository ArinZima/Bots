const { InteractionType } = require('discord.js');

/**
 * @param {import("../../classes/CustomClient")} client
 * @param {import("discord.js").CommandInteraction} interaction
 */
module.exports = async (client, interaction) => {
    // If the interaction type wasn't a command or was sent by a bot user, return
    if (interaction.type !== InteractionType.ApplicationCommand || interaction.user.bot) { return };
    // Get the text-based path for this interaction which will be used to fetch from the commands cache
    let path = client.commands.interactionCommandPath(interaction);
    // Attempt to get the command from the commands cache that path matches the key of. If not found, return
    let cmd = client.commands.cache.get(path); if (!cmd) { return };
    // Run the command and send through params
    cmd.run.slash(client, interaction, cmd.fetchArgs(interaction.options), cmd);
};