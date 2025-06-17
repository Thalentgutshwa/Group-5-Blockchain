// Simple in-memory storage for users (username: password)
const users = {};
// Stores the currently logged-in user
let currentUser = null;
// Array to hold product objects
let products = [];
// Array to represent the blockchain (immutable ledger)
let blockchain = [];

// Asynchronously hashes data using SHA-256
async function hashData(data) {
  const encoded = new TextEncoder().encode(data);
  const buffer = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Registers a new user
function registerUser() {
  const user = document.getElementById("regUser").value;
  const pass = document.getElementById("regPass").value;
  if (!user || !pass || users[user]) return alert("Invalid or duplicate user.");
  users[user] = pass;
  alert("Registration successful.");
}

// Logs in an existing user
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

// Logs out the current user
function logout() {
  currentUser = null;
  document.getElementById("auth").classList.remove("hidden");
  document.getElementById("app").classList.add("hidden");
}

// Registers a new product on the blockchain
async function registerProduct() {
  const name = document.getElementById("productName").value;
  const desc = document.getElementById("productDesc").value;
  const node = document.getElementById("nodeLocation").value;
  const id = Date.now().toString();
  // Add the product to the in-memory product list
  products.push({ id, name, desc, owner: currentUser, location: node });
  // Append a "REGISTER" block to the blockchain
  await appendBlock({ type: "REGISTER", id, name, desc, from: "SYSTEM", to: currentUser, node });
  refreshProductList();
  renderBlockchain();
  generateQRCode(id);
  renderAnalytics();
}

async function transferProduct() {
  // Transfers ownership of a product
  const id = document.getElementById("productList").value;
  const newOwner = document.getElementById("newOwner").value;
  const product = products.find(p => p.id === id);
  // Check if the product exists and the current user is the owner
  if (!product || product.owner !== currentUser) return alert("Unauthorized transfer.");
  const oldOwner = product.owner;
  // Update product owner
  product.owner = newOwner;
  // Append a "TRANSFER" block to the blockchain
  await appendBlock({ type: "TRANSFER", id, from: oldOwner, to: newOwner });
  refreshProductList();
  renderBlockchain();
  generateQRCode(id);
  renderAnalytics();
}

async function appendBlock(data) {
  // Appends a new block to the blockchain
  // Get the hash of the previous block, or "GENESIS" if it's the first block
  const prevHash = blockchain.length ? blockchain[blockchain.length - 1].hash : "GENESIS";
  // Create a record by concatenating the data and the previous hash
  const record = JSON.stringify(data) + prevHash;
  const hash = await hashData(record);
  // Add the new block to the blockchain array
  blockchain.push({ ...data, time: new Date().toISOString(), prevHash, hash });
}

function refreshProductList() {
  // Updates the product list dropdown with products owned by the current user
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
  // Renders the blockchain on the UI
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
  // Generates a QR code for a given product ID
  const product = products.find(p => p.id === id);
  const qrContainer = document.getElementById("qrContainer");
  qrContainer.innerHTML = "";
  if (product) {
    // Use QRCode.toCanvas to generate and append the QR code canvas
    QRCode.toCanvas(document.createElement('canvas'), JSON.stringify(product), (err, canvas) => {
      if (!err) qrContainer.appendChild(canvas);
    });
  }
}

function exportCSV() {
  // Exports the blockchain data to a CSV file
  const csv = ["Type,ID,From,To,Time,Hash"];
  blockchain.forEach(b => {
    csv.push(`${b.type},${b.id},${b.from},${b.to},${b.time},${b.hash}`);
  });
  // Create a Blob and a download link for the CSV data
  const blob = new Blob([csv.join("\n")], { type: 'text/csv' });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "blockchain_log.csv";
  link.click();
}

function renderAnalytics() {
  // Renders simple analytics about product ownership
  const analytics = {};
  products.forEach(p => {
    analytics[p.owner] = (analytics[p.owner] || 0) + 1;
  });
  const div = document.getElementById("analytics");
  div.innerHTML = Object.entries(analytics).map(([owner, count]) => `<p>${owner}: ${count} products</p>`).join('');
}
