# WDS Notion Backend Setup Guide

This document contains the complete database schema specification and setup instructions for configuring Notion as the operational datastore for the WDS Website Hub.

---

## Architecture Overview

```
                      WDS Website & Hub UI
                               │
                               ▼
                      Next.js API Routes
                     (/api/tasks, /api/bugs, ...)
                               │
                               ▼
                   Validation / Service Layer
                               │
                               ▼
                   Central Repository Layer
                   (lib/repositories/*.ts)
                               │
                               ▼
                       Notion API Client
                     (lib/notion/client.ts)
                               │
                               ▼
                   11 Notion Core Databases
```

---

## 1. Required Notion Integration & Token

1. Go to [Notion Integrations](https://www.notion.so/my-integrations).
2. Click **New integration**.
3. Name it `WDS Hub Integration` and select the appropriate workspace.
4. Grant capabilities:
   - **Read content**
   - **Update content**
   - **Insert content**
   - **User Information** (No email address required)
5. Copy the **Internal Integration Secret** (`ntn_...` or `secret_...`) and set it as `NOTION_API_KEY` in your `.env.local`.

---

## 2. The 11 Core Notion Databases

Create 11 databases in your Notion workspace. Share each database with your `WDS Hub Integration` via the `...` menu -> **Add connections**.

### 1. Tasks Database (`NOTION_TASKS_DATABASE_ID`)
- **Task** (`title`): Name/title of the task.
- **Status** (`select` / `status`): `TODO`, `IN_PROGRESS`, `BLOCKED`, `REVIEW`, `COMPLETED`, `CANCELLED`.
- **Priority** (`select`): `HIGH`, `MEDIUM`, `LOW`.
- **Assignee** (`rich_text`): Society member handle or name.
- **Description** (`rich_text`): Task details or acceptance criteria.
- **Due Date** (`date`): Target completion deadline.
- **Tags** (`multi_select`): Labels such as `frontend`, `bug`, `infra`.
- **Blocked By** (`rich_text`): Dependency or blocker explanation.
- **Project** (`relation`): Linked to Projects database.

### 2. Projects Database (`NOTION_PROJECTS_DATABASE_ID`)
- **Name** (`title`): Name of the project or initiative.
- **Slug** (`rich_text`): Unique lowercase URL identifier.
- **Description** (`rich_text`): Scope and objectives.
- **Status** (`select`): `ACTIVE`, `MAINTENANCE`, `COMPLETED`, `PLANNING`.
- **Lead** (`rich_text`): Tech Lead or Project Manager handle.
- **Wing** (`select`): `Technical Wing`, `Design Wing`, `Editorial Wing`, `Core Operations`.
- **URL** (`url`): Live production deployment URL.
- **Repository** (`url`): GitHub repository link.
- **Tech Stack** (`multi_select`): `Next.js`, `TypeScript`, `TailwindCSS`, `PostgreSQL`, etc.

### 3. Candidates Database (`NOTION_CANDIDATES_DATABASE_ID`)
- **Full Name** (`title`): Candidate's full name.
- **Enrollment Number** (`rich_text`): College roll/enrollment number.
- **College Email** (`email`): Official student email.
- **Phone** (`phone`): Contact number.
- **Branch** (`select`): `CSE`, `IT`, `ECE`, `EEE`, `AIDS`, `AIML`, etc.
- **Section** (`rich_text`): Class section.
- **Year** (`select`): `1st Year`, `2nd Year`, `3rd Year`.
- **Preferred Team** (`select`): `Technical Wing`, `Design Wing`, `Editorial Wing`, `Core Operations`.
- **Experience Level** (`select`): `Beginner`, `Intermediate`, `Advanced`.
- **Time Commitment** (`select`): `4-8 hrs`, `8-12 hrs`, `12+ hrs`.
- **Status** (`select`): `RECEIVED`, `SCREENING`, `SHORTLISTED`, `INTERVIEW`, `SELECTED`, `REJECTED`.
- **GitHub URL** (`url`): GitHub profile.
- **LinkedIn URL** (`url`): LinkedIn profile.
- **Portfolio URL** (`url`): Portfolio or personal site.
- **Notes** (`rich_text`): Internal review notes.

### 4. Interviews Database (`NOTION_INTERVIEWS_DATABASE_ID`)
- **Candidate Name** (`title`): Name of candidate interviewed.
- **Interviewer** (`rich_text`): Interviewer's handle or name.
- **Interview Round** (`select`): `ROUND_1_TECHNICAL`, `ROUND_2_HR_CULTURE`, `ROUND_3_FINAL`.
- **Interview Date** (`date`): Date of evaluation.
- **Technical Score** (`number`): Rating from 1 to 10.
- **Communication Score** (`number`): Rating from 1 to 10.
- **Problem Solving Score** (`number`): Rating from 1 to 10.
- **Team Fit Score** (`number`): Rating from 1 to 10.
- **Overall Score** (`number`): Weighted overall score.
- **Strengths** (`rich_text`): Key strengths observed.
- **Weaknesses** (`rich_text`): Areas of improvement.
- **Questions Asked** (`rich_text`): Technical questions posed.
- **Recommendation** (`select`): `STRONG_HIRE`, `HIRE`, `LEAN_HIRE`, `LEAN_REJECT`, `REJECT`.
- **Decision Status** (`select`): `PENDING`, `ACCEPTED`, `REJECTED`, `WAITLISTED`.
- **Candidate** (`relation`): Linked to Candidates database.

### 5. Bugs Database (`NOTION_BUGS_DATABASE_ID`)
- **Title** (`title`): Bug summary.
- **Severity** (`select`): `CRITICAL`, `HIGH`, `MEDIUM`, `LOW`.
- **Priority** (`select`): `P0`, `P1`, `P2`, `P3`.
- **Status** (`select`): `OPEN`, `TRIAGED`, `IN_PROGRESS`, `RESOLVED`, `DUPLICATE`, `INVALID`.
- **Reporter** (`rich_text`): Reporter handle.
- **URL** (`url`): Affected URL.
- **Description** (`rich_text`): Detailed bug description.
- **Assignee** (`rich_text`): Assigned developer.
- **Source** (`select`): `MANUAL`, `BUG_HUNT_WEBHOOK`.
- **Project** (`relation`): Linked to Projects database.

### 6. Events Database (`NOTION_EVENTS_DATABASE_ID`)
- **Name** (`title`): Event title.
- **Description** (`rich_text`): Event description.
- **Status** (`select`): `IDEA`, `PLANNING`, `ANNOUNCED`, `REGISTRATION`, `LIVE`, `COMPLETED`, `ARCHIVED`.
- **Date** (`date`): Event schedule.
- **Venue** (`rich_text`): Location or room number.
- **Lead** (`rich_text`): Event coordinator handle.
- **Registration URL** (`url`): Sign-up form link.
- **Expected Attendance** (`number`): Estimated headcount.

### 7. Content Database (`NOTION_CONTENT_DATABASE_ID`)
- **Title** (`title`): Post title or campaign headline.
- **Platform** (`select`): `INSTAGRAM`, `LINKEDIN`, `NEWSLETTER`, `WEBSITE_BLOG`.
- **Type** (`select`): `POST`, `CAROUSEL`, `REEL`, `ARTICLE`, `ANNOUNCEMENT`.
- **Status** (`select`): `IDEA`, `DRAFT`, `REVIEW`, `APPROVED`, `SCHEDULED`, `PUBLISHED`, `ARCHIVED`.
- **Author** (`rich_text`): Content creator handle.
- **Publish Date** (`date`): Planned publishing date.
- **URL** (`url`): Link to live post or draft asset.
- **Caption** (`rich_text`): Post copy and hashtags.

### 8. Assets Database (`NOTION_ASSETS_DATABASE_ID`)
- **Name** (`title`): Asset label.
- **Category** (`select`): `LOGOS`, `POSTERS`, `BRAND`, `DOCUMENTS`, `TEMPLATES`.
- **Type** (`select`): `PNG`, `SVG`, `PDF`, `FIGMA`, `MD`, `OTHER`.
- **URL** (`url`): Asset link (Figma, Cloudinary, Drive).
- **Owner** (`rich_text`): Designer or creator.
- **Version** (`rich_text`): Version tag (e.g. `2.0`).

### 9. Faculty Database (`NOTION_FACULTY_DATABASE_ID`)
- **Name** (`title`): Professor or faculty name.
- **Department** (`select`): `CSE`, `IT`, `ECE`, `EEE`, etc.
- **Designation** (`rich_text`): Academic title.
- **Email** (`email`): Faculty email address.
- **Phone** (`phone`): Contact number (optional).
- **Office** (`rich_text`): Room / cabin location.
- **Role** (`select`): `FACULTY_ADVISOR`, `MENTOR`, `HOD`, `COORDINATOR`.

### 10. Resources Database (`NOTION_RESOURCES_DATABASE_ID`)
- **Name** (`title`): Resource name.
- **Type** (`select`): `DOCUMENTATION`, `API_KEY`, `DESIGN_SYSTEM`, `INFRASTRUCTURE`, `EXTERNAL_TOOL`, `GUIDELINE`.
- **URL** (`url`): Documentation or portal link.
- **Description** (`rich_text`): Instructions on how to use.
- **Owner** (`rich_text`): Responsible member handle.

### 11. College Information Database (`NOTION_COLLEGE_INFO_DATABASE_ID`)
- **Name** (`title`): Fact or guideline key (e.g. `Affiliated University`).
- **Category** (`select`): `ACADEMICS`, `ADMINISTRATION`, `FACILITIES`, `SOCIETY_POLICY`, `AFFILIATION`, `GENERAL`.
- **Value** (`rich_text`): Operational value.
- **Source** (`rich_text`): Verification reference.

---

## 3. Environment Variables Configuration

Copy `.env.example` to `.env.local` and populate all Notion IDs:

```env
NOTION_API_KEY=ntn_your_secret_api_key_here

NOTION_TASKS_DATABASE_ID=your_tasks_database_id
NOTION_PROJECTS_DATABASE_ID=your_projects_database_id
NOTION_CANDIDATES_DATABASE_ID=your_candidates_database_id
NOTION_INTERVIEWS_DATABASE_ID=your_interviews_database_id
NOTION_BUGS_DATABASE_ID=your_bugs_database_id
NOTION_EVENTS_DATABASE_ID=your_events_database_id
NOTION_CONTENT_DATABASE_ID=your_content_database_id
NOTION_ASSETS_DATABASE_ID=your_assets_database_id
NOTION_FACULTY_DATABASE_ID=your_faculty_database_id
NOTION_RESOURCES_DATABASE_ID=your_resources_database_id
NOTION_COLLEGE_INFO_DATABASE_ID=your_college_info_database_id
```

---

## 4. Diagnostics & Verification

The system includes automated endpoints to verify your Notion setup:

- `GET /api/notion/health`: Validates token authorization with Notion API.
- `GET /api/notion/schema`: Verifies all 11 databases have the required properties without missing fields.
