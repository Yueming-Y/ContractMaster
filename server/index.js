const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "data.json");
const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));

const app = express();
app.use(cors());
app.use(express.json());

const matches = new Map();
const rooms = new Map();

function pickByWeight(list) {
  const total = list.reduce((sum, item) => sum + item.weight, 0);
  let r = Math.random() * total;
  for (const item of list) {
    if (r < item.weight) return item;
    r -= item.weight;
  }
  return list[list.length - 1];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rollLoot(containerId) {
  const container = data.containers.find((c) => c.id === containerId);
  if (!container) return null;
  const drop = pickByWeight(container.drops);
  const value = randomInt(drop.minValue, drop.maxValue);
  const itemName = drop.items[randomInt(0, drop.items.length - 1)];
  const waitTime = randomInt(container.wait.min, container.wait.max);
  return {
    lootId: uuidv4(),
    containerId: container.id,
    containerName: container.name,
    rarity: drop.rarity,
    itemName,
    value,
    waitTime
  };
}

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/match/start", (req, res) => {
  const matchId = uuidv4();
  const playerId = uuidv4();
  matches.set(matchId, { matchId, playerId, startedAt: Date.now() });
  res.json({ matchId, playerId });
});

app.post("/room/create", (req, res) => {
  const roomId = uuidv4();
  rooms.set(roomId, { roomId, players: [] });
  res.json({ roomId });
});

app.post("/room/join", (req, res) => {
  const { roomId, playerId } = req.body || {};
  const room = rooms.get(roomId);
  if (!room) return res.status(404).json({ error: "room_not_found" });
  room.players.push(playerId || uuidv4());
  res.json({ roomId, players: room.players });
});

app.post("/loot/roll", (req, res) => {
  const { containerId } = req.body || {};
  const loot = rollLoot(containerId);
  if (!loot) return res.status(400).json({ error: "invalid_container" });
  res.json(loot);
});

app.post("/match/finish", (req, res) => {
  const { matchId, playerId, totalValue } = req.body || {};
  const match = matches.get(matchId);
  if (!match) return res.status(404).json({ error: "match_not_found" });
  match.finishedAt = Date.now();
  match.totalValue = totalValue || 0;
  match.playerId = playerId || match.playerId;
  res.json({ matchId, rank: 1, totalValue: match.totalValue });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  process.stdout.write(`server_running:${port}`);
});
