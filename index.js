const { ShardingManager } = require('discord.js');
const colors = require('colors');
colors.enable();

const shardman = new ShardingManager("./bot.js", {
    token: process.env.BOT_TOKEN,
    respawn: true
});

shardman.on('shardCreate', async shard => {
    shard.on('ready', async () => {
        const guildSize = await shard.fetchClientValue('guilds.cache.size');

        console.log(`${colors.brightMagenta(`[INFO/SHARD #${shard.id}]:`)} ${colors.green("Spawned!")} ${colors.cyan(`I currently contain ${guildSize} ${guildSize == 1 ? "guild" : "guilds"}.`)}`);
    });

    shard.on('death', () => {
        console.log(`${colors.brightMagenta(`[${colors.brightRed("ERROR")}/SHARD #${shard.id}]:`)} ${colors.brightRed("Died!")}`);
    });

    shard.on('disconnect', () => {
        console.log(`${colors.brightMagenta(`[${colors.yellow("WARNING")}/SHARD #${shard.id}]:`)} ${colors.yellow("Disconnected!")}`);
    });

    shard.on('reconnecting', () => {
        console.log(`${colors.brightMagenta(`[${colors.yellow("WARNING")}/SHARD #${shard.id}]:`)} ${colors.yellow("Reconnecting...")}`);
    });

    shard.on('resume', () => {
        console.log(`${colors.brightMagenta(`[INFO/SHARD #${shard.id}]:`)} ${colors.green("Resumed!")}`);
    });
});

shardman.spawn({ amount: 1, delay: 1000 })
.catch(error => console.error(`${colors.brightMagenta(`[${colors.brightRed("ERROR")}/SHARD]:`)} ${colors.brightRed("Shard failed to spawn. ->")} ${colors.yellow(error)}`));