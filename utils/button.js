import { handleUpdate } from "../handler.js";

export function Button({ bot, plugins }) {
bot.on("callback_query", async (query) => {
const data = query.data;
 
await bot.answerCallbackQuery(query.id);  

if (!data) return;  
    
const defaultPrefix = global.db?.data?.settings?.prefix || ".";  
const multi = global.db?.data?.settings?.multi || false;  

const prefixes = multi  
  ? ["!", ".", "/", "#", defaultPrefix]  
  : [defaultPrefix];  

let text = data;  

if (!prefixes.some(p => data.startsWith(p))) {  
  text = defaultPrefix + data;  
}  
 
const fakeMsg = {  
  message_id: query.message.message_id,  
  chat: query.message.chat,  
  from: query.from,  
  text,  
  fromCallback: true  
};  

const m = await bot.smsg(fakeMsg);  

await handleUpdate({  
  bot,  
  msg: m,  
  plugins  
});

});
}