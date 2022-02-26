const { MessageEmbed } = require("discord.js");
const db = require("quick.db");

module.exports = {
	name: "suggest",
	category: "Suggestions",
	description: "Suggest something.",
	aliases: ["s"],
	usage: "suggest <suggestion>",
	run: async (client, message, args, util) => {
		const channel = await db.fetch(`suggestionChannel_${message.guild.id}`);
		if (channel === null) {
			const noChannel = new MessageEmbed()
				.setDescription(
					`You must set a suggestion channel first: \`;setchannel\``
				)
				.setColor(client.colors.red)
				.setFooter(message.author.username, message.author.displayAvatarURL());

			return message.channel.send({
				embeds: [noChannel],
			});
		}
		if (!args.length) {
			const noArgs = new MessageEmbed()
				.setDescription(`Please provide a suggestion`)
				.setColor(client.colors.red)
				.setFooter(message.author.username, message.author.displayAvatarURL());

			return message.channel.send({
				embeds: [noArgs],
			});
		}

		try {
			const suggested = new MessageEmbed()
				.setAuthor(message.author.username, message.author.displayAvatarURL())
				.setDescription("**Feature Suggestion:** \n" + args.join(" "))
				.setColor("#8130D7")
				.setTimestamp()
				.setFooter("LinkNSync.live")
				.addField("Status:", "awaiting approval");
			client.channels.cache
				.get(channel)
				.send({
					embeds: [suggested],
				})
				.then(async (m) => {
					await m.react("👍");
					await m.react("👎");
				})
				.then(async () => {
					const success = new MessageEmbed()
						.setDescription(`Your suggestion has been sent to <#${channel}>`)
						.setColor(client.colors.green)
						.setFooter(
							message.author.username,
							message.author.displayAvatarURL()
						);

					await message.channel.send({
						embeds: [success],
					});
				})
				.catch(async () => {
					const noPerms = new MessageEmbed()
						.setDescription(
							`__I__ don't have permission to send messages in the suggestion channel`
						)
						.setColor(client.colors.red)
						.setFooter(
							`© LinkNSync Development`,
							client.user.displayAvatarURL()
						);

					return message.channel.send({
						embeds: [noPerms],
					});
				});
		} catch {
			return util.errorEmbed(
				client,
				message,
				"There was an error, please try again",
				client.colors.red
			);
		}
	},
};
