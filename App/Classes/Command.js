class Command {
    constructor(data) {
        /**
         * @type {Object[]}
         */
        this._args = data.options ? [this._getArgTypes(data.options)] : null;

        this.run = {
            /**
             * @type {Function}
             */
            slash: data.run.slash
        };
    };

    /**
     * @param {import("discord.js").CommandInteractionOptionResolver} data
     * @returns {Any[]}
     */
    fetchArgs(data) {
        let argsData = [];
        if(this._args == null) {
            return;
        } else {
            // Loops through all defined argument objects, then builds the appropriate data from the interaction
            this._args.forEach(arg => {
                switch (arg.type) {
                    case 3: argsData.push(data.getString(arg.name, false)); break;
                    case 4: argsData.push(data.getInteger(arg.name, false)); break;
                    case 5: argsData.push(data.getBoolean(arg.name, false)); break;
                    case 6: argsData.push(data.getMember(arg.name, false) ?? data.getUser(arg.name, false)); break;
                    case 7: argsData.push(data.getChannel(arg.name, false)); break;
                    case 8: argsData.push(data.getRole(arg.name, false)); break;
                    case 9: argsData.push(data.getMentionable(arg.name, false)); break;
                    case 10: argsData.push(data.getNumber(arg.name, false)); break;
                    case 11: argsData.push(data.getAttachment(arg.name, false)); break;
                    default: argsData.push(data.get(arg.name, false)); break;
                };
            });
        };
        return argsData;
    };

    /**
     * @private
     * @param {Object[]} data
     * @returns {Object}
     */
     _getArgTypes(data) {
        if (!data?.length) { return {} }; let resData = [];
        data.forEach(opt => { resData.push({ name: opt.name, type: opt.type, required: opt.required ?? false }) });
        return resData;
    };
};

module.exports = Command;