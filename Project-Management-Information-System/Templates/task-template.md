---
title: "{{title}}"
status: "{{status}}"
finalized:
started: "{{date}}"
target: "{{target}}"
contact: "{{contact}}"
project: "{{project}}"
tags:
  - task
  - active
---

# {{title}}

> [!info] Task Info
> **Project:** `= this.project`
> **Status:** `= this.status` 
> **Started:** `= this.started` 
> **Target:** `= this.target`
> **Contact:** `= this.contact` 

> [!info] Quick Status Update
> ```dataviewjs
> // Task Status Update Dropdown
> const displayStatuses = ["📝 To Do", "🔄 In Progress", "⏸️ Waiting", "🚫 On Hold", "✅ Complete"];
> const statusValues = ["todo", "in-progress", "waiting", "on-hold", "complete"];
> const currentStatus = dv.current().status;
> 
> // 1. Create the <select> dropdown element
> const select = dv.el("select", "", { 
>     cls: "dataview-select-status",
>     title: "Change Task Status"
> });
> 
> // 2. Populate the dropdown with options
> for (let i = 0; i < displayStatuses.length; i++) {
>     let option = dv.el("option", displayStatuses[i]);
>     // The value is the clean, lowercase string (e.g., "todo")
>     option.value = statusValues[i];
>     
>     // Set the selected option based on the current YAML status
>     if (statusValues[i] === currentStatus) {
>         option.selected = true;
>     }
>     select.appendChild(option);
> }
> 
> // 3. Add the event listener to handle changes
> select.addEventListener('change', async (evt) => {
>     // The value is already the clean, lowercase string from statusValues array
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
>     // The new status is written directly without quotes (since it's a simple string)
>     const newStatusLine = `status: ${finalStatus}`; 
> 
>     const newContent = content.replace(statusRegex, newStatusLine);
> 
>     // Write the change back to the file
>     if (content !== newContent) {
>         await app.vault.modify(currentFile, newContent);
>         new Notice(`Task Status updated to: ${finalStatus}`);
>     } else {
>         new Notice("Failed to find or update task status property. Check YAML frontmatter.");
>     }
> });
> 
> dv.paragraph(select);
> ```
## Task Overview
### Description
{{description}}

### Success Criteria
{{success}}

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

## References & Links
- Related project: 
- Documentation: