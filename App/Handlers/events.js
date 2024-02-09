const { readdirSync } = require("fs"), colors = require('colors');
colors.enable();

/**
 * @param {import("discord.js").Client} client 
 */
module.exports = (client) => {
    // Loads each dir of events, then loads each event inside the dir
    const load = dirs => {
        let events = readdirSync(`Client/Events/${dirs}/`).filter(d => d.endsWith(`.js`));
        // console.log(events);
        for (let file of events) {
            try {
                // Attempts to require the event file
                let evt = require(`../../Client/Events/${dirs}/${file}`), evtName = file.split(`.`)[0];
                // Binds the event to the current event module
                client.on(evtName, evt.bind(null, client));
                // Log success message to console
                console.log(`${colors.brightBlue("[INFO]:")} ${colors.yellow(`/Client/Events/${dirs}/${file}:`)} ${colors.green("Loaded!")}`);
            } catch (err) {
                // Log error message to console along with the first line of the raw error
                console.log(`${colors.brightRed("[ERROR]:")} ${colors.yellow(`/Client/Events/${dirs}/${file}:`)} ${colors.red(` Not loaded. ->`)}`, `${err.name}: ${err.message}`);
            };
        };
    };
    readdirSync(`Client/Events/`).forEach(dir => load(dir));
};