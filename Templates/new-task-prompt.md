<%*
const app = window.app; 
const selectProject = tp.user.unified_scripts.selectProject; 

let title = ""; 
let sanitizedTitle = ""; 
let titleExists = true;

// 1. Project Selection
let projectTitle = await selectProject(tp, app);
if (projectTitle === null) {
	return; 
}

// --- LINKING PATH PREPARATION ---
let projectLink = "";
let projectFilePath = ""; 
let projectSanitizedTitle = ""; // Need this to build the task path

if (projectTitle !== "General") {
    // 1. Sanitize the title to match the project's folder name
    projectSanitizedTitle = projectTitle.trim()
        .replace(/[\/\\:*?"<>|]/g, '-')
        .replace(/\s+/g, '-')
        .replace(/^-+|-+$/g, '');
        
    // 2. Construct the full path to the Project's Metadata.md file
    projectFilePath = `Projects/Active/${projectSanitizedTitle}/Metadata`;
    
    // 3. Create the path-based link
    projectLink = `[[${projectFilePath}|${projectTitle.trim()}]]`;

	await tp.user.unified_scripts.verifyTaskSubfolders(app, projectSanitizedTitle);
}
// --- END LINKING PATH PREPARATION ---


// 2. Task Uniqueness Check
const folders = ['Active', 'Archive', 'Backlog', 'Completed'];

while (titleExists) {
    title = await tp.system.prompt("Task Title (must be unique)");
    
    if (title === null) {
        return;
    }
    
    sanitizedTitle = title.trim()
        .replace(/[\/\\:*?"<>|]/g, '-')
        .replace(/\s+/g, '-')
        .replace(/^-+|-+$/g, '');
        
    if (sanitizedTitle === "") {
        new Notice("Title cannot be empty after cleaning.", 5000);
        continue;
    }

    titleExists = false; 
    let conflictFolder = null;

    for (const folder of folders) {
        const potentialPath = `Tasks/${folder}/${sanitizedTitle}`; 
        const fileExists = app.vault.getAbstractFileByPath(potentialPath);

        if (fileExists) {
            titleExists = true; 
            conflictFolder = folder;
            break; 
        }
    }

    if (titleExists) {
        new Notice(`❌ A task named "${sanitizedTitle}" already exists in the 'Tasks/${conflictFolder}/' folder. Please choose a unique name.`, 8000);
    }
}
title = title.trim();

// 3. The rest of the prompts (Contact, Description, Success, Target, Status)

let contact = await tp.system.prompt("Contact/Requester (optional)");
if (contact && contact.trim() !== "") { 
    contact = `[[${contact.trim()}]]`; 
} else if (contact === null) { 
	return; 
} else {
    contact = "";
}

let description = await tp.user.unified_scripts.collectMultilineInput(tp, "Task Description"); 
if (description === null) { 
	return; 
} 

let success = await tp.user.unified_scripts.collectMultilineInput(tp, "Success Criteria"); 
if (success === null) { 
	return; 
} 

let target = await tp.system.prompt("Target Date (YYYY-MM-DD, optional)", ""); 
while (target !== null && target.trim() !== "" && !moment(target.trim(), "YYYY-MM-DD", true).isValid()) { 
	new Notice("Invalid date format. Please use YYYY-MM-DD (e.g., 2025-01-31) or leave blank.", 7000); 
	target = await tp.system.prompt("Target Date (YYYY-MM-DD, optional)"); 
} 
if (target === null) { 
	return; 
}
target = (target.trim() !== "") ? `[[${target.trim()}]]` : "";

let status = await tp.system.suggester( ["📝 To Do", "🔄 In Progress", "⏸️ Waiting", "🚫 On Hold", "✅ Complete"], ["todo", "in-progress", "waiting", "on-hold", "complete"], false, "Current Status" )
if (status === null) {
	return; 
}

// 4. Prepare Template Content
let templateContent = await tp.file.include("[[Templates/task-template.md]]");
// --- DYNAMIC FILE PATH DETERMINATION (NEW) ---
if (projectTitle !== "General") {
    // Task goes inside the project's subfolder
    taskFilePath = `Projects/Active/${projectSanitizedTitle}/Tasks/Active/${sanitizedTitle}/Metadata`;
} else {
    // Task goes to the general active folder
    taskFilePath = `Tasks/Active/${sanitizedTitle}/Metadata`;
}
// ---------------------------------------------

let newContent = templateContent
    .replace(/{{title}}/g, title)
    .replace(/{{status}}/g, status)
    .replace(/{{contact}}/g, contact)
    .replace(/{{target}}/g, target) 
    .replace(/{{description}}/g, description)
    .replace(/{{success}}/g, success)
    .replace(/{{project}}/g, projectLink) 
    .replace(/{{date}}/g, `[[${tp.date.now("YYYY-MM-DD")}]]`);

tR += newContent;

// 6. Move and Create File
await tp.file.move(taskFilePath);
_%>