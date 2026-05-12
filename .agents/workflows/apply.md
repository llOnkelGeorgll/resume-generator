---
description: Automatically apply to a curated job listing using the generated resume and cover letter.
---

1. Read the `application_metadata.md` file inside the target `data/outputs/[TargetFolder]` you are given to extract the original LinkedIn Job Posting URL.
2. Read the `resume_data.json` to familiarize yourself with the user's basic background context (helpful if the application form asks simple text questions). Use the following primary contact details for form filling: Georg Weber, georgweber88@gmail.com, +1 (650) 223-3053.
3. Extract `[JobTitle]` from the `[TargetFolder]` name (e.g., if folder is `SnorkelAI_ProductManager`, the JobTitle is `ProductManager`). Formulate the absolute system file paths for both `"data/outputs/[TargetFolder]/GW_[JobTitle]_Resume.pdf"` and `"data/outputs/[TargetFolder]/GW_[JobTitle]_CoverLetter.pdf"`.
4. Trigger the `browser_subagent` using the `default_api:browser_subagent` tool. Provide the subagent with the following precise, highly detailed Task prompt:
   - "Navigate to this specific LinkedIn Job Posting URL: [Inject URL here]."
   - "Locate and click the 'Apply' or 'Easy Apply' button to begin the application flow."
   - "Navigate chronologically through the application modal, autonomously filling in standard text fields (email, phone, name, simple questions) using your context."
   - "CRITICAL RULE: When you encounter the Resume upload input, use your DOM manipulation tools to input this absolute path: [Inject absolute Resume PDF path here]."
   - "CRITICAL RULE: When you encounter the Cover Letter upload input, use your DOM manipulation tools to input this absolute path: [Inject absolute Cover Letter PDF path here]."
   - "Iterate through any remaining required fields. Once the final review screen is reached and everything is filled, click 'Submit Application'."
5. Once the `browser_subagent` returns successfully, use the `run_command` tool to append `* **Application Status**: Submitted successfully via Agent on [Current Date]` to the `application_metadata.md` log.
6. Provide a final summary to the user!