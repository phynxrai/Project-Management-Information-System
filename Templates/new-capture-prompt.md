<%* const app = window.app; 
const selectProject = await tp.user.unified_scripts.selectProject(tp, app); 

// Generate date and time 
let date = tp.date.now("YYYY-MM-DD"); 
let time = tp.date.now("HHmm"); 

// Get the template content 
let templateContent = await tp.file.include("[[Templates/daily-capture-template]]");

// --- PROJECT SELECTION ---
let projectTitle = selectProject; 
if (projectTitle === null) { 
	return; 
}
// Store the final linked value for the task file
let projectLink = projectTitle !== "General" ? `[[${projectTitle.trim()}]]` : "General";
// -------------------------

// Prompt for contact 
let contact = await tp.system.prompt("Contact (or leave blank)"); 
if (contact && contact.trim() !== "") { 
    contact = `[[${contact.trim()}]]`; 
} else if (contact === null) { 
	return; 
} else {
    contact = "";
}

// Prompt for notes
let notes = await tp.user.unified_scripts.collectMultilineInput(tp, "Notes"); 
if (notes === null) { 
	return; 
} 

// Prompt for parts
let parts = await tp.user.unified_scripts.collectMultilineInput(tp, "Parts"); 
if (parts === null) { 
	return; 
} 

// Replace all placeholders in the template 
let captureContent = templateContent 
	.replace(/{{date}}/g, date) 
	.replace(/{{time}}/g, time) 
	.replace(/{{project}}/g, projectLink) // Use the final link/string
	.replace(/{{contact}}/g, contact)
	.replace(/{{notes}}/g, notes) 
	.replace(/{{parts}}/g, parts)

tR += captureContent;

// Use the Project/General name for the filename
let title = (projectTitle !== "General" ? projectTitle.trim() : "General") + "_" + date + "_" + time;

// Remove illegal characters for the filename, but use the original title for display
let filename = "Inbox/" + title.replace(/[\/\\:*?"<>|]/g, '').replace(/\s+/g, '_');
await tp.file.move(filename);
_%>