const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences
  ],
});

const ROLE_ID = process.env.ROLE_ID; // .env'den rol ID'sini al
const LOG_CHANNEL_ID = '1307673577587478648'; // Mesajın gönderileceği kanalın ID'si

client.once('ready', () => {
  console.log(`${client.user.tag} is online!`);
});

client.on('presenceUpdate', async (oldPresence, newPresence) => {
  if (!newPresence.activities) return;

  const user = newPresence.user;
  const guild = newPresence.guild;

  // Kullanıcının durumunu kontrol et
  const status = newPresence.activities.find(activity => activity.state?.includes('gg/matadories'));
  if (!status) return;

  // Rolü bul
  const role = guild.roles.cache.get(ROLE_ID);
  if (!role) {
    console.log(`Rol bulunamadı: ${ROLE_ID}`);
    return;
  }

  const member = guild.members.cache.get(user.id);
  if (member.roles.cache.has(role.id)) return; // Zaten rol verilmişse işlem yapma

  try {
    // Rolü ver
    await member.roles.add(role);
    console.log(`${user.tag} adlı kullanıcıya rol verildi: ${role.name}`);

    // Belirli ID'ye sahip kanala mesaj gönder
    const logChannel = guild.channels.cache.get(LOG_CHANNEL_ID);
    if (logChannel) {
      logChannel.send(`${user} URL aldı: gg/matadories`);
    } else {
      console.log(`Log kanalı bulunamadı: ${LOG_CHANNEL_ID}`);
    }
  } catch (error) {
    console.error(`Rol verme hatası: ${error}`);
  }
});

client.login(process.env.TOKEN);
