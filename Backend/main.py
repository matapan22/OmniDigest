from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import uvicorn
import google.generativeai as genai
from dotenv import load_dotenv
import os
import json
import pypdf
import asyncio
from youtube_transcript_api import YouTubeTranscriptApi
import urllib.parse
import requests
import random




origins = [
    "http://localhost:3000",
    "hhttps://main.d39f9d9deskfjr.amplifyapp.com" 
]

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_video_id(url: str):
    """Extracts video ID from a YouTube URL"""
    parsed_url = urllib.parse.urlparse(url)
    if parsed_url.hostname == 'youtu.be':
        return parsed_url.path[1:]
    if parsed_url.hostname in ('www.youtube.com', 'youtube.com'):
        if parsed_url.path == '/watch':
            p = urllib.parse.parse_qs(parsed_url.query)
            return p['v'][0]
    return None


def get_transcript_text(video_id: str):
    print(f"DEBUG: Attempting to fetch transcript for {video_id}...")
    try:
        transcript_list = YouTubeTranscriptApi()
        transcript_list.fetch(video_id)
        fetched_transcript = transcript_list.fetch(video_id)

        # is iterable
        formatter = []
        for snippet in fetched_transcript:
            print(snippet.text)
            formatter.append(snippet.text)

        full_text = " ".join(formatter)
        print(f"DEBUG: Successfully fetched {len(full_text)} characters.")
        return full_text


        # indexable
        last_snippet = fetched_transcript[-1]

        # provides a length
        snippet_count = len(fetched_transcript)
    except Exception as e:
        # This print statement is CRITICAL. 
        # Look at your VS Code terminal to see what 'e' actually is.
        print(f"DEBUG ERROR: {e}")
        return ""


def clean_text(text: str) -> str:
    """Removes extra whitespace and newlines to save tokens."""
    return " ".join(text.split())

def get_text_chunks(text: str, chunk_size=8000) -> List[str]:
    """Splits one huge string into a list of smaller strings."""
    chunks = []
    current_chunk = ""
    words = text.split()
    
    for word in words:
        if len(current_chunk) + len(word) < chunk_size:
            current_chunk += " " + word
        else:
            chunks.append(current_chunk)
            current_chunk = word
    chunks.append(current_chunk) # Don't forget the last piece!
    return chunks


model = genai.GenerativeModel('gemini-2.5-flash') # Flash is faster/cheaper for chunking

@app.post("/summarize/")
async def summarize_pdf(file: UploadFile = File(...)):
    # 1. READ PDF
    try:
        pdf_reader = pypdf.PdfReader(file.file)
        full_text = ""
        for page in pdf_reader.pages:
            full_text += page.extract_text() or ""
        
        # Clean the text
        clean_full_text = clean_text(full_text)
        
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid PDF file")

    # 2. DECIDE: SIMPLE VS. CHUNKED
    # If text is small (< 10,000 chars), do it in one shot.
    # If text is huge, use Map-Reduce.
    
    final_input_text = ""
    
    if len(clean_full_text) < 10000:
        final_input_text = clean_full_text
               
    else:
        # === MAP PHASE (Parallel) ===
        chunks = get_text_chunks(clean_full_text)
        print(f"Processing {len(chunks)} chunks...") # For debugging

        # 1. Define a helper for a SINGLE chunk call
        async def process_chunk(chunk, index):
            try:
                # Use the Async version of Gemini if available, 
                # or wrap the sync call in a thread executor
                prompt = f"Summarize this section: {chunk}"
                response = await model.generate_content_async(prompt) # Gemini supports async!
                return response.text
            except Exception as e:
                print(f"Error on chunk {index}: {e}")
                return ""

        # 2. Fire all requests at once
        tasks = [process_chunk(chunk, i) for i, chunk in enumerate(chunks)]
        intermediate_summaries = await asyncio.gather(*tasks)

        # Combine results
        final_input_text = "\n".join(intermediate_summaries)

    # === REDUCE PHASE (Final Polish) ===
    # Now we take either the original short text OR the combined summaries
    # and turn them into your beautiful JSON format.
    
    final_prompt = f"""
    Act as a professional content analyst. 
    Analyze the text below (which may be a collection of summaries from a larger document).
    
    Return a JSON object with exactly three keys: "heading", "keywords", and "summary_text".
    
    1. "heading": A concise, professional title.
    2. "keywords": A Python list of 5-10 specific tags/concepts.
    3. "summary_text": A cohesive, flowing summary. 
       - If the input was chunks, merge them into a seamless narrative.
       - Use professional formatting.
       
    Input Text:
    "{final_input_text}"
    
    Return ONLY valid JSON.
    """
        
    try:
            # 1. FORCE JSON MODE (The Fix)
            # This tells Gemini: "Do not give me text unless it is valid JSON"
            response = model.generate_content(
                final_prompt,
                generation_config={"response_mime_type": "application/json"}
            )
            
            # 2. No need to replace "```json" anymore, it comes back clean.
            response_data = json.loads(response.text)
            return response_data

    except Exception as e:
        print("Final Generation Error:", e)
        # Print the raw text so you can see what went wrong in your terminal
        if 'response' in locals():
            print("Raw Gemini Output:", response.text) 
        raise HTTPException(status_code=500, detail="Failed to generate final summary")
    

class YouTubeRequest(BaseModel):
    url: str

@app.post("/summarize-youtube/")
async def summarize_youtube(request: YouTubeRequest):
    # 1. Get Video ID
    video_id = get_video_id(request.url)
    if not video_id:
        raise HTTPException(status_code=400, detail="Invalid YouTube URL")
    
    # 2. Get Transcript
    transcript_text = get_transcript_text(video_id)
    
    # 3. Clean the text (using your existing helper)
    clean_transcript = clean_text(transcript_text)
    
    # 4. Summarize (Direct Prompt)
    final_prompt = f"""
    Act as a professional content analyst. 
    Analyze the YouTube video transcript below.
    
    Return a JSON object with exactly three keys: "heading", "keywords", and "summary_text".
    
    1. "heading": A catchy title for the video.
    2. "keywords": A list of 5-10 topics discussed.
    3. "summary_text": A detailed summary of the video content.
    
    Input Transcript:
    "{clean_transcript[:30000]}" 
    """
    # Note: We limit to 30k chars to be safe. You can use your chunking logic here if you want later.
    try:
        # === THE FIX STARTS HERE ===
        response = model.generate_content(
            final_prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        
        # DEBUG: Print what Gemini actually sent back
        # This helps if it crashes again
        print(f"Gemini Raw Output: {response.text[:200]}...") 

        # Clean up Markdown formatting if Gemini adds it (e.g. ```json )
        cleaned_response = response.text.replace("```json", "").replace("```", "").strip()
        
        return json.loads(cleaned_response)
        # === THE FIX ENDS HERE ===

    except Exception as e:
        print(f"Gemini Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate summary from AI")
    