# 📚 Project System Master Guide

Welcome to your comprehensive project management system! This system is designed to help you organize, track, and log all your goals, from complex engineering projects and business tasks to creative endeavors.

This system works by using three powerful tools:

1. **YAML Properties:** Data tags at the top of each file (like `status: in-progress`).
    
2. **Templater:** Scripts that automate file creation and data input.
    
3. **DataviewJS:** Code blocks that automatically read the YAML data from your files and display it in organized tables and interactive menus.
    

## 1. System Structure and Flow (File Paths)

This system relies on specific file locations for Dataview and Templater to function correctly. **The organization of files is crucial for automation.**

![Image of Project Management System File Structure](https://encrypted-tbn2.gstatic.com/licensed-image?q=tbn:ANd9GcS0AZ9PxTZs6yaHxlwnEGBQa2fg-Gk5iCiLolgxLKkZhQS2AFDZBauWsVCME3datM6DHk6MgjxjKgo31TjcszOJYjwmZbkQRNxoExmZgxk-eqzVmFQ)

Shutterstock

### Core File Structure

All files are nested within key top-level folders: `Dashboards`, `Projects`, `Tasks`, `Templates`, and `Inbox`.

```
Vault/
├── Dashboards/
│   └── Dashboard.md             <-- The main view, reads all other files.
├── Projects/
│   ├── Active/
│   │   └── Project-Example-A/   <-- Project Folder (Sanitized Title)
│   │       ├── Metadata.md      <-- The Project Document (Project Template)
│   │       └── Tasks/           <-- PROJECT-SPECIFIC TASKS ONLY
│   │           ├── Active/
│   │           │   └── Task-Name-1/
│   │           │       └── Metadata.md  <-- The Task Document (Task Template)
│   │           ├── Complete/
│   │           └── Cancel/      <-- Abandoned tasks
│   ├── Completed/
│   │   └── YYYY/                <-- Projects moved here when finalized
├── Tasks/                       <-- GENERAL TASKS ONLY (not tied to a specific project)
│   ├── Active/
│   │   └── General-Task/
│   │       └── Metadata.md      <-- Example General Task (Task Template)
│   ├── Archive/
│   ├── Backlog/
│   └── Completed/
├── Templates/                   <-- ALL TEMPLATE AND JAVASCRIPT FILES
│   ├── project-template.md
│   ├── task-template.md
│   ├── daily-capture-template.md
│   └── js/
│       └── unified_scripts.js   <-- All JavaScript functions
│   └── ... (All other helper templates/prompts)
└── Inbox/
    └── YYYY-MM-DD-HHmm.md       <-- Quick Capture files are created here.
```

### Clarification on Task Folders

There are two distinct types of `Tasks` folders in this system:

1. **Project-Specific Tasks (`Projects/Active/Project-X/Tasks/`):** These are tasks that are direct components of a major project. They are automatically queried and displayed within the parent project's `Metadata.md` file.
    
2. **General Tasks (`Tasks/` at the Vault Root):** This folder is for standalone tasks, routine maintenance, or personal to-dos that do not belong to a specific project. The Dashboard queries this folder, along with the project-specific ones, to create your Master List.
    

### Information Flow

- **Dashboard** is your central view; it reads data from **Projects** and **Tasks**.
    
- **Projects** are the main containers; they automatically pull in all related **Tasks** based on the nested folder structure.
    
- **Daily Capture** is the quick entry point (`Inbox/`); its data is manually processed into the right Project or Task later.
    

## 2. The Main Control Center: Your Dashboard (`Dashboards/Dashboard.md`)

Your **Dashboard.md** file is the main hub for system oversight. It uses DataviewJS to read data from all your other files and displays it in organized tables.

### 🚀 Quick Actions

This section provides three buttons that instantly run the **Templater** prompts, gather information from you, and create a new file in the correct location.

|   |   |   |
|---|---|---|
|**Button**|**File Created**|**Purpose**|
|**➕ New Project**|A new Project file.|Use this for large, multi-step goals, like "Develop Product X" or "Build the Home Lab."|
|**📋 New Task**|A new Task file.|Use this for small, actionable steps that move a project forward, like "Order the main component" or "Draft the initial schematic."|
|**⚡ Quick Capture**|A Daily Capture file.|Use this for quick notes, spontaneous ideas, or parts you need to order _right now_. This data is reviewed and moved later.|

### 🔍 All Active Items (The Master List)

This table automatically finds all files tagged `#project` or `#task` across your vault and lists them in one spot. This is your comprehensive, real-time to-do list.

|   |   |
|---|---|
|**Column**|**What It Shows**|
|**Type**|Identifies the file as a Project or a Task.|
|**Name**|A clickable link to the file.|
|**Status**|The current status (e.g., In Progress, To Do, Waiting).|
|**Priority**|How important the item is (only shows for Projects).|
|**Last Edited**|When the file was last updated, helping you spot forgotten items.|

### ✅ Projects Completed This Year

This table queries your `Projects/Completed/YYYY` folder to show a list of all your finished goals for the current year.

## 3. The Core Document Types

### A. The Project Document (`project-template.md`)

This file is the control center for a large goal, creating a dedicated folder for all related documents and tasks.

#### Key Sections & How to Use Them (Automated)

|   |   |   |
|---|---|---|
|**Section**|**Explanation**|**Optimal Use**|
|**YAML Frontmatter**|The data block at the very top. You manually fill out `title`, `priority`, `target` date, and `contact` here.|**Optimal Use:** Always fill this out _completely_ when creating a new project to enable all Dataview features.|
|**Quick Status Update**|A **DataviewJS** dropdown menu.|**Optimal Use:** Use this dropdown to change the project's status immediately. When you select **✅ Complete**, the script automatically adds today’s date to the `finalized` property.|
|**Budget Tracking**|A table for tracking expenses and a DataviewJS block that automatically calculates spending.|**Optimal Use:** Add every required component to the table using the **➕ Add Part** button. The code totals the cost for items marked **📦 Ordered** or **✅ Received**.|
|**Related Tasks**|A **DataviewJS** block that queries the Project's subfolders (`Tasks/Active`, `Tasks/Complete`, etc.) for files tagged `#task` and lists them here.|**Optimal Use:** This section is fully automated. You never manually list tasks here; the code finds them for you. _Ensure task files have the `#task` tag and are filed in the correct subfolder._|
|**Progress Log**|Contains the **➕ Add Daily Log** button, which runs the `progress-log-entry.md` script.|**Optimal Use:** Use this button daily to record what you did, what problems you encountered (`Blockers`), and what the next specific steps are.|

### In-Depth Guide to Project Sections (Manual/Static)

These sections are filled out manually to provide the narrative and documentation for your project.

#### 1. Project Overview

This is the most critical section for defining your work. It ensures everyone (including your future self) understands _why_ the project exists and _what_ success looks like.

|   |   |   |
|---|---|---|
|**Section**|**Purpose**|**Key Questions to Answer**|
|**Purpose**|**WHY** are you doing this project? Defines the underlying problem or opportunity you are addressing.|What business need does this fulfill? What problem does it solve for the user?|
|**Scope**|**WHAT** is included and, crucially, **WHAT IS NOT** included? Sets boundaries to prevent "scope creep."|What features must be delivered? What specific items are explicitly out of bounds (Out of Scope)?|
|**Success Criteria**|**HOW** will you know the project is done and successful? These should be specific, measurable outcomes.|How is the deliverable measured (e.g., must hit 99.9% uptime, must be under $1,000 budget, must be completed by target date)?|

#### 2. Feature Requests & Ideas

Use this section to capture any ideas, improvements, or non-essential features that come up during the project.

- **How to Use:** Keep this as a simple checklist (`- [ ]`) or a bulleted list. This is your "parking lot" for ideas that you may want to address in a **Phase 2** project. Moving features here ensures you stay focused on the defined **Scope** (Section 1) while not losing creative insights.
    

#### 3. Design Notes

This section is the central repository for technical specifications, creative decisions, and structural blueprints. It is split into sub-sections to keep the technical details organized.

- **Schematic:** Use this for electrical, fluid, or process flow diagrams. Include links to external CAD files or paste small diagrams directly here.
    
- **PCB/Mechanical:** Notes on physical dimensions, component placement, enclosure design, 3D printing parameters, and material choices.
    
- **Software/Firmware:** Outlines the high-level architecture, required libraries, main loop structure, and any integration points (e.g., API endpoints, database schemas).
    

#### 4. Testing & Validation

This section is where you document the formal process of proving the project is complete and meets its **Success Criteria**.

- **How to Use:** Start with a standard checklist (as provided in the template) and customize it with detailed test cases and acceptance criteria.
    
    - _Example:_ Change `- [ ] Functional testing` to `- [ ] Test sensor accuracy to be within +/- 1% of baseline.`
        
- Ensure that every item on this list is checked off before marking the project as **✅ Complete** in the YAML frontmatter.
    

#### 5. References & Links

A crucial section for documentation and future maintenance.

- **How to Use:** Centralize all external information needed to understand or maintain the project.
    
    - _Examples:_ Data sheets for components, source code repositories, links to vendor sites, industry standards documents, or external documentation manuals.
        

#### 6. Project Retrospective

This section is filled out **only after** the project is marked complete. It is a critical learning tool for improving future performance.

- **How to Use:** Once complete, review the entire project and answer these questions:
    
    - **What went well?** (What processes, tools, or decisions should be repeated?)
        
    - **What was challenging?** (What surprised you or caused delays?)
        
    - **What should be changed next time?** (Process improvements for future projects.)
        
    - **Was the final result successful based on the defined Success Criteria?** (A final assessment).
        

### B. The Task Document (`task-template.md`)

This file is for a single, actionable step. It must be linked to a parent project. **If a task is not linked to a specific project, it should be placed in the root `Tasks/` folder.**

|   |   |   |
|---|---|---|
|**Section**|**Explanation**|**Optimal Use**|
|**YAML Frontmatter**|Crucially includes the `project: "[[...]]"` line, which links it back to its parent Project file.|**Optimal Use:** It must have the tag `#task`. This is how the Project's **Related Tasks** section knows to find it.|
|**Quick Status Update**|A **DataviewJS** dropdown (similar to the Project file) to quickly change the task status.|**Optimal Use:** When you finish a task, use this dropdown to change the status to **✅ Complete**, and then physically move the file from the `Active` folder to the `Completed` folder (either within the project or the root `Tasks/` folder).|
|**Task Overview**|The **Description** and **Success Criteria** sections.|**Optimal Use:** Write out exactly what needs to be done and what will determine a successful outcome.|
|**Progress Log**|Same logging button as the Project file.|**Optimal Use:** Use this to track specific, granular work done on this _single_ task.|

### C. The Daily Capture Document (`daily-capture-template.md`)

This file is a quick, disposable notepad for capturing information on the fly.

|   |   |   |
|---|---|---|
|**Section**|**Explanation**|**Optimal Use**|
|**YAML Frontmatter**|Logs the exact `date` and `time` and links it to a `project` (if selected).|**Optimal Use:** Use the **⚡ Quick Capture** button on the Dashboard. Don't worry about formatting; just quickly capture the information.|
|**Notes & Parts**|Simple sections for your text notes and items you need to order.|**Optimal Use:** At the end of the day, review this file. **Move** all relevant information into the correct Project or Task file (or add parts to the budget table), and then **delete** the capture file.|

## 4. The Helper Files (Automating the System)

These files contain the underlying code that makes the system work. You generally do not edit these.

### A. The JavaScript Brain (`unified_scripts.js`)

This file holds essential functions used by your Templater prompts. It is located at `Templates/js/unified_scripts.js`.

|   |   |   |
|---|---|---|
|**Function**|**What It Does**|**Why It’s Important**|
|`selectProject(tp, app)`|Provides a dynamic list of active projects so you can accurately link your new Tasks and Captures.|Ensures all new files are correctly linked, which is crucial for Dataview queries.|
|`collectMultilineInput(tp, promptText)`|Allows you to type multiple lines of text (like a bulleted list for your progress log) into a single pop-up window.|Makes logging progress much faster and cleaner than standard prompts.|
|`verifyTaskSubfolders(app, projectSanitizedTitle)`|Automatically called when a new Project is created. It checks for and creates the necessary folders: `Tasks`, `Tasks/Active`, `Tasks/Complete`, and `Tasks/Cancel`.|**Absolutely essential** for the **Related Tasks** block to function correctly, as it relies on these specific folder paths.|

### B. The Quick Entry Templates

These small files are not used to create new documents, but to _append_ (add) content directly to an existing file.

|                          |                                                                                                                                                           |                                                                             |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| **File Name**            | **Purpose**                                                                                                                                               | **How It's Used**                                                           |
| `progress-log-entry.md`  | Runs the prompts for your daily log (What I Did, Blockers, Next Steps) and inserts the formatted entry into the **Progress Log** section.                 | Run by clicking the **➕ Add Daily Log** button in any Project or Task file. |
| `part-entry-template.md` | Runs the prompts for component details (Cost, Supplier, Tracking) and inserts a new, properly formatted row into the Project's **Budget Tracking** table. | Run by clicking the **➕ Add Part** button in a Project file.                |