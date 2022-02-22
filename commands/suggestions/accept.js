const { MessageEmbed } = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: "accept",
    category: "Suggestions",
    description: "Accept a suggestion.",
    aliases: ["a"],
    usage: "accept <messageID> [reason]",
    userPermissions: ["MANAGE_CHANNELS"],
    run: async(client, message, args, util) => {
        const channel = db.fetch(`suggestionChannel_${message.guild.id}`)
        if(channel === null) {
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
            } else {
                message_id = args[0];
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
                message_id = message.reference.messageID;
            }
        } else {
            if(!message.reference) {
                message_id = args[0];
            }
        }


        try {
            const suggestedEmbed = await message.guild.channels.cache.get(channel).messages.fetch(message_id)
    
            const data = suggestedEmbed.embeds[0]
            
            if (args[0] == message_id) {
                acceptMsg=args.slice(1).join(" ")                
            } else {
                acceptMsg=args.slice(0).join(" ") 
            }    

            const accepted = new MessageEmbed()
                .setAuthor(data.author.name, data.author.iconURL)
                .setDescription(data.description)
                .setColor(client.colors.green)
                .setTimestamp()
                // .addField("Status: ", 'accepted')
                // .addField("Reason: ", `${acceptMsg || "-"}`)

            await suggestedEmbed.delete()
            .then(async() => {
                const success = new MessageEmbed()
                .setDescription(`Suggestion with the ID \`${message_id}\` has been __accepted__`)
                .setColor(client.colors.green)
                .setFooter(message.author.username, message.author.displayAvatarURL())

                await message.channel.send({
                    embeds: [success]
                })
                .then(message => {
                    setTimeout(() => message.delete(), 10000);
                })
            })
            .then(async() => {
                const channeld = db.fetch(`acceptedChannel_${message.guild.id}`)
                if(channeld === null) {
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
                return message.guild.channels.cache.get(channeld).send({
                    embeds: [accepted]
                })
            })

        } catch {
            return util.errorEmbed(client, message, "Please provide a valid message ID", client.colors.red)
        }
    }
}