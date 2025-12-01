async function collectMultilineInput(tp, promptText) {
	let defaultIfBlank = "_Not noted_";
    let output = "";
    let entry = "";
    
    do {
        // Use a dedicated 'stop' prompt text to clearly guide the user
        entry = await tp.system.prompt(promptText + " (Press ENTER for new line, or leave blank to finish)"); 
        
        if (entry === null) {
            // User cancelled the entire sequence
            return null;
        }
        if (entry !== "") {
			let outputLine = "";
            
            // Regex to capture one or more leading hyphens followed by a space and the rest of the content
            let match = entry.match(/^(-+)\s(.*)/);

            if (match) {
                // Case 1: Indented List Item (starts with '-' or '--', etc.)
                let hyphenCount = match[1].length; 
                let contentText = match[2]; 
                
                // FIX: Calculate indentation based on the fact that Markdown requires 4 spaces
                // for the first nested level (hyphenCount = 1).
                // We want: 
                // Level 1: 4 spaces
                // Level 2 (hyphenCount=2): 8 spaces
                // Level 3 (hyphenCount=3): 12 spaces
                let indentLevel = hyphenCount; // Treat the number of hyphens as the desired list level
                let indentSpaces = " ".repeat(indentLevel * 4);
                
                // Construct the line: [Spaces] + [- ] + [Content]
                // We always use a single '- ' list marker.
                outputLine = indentSpaces + "- " + contentText;

            } else {
                // Case 2: Top-Level List Item (no leading hyphens in the input)
                outputLine = "- " + entry;
            }

            output += outputLine;
            output += "\n";
        } 
    } while (entry !== "");
    
    // If the output is empty after the loop, return the default value
    if (output === "") {
        return defaultIfBlank; 
    }
    
    return output;
};

/**
 * @param {Templater} tp 
 * @param {Object} app 
 */
async function selectProject(tp, app) {
    // Safely get Dataview API using the global access method
    const dvApi = app.plugins.plugins.dataview?.api;
    if (!dvApi) {
        new Notice("Dataview API not available. Only 'General' can be selected.", 6000);
        return await tp.system.prompt("Project Title (Only 'General' is available)", "General");
    }

    // --- FIX: Filter Dataview pages by tag, EXCLUDING the Templates folder path ---
    const projectPages = dvApi.pages('#project')
        .where(p => 
            p.file.path.startsWith("Projects/Active") &&
            p.status != "complete" && 
            p.status != "canceled"
        ); 
    // 2. Map file titles to a list for the suggester
    const projectTitles = projectPages.map(p => p.title).array().sort();
    
    // 3. Prompt the user
    let projectTitle = await tp.system.suggester(
        ["General", ...projectTitles], 
        ["General", ...projectTitles], 
        false, 
        "Link to Project (or select General)"
    );

    // If canceled, return null
    if (projectTitle === null) {
        return null; 
    }
    // 4. Verify Project Exists (This section is critical and necessary)
    if (projectTitle !== "General") {
        // Sanitize the title to match the actual folder/file name
        const sanitizedTitle = projectTitle.trim()
            .replace(/[\/\\:*?"<>|]/g, '-')
            .replace(/\s+/g, '-')
            .replace(/^-+|-+$/g, '');
            
        // Check for the Metadata.md file inside the expected Active folder path
        const projectPath = `Projects/Active/${sanitizedTitle}/Metadata.md`;
        
        // Check if the file exists
        const projectFile = app.vault.getAbstractFileByPath(projectPath);
        if (!projectFile) {
            new Notice(`❌ Project file not found at expected path: ${projectPath}. Please select a valid project.`, 8000);
            // Recursively prompt again
            return await selectProject(tp, app); 
        }
    }
    
    return projectTitle;
}

/**
 * @param {Templater} tp 
 * @param {Object} app 
 */
async function completeTask(tp, app) {
    // 1. Get the current file object
    const currentFilePath = tp.file.path(true); // Gets the full path of the current file
    const currentFile = app.vault.getAbstractFileByPath(currentFilePath);

    if (!currentFile) {
        new Notice("Error: Could not find current file.", 5000);
        return;
    }

    // 2. Read the file content
    let content = await app.vault.read(currentFile);
    
    // Check if the status is already complete
    if (content.includes("status: complete")) {
        new Notice("Task is already marked complete. Skipping update.", 4000);
        return;
    }

    // 3. Update the status and finalized date in the YAML frontmatter
    let newContent = content
        // Replace current status with 'complete'
        .replace(/status: (planning|in-progress|waiting|on-hold)/, 'status: complete')
        // Add the completion date to the 'finalized' field
        .replace(/finalized: /, `finalized: [[${tp.date.now("YYYY-MM-DD")}]]`);

    // 4. Write the new content back to the file
    await app.vault.modify(currentFile, newContent);
    new Notice(`✅ Task marked Complete and finalized date set!`, 5000);
}

/**
 * Ensures the required task subfolders (Active, Complete, Cancel) exist 
 * inside the specified project's 'Tasks' directory.
 * This is called only when creating a new task for a project.
 * @param {Object} app - The Obsidian App object
 * @param {string} projectSanitizedTitle - The sanitized title of the project (folder name)
 */
async function verifyTaskSubfolders(app, projectSanitizedTitle) {
    if (projectSanitizedTitle === "General" || !projectSanitizedTitle) {
        // Skip check for 'General' tasks
        return;
    }

    // Path to the project's root folder (e.g., Projects/Active/Project-A)
    const projectFolderPath = `Projects/Active/${projectSanitizedTitle}`;
    // The folders we need to ensure exist relative to the project folder
    const requiredSubfolders = ["Tasks", "Tasks/Active", "Tasks/Completed", "Tasks/Archive", "Tasks/Backlog"];
    let createdCount = 0;
    
    // Iterate and create folders
    for (const folder of requiredSubfolders) {
        const finalPath = `${projectFolderPath}/${folder}`;
        
        try {
            // createFolder handles recursive creation (e.g., if 'Tasks' is missing, it creates it)
            await app.vault.createFolder(finalPath);
            createdCount++;
        } catch (e) {
            // Safely ignore errors for folders that already exist
        }
    }

    if (createdCount > 0) {
        new Notice(`📁 Project setup for '${projectSanitizedTitle}': Created ${createdCount} missing task subfolders.`, 4000);
    }
}

module.exports = {
    selectProject,      // Existing function
	collectMultilineInput,
    completeTask,       // Existing function
    verifyTaskSubfolders // <--- THIS LINE MUST BE PRESENT
};