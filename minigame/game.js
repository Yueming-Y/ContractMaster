const system = wx.getSystemInfoSync();
const canvas = wx.createCanvas();
canvas.width = system.windowWidth;
canvas.height = system.windowHeight;
const ctx = canvas.getContext("2d");

const SERVER_URL = "http://localhost:3000";
const USE_MOCK = true;
 const SPIN_BG = "assets/spin_bg.png";
const SPIN_CYCLE_MS = 1600;
const SPIN_MAG_X = 0.2;
const SPIN_MAG_Y = 0.28;
const SPIN_MAG_R = 0.05;
const MIN_ROUND_ITEMS = 1;
const MAX_ROUND_ITEMS = 4;

const SAFE_IMG = "assets/safe.png";
const PC_IMG = "assets/pc.png";

const itemImages = {
  "pure_gold_bar": "assets/pure_gold_bar.png",
  "tank_model": "assets/tank_model.png",
  "ceremonial_dagger": "assets/ceremonial_dagger.png",
  "claudius_bust": "assets/claudius_bust.png",
  "ke_xiao_quan": "assets/ke_xiao_quan.png",
  "basic_bullet_part": "assets/basic_bullet_part.png",
  "merit_medal": "assets/merit_medal.png",
  "clockwork_music_box": "assets/clockwork_music_box.png",
  "ancient_pirate_scope": "assets/ancient_pirate_scope.png",
  "luxury_watch": "assets/luxury_watch.png",
  "asala_pot": "assets/asala_pot.png",
  "totem_arrow": "assets/totem_arrow.png",
  "grandfather_clock": "assets/grandfather_clock.png",
  "local_jewelry": "assets/local_jewelry.png",
  "ifv_model": "assets/ifv_model.png",
  "pirate_knife": "assets/pirate_knife.png",
  "horn_decor": "assets/horn_decor.png",
  "jeweled_tiara": "assets/jeweled_tiara.png",
  "terracotta_figure": "assets/terracotta_figure.png",
  "sayyids_pocket_watch": "assets/sayyids_pocket_watch.png",
  "dancing_lady": "assets/dancing_lady.PNG",
  "golden_laurel": "assets/golden_laurel.png",
  "asala_canteen": "assets/asala_canteen.png",
  "asala_lantern": "assets/asala_lantern.png",
  "reths_phonograph": "assets/reths_phonograph.png",
  "mosaic_lamp": "assets/mosaic_lamp.png",
  "golden_gazelle": "assets/golden_gazelle.png",
  "coin": "assets/coin.png",
  "earring": "assets/earring.png",
  "gold_medallion": "assets/gold_medallion.PNG",
  "phonograph": "assets/phonograph.png",
  "wine_glass": "assets/win_glass.PNG"
};

const itemSpans = {
  "pure_gold_bar": { spanX: 1, spanY: 2 },
  "tank_model": { spanX: 3, spanY: 3 },
  "ceremonial_dagger": { spanX: 3, spanY: 2 },
  "claudius_bust": { spanX: 2, spanY: 3 },
  "ke_xiao_quan": { spanX: 1, spanY: 2 },
  "basic_bullet_part": { spanX: 1, spanY: 2 },
  "merit_medal": { spanX: 1, spanY: 1 },
  "clockwork_music_box": { spanX: 1, spanY: 1 },
  "ancient_pirate_scope": { spanX: 1, spanY: 2 },
  "luxury_watch": { spanX: 1, spanY: 1 },
  "asala_pot": { spanX: 1, spanY: 2 },
  "totem_arrow": { spanX: 1, spanY: 1 },
  "grandfather_clock": { spanX: 2, spanY: 2 },
  "local_jewelry": { spanX: 3, spanY: 2 },
  "ifv_model": { spanX: 3, spanY: 2 },
  "pirate_knife": { spanX: 1, spanY: 1 },
  "horn_decor": { spanX: 2, spanY: 1 },
  "jeweled_tiara": { spanX: 3, spanY: 1 },
  "terracotta_figure": { spanX: 1, spanY: 2 },
  "sayyids_pocket_watch": { spanX: 1, spanY: 1 },
  "dancing_lady": { spanX: 1, spanY: 2 },
  "golden_laurel": { spanX: 3, spanY: 1 },
  "asala_canteen": { spanX: 1, spanY: 2 },
  "asala_lantern": { spanX: 1, spanY: 2 },
  "reths_phonograph": { spanX: 2, spanY: 3 },
  "mosaic_lamp": { spanX: 2, spanY: 3 },
  "golden_gazelle": { spanX: 2, spanY: 2 },
  "coin": { spanX: 1, spanY: 1 },
  "earring": { spanX: 1, spanY: 1 },
  "gold_medallion": { spanX: 1, spanY: 2 },
  "phonograph": { spanX: 2, spanY: 2 },
  "wine_glass": { spanX: 1, spanY: 1 }
};

const itemValues = {
  "pure_gold_bar": 333900,
  "tank_model": 2100000,
  "ceremonial_dagger": 118300,
  "claudius_bust": 1300000,
  "ke_xiao_quan": 30000,
  "basic_bullet_part": 20900,
  "merit_medal": 82200,
  "clockwork_music_box": 59300,
  "ancient_pirate_scope": 11500,
  "luxury_watch": 212500,
  "asala_pot": 25000,
  "totem_arrow": 14800,
  "grandfather_clock": 200000,
  "local_jewelry": 418800,
  "ifv_model": 1300000,
  "pirate_knife": 27600,
  "horn_decor": 18500,
  "jeweled_tiara": 145300,
  "terracotta_figure": 91500,
  "sayyids_pocket_watch": 216800,
  "dancing_lady": 15400,
  "golden_laurel": 85900,
  "asala_canteen": 34700,
  "asala_lantern": 36400,
  "reths_phonograph": 1300000,
  "mosaic_lamp": 129200,
  "golden_gazelle": 432800,
  "wine_glass": 63300,
  "earring": 14200,
  "coin": 8900,
  "gold_medallion": 23400
};
const imageCache = {};
function createImage() {
  if (typeof wx !== "undefined" && typeof wx.createImage === "function") return wx.createImage();
  if (typeof canvas.createImage === "function") return canvas.createImage();
  if (typeof Image !== "undefined") return new Image();
  return null;
}
function getImage(path) {
  if (!path) return null;
  const cached = imageCache[path];
  if (cached) return cached.img || cached;
  const img = createImage();
  if (!img) return null;
  const entry = { img, loaded: false, error: false };
  img.onload = () => { entry.loaded = true; };
  img.onerror = () => { entry.error = true; };
  img.src = path;
  imageCache[path] = entry;
  return img;
}

function preloadImages() {
  Object.values(itemImages).forEach((p) => getImage(p));
  if (SPIN_BG) getImage(SPIN_BG);
  if (SAFE_IMG) getImage(SAFE_IMG);
  if (PC_IMG) getImage(PC_IMG);
}
const containers = [
  {
    id: "safe",
    name: "保险柜",
    wait: { min: 8, max: 18 },
    drops: [
      { rarity: "蓝色物品", minValue: 1000, maxValue: 20000, weight: 60, items: ["basic_bullet_part", "ancient_pirate_scope", "dancing_lady", "coin"] },
      { rarity: "紫色物品", minValue: 20000, maxValue: 300000, weight: 25, items: ["ceremonial_dagger", "asala_pot", "totem_arrow", "pirate_knife", "horn_decor", "asala_canteen", "asala_lantern","gold_medallion","earring","mosaic_lamp"] },
      { rarity: "金色物品", minValue: 300000, maxValue: 3000000, weight: 12, items: ["ke_xiao_quan", "merit_medal", "clockwork_music_box", "grandfather_clock", "local_jewelry", "jeweled_tiara", "terracotta_figure", "golden_laurel", "wine_glass"] },
      { rarity: "红色物品", minValue: 3000000, maxValue: 15000000, weight: 3, items: ["pure_gold_bar", "tank_model", "claudius_bust", "luxury_watch", "ifv_model", "sayyids_pocket_watch", "reths_phonograph", "golden_gazelle"] }
    ]
  },
  {
    id: "pc",
    name: "电脑",
    wait: { min: 5, max: 12 },
    drops: [
      { rarity: "蓝色物品", minValue: 1000, maxValue: 15000, weight: 65, items: [] },
      { rarity: "紫色物品", minValue: 20000, maxValue: 250000, weight: 22, items: [] },
      { rarity: "金色物品", minValue: 250000, maxValue: 2500000, weight: 10, items: [] },
      { rarity: "红色物品", minValue: 2500000, maxValue: 12000000, weight: 3, items: [] }
    ]
  }
];

const state = {
  mode: "menu",
  totalValue: 0,
  searchCount: 0,
  selectedContainer: null,
  currentLoot: null,
  spinStart: 0,
  spinDuration: 0,
  buttons: {},
  roundLoots: [],
  layout: [],
  roundIndex: 0,
  roundValue: 0,
  roundTarget: 0
};

function valueToWaitSec(v) {
  if (v < 20000) return randomInt(2, 4);
  if (v < 300000) return randomInt(5, 7);
  if (v < 3000000) return randomInt(8, 12);
  return randomInt(13, 18);
}

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

function getGridMetrics(cols) {
  const desiredTile = 96;
  const minMargin = 2;
  let tileW = Math.min(desiredTile, Math.floor((canvas.width - minMargin * (cols + 1)) / cols));
  let margin = Math.floor((canvas.width - tileW * cols) / (cols + 1));
  if (margin < 2) margin = 2;
  tileW = Math.min(desiredTile, Math.floor((canvas.width - margin * (cols + 1)) / cols));
  const tileH = tileW;
  const gridTop = 160;
  const rows = 4; // Define a fixed number of rows for the grid background
  return { margin, tileW, tileH, gridTop, cols, rows };
}

function gridBottomY() {
  const { gridTop, tileH, margin, rows } = getGridMetrics(4);
  return gridTop + rows * tileH + (rows - 1) * margin;
}

function drawBaseGrid() {
  const { gridTop, tileW, tileH, margin, cols, rows } = getGridMetrics(4);
  ctx.strokeStyle = "#444";
  ctx.lineWidth = 1;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = margin + c * (tileW + margin);
      const y = gridTop + r * (tileH + margin);
      ctx.strokeRect(x, y, tileW, tileH);
    }
  }
}

function normalizeRarity(r) {
  const s = r || "";
  if (s.includes("红")) return "红";
  if (s.includes("金")) return "金";
  if (s.includes("紫")) return "紫";
  if (s.includes("蓝")) return "蓝";
  if (s.includes("传说")) return "红";
  if (s.includes("稀有")) return "金";
  if (s.includes("中等")) return "紫";
  if (s.includes("普通")) return "蓝";
  return "蓝";
}

function getItemSpan(itemName, img, cols, rows) {
  const override = itemSpans[itemName];
  if (override) return override;
  return { spanX: 1, spanY: 1 };
}
function getLootSpan(loot, cols, rows) {
  if (!loot) return { spanX: 1, spanY: 1 };
  const byItem = itemSpans[loot.itemName];
  if (byItem) return byItem;
  const r = normalizeRarity(loot.rarity);
  if (r === "红") return { spanX: 2, spanY: 2 };
  if (r === "金") return { spanX: 1, spanY: 3 };
  if (r === "紫") return { spanX: 1, spanY: 2 };
  return { spanX: 1, spanY: 1 };
}

function spinRounds(loot) {
  const r = normalizeRarity(loot.rarity);
  if (r === "蓝") return 1;
  if (r === "紫") return 2;
  if (r === "金") return 3;
  if (r === "红") return 4;
  return 1;
}
function mockLoot(containerId) {
  const container = containers.find((c) => c.id === containerId);
  const drop = pickByWeight(container.drops);
  const itemName = drop.items[randomInt(0, drop.items.length - 1)];
  const value = itemValues[itemName] || randomInt(drop.minValue, drop.maxValue);
  const waitTime = randomInt(container.wait.min, container.wait.max);
  return Promise.resolve({
    lootId: `${Date.now()}_${Math.random()}`,
    containerId: container.id,
    containerName: container.name,
    rarity: drop.rarity,
    itemName,
    value,
    waitTime
  });
}

function requestLoot(containerId) {
  if (USE_MOCK) return mockLoot(containerId);
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${SERVER_URL}/loot/roll`,
      method: "POST",
      data: { containerId },
      success: (res) => resolve(res.data),
      fail: reject
    });
  });
}

function canPlace(grid, startC, startR, spanX, spanY, maxC, maxR) {
  if (startC + spanX > maxC || startR + spanY > maxR) {
    return false;
  }
  for (let r = startR; r < startR + spanY; r++) {
    for (let c = startC; c < startC + spanX; c++) {
      if (grid[r][c]) {
        return false;
      }
    }
  }
  return true;
}

function markOccupied(grid, startC, startR, spanX, spanY) {
  for (let r = startR; r < startR + spanY; r++) {
    for (let c = startC; c < startC + spanX; c++) {
      grid[r][c] = true;
    }
  }
}

function calculateLayout(loots, cols, maxRows, tileW, tileH, margin, gridTop) {
  const grid = Array.from({ length: maxRows }, () => Array(cols).fill(false));

  const lootsWithOriginalIndex = loots.map((loot, index) => ({ ...loot, originalIndex: index }));

  const sortedLoots = lootsWithOriginalIndex.sort((a, b) => {
    const spanA = getLootSpan(a);
    const areaA = spanA.spanX * spanA.spanY;
    const spanB = getLootSpan(b);
    const areaB = spanB.spanX * spanB.spanY;
    if (areaB !== areaA) {
      return areaB - areaA;
    }
    return spanB.spanY - spanA.spanY;
  });

  const placedLoots = [];

  for (const loot of sortedLoots) {
    const spanInfo = getLootSpan(loot);
    const spanX = spanInfo.spanX;
    const spanY = spanInfo.spanY;

    let placed = false;
    for (let r = 0; r < maxRows && !placed; r++) {
      for (let c = 0; c < cols && !placed; c++) {
        if (canPlace(grid, c, r, spanX, spanY, cols, maxRows)) {
          markOccupied(grid, c, r, spanX, spanY);
          const lootWithLayout = {
            ...loot,
            col: c,
            row: r,
            x: margin + c * (tileW + margin),
            y: gridTop + r * (tileH + margin),
            w: tileW * spanX + margin * (spanX - 1),
            h: tileH * spanY + margin * (spanY - 1)
          };
          placedLoots.push(lootWithLayout);
          placed = true;
        }
      }
    }
    if (!placed) {
      console.error("Could not place item:", loot.itemName);
    }
  }

  placedLoots.sort((a, b) => {
    if (a.row !== b.row) {
      return a.row - b.row;
    }
    return a.col - b.col;
  });

  return placedLoots;
}

async function beginRoll(containerId) {
  state.searchCount++;
  state.mode = "spinning";
  state.selectedContainer = containerId;
  state.roundTarget = randomInt(MIN_ROUND_ITEMS, MAX_ROUND_ITEMS);
  state.roundLoots = [];
  state.layout = [];
  state.roundValue = 0;
  state.roundIndex = 0;
  state.currentLoot = null;

  const lootPromises = [];
  for (let i = 0; i < state.roundTarget; i++) {
    lootPromises.push(requestLoot(containerId));
  }

  try {
    const loots = await Promise.all(lootPromises);
    state.roundLoots = loots;

    const { cols, rows, tileW, tileH, margin, gridTop } = getGridMetrics(4);
    state.layout = calculateLayout(loots, cols, rows, tileW, tileH, margin, gridTop);

    startSpinForItem(0);
  } catch (e) {
    console.error("Failed to fetch loot:", e);
    state.mode = "menu";
  }
}

function startSpinForItem(index) {
  if (index >= state.layout.length) {
    state.mode = 'result';
    state.totalValue += state.roundValue;
    return;
  }
  state.roundIndex = index;
  const currentLoot = state.layout[index];
  state.currentLoot = currentLoot;
  state.spinStart = Date.now();
  const rounds = spinRounds(currentLoot);
  state.spinDuration = Math.max(600, Math.round(rounds * SPIN_CYCLE_MS));
}

function updateSpin() {
  if (state.mode !== "spinning" || !state.currentLoot) return;

  const elapsed = Date.now() - state.spinStart;
  if (elapsed >= state.spinDuration) {
    state.roundValue += state.currentLoot.value;

    const nextIndex = state.roundIndex + 1;
    if (nextIndex < state.layout.length) {
      startSpinForItem(nextIndex);
    } else {
      state.mode = "result";
      state.totalValue += state.roundValue;
    }
  }
}

function drawButton(rect, text) {
  ctx.fillStyle = "#2d2d2d";
  ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
  ctx.strokeStyle = "#ffffff";
  ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
  ctx.fillStyle = "#ffffff";
  ctx.font = "20px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, rect.x + rect.w / 2, rect.y + rect.h / 2);
}

function inRect(x, y, rect) {
  return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
}

function drawStripes(x, y, w, h, bg, stripe) {
  ctx.fillStyle = bg;
  ctx.fillRect(x, y, w, h);
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.strokeStyle = stripe;
  ctx.lineWidth = 1;
  const step = 8;
  ctx.beginPath();
  for (let d = -h; d < w; d += step) {
    ctx.moveTo(x + d, y);
    ctx.lineTo(x + d + h, y + h);
  }
  ctx.stroke();
  ctx.restore();
}
function drawMenu() {
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ffffff";
  ctx.font = "28px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText("今天出红了吗", canvas.width / 2, 100);

  const img = getImage(SAFE_IMG);
  const imgLoaded = img && img.width;

  const imgW = canvas.width * 0.3; // Further reduced to 0.3
  const imgH = imgLoaded ? (img.height / img.width) * imgW : imgW;
  const x = (canvas.width - imgW) / 2;
  const y1 = 200;

  const safeRect = { x, y: y1, w: imgW, h: imgH };
  state.buttons.safe = safeRect;

  if (imgLoaded) {
    ctx.drawImage(img, x, y1, imgW, imgH);
  } else {
    drawButton(safeRect, "进入保险柜");
  }

  const btnW = canvas.width * 0.6;
  const btnH = 60;
  const y2 = y1 + imgH + 30;
  const pcRect = { x: (canvas.width - btnW) / 2, y: y2, w: btnW, h: btnH };
  state.buttons.pc = pcRect;
  drawButton(pcRect, "进入电脑");

  ctx.font = "18px sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(`累计价值：${state.totalValue.toLocaleString()}`, canvas.width / 2, y2 + btnH + 50);
}

function drawSpinner() {
  const bg = SPIN_BG ? getImage(SPIN_BG) : null;
  const bgLoaded = bg && bg.width;
  if (bgLoaded) {
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = "#111111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.fillStyle = "#ffffff";
  ctx.font = "24px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText("正在搜索物资", canvas.width / 2, 100);
  ctx.font = "16px sans-serif";
  ctx.fillStyle = "#cccccc";
  ctx.fillText(`第 ${state.searchCount} 次`, canvas.width / 2, 130);

  drawBaseGrid();

  state.layout.forEach((loot, index) => {
    if (index < state.roundIndex) {
      // Revealed items
      drawRevealedItem(loot);
    } else if (index === state.roundIndex) {
      // Item currently spinning
      drawSpinningIndicator(loot);
    } else {
      // Unrevealed items (card backs)
      drawCardBack(loot);
    }
  });


}

function drawRevealedItem(loot) {
  const imgPath = itemImages[loot.itemName];
  const img = getImage(imgPath);
  const imgEntry = imgPath ? imageCache[imgPath] : null;
  const imgLoaded = imgEntry && imgEntry.loaded;

  ctx.fillStyle = "#2a2a2a";
  ctx.fillRect(loot.x, loot.y, loot.w, loot.h);
  ctx.strokeStyle = "#444";
  ctx.strokeRect(loot.x, loot.y, loot.w, loot.h);

  if (img && imgLoaded && img.width) {
    const scale = Math.max(loot.w / img.width, loot.h / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    const x = loot.x + (loot.w - w) / 2;
    const y = loot.y + (loot.h - h) / 2;
    ctx.save();
    ctx.beginPath();
    ctx.rect(loot.x, loot.y, loot.w, loot.h);
    ctx.clip();
    ctx.drawImage(img, x, y, w, h);
    ctx.restore();
  } else {
    ctx.fillStyle = "#ffcc66";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("加载中", loot.x + loot.w / 2, loot.y + loot.h / 2);
  }
}

function drawSpinningIndicator(loot) {
  drawStripes(loot.x, loot.y, loot.w, loot.h, "#0b0b0b", "#202020");
  const cx = loot.x + loot.w / 2;
  const cy = loot.y + loot.h / 2;
  const r = Math.min(loot.w, loot.h) * 0.25;
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  const t = Date.now() / 600;
  const handleLen = r * 1.4;
  const handleAngle = t % (Math.PI * 2);
  const hx = cx + Math.cos(handleAngle) * handleLen;
  const hy = cy + Math.sin(handleAngle) * handleLen;
  ctx.beginPath();
  ctx.moveTo(cx + Math.cos(handleAngle) * r, cy + Math.sin(handleAngle) * r);
  ctx.lineTo(hx, hy);
  ctx.stroke();
}

function drawCardBack(loot) {
  drawStripes(loot.x, loot.y, loot.w, loot.h, "#0b0b0b", "#202020");
}

function drawResult() {
  ctx.fillStyle = "#0f0f0f";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ffffff";
  ctx.font = "24px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText("掉落结果", canvas.width / 2, 100);
  ctx.font = "16px sans-serif";
  ctx.fillStyle = "#cccccc";
  ctx.fillText(`第 ${state.searchCount} 次搜索`, canvas.width / 2, 130);

  drawBaseGrid();

  state.layout.forEach(loot => {
    drawRevealedItem(loot);
  });

  ctx.textAlign = "center";
  const formattedValue = state.roundValue.toLocaleString();
  ctx.font = "18px sans-serif";
  ctx.fillStyle = "#FFD700"; // Gold color
  ctx.fillText(`本次总价值：${formattedValue}`, canvas.width / 2, gridBottomY() + 20);
  ctx.fillStyle = "#FFD700"; // Gold color
  ctx.fillText(`累计价值：${state.totalValue.toLocaleString()}`, canvas.width / 2, gridBottomY() + 45);

  const btnW = canvas.width * 0.6;
  const btnH = 56;
  const x = (canvas.width - btnW) / 2;
  const yBase = gridBottomY() + 85;
  const y1 = yBase;
  const y2 = y1 + 80;
  const againRect = { x, y: y1, w: btnW, h: btnH };
  const backRect = { x, y: y2, w: btnW, h: btnH };
  state.buttons.again = againRect;
  state.buttons.back = backRect;
  drawButton(againRect, "再来一次");
  drawButton(backRect, "返回选择");
}

function draw() {
  updateSpin();
  if (state.mode === "menu") drawMenu();
  if (state.mode === "spinning") drawSpinner();
  if (state.mode === "result") drawResult();
}

function handleTap(x, y) {
  if (state.mode === "menu") {
    if (inRect(x, y, state.buttons.safe)) beginRoll("safe");
    if (inRect(x, y, state.buttons.pc)) beginRoll("pc");
    return;
  }
  if (state.mode === "result") {
    if (inRect(x, y, state.buttons.again)) beginRoll(state.selectedContainer);
    if (inRect(x, y, state.buttons.back)) state.mode = "menu";
  }
}

wx.onTouchStart((e) => {
  const touch = e.touches[0];
  if (!touch) return;
  handleTap(touch.clientX, touch.clientY);
});

const raf = typeof requestAnimationFrame === "function"
  ? requestAnimationFrame
  : (fn) => setTimeout(fn, 16);

function loop() {
  draw();
  raf(loop);
}

preloadImages();
loop();
