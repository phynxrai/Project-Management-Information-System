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
// FINAL PRODUCTION BLOCK: Displays the 3 oldest, currently active tasks.

// 1. Define the status map (using full words for display, instead of symbols)
const statusMap = {
    'todo': '📝 To Do',
    'in-progress': '🔄 In Progress',
    'waiting': '⏸️ Waiting',
    // We filter out 'on-hold' and 'complete' tasks later
};

const files = dv.pages('#task')
    .where(p => 
        // Filter by Path: Descendants of General or Project Active folders
        p.file.path.startsWith("Tasks/Active/") ||
        /^Projects\/Active\/[^\/]+\/Tasks\/Active\//.test(p.file.path)
    )
    .filter(p => {
        // Filter 2: Must NOT be 'complete' or 'on-hold'
        return p.status && p.status !== 'complete' && p.status !== 'on-hold';
    })
    .filter(p => 
        // Filter 3: Must have a 'started' date recorded
        p.started
    )
    // 2. Sort: Oldest tasks first (ascending 'started' date)
    .sort(p => p.started, 'asc')
    
    // 3. Limit: Only show the top 3 oldest tasks
    .limit(3);

dv.header(3, `📌 Top 3 Oldest Active Tasks`);

if (files.length === 0) {
    dv.paragraph("No active tasks found that have a 'started' date.");
} else {
    // 4. Map and display the table
    dv.table(
        // Use the requested clean headers
        ["Title", "Project", "Status", "Started"],
        files.map(p => {
            // Manually construct the link for the Title column:
            // This links to the task's Metadata.md file but displays its 'title' property.
            const taskLink = `[[${p.file.path}|${p.title}]]`;
            
            // Map the status for a friendly display
            const statusDisplay = statusMap[p.status] || p.status;
            
            // Format the start date as YYYY-MM-DD
            const startedDate = p.started ? dv.date(p.started).toFormat("yyyy-MM-dd") : '—';

            return [
                taskLink,
                p.project || '—', // Use the existing linked project property
                statusDisplay,
                startedDate
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
//const backlogProjects = dv.pages('"Projects/Backlog/*" & #project')
  //  .sort(p => p.title, 'asc'); // Sorts alphabetically by project title

const backlogProjects = dv.pages('#project')
    .where(p => 
        // Filter by Path: Descendants of General or Project Active folders
        p.file.path.startsWith("Projects/Backlog/")
    )
    .filter(p => {
        // Filter 2: Must NOT be 'complete' or 'on-hold'
        return p.status && p.status !== 'complete';
    })
    // 2. Sort: Oldest tasks first (ascending 'started' date)
    .sort(p => p.title, 'asc')

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
const folderPath = `Projects/Completed/${currentYear}`;

// 2. Query for projects in the current year's completed folder
//const completedProjects = dv.pages(`${folderPath} & #project`)
    // Sort by the 'finalized' date, which is logged by the Admonition buttons
    //.sort(p => p.finalized, 'desc'); 

const completedProjects = dv.pages('#project')
    .where(p => 
        // Filter by Path: Descendants of General or Project Active folders
        p.file.path.startsWith(folderPath)
    )
    .filter(p => {
        // Filter 2: Must be 'complete'
        return p.status && p.status == 'complete';
    })
    // 2. Sort: Oldest tasks first (ascending 'started' date)
    .sort(p => p.finalized, 'desc')


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

