module.exports = async(client, interaction) => {

    if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) { return; }

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'Bu komutu çalıştırırken bir hata oluştu.', ephemeral: true });
		} else {
			await interaction.reply({ content: 'Bu komutu çalıştırırken bir hata oluştu.', ephemeral: true });
		}
	}

}