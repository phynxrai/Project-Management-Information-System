---
title: "{{title}}"
priority: "{{priority}}"
status: "{{status}}"
finalized:
started: "{{date}}"
target: "{{target}}"
contact: "{{contact}}"
budget:
capital: "{{capital}}"
tags:
  - project
  - active
abstract:
---
# {{title}}

> [!abstract] Project Summary
> _A one or two sentence summary of the project's objective and outcome._

> [!info] Project Info
> **Priority:** `= this.priority` 
> **Status:** `= this.status` 
> **Target:** `= this.target`
> **Contact:** `= this.contact` 
> **Budget:** $`= this.budget` 
> **Expense:** `= this.capital`

> [!info] Quick Status Update
> ```dataviewjs
> // Project Status Update Dropdown
> // Two parallel arrays: one for display, one for clean YAML value
> const displayStatuses = ["📋 Planning", "🔄 In Progress", "⏸️ Waiting", "🚫 On Hold", "✅ Complete"];
> const statusValues = ["planning", "in-progress", "waiting", "on-hold", "complete"];
> const currentStatus = dv.current().status; // e.g., "in-progress"
> 
> // 1. Create the <select> dropdown element
> const select = dv.el("select", "", { 
>     cls: "dataview-select-status",
>     title: "Change Project Status"
> });
> 
> // 2. Populate the dropdown with options
> for (let i = 0; i < displayStatuses.length; i++) {
>     let option = dv.el("option", displayStatuses[i]);
>     // Set the option value to the clean, lowercase string
>     option.value = statusValues[i];
>     
>     // Match the selected option by comparing the current YAML status directly
>     if (statusValues[i] === currentStatus) {
>         option.selected = true;
>     }
>     select.appendChild(option);
> }
> 
> // 3. Add the event listener to handle changes
> select.addEventListener('change', async (evt) => {
>     // The finalStatus is now the clean value from the option.value
>     const finalStatus = evt.target.value; 
>     
>     const currentFile = app.workspace.getActiveFile();
>     
>     if (!currentFile) {
>         new Notice("No active file found for update.");
>         return;
>     }
> 
>     let content = await app.vault.read(currentFile);
>     
>     // Find and replace the status property line in YAML frontmatter
>     const statusRegex = /^status:.*$/m;
>     // The new value uses the lowercase status
>     const newStatusLine = `status: "${finalStatus}"`; 
> 
>     const newContent = content.replace(statusRegex, newStatusLine);
> 
>     // Write the change back to the file
>     if (content !== newContent) {
>         await app.vault.modify(currentFile, newContent);
>         // Display the full status to the user in the notice
>         const fullNewStatus = displayStatuses[statusValues.indexOf(finalStatus)];
>         new Notice(`Project Status updated to: ${fullNewStatus}`);
>     } else {
>         new Notice("Failed to find or update project status property. Check YAML frontmatter.");
>     }
> });
> 
> dv.paragraph(select);
> ```

## Project Overview
### Purpose
{{purpose}}

### Scope
{{scope}}

### Success Criteria
{{success}}


---

### Related Tasks

```dataviewjs
// 1. Get the base path for all tasks in this project's hierarchy
// Example: "Projects/Active/Condition-Monitoring/Tasks"
const baseTaskFolderPath = `${dv.current().file.folder}/Tasks`;

// 2. Define the status map for display
const statusMap = {
    "todo": "📝 To Do",
    "in-progress": "🔄 In Progress",
    "waiting": "⏸️ Waiting",
    "on-hold": "🚫 On Hold",
    "complete": "✅ Complete",
    "cancel": "❌ Cancelled" 
};

// 3. Query ALL files tagged #task in the entire vault.
// This is the most robust way to find files regardless of folder structure.
// NOTE: This requires the tag 'task' to be in the YAML frontmatter of your task files.
const allTasks = dv.pages("#task");


// -----------------------------------------------------------------
// --- Query 1: Active Tasks (Filter by 'Active' subfolder) ---
// -----------------------------------------------------------------
dv.header(4, "Active Tasks");

const activeTasks = allTasks
    .where(p => {
        // Filter: Folder path must START with the Active task folder path
        const activePathPrefix = `${baseTaskFolderPath}/Active`;
        return p.file.folder.startsWith(activePathPrefix);
    })
    .sort(p => p.target, 'asc'); // Sort by target date

if (activeTasks.length === 0) {
    dv.paragraph("No active tasks for this project.");
} else {
    dv.table(
        ["Task Name", "Target Date", "Status", "Contact"],
        activeTasks.map(p => {
            const taskLink = `[[${p.file.path}|${p.title}]]`;
            const statusDisplay = statusMap[p.status] || p.status;
            
            return [taskLink, p.target, statusDisplay, p.contact];
        })
    );
}

// -------------------------------------
// --- Query 2: Completed Tasks (Filter by 'Complete' subfolder) ---
// -------------------------------------
dv.header(4, "Completed Tasks");

const completedTasks = allTasks
    .where(p => {
        // Filter: Folder path must START with the Complete task folder path
        const completePathPrefix = `${baseTaskFolderPath}/Complete`;
        return p.file.folder.startsWith(completePathPrefix);
    })
    .sort(p => p.finalized || p.file.mtime, 'desc'); // Sort by completion date

if (completedTasks.length === 0) {
    dv.paragraph("No completed tasks for this project.");
} else {
    dv.table(
        ["Task Name", "Finalized Date", "Contact"],
        completedTasks.map(p => {
            const taskLink = `[[${p.file.path}|${p.title}]]`;
            const finalizedDate = p.finalized || p.file.mtime.toFormat("YYYY-MM-DD");
            
            return [taskLink, finalizedDate, p.contact];
        })
    );
}
```

---
## Parts & Components

> [!tip] Quick Entry Button
> ```dataviewjs
>const partTemplate = app.vault.getAbstractFileByPath("Templates/part-entry-template.md"); 
>const templater = app.plugins.plugins["templater-obsidian"].templater; 
>const btn = dv.el("button", "📦 Add New Part", { cls: "dataview-button" }); 
>btn.addEventListener('click', async (evt) => { evt.preventDefault(); 
>await templater.append_template_to_active_file(partTemplate); });
> ```

| Part/Component | Qty | Unit Cost | Status                           | Supplier | Order Date | Tracking | Link | Notes |
| -------------- | --- | --------- | -------------------------------- | -------- | ---------- | -------- | ---- | ----- |
|                |     |           | ⬜ Need / 📦 Ordered / ✅ Received |          |            |          |      |       |

```dataviewjs
// Calculation: Total Parts Cost
let totalCost = 0;

// Read the raw text of the current file
let fileContent = await dv.io.load(dv.current().file.path);
let lines = fileContent.split('\n');

// 1. Find the table separator line (|---|) which follows the header
let tableSeparatorIndex = lines.findIndex(line => line.includes('| --- |'));

if (tableSeparatorIndex !== -1) {
    // 2. Iterate through rows starting AFTER the separator
    for (let i = tableSeparatorIndex + 1; i < lines.length; i++) {
        let line = lines[i].trim();

        // Stop if line is not a table row (e.g., empty line, start of next section)
        if (!line.startsWith('|') || line.includes('Parts Cost')) {
            break;
        }

        // Skip the placeholder row
        if (line.includes('Need / 📦 Ordered')) {
            continue;
        }

        // 3. Extract Qty and Unit Cost
        // .slice(1, -1) removes the outermost leading/trailing pipes.
        let columns = line.slice(1, -1).split('|').map(c => c.trim());
        
        // Qty is in column 2 (index 1), Unit Cost is in column 3 (index 2)
        // Clean the strings (removes anything that isn't a digit or decimal point)
        let qty = parseFloat(columns[1].replace(/[^0-9.]/g, ''));
        let unitCost = parseFloat(columns[2].replace(/[^0-9.]/g, ''));

        if (!isNaN(qty) && !isNaN(unitCost)) {
            totalCost += (qty * unitCost);
        }
    }
}

// 4. Display Total Parts Cost
dv.paragraph(`**Total Parts Cost:** $${totalCost.toFixed(2)}`);

// 5. Calculate and display Remaining Budget (uses file properties)
let budget = dv.current().budget || 0;
let capital = dv.current().capital; 

// Check for expense status (covering "expense" as requested, and "Expensed" based on likely template output)
let isExpensed = (capital === "expense" || capital === "Expensed" || capital === "✓ Expensed");

// Only display the remaining budget line if the budget property is set OR if it's an expense.
if (dv.current().budget || isExpensed) {
    if (isExpensed) {
        // If expensed, show only the label as requested.
        dv.paragraph(`**Remaining Budget:**`);
    } else {
        // If capitalized (not expensed), show the calculated remaining budget.
        let remaining = budget - totalCost;
        let budgetLine = `**Remaining Budget:** $${remaining.toFixed(2)} *(update as parts are ordered)*`;
        dv.paragraph(budgetLine);
    }
}
```

---

## Feature Requests & Ideas
- [ ]  

---

## Design Notes
### Schematic
- Link to schematic files or brief description

### PCB/Mechanical
- Board design notes, enclosure considerations

### Software/Firmware
- Code structure, libraries needed

---
## Progress Log

> [!tip] Quick Entry Button
> ```dataviewjs
> const logTemplate = app.vault.getAbstractFileByPath("Templates/progress-log-entry.md"); 
> const templater = app.plugins.plugins["templater-obsidian"].templater; 
> const btn = dv.el("button", "➕ Add Daily Log", { cls: "dataview-button" }); 
> btn.addEventListener('click', async (evt) => { evt.preventDefault(); 
> await templater.append_template_to_active_file(logTemplate); });
> ```



---

## Testing & Validation
- [ ] Initial power-on test
- [ ] Functional testing
- [ ] Edge case testing
- [ ] Documentation complete

---

## References & Links
- Datasheets: 
- Related projects: 
- Inspiration: 
- Documentation: 

---

## Project Retrospective
(Complete when project is done)
### What went well:
- 

### What I'd do differently:
- 

### Lessons learned:
-
