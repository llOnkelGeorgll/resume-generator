document.addEventListener('DOMContentLoaded', () => {
    fetchJobs();

    const jobList = document.getElementById('job-list');
    const requirementsPills = document.getElementById('requirements-pills');
    const resumeSummary = document.getElementById('resume-summary');
    const resumeCompetencies = document.getElementById('resume-competencies');
    const resumeExperience = document.getElementById('resume-experience');
    
    // Assistant Elements
    const assistantTabs = document.getElementById('assistant-tabs');
    const sourceTabBtn = document.querySelector('[data-target="source-tab"]');
    const storiesTabBtn = document.querySelector('[data-target="stories-tab"]');
    const sourceTabContent = document.getElementById('source-tab');
    const storiesTabContent = document.getElementById('stories-tab');

    // Structural definitions mapping JSON keys to UI labels (mirroring PDF structure)
    const experienceMap = [
        { key: 'sr_product_manager', title: 'Sr. Product Manager', company: 'ASSURANT INC. | Redwood City, CA', dates: '2025 - Present' },
        { group: 'OPTOFIDELITY INC. | Cupertino, CA', items: [
            { key: 'director_tam', title: 'Director, Technical Account Management', dates: '2023 - 2025' },
            { key: 'director_cs', title: 'Director, Customer Success', dates: '2021 - 2023' },
            { key: 'cs_manager', title: 'Customer Success Manager', dates: '2019 - 2021' },
            { key: 'cs_engineer', title: 'Customer Success Engineer', dates: '2017 - 2019' }
        ]},
        { key: 'co_founder', title: 'Co-Founder & Technical Lead', company: 'BIRTHDAY BOX INC.', dates: '2014 - 2016' },
        { key: 'software_engineer', title: 'Software Engineer', company: 'ROBERT BOSCH LLC', dates: '2014 - 2017' },
    ];

    let currentJobReqs = [];
    let currentResumeData = null;
    let activeClickElement = null;

    // Tab Switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
            
            const target = e.target.dataset.target;
            e.target.classList.add('active');
            document.getElementById(target).classList.add('active');
        });
    });

    async function fetchJobs() {
        try {
            const res = await fetch('/api/jobs');
            const jobs = await res.json();
            jobList.innerHTML = '';
            jobs.forEach(job => {
                const li = document.createElement('li');
                li.innerText = job.replace(/_/g, ' ');
                li.onclick = () => loadJob(job, li);
                jobList.appendChild(li);
            });
        } catch (e) {
            console.error('Error fetching jobs:', e);
        }
    }

    async function loadJob(jobName, liElement) {
        document.querySelectorAll('#job-list li').forEach(el => el.classList.remove('active'));
        liElement.classList.add('active');
        resetAssistant();

        try {
            const res = await fetch(`/api/job/${jobName}`);
            const data = await res.json();
            
            if (!data.resumeData) {
                alert("This job folder does not yet contain the new v2 resume_data.json object schema.");
                return;
            }

            currentResumeData = data.resumeData;
            parseATSRequirements(data.applicationMetadata);
            renderResume(currentResumeData);
            setTimeout(scaleResume, 10);
        } catch (e) {
            console.error(e);
        }
    }

    function parseATSRequirements(mdContent) {
        requirementsPills.innerHTML = '';
        currentJobReqs = [];
        
        if (!mdContent) return;

        const reqRegex = /- \[x?\] Requirement:\s*(.+)/gi;
        let match;
        while ((match = reqRegex.exec(mdContent)) !== null) {
            currentJobReqs.push(match[1].trim());
        }

        currentJobReqs.forEach(req => {
            const pill = document.createElement('div');
            pill.className = 'req-pill';
            pill.innerText = req;
            pill.dataset.req = req;
            
            pill.addEventListener('mouseenter', () => highlightResumeReq(req));
            pill.addEventListener('mouseleave', () => unhighlightResumeReq());
            
            requirementsPills.appendChild(pill);
        });
    }

    function createMappedElement(dataObj, isListItem = false) {
        if (typeof dataObj === 'string') {
            const el = document.createElement(isListItem ? 'li' : 'div');
            el.innerHTML = dataObj;
            return el;
        }

        const el = document.createElement(isListItem ? 'li' : 'div');
        el.className = 'mapped-item';
        el.innerHTML = dataObj.text;
        
        if (dataObj.matched_requirements && dataObj.matched_requirements.length > 0) {
            el.dataset.reqs = JSON.stringify(dataObj.matched_requirements);
        }

        if (dataObj.source_file) {
            el.addEventListener('click', (e) => {
                // Clear old active state
                if (activeClickElement) {
                    activeClickElement.classList.remove('active-click');
                }
                activeClickElement = el;
                el.classList.add('active-click');
                
                loadAssistantData(dataObj);
            });
        }

        return el;
    }

    function renderResume(data) {
        resumeSummary.innerHTML = '';
        resumeCompetencies.innerHTML = '';
        resumeExperience.innerHTML = '';

        if (data.summary) {
            resumeSummary.appendChild(createMappedElement(data.summary));
        }

        for (let i = 1; i <= 4; i++) {
            const comp = data[`competency_${i}`];
            if (comp) resumeCompetencies.appendChild(createMappedElement(comp, true));
        }

        experienceMap.forEach(blockInfo => {
            if (blockInfo.group) {
                // Multi-role company grouping (e.g. OptoFidelity)
                const groupDiv = document.createElement('div');
                groupDiv.style.marginBottom = '12px';
                groupDiv.innerHTML = `<div class="experience-left" style="margin-bottom: 4px;"><span class="company">${blockInfo.group}</span></div>`;
                
                blockInfo.items.forEach(subItem => {
                    const roleData = data[subItem.key];
                    if (roleData) {
                        const subDiv = document.createElement('div');
                        subDiv.style.marginBottom = '6px';
                        subDiv.innerHTML = `
                            <div class="experience-header">
                                <div class="experience-left"><span class="title">${subItem.title}</span></div>
                                <div class="dates">${subItem.dates}</div>
                            </div>
                        `;
                        const ul = document.createElement('ul');
                        ul.appendChild(createMappedElement(roleData, true));
                        subDiv.appendChild(ul);
                        groupDiv.appendChild(subDiv);
                    }
                });
                resumeExperience.appendChild(groupDiv);
            } else {
                // Single role company
                const roleData = data[blockInfo.key];
                if (roleData) {
                    const blockDiv = document.createElement('div');
                    blockDiv.className = 'experience-item';
                    blockDiv.innerHTML = `
                        <div class="experience-header">
                            <div class="experience-left"><span class="company">${blockInfo.company}</span></div>
                        </div>
                        <div class="experience-header" style="margin-top: 2px;">
                            <div class="experience-left"><span class="title">${blockInfo.title}</span></div>
                            <div class="dates">${blockInfo.dates}</div>
                        </div>
                    `;
                    const ul = document.createElement('ul');
                    ul.appendChild(createMappedElement(roleData, true));
                    blockDiv.appendChild(ul);
                    resumeExperience.appendChild(blockDiv);
                }
            }
        });
    }

    function highlightResumeReq(reqStr) {
        document.querySelectorAll('.mapped-item').forEach(item => {
            if (item.dataset.reqs) {
                const reqs = JSON.parse(item.dataset.reqs);
                if (reqs.some(r => r.includes(reqStr) || reqStr.includes(r))) {
                    item.classList.add('highlight-req');
                }
            }
        });
    }

    function unhighlightResumeReq() {
        document.querySelectorAll('.mapped-item.highlight-req').forEach(item => item.classList.remove('highlight-req'));
    }

    function resetAssistant() {
        assistantTabs.classList.add('hidden');
        sourceTabContent.innerHTML = '<div class="empty-state">Click any bullet point on the resume to view its verified source trace.</div>';
        storiesTabContent.innerHTML = '';
        if (activeClickElement) {
            activeClickElement.classList.remove('active-click');
            activeClickElement = null;
        }
    }

    async function loadAssistantData(dataObj) {
        assistantTabs.classList.remove('hidden');
        
        // 1. Process Source Tab
        sourceTabContent.innerHTML = '<i>Fetching ATS database source...</i>';
        try {
            const res = await fetch(`/api/source/${encodeURIComponent(dataObj.source_file)}`);
            if (!res.ok) throw new Error('Source file not found');
            const fileData = await res.json();
            
            let htmlText = escapeHTML(fileData.content);
            if (dataObj.source_quote) {
                const escapedQuote = escapeHTML(dataObj.source_quote);
                htmlText = htmlText.replace(escapedQuote, `<span class="source-quote-highlight">${escapedQuote}</span>`);
            }
            
            sourceTabContent.innerHTML = `
                <div style="margin-bottom:12px;"><span style="background:#334155; padding: 4px 8px; border-radius:4px; font-family:monospace; font-size:11px;">${dataObj.source_file}</span></div>
                ${htmlText}
            `;
            
            // Auto scroll highlight into view in Source pane
            setTimeout(() => {
                const hl = sourceTabContent.querySelector('.source-quote-highlight');
                if (hl) hl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 50);

        } catch (err) {
            sourceTabContent.innerHTML = `<span style="color: coral">Error loading source logic: ${err.message}</span>`;
        }

        // 2. Process Behavioral Stories Tab
        storiesTabContent.innerHTML = '<i>Looking up behavioral interviews...</i>';
        if (!dataObj.supporting_stories || dataObj.supporting_stories.length === 0) {
            storiesTabContent.innerHTML = '<div class="empty-state">No behavioral stories explicitly mapped for this bullet. Trigger Tailor Agent V3.</div>';
            return;
        }

        storiesTabContent.innerHTML = '';
        for (const story of dataObj.supporting_stories) {
            const card = document.createElement('div');
            card.className = 'story-card';
            
            card.innerHTML = `
                <div class="story-header">${story.file}</div>
                <div class="story-relevance"><b>Value Add:</b> ${story.relevance}</div>
                <div class="story-body"><i>Loading story content...</i></div>
            `;
            storiesTabContent.appendChild(card);

            try {
                const storyRes = await fetch(`/api/source/${encodeURIComponent(story.file)}`);
                if (storyRes.ok) {
                    const storyData = await storyRes.json();
                    card.querySelector('.story-body').innerHTML = escapeHTML(storyData.content);
                } else {
                    card.querySelector('.story-body').innerHTML = `<span style="color: coral">Story file missing.</span>`;
                }
            } catch (e) {
                card.querySelector('.story-body').innerHTML = `<span style="color: coral">Error: ${e.message}</span>`;
            }
        }
    }

    function escapeHTML(str) {
        if (!str) return '';
        return str.replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag]));
    }

    function scaleResume() {
        const viewerPane = document.getElementById('resume-viewer-pane');
        const rContainer = document.querySelector('.resume-container');
        if (!viewerPane || !rContainer) return;

        const availableWidth = viewerPane.clientWidth - 48; // padding 24*2
        const availableHeight = viewerPane.clientHeight - 48;
        
        const scaleX = availableWidth / 816;
        const scaleY = availableHeight / 1056;
        
        const scale = Math.min(scaleX, scaleY, 1.5); 
        rContainer.style.transform = `scale(${scale})`;
    }

    window.addEventListener('resize', scaleResume);
    setTimeout(scaleResume, 50); // call once on load
});
