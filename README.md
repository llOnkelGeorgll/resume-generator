# Resume Generator (Antigravity)

This project provides an automated, AI-driven workflow to tailor your resume and cover letter for specific job postings. It takes a base resume and stories about your past work experiences, cross-references them against a job description, and outputs a highly tailored PDF resume and cover letter. It also includes an interactive web viewer for inspecting the generated materials.

## Prerequisites

- **Node.js**: Make sure you have Node.js installed.
- **Antigravity**: This project heavily utilizes Antigravity for running the AI agents and workflows. You must be using the Antigravity assistant.

## Installation & Auto-Setup

This repository is optimized for AI assistants (like Antigravity). You don't need to manually install dependencies or start the server if you are using the AI!

1. Clone or download this repository.
2. Open the project folder in your AI coding assistant.
3. Simply tell the AI: **"Set up the project"** or **"Start the server"**. The AI will automatically read the `.gemini.md` instructions, install any missing dependencies (`npm install`), troubleshoot errors, and boot up the interactive viewer for you.
4. **CRITICAL FIRST STEP**: Once the AI is ready, type `/initialize` in the chat. The AI will ask for your personal contact info and your current resume. It will then act as a developer to completely rewrite the codebase's templates and logic to perfectly mold to your unique career history!

## Directory Structure & User Data

To keep your personal data secure and separate from the application logic, all user-specific information should be placed in the `data/` directory. **This folder is ignored by Git, so your private details will not be uploaded.**

Please populate the following directories:

- `data/reference_material/old_resume`: A plain text markdown file of your current base resume. (The `/initialize` workflow will help you set this up).
- `data/experiences/`: Create markdown files (e.g., `story_1_project.md`) detailing specific situations, projects, or accomplishments. The AI will pull from these to generate tailored bullet points. **(Tip: Type `/add_story` in the chat to have the AI help you write and format these stories!)**

*Note: The generated tailored resumes and cover letters will automatically be saved to `data/outputs/`.*

## Usage Guide

To tailor a resume for a job, you can use the Antigravity workflows provided in the `.agents/workflows` folder.

1. **Invoke the Workflow**: In the Antigravity chat, type `/tailor_resume`.
2. **Provide the Job Posting**: Paste the LinkedIn URL or the raw job description when prompted.
3. The AI agent will:
   - Extract the ATS requirements from the job description.
   - Map your `data/experiences/` and `old_resume` to those requirements.
   - Generate `resume_data.json` and `cover_letter_data.json` inside a specific folder in `data/outputs/`.
   - Compile beautiful PDFs using Puppeteer.

## Interactive Viewer

If you want to view the tailored resume JSON data visually in the browser before generating a PDF (or to debug the ATS matches), you can start the interactive viewer:

```bash
cd interactive_view
npm install # if it has its own dependencies
node server.js
```

Then navigate to `http://localhost:3000` in your web browser.
