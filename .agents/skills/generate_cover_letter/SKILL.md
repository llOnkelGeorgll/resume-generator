---
name: Generate Cover Letter
description: Draft a highly tailored, evidence-based cover letter matching Georg Weber's technical generalist profile.
---
# Generate Cover Letter

Use this skill whenever you need to draft a cover letter for a job application for Georg Weber. 

**Role**: Act as an elite Executive Career Coach and Recruiter.
**Objective**: Generate a one-page, high-impact cover letter for Georg Weber for the target position.

## 1. Input Data Reference
* **Resume**: You MUST use the specific `data/outputs/[CompanyName]_[JobTitle]/resume_data.json` generated for the current job application. Do NOT use old, irrelevant JSON files from other folders.
* **Experience Metrics**: You MUST read and incorporate data from the `data/experiences` directory. Use these files to extract real, precise values and track records. Do not make up even the slightest fact or metric.
* **Job Posting**: Use the provided LinkedIn text to identify key "must-have" skills and cultural values.
* **Candidate Profile**: Georg is a revenue-driven leader with deep technical curiosity and a low-ego, high-trust approach. He excels in both seed-stage startups and enterprise B2B environments.

## 2. Core Constraints
* **Zero Fabrication**: Do not invent metrics, projects, or degrees. Use only the data found in the resume.
* **Tone**: Professional, strategic, and technically grounded. Avoid "flowery" AI-clichés; focus on impact and problem-solving.
* **The "Checklist" Match**: Map Georg’s experience in CS operating models, strategic renewals, and engineering partnerships directly to the requirements in the job description.

## 3. Content Structure
* **The Hook**: Start with a strong statement about Georg’s ability to bridge the gap between technical engineering and customer-facing revenue growth.
* **The "Why You"**: Highlight his transition from a Software Engineer to a Director of Customer Success, proving he can "speak" both engineering and business fluently as a fast-learning master generalist.
* **Evidence-Based Value**: Reference his specific experience in designing CS models from scratch and managing complex integrations for elite clients.
* **Closing**: Reiterate his interest in the company's specific mission and provide a clear call to action. You MUST end the cover letter with a professional sign-off (e.g., `<p>Best regards,</p><p>Georg Weber</p>`).

*After generating the text based on these rules*, save the output directly into a specific `data/outputs/[CompanyName]_[JobTitle]/cover_letter_data.json` file containing the keys: `date`, `company_name`, `job_title`, and `cover_letter_body`.
