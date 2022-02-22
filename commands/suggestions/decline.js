const { MessageEmbed } = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: "decline",
    category: "Suggestions",
    description: "Decline a suggestion.",
    aliases: ["d"],
    usage: "decline <messageID> [reason]",
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
                .setDescription("Please provide a message IDa")
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
                .setDescription("Please provide a message IDb")
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
                declineMsg=args.slice(1).join(" ")                
            } else {
                declineMsg=args.slice(0).join(" ") 
            }    

            const declined = new MessageEmbed()
                .setAuthor(data.author.name, data.author.iconURL)
                .setDescription(data.description)
                .setColor(client.colors.red)
                .setTimestamp()
                .addField("Status: ", 'declined')
                .addField("Reason: ", `${declineMsg || "-"}`)

            await suggestedEmbed.delete()
            .then(async() => {
                const success = new MessageEmbed()
                .setDescription(`Suggestion with the ID \`${message_id}\` has been __declined__`)
                .setColor(client.colors.red)
                .setFooter(message.author.username, message.author.displayAvatarURL())

                await message.channel.send({
                    embeds: [success]
                })
                .then(message => {
                    setTimeout(() => message.delete(), 10000);
                })
            })
            .then(async() => {
                const channeld = db.fetch(`declinedChannel_${message.guild.id}`)
                if(channeld === null) {
                    const noChannel = new MessageEmbed()
                    .setDescription(`You must set a declined channel first: \`;setchannel\``)
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
                    embeds: [declined]
                })
            })

        } catch {
            return util.errorEmbed(client, message, "Please provide a valid message ID", client.colors.red)
        }
    }
}