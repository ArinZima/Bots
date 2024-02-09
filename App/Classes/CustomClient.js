const { Client, Collection } = require('discord.js'), CommandManager = require("./CommandManager"), { readFileSync } = require("fs");

class CustomClient extends Client {
    constructor(options) {
        super(options);

        this.config = JSON.parse(readFileSync(`config.json`, `utf-8`));

        this.commands = new CommandManager(this);
    };
}

module.exports = CustomClient;