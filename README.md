# Smart Data Analyst AI Agent

A powerful Node.js application that uses AI to analyze data, provide insights, and generate visualizations. This tool helps you extract meaningful information from your datasets without requiring data science expertise.

## Features

- **Data Upload & Parsing**: Upload CSV or Excel files for analysis
- **AI-Powered Analysis**: Uses OpenAI's GPT-4 to analyze data and provide insights
- **Data Visualization**: Automatically generates relevant charts and graphs
- **Statistical Analysis**: Calculates key statistics from your data
- **Business Recommendations**: Suggests actionable insights based on data patterns

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key

## Installation

1. Clone this repository or download the source code

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory based on `.env.example`:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=3000
   ```

## Usage

1. Start the server:
   ```bash
   npm start
   ```

2. The API will be available at `http://localhost:3000`

### API Endpoints

#### 1. Upload and Analyze Data

**Endpoint**: `POST /api/analyze`

**Request**: Multipart form data with:
- `file`: CSV or Excel file (required)
- `questions`: Specific questions about the data (optional)

**Example using curl**:
```bash
curl -X POST http://localhost:3000/api/analyze \
  -F "file=@./sample-data.csv" \
  -F "questions=What are the top selling products? Is there a correlation between region and sales?"
```

**Example using JavaScript**:
```javascript
const form = new FormData();
form.append('file', fileInput.files[0]);
form.append('questions', 'What are the top selling products?');

fetch('http://localhost:3000/api/analyze', {
  method: 'POST',
  body: form
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

#### 2. Analyze Text Data

**Endpoint**: `POST /api/analyze/text`

**Request**: JSON with:
- `data`: Array of objects (required)
- `questions`: Specific questions about the data (optional)

**Example using curl**:
```bash
curl -X POST http://localhost:3000/api/analyze/text \
  -H "Content-Type: application/json" \
  -d '{"data":[{"product":"Laptop","sales":1200.50},{"product":"Smartphone","sales":800.75}],"questions":"Which product has higher sales?"}'
```

**Example using JavaScript**:
```javascript
const data = {
  data: [
    {product: "Laptop", sales: 1200.50},
    {product: "Smartphone", sales: 800.75}
  ],
  questions: "Which product has higher sales?"
};

fetch('http://localhost:3000/api/analyze/text', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

### Response Format

The API returns a JSON response with the following structure:

```json
{
  "success": true,
  "data": {
    "summary": "Brief summary of the dataset",
    "insights": ["Key insight 1", "Key insight 2", ...],
    "statistics": { "Statistical observations" },
    "recommendations": ["Recommendation 1", "Recommendation 2", ...],
    "charts": [
      {
        "type": "bar|line|pie|scatter",
        "title": "Chart title",
        "description": "What this chart shows",
        "url": "https://quickchart.io/chart?c=..."
      }
    ]
  }
}
```

## Sample Data

A sample CSV file (`sample-data.csv`) is included in this repository for testing purposes.

## Deployment

This application can be deployed to platforms like Vercel, Render, or Heroku. Make sure to set the environment variables in your deployment platform.

### Deploying to Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

### Deploying to Render

1. Create a new Web Service on Render
2. Connect your repository
3. Set the build command to `npm install`
4. Set the start command to `npm start`
5. Add environment variables

## Extending the Application

### Adding New Chart Types

To add new chart types, modify the `chartGenerator.js` file in the `utils` directory. Add a new function to create the chart configuration and update the `generateChart` function to handle the new chart type.

### Customizing AI Analysis

To customize the AI analysis, modify the `openaiService.js` file in the `utils` directory. You can update the system message or adjust the parsing logic to extract different information from the AI response.

## License

MIT