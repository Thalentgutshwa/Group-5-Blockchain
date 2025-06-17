# Group-5-Blockchain

# GreenFarm Organics Blockchain Traceability

This project presents a lightweight blockchain traceability system for GreenFarm Organics, designed to track agricultural product movement from farm to retail. The platform simulates a 3-node supply chain—Farmers, Distributors, and Retail Shops—ensuring end-to-end visibility and trust using a custom blockchain.

# Project Overview

GreenFarm Organics aims to enhance transparency in the food supply chain. The project enables:
- Product registration and tracking across 3 supply chain nodes
- Blockchain ledger with hash chaining and timestamps
- QR code generation for each product
- Exportable CSV traceability records
- Ownership analytics for auditing
- A user-friendly and responsive web interface

# Problem Statement

Small agricultural producers face challenges in authenticating product origin and ensuring reliable handovers. Manual methods lack transparency and traceability, leading to fraud and trust issues. This system introduces blockchain technology to:
- Ensure data immutability and trust
- Track provenance with accurate timestamping
- Provide a digital audit trail of product ownership

# System Architecture

[ Farmer Node ] → [ Distributor Node ] → [ Retail Node ]
| | |
Register Transfer Verify + Export
Products Ownership QR + Analytics
↓ ↓ ↓
Blockchain Ledger ← Append ← Append ← Append per Event

- Blocks contain product data, timestamp, user identity, and hash links.
- Each action (register or transfer) appends a new block to the chain.
- Users interact via a frontend and see live changes reflected in the blockchain ledger.

## Features

- User login and registration
- Product registration and ownership tracking
- Blockchain ledger with hash and previous hash
- QR code generation for each product
- CSV export of all product traceability data
- Ownership analytics (node activity chart)
- Responsive and branded UI

## Technologies Used

- HTML, CSS, JavaScript
- QRCode.js for QR code generation
- Firebase Studio for authentication and data storage
- Github Repositery pages for hosting the blockchain website live
- In-memory blockchain array (JavaScript-based)
- CSV export and DOM manipulation

## Testing & Validation

- Manually tested major functions:
  - Product registration
  - Blockchain hash integrity
  - QR code validity
  - Ownership analytics
  - CSV download format
- System tested on mobile and desktop screen sizes
- Verified that data remains immutable once appended

## Project Structure

GreenFarm

├── index.html Main UI layout and structure
├── style.css Styling for layout, cards, QR, buttons
├── script.js Logic for blockchain, QR, analytics, CSV
├── architecture Diagram (visual for reports)
├── README.md Project documentation


## Node Simulation

Each registered user is assigned to a role (Farmer, Distributor, Retailer). The product is passed along through these nodes using the Transfer Product feature, each step recorded on the blockchain.

## Innovation

- Simulates decentralization without complex infrastructure
- Uses QR to allow quick scanning and provenance verification
- Adds analytics to identify supply chain hotspots
- Lightweight and scalable for small business environments

## How to Use

1. Open `index.html` in your browser.
2. Register as a new user.
3. Login and register a product (Farmer).
4. Transfer to Distributor ➝ Retailer.
5. View the blockchain ledger and generate QR.
6. Export traceability report as CSV.

##  Contact & Credits

- Developed by: Group 5
- For academic evaluation under Blockchain Traceability Project 
- Contact: `talent@example.com` (replace with your actual email)
- GitHub: [github.com/your-org](https://github.com/your-org)

## License

 Free version in Firebase Studio and Github to use and modify for academic or non-commercial purposes.
