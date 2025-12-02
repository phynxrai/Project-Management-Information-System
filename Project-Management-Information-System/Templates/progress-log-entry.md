<%* 
let whatIDid = await tp.user.unified_scripts.collectMultilineInput(tp, "What I did today"); 
if (whatIDid === null || whatIDid === "") { 
	return; 
} 

let blockers = await tp.user.unified_scripts.collectMultilineInput(tp, "Blockers/Issues"); 
if (blockers === null) { 
	return; 
} 

let nextSteps = await tp.user.unified_scripts.collectMultilineInput(tp, "Next Steps"); 
if (nextSteps === null) { 
	return; 
} 

// Format the log entry 
let logEntry = `\n### ${tp.date.now("YYYY-MM-DD")}\n`; 
logEntry += `**What I did:**\n`; 
logEntry += whatIDid ? `${whatIDid}\n` : `- \n`; 
logEntry += `\n`; 
logEntry += `**Blockers/Issues:**\n`; 
logEntry += blockers ? `${blockers}\n` : `- \n`; 
logEntry += `\n`; 
logEntry += `**Next steps:**\n`; 
logEntry += nextSteps ? `${nextSteps}\n` : `- \n`; 
logEntry += `\n`;

// Get current file content 
let currentFile = tp.file.find_tfile(tp.file.path(true)); 
let content = await app.vault.read(currentFile);

// Find the Progress Log section header and insert right after the button block 
let progressLogSection = "## Progress Log"; 
let buttonEndMarker = "```\n\n";

let sectionStart = content.indexOf(progressLogSection);

if (sectionStart !== -1) { // Find the end of the button's dataviewjs block after the Progress Log header 
let searchStart = sectionStart + progressLogSection.length; 
let buttonEnd = content.indexOf(buttonEndMarker, searchStart);


if (buttonEnd !== -1) {
    // Insert right after the button block ends
    let insertPosition = buttonEnd + buttonEndMarker.length;
    let newContent = content.slice(0, insertPosition) + logEntry + content.slice(insertPosition);
    await app.vault.modify(currentFile, newContent);
} else {
    // Fallback: if no button found, insert right after Progress Log header
    let insertPosition = content.indexOf("\n", sectionStart) + 1;
    let newContent = content.slice(0, insertPosition) + logEntry + content.slice(insertPosition);
    await app.vault.modify(currentFile, newContent);
}


} else { // Fallback: append to end if section not found 
tR += logEntry; 
} 
_%>