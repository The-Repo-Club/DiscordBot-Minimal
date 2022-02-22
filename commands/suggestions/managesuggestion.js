const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: "managesuggestion",
    category: "Suggestions",
    description: "Manage a suggestion.",
    aliases: ["mg", "ms"],
    usage: "managesuggestion <messageID>",
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

        let accept = new MessageButton()
        .setStyle("SUCCESS")
        .setLabel("Accept")
        .setCustomID(`${message.id}accept`)
        let deny = new MessageButton()
        .setStyle("DANGER")
        .setLabel("Deny")
        .setCustomID(`${message.id}deny`)
        let row = new MessageActionRow()
        .addComponents(accept, deny)

        try {
            
            const suggestedEmbed = await message.guild.channels.cache.get(channel).messages.fetch(args[0])
    
            const data = suggestedEmbed.embeds[0]
    
            const suggestion = new MessageEmbed()
            .setAuthor(data.author.name, data.author.iconURL)
            .setDescription(data.description)
            .setColor(data.color)
            .addField(`${data.fields[0].name}`, `${data.fields[0].value}`, data.fields[0].inline)
    
            const msg = await message.channel.send({
                embeds: [suggestion],
                components: [row]
            })

            const filter = (i) => i.user.id === message.author.id;
            const collector = msg.createMessageComponentInteractionCollector(filter, { time: 30000 });

            collector.on("collect", async(button) => {
                if(button.customID === `${message.id}accept`) {
                    const channela = db.fetch(`acceptedChannel_${message.guild.id}`)
                    if(channela === null) {
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
                    const accepted = new MessageEmbed()
                    .setAuthor(data.author.name, data.author.iconURL)
                    .setDescription(data.description)
                    .setColor(client.colors.green)
                    .setTimestamp()
                    // .addField("Status: ", "accepted")

                    await suggestedEmbed.delete();

                    collector.stop();

                    button.update({
                        embeds: [accepted],
                        components: [row]
                    })

                    return message.guild.channels.cache.get(channela).send({
                        embeds: [accepted]
                    })

                } else if(button.customID === `${message.id}deny`) {
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
                    const declined = new MessageEmbed()
                    .setAuthor(data.author.name, data.author.iconURL)
                    .setDescription(data.description)
                    .setColor(client.colors.red)
                    .setTimestamp()
                    // .addField("Status:", "declined")

                    await suggestedEmbed.delete();

                    collector.stop();

                    button.update({
                        embeds: [declined],
                        components: [row]
                    })


                    return message.guild.channels.cache.get(channeld).send({
                        embeds: [declined]
                    })
                }
            })

            collector.on("end", async() => {
                accept = new MessageButton()
                .setStyle("SUCCESS")
                .setLabel("Accept")
                .setCustomID(`${message.id}accept`)
                .setDisabled(true)
                deny = new MessageButton()
                .setStyle("DANGER")
                .setLabel("Deny")
                .setCustomID(`${message.id}deny`)
                .setDisabled(true)
                row = new MessageActionRow()
                .addComponents(accept, deny)

                const endEmbed = new MessageEmbed()
                .setAuthor(data.author.name, data.author.iconURL)
                .setDescription(data.description)
                .setColor(data.color)
                .addField(`${data.fields[0].name}`, `${data.fields[0].value}`, data.fields[0].inline)

                await msg.edit({
                    embeds: [endEmbed],
                    components: [row]
                })
                .then(msg => {
                    setTimeout(() => msg.delete(), 1000)
                })
            })
        } catch {
            return util.errorEmbed(client, message, "Please provide a valid message ID", client.colors.red)
        }
    }
}