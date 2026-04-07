import fs from "fs-extra";
import chalk from "chalk";
import { styleText, styleSans, styleSmallCaps } from "./media/text/styleText.js";

// FUNCTION CODE
let d = new Date();
let locale = "id";
let currentYear = d.getFullYear();
let gmt = new Date(0).getTime() - new Date(`1 Januari ${currentYear}`).getTime();
let week = d.toLocaleDateString(locale, { weekday: "long" });
const calender = d.toLocaleDateString(locale, {
  day: "numeric",
  month: "long",
  year: "numeric"
});

const sleep = async (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);

function makeid(length) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function randomNumberId(length = 10) {
  let res = "";
  for (let i = 0; i < length; i++) {
    res += Math.floor(Math.random() * 10);
  }
  return res;
}

// PEMANGGILAN ===>
global.telegram =  {
  token: "×××××××××", // masukan/ganti token bot kamu disini, langkah ambil token nya liat tutorial jika belum paham
  bot: {
    name: "RHNX", // ganti sesuai kan
    channel:'@rhnxofficial', // ganti sesuikan 
    copyright: "© RHNX", 
    timezone: "Asia/Jakarta",
    owner: [7123844952], // ganti jadi nomor kamu ,untuk mendapatkan nomor nya gunakan fitur (.profile) di bot
}}

global.api = {
    rhnx: "https://api.rhnx.xyz" 
}

global.key = {
    rhnx: 'rhnx_y0hYfwmCE' // cek jika apikey expired kamu tinggal daftar 
}

global.styleText = (text) => styleText(text, db.data.settings.style || "normal");
global.sleep = sleep;
global.readmore = readmore;
global.week = week;
global.calender = calender;
global.makeid = makeid;
global.randomNumberId = randomNumberId;

const file = new URL(import.meta.url).pathname;
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.bgRed(`UPDATE ${file}`));
  import(`${import.meta.url}?update=${Date.now()}`);
});