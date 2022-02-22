const { MessageEmbed } = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: "setchannel",
    category: "Suggestions",
    description: "Set a channel for events.",
    aliases: ["sc"],
    usage: "setchannel <event> <channel>",
    userPermissions: ["MANAGE_CHANNELS"],
    run: async(client, message, args) => {
        if(args[0] === "suggestions") {
            let channel = message.mentions.channels.first()
            if(!channel) {
                const noChannel = new MessageEmbed()
                .setDescription(`Please mention a channel`)
                .setColor(client.colors.red)
                .setFooter(message.author.username, message.author.displayAvatarURL())

                return message.channel.send({
                    embeds: [noChannel]
                })
                .then(message => {
                    setTimeout(() => message.delete(), 10000)
                })
            }

            db.set(`suggestionChannel_${message.guild.id}`, channel.id)

            const success = new MessageEmbed()
            .setDescription(`Set the suggestion channel to ${channel}`)
            .setColor(client.colors.green)
            .setFooter(message.author.username, message.author.displayAvatarURL())

            return message.channel.send({
                embeds: [success]
            })
            .then(message => {
                setTimeout(() => message.delete(), 10000)
            })

        } else if(args[0] === "accepted") {
            let channel = message.mentions.channels.first()
            if(!channel) {
                const noChannel = new MessageEmbed()
                .setDescription(`Please mention a channel`)
                .setColor(client.colors.red)
                .setFooter(message.author.username, message.author.displayAvatarURL())

                return message.channel.send({
                    embeds: [noChannel]
                })
            }

            db.set(`acceptedChannel_${message.guild.id}`, channel.id)

            const success = new MessageEmbed()
            .setDescription(`Set the accepted channel to ${channel}`)
            .setColor(client.colors.green)
            .setFooter(message.author.username, message.author.displayAvatarURL())

            return message.channel.send({
                embeds: [success]
            })
            .then(message => {
                setTimeout(() => message.delete(), 10000)
            })

        } else if(args[0] === "declined") {
            let channel = message.mentions.channels.first()
            if(!channel) {
                const noChannel = new MessageEmbed()
                .setDescription(`Please mention a channel`)
                .setColor(client.colors.red)
                .setFooter(message.author.username, message.author.displayAvatarURL())

                return message.channel.send({
                    embeds: [noChannel]
                })
            }

            db.set(`declinedChannel_${message.guild.id}`, channel.id)

            const success = new MessageEmbed()
            .setDescription(`Set the declined channel to ${channel}`)
            .setColor(client.colors.green)
            .setFooter(message.author.username, message.author.displayAvatarURL())

            return message.channel.send({
                embeds: [success]
            })
            .then(message => {
                setTimeout(() => message.delete(), 10000)
            })

        } else {
            const noArgs = new MessageEmbed()
            .setDescription(`Please provide a valid event\n\nValid Events: \`suggestions\``)
            .setColor(client.colors.red)
            .setFooter(`© LinkNSync Development`, client.user.displayAvatarURL())

            return message.channel.send({
                embeds: [noArgs]
            })
            .then(message => {
                setTimeout(() => message.delete(), 10000)
            })
        }
    }
}