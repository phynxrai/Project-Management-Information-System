# 📚 Project Management Information System Guide

> [!important] Getting Started: Initial Setup (MANDATORY)
> 
> The entire project structure is contained within the folder (`Project-Management-Information-System.zip`). To start using this system:
> 
> **Step 1: Unzip and Open Vault**
> 
> 1. **Download** the folder (`Project-Management-Information-System`).
>     
> 2. **Open Obsidian**.
>     
> 3. On the welcome screen, select **"Open folder as vault"**.
>     
> 4. Navigate to and select the downloaded `Project-Management-Information-System` folder.
>     
> 5. Delete all placeholder.md files
> 
> **Step 2: Install Essential Plugins** For all dynamic features (tables, buttons, automation) to work, you must install and enable the following community plugins (via **Settings** > **Community Plugins**):
> 
> - **Dataview** (For dynamic tables and status displays)
>     
> - **Templater** (For all automation and quick actions)
>     
> 
> **Step 3: Configure Dataview** You must enable JavaScript support for the interactive buttons and dynamic tables to load:
> 
> 1. Go to **Settings** > **Dataview**.
>     
> 2. Scroll down and ensure **"Enable JavaScript queries"** is turned **ON**.
>     
> 
> **Step 4: Configure Templater** You must point Templater to the user script location so it can run the automation logic:
> 
> 1. Go to **Settings** > **Templater**.
>     
> 2. Set **Template folder location** to: `Templates`
>     
> 3. Set **User script folder** to: `Templates/js`
>     

Welcome to your comprehensive project management system! This system is designed to help you organize, track, and log all your goals, from complex engineering projects and business tasks to creative endeavors.

This system works by using three powerful tools:

1. **YAML Properties:** Data tags at the top of each file (like `status: in-progress`).
    
2. **Templater:** Scripts that automate file creation and data input.
    
3. **DataviewJS:** Code blocks that automatically read the YAML data from your files and display it in organized tables and interactive menus.

Welcome to your comprehensive project management system! This system is designed to help you organize, track, and log all your goals, from complex engineering projects and business tasks to creative endeavors.

This system works by using three powerful tools:

1. **YAML Properties:** Data tags at the top of each file (like `status: in-progress`).
    
2. **Templater:** Scripts that automate file creation and data input.
    
3. **DataviewJS:** Code blocks that automatically read the YAML data from your files and display it in organized tables and interactive menus.
    

## 1. System Structure and Flow (File Paths)

This system relies on specific file locations for Dataview and Templater to function correctly. **The organization of files is crucial for automation.**

![Image of Project Management System File Structure](https://encrypted-tbn2.gstatic.com/licensed-image?q=tbn:ANd9GcQ0tdzNqZWVA0ELxm2HZCSPZ6_sXU4l7OkxXxMwE3sdspe-Wk5EiVVaX2wmyFyRf5rzQzgfwAFFgCE6aNcFIvQ0pDMe4Ny2XSxeeop2clGR7SOk_uU)

Shutterstock

### Core File Structure

All files are nested within key top-level folders: `Dashboards`, `Projects`, `Tasks`, `Templates`, and `Inbox`.

```
Vault/
├── Dashboards/
│   └── Dashboard.md             <-- The main view, reads all other files.
├── Projects/
│   ├── Active/                  <-- Projects currently being worked on
│   │   └── Project-Example-A/   
│   │       ├── Metadata.md      
│   │       └── Tasks/           
│   │           ├── Active/      <-- Project tasks that are active
│   │               └── Project-Task/
│   │                   └── Metadata.md
│   │           ├── Archive/     <-- Project tasks that are cancelled/failed
│   │           ├── Backlog/     <-- Project tasks that are planned or stagnant
│   │           └── Completed/   <-- Project tasks that are finished
│   ├── Archive/                 <-- Projects that are cancelled/failed
│   ├── Backlog/                 <-- Projects that are planned or stagnant
│   └── Completed/               <-- Projects that are finished
├── Tasks/                       <-- GENERAL TASKS ONLY 
│   ├── Active/                  <-- General tasks that are active
│   │   └── General-Task/
│   │       └── Metadata.md      
│   ├── Archive/                 <-- General tasks that are cancelled/failed
│   ├── Backlog/                 <-- General tasks that are planned or stagnant
│   └── Completed/               <-- General tasks that are finished
├── Templates/                   
│   ├── project-template.md
│   ├── task-template.md
│   ├── daily-capture-template.md
│   └── js/
│       └── unified_scripts.js   
│   └── ... (All other helper templates/prompts)
└── Inbox/
    └── YYYY-MM-DD-HHmm.md       
```

### Clarification on Project Status Folders

The `Projects/` folder uses multiple sub-folders to accurately track the lifecycle of your major goals:

|   |   |   |
|---|---|---|
|**Folder**|**Status**|**Purpose and Use**|
|`Projects/Active/`|**In-Progress**|Contains projects that are currently underway and consuming resources. Files are created here by the `➕ New Project` prompt.|
|`Projects/Completed/`|**Success**|For projects that have successfully met their **Success Criteria**. Files are moved here once finalized.|
|`Projects/Backlog/`|**Planned/Paused**|For projects that have been defined and approved but are waiting for resources, or for projects that were **started but are currently stagnant** (on hold, blocked, or paused indefinitely). Move these projects here to keep your active list focused.|
|`Projects/Archive/`|**Canceled/Failed**|For projects that were stopped mid-way, failed to meet criteria, or have been placed on an indefinite hold. Use this to maintain a history without cluttering the main lists.|

### Clarification on Task Folders

There are two distinct types of `Tasks` folders in this system:

1. **Project-Specific Tasks (`Projects/Active/Project-X/Tasks/`):** These are tasks that are direct components of a major project. **These sub-folders now mirror the Project lifecycle to give you granular control over task status.**
    
    - `Tasks/Active/`
        
    - `Tasks/Completed/`
        
    - `Tasks/Archive/`
        
    - `Tasks/Backlog/`
        
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

|   |   |
|---|---|
|**Column**|**What It Shows**|
|**Project**|A clickable link to the project file.|
|**Finalized Date**|The date the project was marked as complete.|

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
|**Related Tasks**|A **DataviewJS** block that queries the Project's subfolders (`Tasks/Active`, `Tasks/Completed`, etc.) for files tagged `#task` and lists them here.|**Optimal Use:** This section is fully automated. You never manually list tasks here; the code finds them for you. _Ensure task files have the `#task` tag and are filed in the correct subfolder._|
|**Progress Log**|Contains the **➕ Add Daily Log** button, which runs the `progress-log-entry.md` script.|**Optimal Use:** Use this button daily to record what you did, what problems you encountered (`Blockers`), and what the next specific steps are.|

### In-Depth Guide to Project Sections (Manual/Static)

These sections are filled out manually to provide the narrative and documentation for your project.

|   |   |   |
|---|---|---|
|**Section**|**Purpose**|**Key Questions to Answer**|
|**Purpose**|**WHY** are you doing this project? Defines the underlying problem or opportunity you are addressing.|What business need does this fulfill? What problem does it solve for the user?|
|**Scope**|**WHAT** is included and, crucially, **WHAT IS NOT** included? Sets boundaries to prevent "scope creep."|What features must be delivered? What specific items are explicitly out of bounds (Out of Scope)?|
|**Success Criteria**|**HOW** will you know the project is done and successful? These should be specific, measurable outcomes.|How is the deliverable measured (e.g., must hit 99.9% uptime, must be under $1,000 budget, must be completed by target date)?|
|**Feature Requests & Ideas**|Captures ideas for future iterations without derailing the current scope.|Use this section as a "parking lot" for non-essential features or improvements for a **Phase 2** project.|
|**Design Notes**|Central repository for technical specs, organized by Schematic, PCB/Mechanical, and Software/Firmware.|Document the high-level architecture, physical constraints, and required libraries.|
|**Testing & Validation**|Documents the formal process of proving the project meets its criteria.|Customize the checklist with detailed test cases and acceptance criteria.|
|**References & Links**|Centralizes all external information needed for maintenance or understanding.|Include datasheets, source code repositories, and documentation manuals.|
|**Project Retrospective**|Filled out **after** completion to improve future performance.|What went well? What was challenging? What should be changed next time?|

### B. The Task Document (`task-template.md`)

This file is for a single, actionable step. It must be linked to a parent project. **If a task is not linked to a specific project, it should be placed in the root `Tasks/` folder.**

#### Key Sections & How to Use Them (Automated)

|   |   |   |
|---|---|---|
|**Section**|**Explanation**|**Optimal Use**|
|**YAML Frontmatter**|Must contain the `#task` tag and the `project: "[[...]]"` line linking it to its parent Project file (or "General").|**Optimal Use:** This data is essential for the Project's **Related Tasks** table to function correctly.|
|**Quick Status Update**|A **DataviewJS** dropdown (similar to the Project file) to quickly change the task status.|**Optimal Use:** Use this to update status. When complete, you must manually move the file to the corresponding `Completed`, `Archive`, or `Backlog` folder.|
|**Task Overview**|The **Description** and **Success Criteria** sections.|**Optimal Use:** Write out exactly what needs to be done and what will determine a successful outcome for this single step.|
|**Progress Log**|Same logging button as the Project file.|**Optimal Use:** Use this to track specific, granular work done on this _single_ task, especially if it takes several days.|

### C. The Daily Capture Document (`daily-capture-template.md`)

This file is a quick, disposable notepad for capturing information on the fly.

|   |   |   |
|---|---|---|
|**Section**|**Explanation**|**Optimal Use**|
|**YAML Frontmatter**|Logs the exact `date` and `time` and links it to a `project` (if selected).|**Optimal Use:** Use the **⚡ Quick Capture** button on the Dashboard. Don't worry about formatting; just quickly capture the information.|
|**Notes & Parts**|Simple sections for your text notes and items you need to order.|**Optimal Use:** At the end of the day, review this file. **Move** all relevant information into the correct Project or Task file (or add parts to the budget table), and then **delete** the capture file.|

## 4. Prompt Reference Guide (Templater Automation)

This section details all the interactive prompts you will encounter when creating new documents or logging progress.

### 📝 Core Input Utility: Multi-Line Inputs

Many prompts utilizes a custom function (`collectMultilineInput`) that allows you to input bulleted lists or multi-paragraph text using standard prompt windows.

|   |   |   |
|---|---|---|
|**Prompt Type**|**Input Method**|**Behavior**|
|**Multi-Line**|Repeated prompts|After the first line, pressing **ENTER** on a blank prompt will typically end the sequence. This is used for descriptions, logs, and criteria.|
|**Suggester**|Dropdown Menu|You select an option from a predefined list (e.g., status or priority).|
|**Single Line**|Standard Prompt|Used for short data like Titles, Dates, and Cost.|

### A. New Project Prompts (`➕ New Project` button)

|   |   |   |   |
|---|---|---|---|
|**Prompt Title**|**Type**|**Purpose**|**Multi-Line?**|
|**Project Title**|Single Line|The main name of the project. **Must be unique.**|No|
|**Priority**|Suggester|Select High, Medium, or Low importance.|No|
|**Target Date**|Single Line|Optional due date (Format: YYYY-MM-DD).|No|
|**Contact**|Single Line|Optional person or group responsible.|No|
|**Budget**|Single Line|The total budget limit (numbers only, no $).|No|
|**Expense Type**|Suggester|Select if the cost is **Expensed** (P&L) or **Capital** (Asset).|No|
|**Purpose**|Multi-Line|**WHY** the project is being done.|**Yes**|
|**Scope**|Multi-Line|**WHAT** is included and excluded from the final deliverable.|**Yes**|
|**Success Criteria**|Multi-Line|**HOW** success will be measured (e.g., measurable objectives).|**Yes**|

### B. New Task Prompts (`📋 New Task` button)

|   |   |   |   |
|---|---|---|---|
|**Prompt Title**|**Type**|**Purpose**|**Multi-Line?**|
|**Project Title**|Suggester|**MANDATORY:** Select the parent project this task belongs to, or select **General**.|No|
|**Task Title**|Single Line|The specific name of the step. **Must be unique.**|No|
|**Contact**|Single Line|Optional assignee or resource person.|No|
|**Target Date**|Single Line|Optional due date (Format: YYYY-MM-DD).|No|
|**Current Status**|Suggester|Initial status (To Do, In Progress, etc.).|No|
|**Description**|Multi-Line|**WHAT** needs to be accomplished in this task.|**Yes**|
|**Success Criteria**|Multi-Line|**HOW** to verify this specific task is complete.|**Yes**|

### C. Quick Entry Prompts

|   |   |   |   |   |
|---|---|---|---|---|
|**Button/Template**|**Prompt Title**|**Type**|**Purpose**|**Multi-Line?**|
|**⚡ Quick Capture**|**Project Title**|Suggester|The project this quick note is related to (or General).|No|
||**Contact**|Single Line|Optional contact to link.|No|
||**Notes**|Multi-Line|General thoughts, ideas, or to-dos.|**Yes**|
||**Parts**|Multi-Line|Components or items to be ordered.|**Yes**|
|**➕ Add Daily Log**|**What I did today**|Multi-Line|Your activity log for the current day.|**Yes**|
||**Blockers/Issues**|Multi-Line|Any problems, delays, or challenges encountered.|**Yes**|
||**Next Steps**|Multi-Line|The next 1-3 specific actions to take.|**Yes**|
|**➕ Add Part**|**Part Name/Component**|Single Line|The name of the item.|No|
||**Unit Cost**|Single Line|Price per unit (numbers only, no $).|No|
||**Status**|Suggester|**Need**, **Ordered**, or **Received**.|No|
||**Link/Source URL**|Single Line|URL for ordering or documentation.|No|
||_(+ 5 other single-line prompts for tracking info)_|Single Line|Qty, Supplier, Date, Tracking, Notes.|No|

## 5. The Helper Files (Automating the System)

These files contain the underlying code that makes the system work. You generally do not edit these.

### A. The JavaScript Brain (`unified_scripts.js`)

This file holds essential functions used by your Templater prompts. It is located at `Templates/js/unified_scripts.js`.

|   |   |   |
|---|---|---|
|**Function**|**What It Does**|**Why It’s Important**|
|`selectProject(tp, app)`|Provides a dynamic list of active projects so you can accurately link your new Tasks and Captures.|Ensures all new files are correctly linked, which is crucial for Dataview queries.|
|`collectMultilineInput(tp, promptText)`|Allows you to type multiple lines of text (like a bulleted list for your progress log) into a single pop-up window.|Makes logging progress much faster and cleaner than standard prompts.|
|`verifyTaskSubfolders(app, projectSanitizedTitle)`|Automatically called when a new Project is created. It checks for and creates the necessary folders: `Tasks`, `Tasks/Active`, `Tasks/Completed`, `Tasks/Archive`, and `Tasks/Backlog`.|**Absolutely essential** for the **Related Tasks** block to function correctly, as it relies on these specific folder paths.|

### B. The Quick Entry Templates

These small files are not used to create new documents, but to _append_ (add) content directly to an existing file.

|   |   |   |
|---|---|---|
|**File Name**|**Purpose**|**How It's Used**|
|`progress-log-entry.md`|Runs the prompts for your daily log (What I Did, Blockers, Next Steps) and inserts the formatted entry into the **Progress Log** section.|Run by clicking the **➕ Add Daily Log** button in any Project or Task file.|
|`part-entry-template.md`|Runs the prompts for component details (Cost, Supplier, Tracking) and inserts a new, properly formatted row into the Project's **Budget Tracking** table.|Run by clicking the **➕ Add Part** button in a Project file.|