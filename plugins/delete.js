const {Function,isPublic} = require("../lib/");
async function isBotAdmins(m, client) {
const groupMetadata = m.isGroup ? await client.groupMetadata(m.chat).catch(e => {}) : ''
const participants = m.isGroup ? await groupMetadata.participants : ''
const groupAdmins = m.isGroup ? await participants.filter(v => v.admin !== null).map(v => v.id) : ''
return m.isGroup ? groupAdmins.includes(m.user_id) : false
}
Function({pattern: 'del ?(.*)', fromMe: isPublic, desc: 'delete message that sended by bot', type: 'misc'}, async (m, text, client) => {
await client.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: true, id: m.quoted.id, participant: m.quoted.sender } })
})
Function({pattern: 'dlt ?(.*)', fromMe: true, desc: 'delete message that sended participant', type: 'group'}, async (m, text, client) => {
if (!m.isGroup) return await m.reply('_This command only works in group chats_')
const isbotAdmin = await isBotAdmins(m, client)
if (!isbotAdmin) return await m.reply("I'm not an admin")
await client.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: m.quoted.fromMe, id: m.quoted.id, participant: m.quoted.sender } })
})