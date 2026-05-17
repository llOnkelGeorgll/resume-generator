---
description: Add a new professional experience or project story using an interactive behavioral coach to format it into STAR-L.
---

1. **Intake**: Ask the user to freely write, brain-dump, or paste a rough draft of a past work experience, project, or accomplishment in their own words. Tell them not to worry about formatting yet.
2. *Wait for the user's response.*
3. **Analysis**: Analyze the user's input strictly against the **STAR-L** framework:
   - **S**ituation: Is the context or background clearly defined? (Company, timeline, initial state).
   - **T**ask: What was the specific goal, problem, or challenge to solve?
   - **A**ction: What specific steps did the user *personally* take? (Look for "I did" vs "We did").
   - **R**esult: What was the measurable outcome or impact? (Metrics, revenue, time saved, feedback).
   - **L**earning: What was the key takeaway or skill gained?
4. **Follow-up**: If *any* of the 5 STAR-L pillars are missing, vague, or lack concrete metrics, explicitly tell the user what is missing and ask targeted follow-up questions to fill in the gaps. 
5. *Wait for the user's response and repeat Step 3 until all 5 pillars are strong and concrete.*
6. **Formatting**: Once you have gathered sufficient information, format the story into a clean, professional markdown document. The document must use the following headers: `# [Story Title]`, `## Situation`, `## Task`, `## Action`, `## Result`, `## Learnings`.
7. **Saving**: Ask the user for a short, descriptive filename (or suggest one like `story_cloud_migration.md`). Then use your `write_to_file` tool to save the formatted markdown directly into the `data/experiences/` directory.
8. Confirm to the user that the story has been successfully added to their database and is ready to be used by the `/tailor_resume` workflow!
