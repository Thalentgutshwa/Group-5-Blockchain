const users = {};
let currentUser = null;
let products = [];
let blockchain = [];

async function hashData(data) {
  const encoded = new TextEncoder().encode(data);
  const buffer = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function registerUser() {
  const user = document.getElementById("regUser").value;
  const pass = document.getElementById("regPass").value;
  if (!user || !pass || users[user]) return alert("Invalid or duplicate user.");
  users[user] = pass;
  alert("Registration successful.");
}

function loginUser() {
  const user = document.getElementById("loginUser").value;
  const pass = document.getElementById("loginPass").value;
  if (users[user] !== pass) return alert("Login failed.");
  currentUser = user;
  document.getElementById("auth").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");
  refreshProductList();
  renderBlockchain();
  renderAnalytics();
}

function logout() {
  currentUser = null;
  document.getElementById("auth").classList.remove("hidden");
  document.getElementById("app").classList.add("hidden");
}

async function registerProduct() {
  const name = document.getElementById("productName").value;
  const desc = document.getElementById("productDesc").value;
  const node = document.getElementById("nodeLocation").value;
  const id = Date.now().toString();
  products.push({ id, name, desc, owner: currentUser, location: node });
  await appendBlock({ type: "REGISTER", id, name, desc, from: "SYSTEM", to: currentUser, node });
  refreshProductList();
  renderBlockchain();
  generateQRCode(id);
  renderAnalytics();
}

async function transferProduct() {
  const id = document.getElementById("productList").value;
  const newOwner = document.getElementById("newOwner").value;
  const product = products.find(p => p.id === id);
  if (!product || product.owner !== currentUser) return alert("Unauthorized transfer.");
  const oldOwner = product.owner;
  product.owner = newOwner;
  await appendBlock({ type: "TRANSFER", id, from: oldOwner, to: newOwner });
  refreshProductList();
  renderBlockchain();
  generateQRCode(id);
  renderAnalytics();
}

async function appendBlock(data) {
  const prevHash = blockchain.length ? blockchain[blockchain.length - 1].hash : "GENESIS";
  const record = JSON.stringify(data) + prevHash;
  const hash = await hashData(record);
  blockchain.push({ ...data, time: new Date().toISOString(), prevHash, hash });
}

function refreshProductList() {
  const list = document.getElementById("productList");
  list.innerHTML = "";
  products.filter(p => p.owner === currentUser).forEach(p => {
    const option = document.createElement("option");
    option.value = p.id;
    option.textContent = `${p.name} (${p.location})`;
    list.appendChild(option);
  });
}

function renderBlockchain() {
  const ledger = document.getElementById("ledger");
  ledger.innerHTML = "";
  blockchain.slice().reverse().forEach(b => {
    const div = document.createElement("div");
    div.className = "block";
    div.innerHTML = `
      <strong>Type:</strong> ${b.type}<br>
      <strong>ID:</strong> ${b.id}<br>
      <strong>From:</strong> ${b.from}<br>
      <strong>To:</strong> ${b.to}<br>
      <strong>Time:</strong> ${b.time}<br>
      <strong>Node:</strong> ${b.node || "N/A"}<br>
      <strong>Hash:</strong><pre>${b.hash}</pre>
      <strong>Prev Hash:</strong><pre>${b.prevHash}</pre>`;
    ledger.appendChild(div);
  });
}

function generateQRCode(id) {
  const product = products.find(p => p.id === id);
  const qrContainer = document.getElementById("qrContainer");
  qrContainer.innerHTML = "";
  if (product) {
    QRCode.toCanvas(document.createElement('canvas'), JSON.stringify(product), (err, canvas) => {
      if (!err) qrContainer.appendChild(canvas);
    });
  }
}

function exportCSV() {
  const csv = ["Type,ID,From,To,Time,Hash"];
  blockchain.forEach(b => {
    csv.push(`${b.type},${b.id},${b.from},${b.to},${b.time},${b.hash}`);
  });
  const blob = new Blob([csv.join("\n")], { type: 'text/csv' });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "blockchain_log.csv";
  link.click();
}

function renderAnalytics() {
  const analytics = {};
  products.forEach(p => {
    analytics[p.owner] = (analytics[p.owner] || 0) + 1;
  });
  const div = document.getElementById("analytics");
  div.innerHTML = Object.entries(analytics).map(([owner, count]) => `<p>${owner}: ${count} products</p>`).join('');
}
