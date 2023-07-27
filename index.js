const fs = require('node:fs');
const path = require('node:path');
const { REST, Routes, Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const prefix = "[MATRİX] "


//
// COMMAND & EVENT HANDLER - START;
//
client.commands = new Collection();
const commands = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
            client.commands.set(command.data.name, command);
            console.log(prefix + `${command.data.name} isimli komut yüklendi.`)
		} 
	}
}

const files = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
for (const file of files) {
  const eventName = file.split(".")[0];
  const event = require(`./events/${file}`);
  client.on(eventName, event.bind(null, client));
}
//
// COMMAND & EVENT HANDLER - END;
//

//
// READY EVENT;
//
client.once(Events.ClientReady, c => {
	console.log(prefix + `Başarıyla bot ${c.user.username} olarak giriş yapıldı.`);

    //
    // REGİSTERİNG SLASH COMMANDS;
    //
    const rest = new REST().setToken(token); (async () => { try { const data = await rest.put(Routes.applicationCommands(c.user.id), { body: commands }); } catch (error) { console.error(error); } })();

});


//
// LOGİN TO CLİENT;
//
client.login(token);