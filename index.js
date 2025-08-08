require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Import utility modules
const dataProcessor = require('./utils/dataProcessor');
const openaiService = require('./utils/openaiService');
const chartGenerator = require('./utils/chartGenerator');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /csv|xlsx|xls/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only CSV and Excel files are allowed!'));
    }
  }
});

// Routes
app.get('/', (req, res) => {
  res.send('Smart Data Analyst API is running!');
});

// Upload and analyze data endpoint
app.post('/api/analyze', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Get user's analysis questions if provided
    const { questions } = req.body;
    
    // Process the uploaded file
    const processedData = await dataProcessor.processFile(req.file.path);
    
    // Get AI analysis of the data
    const aiAnalysis = await openaiService.analyzeData(processedData, questions);
    
    // Generate charts based on AI insights
    const charts = await chartGenerator.generateCharts(processedData, aiAnalysis.chartSuggestions);
    
    // Return the complete analysis
    res.json({
      success: true,
      data: {
        summary: aiAnalysis.summary,
        insights: aiAnalysis.insights,
        statistics: aiAnalysis.statistics,
        recommendations: aiAnalysis.recommendations,
        charts
      }
    });
  } catch (error) {
    console.error('Error analyzing data:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze data' });
  }
});

// Text-based analysis endpoint (for when user wants to analyze without uploading a file)
app.post('/api/analyze/text', express.json({ limit: '1mb' }), async (req, res) => {
  try {
    const { data, questions } = req.body;
    
    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ error: 'Invalid data format. Expected array of objects.' });
    }
    
    // Get AI analysis of the data
    const aiAnalysis = await openaiService.analyzeData(data, questions);
    
    // Generate charts based on AI insights
    const charts = await chartGenerator.generateCharts(data, aiAnalysis.chartSuggestions);
    
    // Return the complete analysis
    res.json({
      success: true,
      data: {
        summary: aiAnalysis.summary,
        insights: aiAnalysis.insights,
        statistics: aiAnalysis.statistics,
        recommendations: aiAnalysis.recommendations,
        charts
      }
    });
  } catch (error) {
    console.error('Error analyzing text data:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze data' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});