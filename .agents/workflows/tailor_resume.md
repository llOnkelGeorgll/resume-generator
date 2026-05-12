---
description: Tailor a resume and generate a cover letter for a specific job posting
---

1. Extract the raw job description, company name, and job title based on the user's input. If a URL is provided, use the `browser_subagent` to browse the posting and extract the text (clicking "See More" if needed). If the user pastes the raw text directly in the chat or points to a local text file, read the job description from the prompt or the referenced file instead. If needed, perform a web search to identify the company's official website URL.
2. Read the file `data/reference_material/old_resume` and the contents in the `data/experiences` directory to gather background data on the user's past work.
3. Identify the Company Name and Job Title from the LinkedIn posting. Format a folder name using `[CompanyName]_[JobTitle]` (e.g., `SnapMagic_CustomerSuccessManager`) and create this directory inside a `data/outputs/` folder.
4. Extract the current system date and time. Distill the raw job description into a distinct checklist of core ATS requirements. Create an `application_metadata.md` file inside the newer `data/outputs/[CompanyName]_[JobTitle]/` directory strictly adhering to the exact ATS Metadata Format:
```markdown
# Application Metadata - [CompanyName]

**Job Role**: [Job Role]
**Company**: [Company]
**Date Compiled**: [Date]

### Links
* **Original Job Posting**: [Text](URL)
* **Company Website**: [URL](URL)
* **Application Status**: Pending V3 Regeneration

# ATS Requirements
- [x] Requirement: [Distilled requirement exactly matching the JSON field mapped later]
(Example: - [x] Requirement: Lead end-to-end SaaS software implementations.)
```
5. Map these tracked ATS requirements explicitly 1-to-1 across the 7 roles present in the `data/reference_material/old_resume`. An ATS requirement should fundamentally fit the chosen role perfectly and should NOT be used multiple times broadly. Ensure the highest diversity of skills is displayed while hitting every extracted requirement perfectly once. Formulate exactly 4 core competencies derived strictly from the extracted job requirements (organized as 4 core topics with 2-3 matching sub-competencies, matching this syntax perfectly: `<b>Core Competency:</b> Sub-comp 1, Sub-comp 2`). Format `competency_1` through `competency_4` as standard V3 nested objects, mapping the explicitly mapped ATS requirements uniquely into their `matched_requirements` array.
6. Generate tailored bullet points for each role pulling *strictly* from the `data/experiences` directory and `data/reference_material/old_resume`. NO FABRICATION ALLOWED! write a section for each job title so that the mapped requirement is fulfilled. the section should talk about the applicant working in that role and perfectly matching the requirements. you should update each job title section to perfectly match the job requirements as mapped in the previous step and only loosely incorporate language and experiences from the old resume if it happens to fit the mapped requirement for that job title. use the experiences to fill in details and make the examples more concrete. Do not make up any skills or experiences.
Identify the precise `source_file` and copy an exact 1-2 sentence `source_quote` directly from the raw original document that justifies the generated claim. ALSO, specifically identify 1-2 exact filenames from the `data/experiences/` directory (`story_*.md`) that are uniquely relevant to the generated bullet and provide a 1-sentence `relevance` mapping for them. No job title paragraph should exceed 60 words.
7. Trigger the `Generate Cover Letter` skill (located in `.agents/skills/generate_cover_letter/SKILL.md`) to draft the cover letter body text.
8. Create a `resume_data.json` file inside the new `data/outputs/[CompanyName]_[JobTitle]/` directory mapping the exactly 12 required fields for the resume (`summary`, `competency_1`-`4`, `sr_product_manager`, `director_tam`, `director_cs`, `cs_manager`, `cs_engineer`, `co_founder`, `software_engineer`) identically using this new strict V3 nested object schema. WARNING: You must use these exact literal keys or the compilation will fail:
```json
"sr_product_manager": {
  "text": "Your generated bullet text.",
  "source_file": "data/reference_material/old_resume",
  "source_quote": "Exact 1-2 sentences copied directly from the original document that proved this.",
  "matched_requirements": ["The ATS Requirement mapped here"],
  "supporting_stories": [
    { "file": "story_2_nre_revenue_stream.md", "relevance": "Context on how I managed C-suite negotiations." }
  ]
}
```
9. Create a `cover_letter_data.json` file inside the same directory mapping the fields for the cover letter (`date`, `company_name`, `job_title`, `cover_letter_body`).
// turbo-all
10. Run `source ~/.zshrc; node build_pdf.js resume_template.html data/outputs/[CompanyName]_[JobTitle]/resume_data.json "data/outputs/[CompanyName]_[JobTitle]/GW_[JobTitle]_Resume.pdf"` to compile the tailored resume. 
11. Run `source ~/.zshrc; node build_pdf.js cover_letter_template.html data/outputs/[CompanyName]_[JobTitle]/cover_letter_data.json "data/outputs/[CompanyName]_[JobTitle]/GW_[JobTitle]_CoverLetter.pdf"` to compile the cover letter.
12. Once finished, use the `run_command` tool with `open "data/outputs/[CompanyName]_[JobTitle]/GW_[JobTitle]_Resume.pdf"` and `open "data/outputs/[CompanyName]_[JobTitle]/GW_[JobTitle]_CoverLetter.pdf"` to show the final results to the user!