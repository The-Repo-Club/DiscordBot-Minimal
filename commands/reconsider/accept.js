const { MessageEmbed } = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: "reconsideraccept",
    category: "Reconsider",
    description: "Reconsider a accepted suggestion.",
    aliases: ["ra"],
    usage: "reconsideraccept <messageID> [reason]",
    userPermissions: ["MANAGE_CHANNELS"],
    run: async(client, message, args, util) => {
        const channel = db.fetch(`acceptedChannel_${message.guild.id}`)
        if(channel === null) {
            const noChannel = new MessageEmbed()
            .setDescription(`You must set a accepted channel first: \`;setchannel\``)
            .setColor(client.colors.red)
            .setFooter(message.author.username, message.author.displayAvatarURL())

            return message.channel.send({
                embeds: [noChannel]
            })
            .then(message => {
                setTimeout(() => message.delete(), 10000)
            })
        }
        if(!args[0]) {
            if(!message.reference) {
                const noArgs = new MessageEmbed()
                .setDescription("Please provide a message ID")
                .setColor(client.colors.red)
                .setFooter(message.author.username, message.author.displayAvatarURL())

                return message.channel.send({
                    embeds: [noArgs]
                })
                .then(message => {
                    setTimeout(() => message.delete(), 10000)
                })
            }

            if (!message.reference.messageID) {
                const noArgs = new MessageEmbed()
                .setDescription("Please provide a message ID")
                .setColor(client.colors.red)
                .setFooter(message.author.username, message.author.displayAvatarURL())

                return message.channel.send({
                    embeds: [noArgs]
                })
                .then(message => {
                    setTimeout(() => message.delete(), 10000)
                })
            } else {
                args[0] = message.reference.messageID;
            }
        }

        try {
            const suggestedEmbed = await message.guild.channels.cache.get(channel).messages.fetch(args[0])
    
            const data = suggestedEmbed.embeds[0]  

            const approval = new MessageEmbed()
                .setAuthor(data.author.name, data.author.iconURL)
                .setDescription(data.description)
                .setColor(client.colors.orange)
                .setTimestamp()
                .addField("Status: ", 'awaiting approval')

            await suggestedEmbed.delete()
            .then(async() => {
                const success = new MessageEmbed()
                .setDescription(`Suggestion with the ID \`${args[0]}\` has been __reconsidered__`)
                .setColor(client.colors.orange)
                .setFooter(message.author.username, message.author.displayAvatarURL())

                await message.channel.send({
                    embeds: [success]
                })
                .then(message => {
                    setTimeout(() => message.delete(), 10000);
                })
            })
            .then(async() => {
                const channela = db.fetch(`suggestionChannel_${message.guild.id}`)
                if(channela === null) {
                    const noChannel = new MessageEmbed()
                    .setDescription(`You must set a suggestion channel first: \`;setchannel\``)
                    .setColor(client.colors.red)
                    .setFooter(message.author.username, message.author.displayAvatarURL())
        
                    return message.channel.send({
                        embeds: [noChannel]
                    })
                    .then(message => {
                        setTimeout(() => message.delete(), 10000)
                    })
                }
                return message.guild.channels.cache.get(channela).send({
                    embeds: [approval]
                })
                .then(async(m) => {
                    await m.react("👍")
                    await m.react("👎")
                })
            })

        } catch {
            return util.errorEmbed(client, message, "Please provide a valid message ID", client.colors.red)
        }
    }
}