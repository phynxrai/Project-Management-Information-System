<%*
const app = window.app; // Ensure 'app' is initialized

// Prompt for all part fields
let partName = await tp.system.prompt("Part Name/Component");
if (partName === null) {
    return;
}

let qty = await tp.system.prompt("Quantity");
if (qty === null) {
    return;
}

let unitCost = await tp.system.prompt("Unit Cost (numbers only, no $)");
if (unitCost === null) {
    return;
}

// Simple status selection using emojis
let status = await tp.system.suggester(
    ["⬜ Need to Order", "📦 Ordered", "✅ Received"],
    ["⬜ Need", "📦 Ordered", "✅ Received"],
    false,
    "Status"
);
if (status === null) {
    return;
}

let supplier = await tp.system.prompt("Supplier (or leave blank)");
if (supplier === null) {
    return;
}

let orderDate = await tp.system.prompt("Order Date (YYYY-MM-DD, or leave blank)");
if (orderDate === null) {
    return;
}

let tracking = await tp.system.prompt("Tracking Number (or leave blank)");
if (tracking === null) {
    return;
}

let link = await tp.system.prompt("Link/Source URL (or leave blank)");
if (link === null) {
    return;
}

let notes = await tp.system.prompt("Notes (or leave blank)");
if (notes === null) {
    return;
}

// ------------------------------------------
// 1. Format the plain text table row
// ------------------------------------------

let linkFormatted = link ? `[Link](${link})` : "";
// Assemble the final row using the selected status text/emoji
let newRow = `| ${partName} | ${qty} | ${unitCost} | ${status} | ${supplier} | ${orderDate} | ${tracking} | ${linkFormatted} | ${notes} |`;

// ------------------------------------------
// 2. Find Table and Insert Row (Robust Logic)
// ------------------------------------------

// Get current file content
let currentFile = tp.file.find_tfile(tp.file.path(true));
let content = await app.vault.read(currentFile);

// Robust Anchor: Use the unique status text to find the placeholder row
let uniqueTextAnchor = "⬜ Need / 📦 Ordered / ✅ Received";
let anchorPos = content.lastIndexOf(uniqueTextAnchor);

if (anchorPos !== -1) {
    // Search backward from the unique text to find the start of the line
    let lineStart = content.lastIndexOf("\n", anchorPos);
    
    // Insertion point is right after the newline
    let insertPosition = (lineStart === -1) ? 0 : lineStart + 1; 

    // Insert the new row right before the placeholder row
    let newContent = content.slice(0, insertPosition) + newRow + "\n" + content.slice(insertPosition);
    await app.vault.modify(currentFile, newContent);
    new Notice(`Part entry for "${partName}" successfully added to table.`);
} else {
    // Fallback: Append to end if table isn't found
    new Notice("Could not find parts table placeholder. Row added to end of file.");
    await app.vault.modify(currentFile, content + "\n\n" + newRow + "\n");
}
_%>