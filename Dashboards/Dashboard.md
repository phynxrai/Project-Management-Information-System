# 🚀 Unified Dashboard

> [!tip] Quick Actions
> Create new projects, tasks, and quick captures from one central spot.
> 
> ```dataviewjs
> // Get references to the template files
> const projectTemplate = app.vault.getAbstractFileByPath("Templates/new-project-prompt.md");
> const taskTemplate = app.vault.getAbstractFileByPath("Templates/new-task-prompt.md");
> const captureTemplate = app.vault.getAbstractFileByPath("Templates/new-capture-prompt.md");
> 
> // Get Templater API
> const templater = app.plugins.plugins["templater-obsidian"].templater;
> 
> // Create button for New Project
> const projectBtn = dv.el("button", "➕ New Project", {
>     cls: "dataview-button"
> });
> projectBtn.addEventListener('click', async (evt) => {
>     evt.preventDefault();
>     await templater.create_new_note_from_template(projectTemplate);
> });
> 
> // Create button for New Task
> const taskBtn = dv.el("button", "📋 New Task", {
>     cls: "dataview-button"
> });
> taskBtn.addEventListener('click', async (evt) => {
>     evt.preventDefault();
>     await templater.create_new_note_from_template(taskTemplate);
> });
> 
> // Create button for Quick Capture
> const captureBtn = dv.el("button", "⚡ Quick Capture", {
>     cls: "dataview-button"
> });
> captureBtn.addEventListener('click', async (evt) => {
>     evt.preventDefault();
>     await templater.create_new_note_from_template(captureTemplate);
> });
> 
> // Display the buttons
> dv.paragraph([projectBtn, taskBtn, captureBtn]);
> 
> ```
---


---
### 📥 Inbox Captures (Still in Inbox)

```dataviewjs
const inboxItems = dv.pages('"Inbox"')
    // Filter out files that are tagged as #task or #project
    .where(p => !p.file.tags.includes('task') && !p.file.tags.includes('project'))
    .sort(p => p.file.ctime, 'desc');

// Check if the list is empty
if (inboxItems.length === 0) {
    dv.paragraph("Inbox empty");
} else {
    // If items exist, render them as a list
    dv.list(inboxItems.file.link);
}
```

---
### 🐢 Top 3 Oldest Tasks

```dataviewjs
const statusMap = {
    "todo": "📝 To Do",
    "in-progress": "🔄 In Progress",
    "waiting": "⏸️ Waiting",
    "on-hold": "🚫 On Hold",
    "complete": "✅ Complete"
};

// 1. Get, filter, sort, and limit the tasks
const tasks = dv.pages('"Tasks/Active/" or "Projects/Active/*/Tasks/" & #task') // <-- UPDATED SEARCH PATH
    .where(p => 
        // Filter: Must have an active status
        p.status != "complete" && 
        p.status != "on-hold" && 
        p.status != "waiting"
    )
    .sort(p => p.started, 'asc')
    .limit(3);

// 2. Check if the task list is empty
if (tasks.length === 0) {
    dv.paragraph("No available tasks.");
} else {
    // 3. Map and display the table if tasks exist
    dv.table(
        ["Task", "Status", "Requester", "Target Date", "Age (Days)"],
        tasks.map(p => {
            // Check if p.started exists before calculating age
            const age = p.started 
                ? Math.round(moment().diff(moment(p.started), 'days')) 
                : '—';
             
            return [
                // Ensure the link displays the title, not Metadata.md
                `[[${p.file.path}|${p.title}]]`, 
                statusMap[p.status] || p.status, 
                p.contact,
                p.target,
                age // Use the calculated age or placeholder
            ];
        })
    );
}
```

---
### 🚧 Active Projects by Priority

```dataviewjs
// Project Status Mapping (for Projects)
const statusMap = {
    "planning": "📋 Planning",
    "in-progress": "🔄 In Progress",
    "waiting": "⏸️ Waiting",
    "on-hold": "🚫 On Hold",
    "complete": "✅ Complete"
};

// Priority Mapping
const priorityMap = {
    "high": "🔴 High",
    "medium": "🟡 Medium",
    "low": "🟢 Low"
};

// 1. Define Fixed Order Array (This controls the display order)
const priorityOrder = [
    { key: "high", display: "🔴 High" },
    { key: "medium", display: "🟡 Medium" },
    { key: "low", display: "🟢 Low" }
];

// 2. Filter and Group Data
const pages = dv.pages("#project")
    .where(p => 
        p.file.path.startsWith("Projects/Active/") && 
        p.status != "complete"
    );

// Group the actual project data by its lowercase priority for fast lookup
const dataMap = pages.groupBy(p => p.priority);

// 3. Iterate over the Fixed Order and Display
for (let priorityGroup of priorityOrder) {
    const groupKey = priorityGroup.key;
    const displayHeader = priorityGroup.display;
    
    // Find the corresponding data group in the mapped data
    const groupData = dataMap.find(g => g.key === groupKey);
    
    // Display the header (Priority Level)
    dv.header(3, displayHeader);
    
    if (groupData && groupData.rows.length > 0) {
        // If projects exist, display the table
        dv.table(
            ["Project", "Status", "Target", "Contact"],
            groupData.rows
                .map(p => [
                    `[[${p.file.path}|${p.title}]]`, 
                    statusMap[p.status] || p.status,
                    p.target,
                    p.contact
                ])
        );
    } else {
        // If no projects exist, display a message
        dv.paragraph(`No active projects currently set to **${displayHeader}** priority.`);
    }
}
```

---
### ⏸️ Projects in Backlog

```dataviewjs
// 1. Query files in the Backlog folder, tagged as #project
const backlogProjects = dv.pages('"Projects/Backlog/" & #project')
    .sort(p => p.title, 'asc'); // Sorts alphabetically by project title

if (backlogProjects.length === 0) {
    dv.paragraph("The project backlog is currently empty.");
} else {
    // 2. Render the table
    dv.table(
        ["Project", "Assigned Date", "Contact"],
        backlogProjects.map(p => [
            // Project Link (using the file path and title)
            `[[${p.file.path}|${p.title}]]`,
            // Assigned Date (uses the 'started' property, which logs the date of creation/assignment)
            p.started,
            // Contact
            p.contact
        ])
    );
}
```

---
## 📋 Recently Updated
```dataviewjs
// Combined Status Mapping (for Tasks and Projects)
const statusMap = {
    "planning": "📋 Planning",
    "in-progress": "🔄 In Progress",
    "waiting": "⏸️ Waiting",
    "on-hold": "🚫 On Hold",
    "complete": "✅ Complete",
    "todo": "📝 To Do" 
};

// Priority Mapping
const priorityMap = {
    "high": "🔴 High",
    "medium": "🟡 Medium",
    "low": "🟢 Low"
};

const allFiles = dv.pages("#project OR #task")
    .where(p => 
        // Filter by path AND exclude completed status
        (p.file.path.startsWith("Tasks/Active/") || p.file.path.startsWith("Projects/Active/")) && 
        p.status != "complete"
    )
    .sort(p => p.file.mtime, 'desc') // Sort by last modified time
    .limit(10) // Limit set to 10
    .map(p => {
        // FIX: Determine Type based on File Path, which is more reliable
        const type = p.file.path.startsWith("Projects/Active/") ? "Project" : "Task";
        
        // Use the file's main title property as the display name for the link
        const linkedTitle = `[[${p.file.path}|${p.title}]]`;
        
        // Map status to emoji display string
        const statusDisplay = statusMap[p.status] || p.status;
        
        // Show priority for projects, use "—" for tasks
        const priorityDisplay = (type === "Project") ? (priorityMap[p.priority] || p.priority) : "—";
        
        // Format last edited time
        const lastEdited = p.file.mtime.toFormat("yyyy-MM-dd HH:mm");

        return [
            type,
            linkedTitle,
            statusDisplay,
            priorityDisplay,
            lastEdited
        ];
    });

dv.table(
    ["Type", "Name", "Status", "Priority", "Last Edited"],
    allFiles
);
```

---
### ✅ Projects Completed This Year

```dataviewjs
// 1. Get the current year for path filtering
const currentYear = moment().format("YYYY");
const folderPath = `"Projects/Completed/${currentYear}"`;

// 2. Query for projects in the current year's completed folder
const completedProjects = dv.pages(`${folderPath} & #project`)
    // Sort by the 'finalized' date, which is logged by the Admonition buttons
    .sort(p => p.finalized, 'desc'); 

dv.header(3, `Completed in ${currentYear}`);

if (completedProjects.length === 0) {
    dv.paragraph(`No projects have been marked complete in ${currentYear} yet.`);
} else {
    // 3. Render the table with only Project and Finalized Date
    dv.table(
        ["Project", "Finalized Date"],
        completedProjects.map(p => [
            // Use p.title for the display text of the link
            `[[${p.file.path}|${p.title}]]`,
            // Display the finalized date from YAML
            p.finalized
        ])
    );
}
```

