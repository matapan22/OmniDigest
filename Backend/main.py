from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import fitz  # PyMuPDF
import google.generativeai as genai
from dotenv import load_dotenv
import os
import json

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def extract_text_from_pdf(file_path):
    text = ""
    with fitz.open(file_path) as pdf:
        for page in pdf:
            text += page.get_text()
    return text

@app.post("/summarize/")
async def summarize(file: UploadFile = File(...)):
    with open(file.filename, "wb") as f:
        content = await file.read()
        f.write(content)

    pdf_text = extract_text_from_pdf(file.filename)

    model = genai.GenerativeModel("gemini-2.5-flash")
    response = model.generate_content(f"""
Analyze the text below and return a JSON object with exactly three keys: "heading", "keywords", and "summary_text".

1. "heading": A concise, professional title for the content.
2. "keywords": A Python list of strings containing the top 5-10 most important keywords or concepts.
3. "summary_text": A comprehensive summary of the content.
   - You must cover every main section of the text (Intro, Body, Conclusion).
   - Do not leave out key details or arguments.
   - Write in a clear, informative tone.

Input Text:
"{pdf_text}"

Return only the valid JSON. Do not add Markdown formatting like ```json.
""")

    os.remove(file.filename)
    

    cleaned_text = response.text.replace("```json", "").replace("```", "").strip()
    response_data = json.loads(cleaned_text)

    return response_data
