const { Collection, CommandInteraction } = require("discord.js"), Command = require('./Command'), { readFileSync, readdirSync, existsSync, mkdirSync, writeFileSync, readFile } = require("fs"), colors = require('colors');
colors.enable();

class CommandManager {
    constructor(client) {
        /**
         * @type {import("./CustomClient")}
         */
        this.client = client;

        /**
         * @type {Collection<String, Command>}
         */
        this.cache = new Collection();
    };


    /**
     * Load a command file
     * @param {String} [file] The name of the file to fetch, or leave blank to fetch all commands (.json extension will be ignored)
     */
    load(file) {
        let cmdSetArray = [];
        if(file) {
            cmdSetArray.push(this._loadFile(file));
        } else {
            readdirSync(`App/SlashCommands/`).forEach(file => {
                cmdSetArray.push(this._loadFile(file));
            });
        }

        if(this.client.config.bot_server_link == "global") {
            this.client.guilds.cache.forEach(guild => {
                guild.commands.set(cmdSetArray);
            });
        } else {
            this.client.guilds.cache.get(this.client.config.bot_server_link).commands.set(cmdSetArray);
        }

        return this.cache;
    };

    /**
     * @private
     * @param {String} [file]
     */
    _loadFile(file) {
        try {
            if(!file.endsWith(".json")) { file = `${file}.json`; };

            if(!existsSync(`App/SlashCommands/${file}`)) { return; };

            let data = JSON.parse(readFileSync(`App/SlashCommands/${file}`, `utf-8`));

            if(data.options?.length > 0 && [1, 2].includes(data.options[0]?.type)) {
                for (let cmdOpt of data.options) {
                    if([2].includes(cmdOpt.type)) {
                        if(cmdOpt.options?.length > 0) {
                            for (let subCmdOpt of cmdOpt.options) { this._construct([ data.name, cmdOpt.name, subCmdOpt.name ], subCmdOpt) };
                        };
                    } else if ([1].includes(cmdOpt.type)) {
                        this._construct([ data.name, cmdOpt.name ], cmdOpt);
                    };
                };
            } else {
                this._construct([ data.name ], data);
            };
            return data;
        } catch (err) {
            console.log(`${colors.brightRed("[ERROR]: ")} ${colors.yellow("An error occured while loading slash command file ")} ${colors.blue(`${file} -> `)}`, `${err.name}: ${err.message}`);
        };
    };

    /**
     * @private
     * @param {String[]} path
     * @param {Object} data
     */
    _construct(path, data) {
        if(!path?.length > 0 || !data?.name) { return };
        let repCnt = path.length, fileName = path.pop(), fullPath = [ ...path, fileName ].join('/'); path = path.join('/');
        console.log(path);
        if(!existsSync(`Client/Commands/${fullPath}.js`)) {
            mkdirSync(`Client/Commands/${path}`, { recursive: true });
            writeFileSync(`Client/Commands/${fullPath}.js`, readFileSync(`Client/Commands/$template.js`).toString().replace(/\.\.\//g, `../`.repeat(repCnt)));
        };
        try {
            data.run = require(`../../Client/Commands/${fullPath}.js`);
            console.log(`${colors.brightBlue("[INFO]:")} ${colors.yellow(`/Client/Commands/${fullPath}.js:`)} ${colors.green("Loaded!")}`);
            return this.cache.set(fullPath.replace(/\//g, `.`), new Command(data));
        } catch (err) {
            console.log(`${colors.brightRed("[ERROR]:")} ${colors.yellow(`/Client/Commands/${fullPath}.js:`)} ${colors.red("NOT loaded | ")} ${colors.yellow(`${err.message.split(`\n`, 1)[0]}`)}`);
        };
    };

    /**
     * @param {CommandInteraction} cmd
     * @param {Boolean|String} [joinStr="."]
     * @returns {String[]|String}
     */
    interactionCommandPath(cmd, joinStr = `.`) {
        let resData = [cmd.commandName];
        if(cmd.options.getSubcommandGroup(false)) { resData.push(cmd.options.getSubcommandGroup()) };
        if (cmd.options.getSubcommand(false)) { resData.push(cmd.options.getSubcommand()) };
        if (joinStr != false) { return resData.join(joinStr) } else { return resData };
    };
};

module.exports = CommandManager;