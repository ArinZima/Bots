import { Snowflake } from "discord.js";

export type BotConfig = {
    bot_server_link: "global" | Snowflake;
    owners: String[];
    channels: Object;
    roles: Object;
}