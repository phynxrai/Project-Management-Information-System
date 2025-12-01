<%* const app = window.app; 
let title = ""; 
let sanitizedTitle = ""; 
let titleExists = true;

const folders = ['Active', 'Archive', 'Backlog', 'Completed'];

while (titleExists) {
    title = await tp.system.prompt("Project Title (must be unique)");
    
    // Check for cancellation
    if (title === null) {
        return;
    }
    // Sanitize the title to check the correct file path
    sanitizedTitle = title.trim()
        .replace(/[\/\\:*?"<>|]/g, '-')
        .replace(/\s+/g, '-')
        .replace(/^-+|-+$/g, '');
        
    // Check if the sanitized title is empty after cleaning
    if (sanitizedTitle === "") {
        new Notice("Title cannot be empty after cleaning. Please enter a valid name.", 5000);
        continue;
    }

    // Assume the title is unique until a conflict is found
    titleExists = false; 
    let conflictFolder = null;

    // Loop through the list of project folders
    for (const folder of folders) {
        const potentialPath = `Projects/${folder}/${sanitizedTitle}`;
        const fileExists = app.vault.getAbstractFileByPath(potentialPath);

        if (fileExists) {
            titleExists = true; // Conflict found, restart loop
            conflictFolder = folder;
            break; // Stop checking other folders immediately
        }
    }

    if (titleExists) {
        new Notice(`❌ A project named "${sanitizedTitle}" already exists in the 'Projects/${conflictFolder}/' folder. Please choose a unique name.`, 8000);
    }
}
// Use the original title for display purposes, but use sanitizedTitle for the path
title = title.trim();

let priority = await tp.system.suggester( ["🔴 High", "🟡 Medium", "🟢 Low"], ["high", "medium", "low"], false, "Select Priority" );
if (priority === null) {
	return; 
}

let capital = await tp.system.suggester( ["Expense", "Capital"], [false, true], false, "Expensed or Capital?" );
if (capital === null) {
	return; 
}

let target = await tp.system.prompt("Target Date (YYYY-MM-DD, optional)", ""); 
// Loop while input is not null, not blank, AND fails moment's strict date check 
while (target !== null && target.trim() !== "" && !moment(target.trim(), "YYYY-MM-DD", true).isValid()) { 
	new Notice("Invalid date format. Please use YYYY-MM-DD (e.g., 2025-01-31) or leave blank.", 7000); 
	target = await tp.system.prompt("Target Date (YYYY-MM-DD, optional)"); 
} 
if (target === null) { 
	return; 
}
target = (target.trim() !== "") ? `[[${target.trim()}]]` : "";

let contact = await tp.system.prompt("Contact (optional)");
if (contact === "") {
	contact = "none";
}
else if (contact === null) { 
	return; 
}

let purpose = await tp.user.unified_scripts.collectMultilineInput(tp, "Project Purpose"); 
if (purpose === null) { 
	return; 
} 

let scope = await tp.user.unified_scripts.collectMultilineInput(tp, "Project Scope"); 
if (scope === null) { 
	return; 
} 

let success = await tp.user.unified_scripts.collectMultilineInput(tp, "Success Criteria"); 
if (success === null) { 
	return; 
} 

let status = await tp.system.suggester( ["📋 Planning", "🔄 In Progress", "⏸️ Waiting", "🚫 On Hold", "✅ Complete"], ["planning", "in-progress", "waiting", "on-hold", "complete"], false, "Current Status" )
if (status === null) {
	return; 
}

let templateContent = await tp.file.include("[[Templates/project-template]]");

let newContent = templateContent 
	.replace(/{{title}}/g, title) 
	.replace(/{{priority}}/g, priority) 
	.replace(/{{capital}}/g, capital) 
	.replace(/{{status}}/g, status) 
	.replace(/{{date}}/g, `[[${tp.date.now("YYYY-MM-DD")}]]`) 
	.replace(/{{target}}/g, target) 
	.replace(/{{contact}}/g, contact) 
	.replace(/{{purpose}}/g, purpose)
	.replace(/{{scope}}/g, scope)
	.replace(/{{success}}/g, success);

tR += newContent;

let filename = "Projects/Active/" + sanitizedTitle + "/Metadata.md";
await tp.file.move(filename); // This creates the main project folder

// --- NEW CODE: Create the Tasks subfolder ---
const projectFolderPath = `Projects/Active/${sanitizedTitle}`;
const requiredSubfolders = ["Tasks", "Tasks/Active", "Tasks/Complete", "Tasks/Cancel"];
let createdCount = 0;

// Iterate and create the required subfolders, relying on recursive creation
for (const folder of requiredSubfolders) {
    const finalPath = `${projectFolderPath}/${folder}`;

    // Use try/catch to safely handle folders that may already exist (though rare here)
    // The main reason to use createFolder on the sub-tasks is safety, 
    // as creating "Tasks/Active" will also ensure "Tasks" exists.
    try {
        await app.vault.createFolder(finalPath);
        createdCount++; // Only increment if the call succeeds (or throws an ignored error)
    } catch (e) {
        // If the folder already exists, createFolder throws an error, but we can safely ignore it.
    }
}

if (createdCount > 0) {
    new Notice(`📁 Project structure created: Added ${createdCount} missing folders.`, 5000);
} else {
    new Notice(`📁 Project structure verified.`, 3000);
}
// ------------------------------------------

_%>