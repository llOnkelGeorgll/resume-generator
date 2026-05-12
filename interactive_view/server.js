const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

// List available job output folders
app.get('/api/jobs', (req, res) => {
    const outputsDir = path.join(__dirname, '../data/outputs');
    fs.readdir(outputsDir, { withFileTypes: true }, (err, files) => {
        if (err) return res.status(500).json({ error: 'Failed to read Outputs directory' });
        const jobs = files.filter(dirent => dirent.isDirectory() && dirent.name !== 'test_output').map(dirent => dirent.name);
        res.json(jobs);
    });
});

// Get resume data and ATS metadata for a specific job
app.get('/api/job/:jobName', (req, res) => {
    const jobName = req.params.jobName;
    const jobDir = path.join(__dirname, '../data/outputs', jobName);
    
    let resumeData = null;
    let applicationMetadata = null;
    
    try {
        if (fs.existsSync(path.join(jobDir, 'resume_data.json'))) {
            resumeData = JSON.parse(fs.readFileSync(path.join(jobDir, 'resume_data.json'), 'utf8'));
        }
        if (fs.existsSync(path.join(jobDir, 'application_metadata.md'))) {
            applicationMetadata = fs.readFileSync(path.join(jobDir, 'application_metadata.md'), 'utf8');
        }
        res.json({ resumeData, applicationMetadata });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Fetch raw source material (e.g. old resume or experience files)
app.get('/api/source/:sourceFile', (req, res) => {
    const sourceFile = req.params.sourceFile;
    let filePath;
    
    if (sourceFile === 'old resume') {
        filePath = path.join(__dirname, '../data/reference_material/old_resume');
    } else {
        filePath = path.join(__dirname, '../data/experiences', sourceFile);
        if (!fs.existsSync(filePath) && !filePath.endsWith('.md')) {
             filePath += '.md';
        }
    }
    
    try {
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            res.json({ content });
        } else {
            res.status(404).json({ error: 'Source file not found: ' + filePath });
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Interactive ATS Viewer running on http://localhost:${PORT}`));
