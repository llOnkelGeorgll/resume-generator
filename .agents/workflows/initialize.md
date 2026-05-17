---
description: Run this immediately after cloning the repository to set up the system with your personal job history.
---

1. Act as a setup wizard. Greet the user and ask them to provide:
   - Their Name, Phone, Location, Email, and LinkedIn URL.
   - Their baseline/current Resume text (they can paste it, or upload it).
   - *Wait for the user to provide this information before proceeding to step 2.*
2. Once the data is provided, save the user's raw baseline resume text into `data/reference_material/old_resume`.
3. Analyze the user's baseline resume and extract a chronological list of their professional job titles, companies, and dates. 
4. **Rewrite the HTML Templates**:
   - Use the `replace_file_content` or `multi_replace_file_content` tool to rewrite `resume_template.html` and `cover_letter_template.html`.
   - Replace the generic placeholders (`[USER_NAME]`, `[USER_PHONE]`, etc.) in the header with the user's real contact information.
   - In `resume_template.html`, replace the generic `[JOB_TITLE_1]` experience blocks. Instead, generate a new `<div class="experience-item">` block for *every single job* you extracted from the user's resume.
   - For the handlebars variables inside these new HTML blocks, invent a unique key for each job (e.g., `{{vp_engineering}}`, `{{director_sales}}`, `{{software_engineer}}`). **Make a note of these exact keys.**
   - In `resume_template.html`, replace the generic `[DEGREE_NAME]` education block with the user's actual education history extracted from their resume.
5. **Rewrite the Interactive Viewer**:
   - Use the `replace_file_content` tool to rewrite `interactive_view/public/app.js`.
   - Locate the `const experienceMap = [...]` array (around line 18).
   - Replace it entirely with a new array that perfectly matches the jobs you just wrote into the HTML template. Ensure the `key` property matches the handlebars keys (e.g., `vp_engineering`) you just invented.
6. **Rewrite the Tailor Resume Agent Workflow**:
   - Use the `replace_file_content` tool to rewrite `.agents/workflows/tailor_resume.md`.
   - Locate step 8 where it defines the required JSON fields (`job_1`, `job_2`).
   - Replace the generic keys with the *exact* handlebars keys you just invented for the user, so that the tailor agent knows exactly which keys to generate in the future.
   - Also, replace `[USER_INITIALS]` in steps 10-12 with the actual initials of the user.
7. Once you have successfully executed all these rewrites, inform the user that the system is now perfectly hardcoded and optimized for their career history.
8. Tell them their next step is to populate the `data/experiences/` folder with markdown files containing deep-dive stories about their past projects, and then they can run `/tailor_resume` on any job description!
