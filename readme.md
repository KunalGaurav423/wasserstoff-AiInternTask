markdown
Copy code
# PDF Processing and Metadata Storage System

This project is designed to download PDFs, extract and process metadata (like summaries and keywords), and store the information in a MongoDB database.

## Features
- Downloads PDFs from a list of URLs.
- Extracts text from PDF files and generates a summary, keyword extraction, and page count.
- Stores PDF metadata in a MongoDB database.
- Updates MongoDB documents with processed data after text extraction.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js** (v14 or later)
- **MongoDB** server installed and running locally or remotely
- **Git** installed for cloning the repository
- **Docker** (optional) if you want to run the MongoDB server in a Docker container

## Installation

1. Clone the repository:

   ```bash
   git clone <repository_url>
   cd <repository_directory>

Install dependencies:
npm install


Set up MongoDB:

Ensure MongoDB is running locally or configure it for a remote database.

Update Configuration:

In the config/config.js file, update the following fields as per your environment:

export const dbConfig = {
    uri: 'mongodb://localhost:27017', // MongoDB connection URI
    dbName: 'mypdf',                  // Database name
    collectionName: 'order'           // Collection name to store PDF metadata
};

export const paths = {
    folderPath: 'C:/path/to/your/downloaded-pdf-folder',   // Path to folder containing PDFs
    datasetPath: 'C:/path/to/your/dataset/Dataset.json'    // Path to dataset JSON file
};
Add your dataset:

Ensure your dataset Dataset.json contains a list of URLs. Example structure:

{
    "urls": [
        "https://example.com/pdf1.pdf",
        "https://example.com/pdf2.pdf"
    ]
}

Running the Project

Run the PDF processing script:
node index.js
The script will:

Download PDFs from the URLs listed in the dataset.
Extract text, summary, keywords, and page count.
Store this metadata into the MongoDB database.
Update the MongoDB documents with processed data (text, summary, and keywords).
Project Structure
config/: Configuration files (e.g., MongoDB connection details, file paths).
services/: PDF processing services.
utils/: Utility functions (e.g., MongoDB connection and query execution).
Dataset.json: Contains the URLs of PDFs to be downloaded.
index.js: Main entry point to run the script.

Example Metadata Schema
Each PDF's metadata document in MongoDB includes the following fields:

name: Name of the PDF document.
size: Size of the PDF file.
url: URL from which the PDF was downloaded.
summary: Summary of the PDF content.
keywords: Top 5 keywords extracted from the PDF content.
pdf_pages: Number of pages in the PDF.
createdAt: Timestamp when the PDF metadata was added.
_id: Unique identifier of the document (auto-generated).

Error Handling

The script includes basic error handling. If a PDF fails to download or process, the error will be logged, and the process will continue with the remaining PDFs.




