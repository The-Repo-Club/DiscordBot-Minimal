const { Client, MessageEmbed, CommandInteraction } = require("discord.js");
const cool = ["861270236475817994", "158743862427385856"];

module.exports = {
	name: "activity",
	description: "Sets the activity for the bot. (Only for devs)",
	options: [
		{
			name: "type",
			description: "Choose between adding or removing the role from member.",
			type: "STRING",
			required: true,
			choices: [
				{
					name: "add",
					value: "add",
				},
				{
					name: "remove",
					value: "remove",
				},
			],
		},
		{
			name: "activity",
			description: "Choose the activity.",
			type: "STRING",
			required: true,
			choices: [
				{
					name: "WATCHING",
					value: "watching",
				},
				{
					name: "PLAYING",
					value: "playing",
				},
				{
					name: "LISTENING",
					value: "listening",
				},
			],
		},
		{
			name: "value",
			description: "Enter activity text.",
			type: "STRING",
			required: true,
		},
	],

	async execute(interaction, client) {
		if (cool.includes(interaction.member.id)) {
			const type = interaction.options.getString("type");
			const activity = interaction.options.getString("activity");
			const text = interaction.options.getString("value");

			switch (type) {
				case "add":
					{
						client.user.setActivity({
							type: `${activity.toUpperCase()}`,
							name: `${text}`,
						});
						interaction.reply({ content: `Done!`, ephemeral: true });
					}
					break;
				case "remove": {
					client.user.setPresence({ activity: null });
					interaction.reply({ content: `Done!`, ephemeral: true });
					break;
				}
			}
		}
	},
};
