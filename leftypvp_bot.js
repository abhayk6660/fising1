const mineflayer = require("mineflayer");

const CONFIG = {
  host: "mc.leftypvp.net",
  port: 25565,
  username: "abhay6660",
  password: "86259233",
  islandWarp: "1saurav1 fishing",
  version: "1.21.1"
};

let bot;
let fishing = false;
let warped = false;

function safeLog(msg) {
  try { console.log(msg.toString()); } catch {}
}

function start() {
  bot = mineflayer.createBot({
    host: CONFIG.host,
    port: CONFIG.port,
    username: CONFIG.username,
    version: CONFIG.version
  });

  bot.on("message", (msg) => {
    const t = msg.toString().toLowerCase();
    safeLog("[CHAT] " + t);

    if (t.includes("login")) bot.chat(`/login ${CONFIG.password}`);
    if (t.includes("register")) bot.chat(`/register ${CONFIG.password} ${CONFIG.password}`);
  });

  bot.once("spawn", () => {
    console.log("[BOT] Spawned!");
    setTimeout(warpOnce, 3500);
  });

  bot.on("end", () => {
    console.log("[BOT] Disconnected → Reconnecting...");
    fishing = false;
    warped = false;
    setTimeout(start, 3000);
  });

  bot.on("error", (err) => {
    console.log("[ERROR]", err?.message);
  });
}

function warpOnce() {
  if (warped) return;
  warped = true;

  console.log("[BOT] Warping...");
  bot.chat(`/is warp ${CONFIG.islandWarp}`);

  setTimeout(() => {
    console.log("[BOT] Starting fishing...");
    startFishing();
  }, 6000);
}

async function startFishing() {
  if (fishing) return;

  const rod = bot.inventory.items().find(i => i.name.includes("fishing_rod"));
  if (!rod) {
    console.log("[BOT] No fishing rod → retrying...");
    return setTimeout(startFishing, 2000);
  }

  try { await bot.equip(rod, "hand"); } catch {}

  fishing = true;
  console.log("[BOT] Fishing started!");

  while (fishing) {
    try {
      await bot.fish();
      await sleep(800);
    } catch {
      await sleep(1500);
    }
  }
}

function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}

start();
