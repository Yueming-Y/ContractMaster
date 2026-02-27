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
  buttons: {}
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
  return { margin, tileW, tileH, gridTop };
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

function beginRoll(containerId) {
  state.searchCount++;
  state.mode = "spinning";
  state.selectedContainer = containerId;
  requestLoot(containerId)
    .then((loot) => {
      state.currentLoot = loot;
      state.spinStart = Date.now();
      const rounds = spinRounds(loot);
      state.spinDuration = Math.max(600, Math.round(rounds * SPIN_CYCLE_MS));
    })
    .catch(() => {
      state.mode = "menu";
    });
}

function updateSpin() {
  if (state.mode !== "spinning") return;
  if (!state.currentLoot) return;
  const elapsed = Date.now() - state.spinStart;
  if (elapsed >= state.spinDuration) {
    state.mode = "result";
    state.totalValue += state.currentLoot.value;
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
  ctx.fillText("三角洲摸红", canvas.width / 2, 100);

  const btnW = canvas.width * 0.6;
  const btnH = 60;
  const x = (canvas.width - btnW) / 2;
  const y1 = 200;
  const y2 = y1 + 90;
  const safeRect = { x, y: y1, w: btnW, h: btnH };
  const pcRect = { x, y: y2, w: btnW, h: btnH };
  state.buttons.safe = safeRect;
  state.buttons.pc = pcRect;
  drawButton(safeRect, "进入保险柜");
  drawButton(pcRect, "进入电脑");

  ctx.font = "18px sans-serif";
  ctx.fillText(`累计价值：${state.totalValue}`, canvas.width / 2, y2 + 110);
}

function drawSpinner() {
  const bg = SPIN_BG ? getImage(SPIN_BG) : null;
  const bgLoaded = bg && bg.width;
  if (bgLoaded) {
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = "#111111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.font = "24px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("正在搜索物资", canvas.width / 2, 100);
    ctx.font = "16px sans-serif";
    ctx.fillStyle = "#cccccc";
    ctx.fillText(`第 ${state.searchCount} 次`, canvas.width / 2, 130);
  }

  const cols = 4;
  const rows = 4;
  const { margin, tileW, tileH, gridTop } = getGridMetrics(cols);
  if (!bgLoaded) {
    for (let i = 0; i < cols * rows; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = margin + col * (tileW + margin);
      const y = gridTop + row * (tileH + margin);
      ctx.fillStyle = i === 0 ? "#000000" : "#2a2a2a";
      ctx.fillRect(x, y, tileW, tileH);
      ctx.strokeStyle = "#444";
      ctx.strokeRect(x, y, tileW, tileH);
    }
  }
  const firstX = margin;
  const firstY = gridTop;
  const loot = state.currentLoot;
  const imgPath = loot ? itemImages[loot.itemName] : null;
  const img = getImage(imgPath);
  const imgEntry = imgPath ? imageCache[imgPath] : null;
  const imgLoaded = imgEntry && imgEntry.loaded;
  const imgError = imgEntry && imgEntry.error;
  const spanInfo = getLootSpan(loot, cols, rows);
  const spanX = spanInfo.spanX;
  const spanY = spanInfo.spanY;
  const boxW = tileW * spanX + margin * (spanX - 1);
  const boxH = tileH * spanY + margin * (spanY - 1);
  if (!bgLoaded) {
    drawStripes(firstX, firstY, boxW, boxH, "#0b0b0b", "#202020");
  }
  const cx = firstX + boxW / 2;
  const cy = firstY + boxH / 2;
  const r = Math.min(boxW, boxH) * 0.25;
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

  if (state.currentLoot) {
    const left = Math.max(0, Math.ceil((state.spinDuration - (Date.now() - state.spinStart)) / 1000));
    ctx.font = "18px sans-serif";
    ctx.fillText(`等待时间：${left}s`, canvas.width / 2, gridTop + tileH * rows + margin * rows + 20);
  }
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

  const loot = state.currentLoot;
  const cols = 4;
  const rows = 4;
  const { margin, tileW, tileH, gridTop } = getGridMetrics(cols);
  for (let i = 0; i < cols * rows; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = margin + col * (tileW + margin);
    const y = gridTop + row * (tileH + margin);
    ctx.fillStyle = "#2a2a2a";
    ctx.fillRect(x, y, tileW, tileH);
    ctx.strokeStyle = "#444";
    ctx.strokeRect(x, y, tileW, tileH);
  }
  const firstX = margin;
  const firstY = gridTop;
  const imgPath = itemImages[loot.itemName];
  const img = getImage(imgPath);
  const imgEntry = imgPath ? imageCache[imgPath] : null;
  const imgLoaded = imgEntry && imgEntry.loaded;
  const imgError = imgEntry && imgEntry.error;
  const spanInfo = getLootSpan(loot, cols, rows);
  const spanX = spanInfo.spanX;
  const spanY = spanInfo.spanY;
  const boxW = tileW * spanX + margin * (spanX - 1);
  const boxH = tileH * spanY + margin * (spanY - 1);
  ctx.strokeStyle = "#444";
  ctx.strokeRect(firstX, firstY, boxW, boxH);
  if (img && imgLoaded && img.width) {
    const maxW = Math.floor(boxW * 0.98);
    const maxH = Math.floor(boxH * 0.98);
    const scale = Math.max(maxW / img.width, maxH / img.height);
    const w = Math.floor(img.width * scale);
    const h = Math.floor(img.height * scale);
    ctx.drawImage(img, firstX + (boxW - w) / 2, firstY + (boxH - h) / 2, w, h);
  } else if (imgPath) {
    ctx.fillStyle = "#ffcc66";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";
    const status = imgError ? "加载失败" : "加载中";
    ctx.fillText(`图片${status}: ${imgPath}`, firstX + 6, firstY + boxH - 6);
  }

  ctx.textAlign = "center";
  const formattedValue = state.currentLoot.value.toLocaleString();
  ctx.font = "18px sans-serif";
  ctx.fillStyle = "#FFD700"; // Gold color
  ctx.fillText(`当前价值：${formattedValue}`, canvas.width / 2, gridTop + tileH * rows + margin * rows + 20);
  ctx.fillStyle = "#FFD700"; // Gold color
  ctx.fillText(`累计价值：${state.totalValue.toLocaleString()}`, canvas.width / 2, gridTop + tileH * rows + margin * rows + 45);

  const btnW = canvas.width * 0.6;
  const btnH = 56;
  const x = (canvas.width - btnW) / 2;
  const yBase = gridTop + tileH * rows + margin * rows + 85;
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
