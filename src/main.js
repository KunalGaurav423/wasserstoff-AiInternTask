process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import fs from 'fs-extra';
import path from 'path';
import axios from 'axios';
import { processPDF } from './services/pdfProcessor.js';
import { insertMetadata, updateDocument } from './database/mongo.js';
import { paths } from './config/config.js';

// Load URLs from Dataset.json
const urlFilePath = path.join(paths.datasetPath);
const urlData = JSON.parse(fs.readFileSync(urlFilePath));
const urls = urlData.urls;

const folderPath = path.join(paths.folderPath, 'downloaded-pdf');
if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
}

// Download PDF
async function downloadPDF(url, filename) {
    const response = await axios.get(url, { responseType: 'stream' });
    const filePath = path.join(folderPath, filename);
    return new Promise((resolve, reject) => {
        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

// Main function to process PDFs
async function main() {
    try {
        const promises = urls.map(async (url, index) => {
            const fileName = `downloaded_pdf_${index + 1}.pdf`;
            console.log(`Downloading PDF: ${url}`);
            await downloadPDF(url, fileName);
            const filePath = path.join(folderPath, fileName);
            const fileStats = fs.statSync(filePath);
            
            const metadata = 
            [
                {
                  name: "Commissioner of Income Tax West Bengal vs Calcutta Agency",
                  size: "635kb",
                  url: "https://digiscr.sci.gov.in/pdf_viewer?dir=YWRtaW4vanVkZ2VtZW50X2ZpbGUvanVkZ2VtZW50X3BkZi8xOTUwL3ZvbHVtZSAxL1BhcnQgSS9Db21taXNzaW9uZXIgb2YgSW5jb21lIFRheCwgV2VzdCBCZW5nYWxfQ2FsY3V0dGEgQWdlbmN5IEx0ZC5fMTY5NzYwNjMxMC5wZGY=",
                  summary: "The Commissioner of Income-tax, West Bengal, appealed to the Supreme Court of India against a judgment of the Calcutta High Court, which had allowed the assessee, Calcutta Agency Ltd., to deduct a sum of Rs. 22,500 from its income as an expenditure incurred for the purpose of its business.",
                  pdf_pages: "11",createdAt: new Date() 
                },
                {
                  name: "The State of Bihar vs MAHARAJADHIRAJA SIR KAMESHWAR SINGH OF Darbhanga AND OTHERS",
                  size: "5.1mb",
                  url: "https://digiscr.sci.gov.in/pdf_viewer?dir=YWRtaW4vanVkZ2VtZW50X2ZpbGUvanVkZ2VtZW50X3BkZi8xOTUyL3ZvbHVtZSAxL1BhcnQgSS90aGUgc3RhdGUgb2YgYmloYXJfbWFoYXJhamFkaGlyYWphIHNpciBrYW1lc2h3YXIgc2luZ2ggb2YgZGFyYmhhbmdhIGFuZCBvdGhlcnNfMTY5ODMxODQ0OC5wZGY=",
                  summary: "The Supreme Court upheld the Bihar Land Reforms Act, 1950, affirming its constitutional validity while striking down certain provisions.",
                  pdf_pages: "131 pages",createdAt: new Date() 
                },
                {
                  name: "THE CONSTITUTION OF INDIA",
                  size: "2.3mb",
                  url: "https://cdnbbsr.s3waas.gov.in/s380537a945c7aaa788ccfcdf1b99b5d8f/uploads/2024/07/20240716890312078.pdf",
                  summary: "A comprehensive document that outlines the political and legal framework of India, amended to meet the country's evolving needs.",
                  pdf_pages: "402 pages",createdAt: new Date() 
                },
                {
                  name: "ministry of law and justice",
                  size: "1293mb",
                  url: "https://www.mha.gov.in/sites/default/files/250883_english_01042024.pdf",
                  summary: "Plays a crucial role in upholding the rule of law and ensuring justice in India, collaborating with various government agencies.",
                  pdf_pages: "102 pages",createdAt: new Date() 
                },
                {
                  name: "RBI appoints Smt. Charulatha S Kar as new Executive Director",
                  size: "327kb",
                  url: "https://rbidocs.rbi.org.in/rdocs/PressRelease/PDFs/PR60974A2ED1DFDB84EC0B3AABFB8419E1431.PDF",
                  summary: "Smt. Charulatha S. Kar appointed as Executive Director at RBI, overseeing key departments including HR and communication.",
                  pdf_pages: "1 page",createdAt: new Date() 
                },
                {
                  name: "THE TATA OIL MILLS CO. LTD vs ITS WORKMEN",
                  size: "458kb",
                  url: "https://digiscr.sci.gov.in/pdf_viewer?dir=YWRtaW4vanVkZ2VtZW50X2ZpbGUvanVkZ2VtZW50X3BkZi8xOTYwL3ZvbHVtZSAxL1BhcnQgSS90aGUgdGF0YSBvaWwgbWlsbHMgY28uIGx0ZC5faXRzIHdvcmttZW4gYW5kIG90aGVyc18xNjk5MzMzODYyLnBkZg==",
                  summary: "Supreme Court clarified guidelines for bonus calculation in industrial disputes, emphasizing profit relations and prior deductions.",
                  pdf_pages: "13 pages",createdAt: new Date() 
                },
                {
                  name: "GREAT INDIAN MOTOR WORKS LTD AND ANOTHER vs THEIR EMPLOYEES",
                  size: "458kb",
                  url: "https://digiscr.sci.gov.in/pdf_viewer?dir=YWRtaW4vanVkZ2VtZW50X2ZpbGUvanVkZ2VtZW50X3BkZi8xOTYwL3ZvbHVtZSAxL1BhcnQgSS9ncmVhdCBpbmRpYW4gbW90b3Igd29ya3MgbHRkLiwgYW5kIGFub3RoZXJfdGhlaXIgZW1wbG95ZWVzIGFuZCBvdGhlcnNfMTY5OTMzNjM1NS5wZGY=",
                  summary: "The Court upheld an award in favor of employees, relating to wages and working conditions.",
                  pdf_pages: "8 pages",createdAt: new Date() 
                },
                {
                  name: "MESSRS. ISPAHANI LTD. CALCUTTA v. ISP AHANI EMPLOYEES' UNION",
                  size: "292kb",
                  url: "https://digiscr.sci.gov.in/pdf_viewer?dir=YWRtaW4vanVkZ2VtZW50X2ZpbGUvanVkZ2VtZW50X3BkZi8xOTYwL3ZvbHVtZSAxL1BhcnQgSS9tZXNzcnMuIGlzcGFoYW5pIGx0ZC4gY2FsY3V0dGFfaXNwYWhhbmkgZW1wbG95ZWVzICB1bmlvbl8xNjk5MzM4NTQ5LnBkZg==",
                  summary: "The case involved an industrial dispute regarding wages and conditions between Ispahani Ltd. and its employees' union.",
                  pdf_pages: "8 pages",createdAt: new Date() 
                },
                {
                  name: "SUPREME COURT REPORTS [1960(1)] PHULBARI TEA ESTATE v. ITS WORKMEN",
                  size: "303kb",
                  url: "https://digiscr.sci.gov.in/pdf_viewer?dir=YWRtaW4vanVkZ2VtZW50X2ZpbGUvanVkZ2VtZW50X3BkZi8xOTYwL3ZvbHVtZSAxL1BhcnQgSS9waHVsYmFyaSB0ZWEgZXN0YXRlX2l0cyB3b3JrbWVuXzE2OTkzMzkyMjYucGRm",
                  summary: "Dealt with an industrial dispute between Phulbari Tea Estate and its workers.",
                  pdf_pages: "8 pages",createdAt: new Date() 
                },
,
                {
                  name: "CIRCULAR ORDERS OF THE HIGH COURT OF JUDICATURE AT ALLAHABAD (SUPPLEMENT) (FROM 1st APRIL, 2011 TO SEPTEMBER, 2016)",
                  size: "2.1mb",
                  url: "https://ijtr.nic.in/Circular%20Orders%20(Supplement).pdf",
                  summary: "This supplement compiles circulars issued by the Allahabad High Court from April 2011 to September 2016, covering guidelines and instructions for legal proceedings.",
                  pdf_pages: "106 pages",createdAt: new Date() 
                },
                {
                  name: "THE PREVENTION OF MONEY-LAUNDERING (MAINTENANCE OF RECORDS) RULES, 2005",
                  size: "13.1mb",
                  url: "https://enforcementdirectorate.gov.in/sites/default/files/Act%26rules/The%20Prevention%20of%20Money-laundering%20%28Maintenance%20of%20Records%29%20Rules%2C%202005.pdf",
                  summary: "These rules regulate record maintenance by entities to prevent money laundering, requiring transaction records and suspicious transaction reporting.",
                  pdf_pages: "24 pages", createdAt: new Date() 
                }
            ];
            const docId = await insertMetadata(metadata);
            
            const processedData = await processPDF(filePath);
            if (processedData) {
                await updateDocument(docId, processedData);
            }
        });

        await Promise.all(promises);
    } catch (error) {
        console.error('Error processing PDFs:', error);
    }
}

main();
