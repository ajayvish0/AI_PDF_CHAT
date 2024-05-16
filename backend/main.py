from fastapi import FastAPI, File, UploadFile, Request
from PyPDF2 import PdfReader
from pydantic import BaseModel
import streamlit as st
from langchain.text_splitter import RecursiveCharacterTextSplitter
import os
import json
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain.vectorstores import FAISS
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains.question_answering import load_qa_chain
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from fastapi import Depends ,FastAPI, File , UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi_sqlalchemy import DBSessionMiddleware, db
 
from schema import Pdf as SchemaPdf, QuestionandAnswer as SchemaQuestionandAnswer
from models import PDFMetadata , QuestionandAnswer as ModelQuestionandAnswer
from database import engine,  get_db
from googleapiclient.http import MediaIoBaseUpload 
import uvicorn
import mimetypes
from io import BytesIO
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from google.auth.transport.requests import Request as req
from database import Base

import google.generativeai as genai
 
genai.configure(api_key=os.getenv('GOOGLE_API_KEY'))
Base.metadata.create_all(bind=engine)

load_dotenv()
# Set up the necessary scopes for the Google Drive API
SCOPES = ['https://www.googleapis.com/auth/drive.file']
app = FastAPI()

creds = None
if os.path.exists('token.json'):
    with open('token.json', 'r') as f:
        creds = Credentials.from_authorized_user_info(json.load(f), SCOPES)
if not creds or not creds.valid:
    if creds and creds.expired and creds.refresh_token:
        creds.refresh(req())
    else:
        flow = InstalledAppFlow.from_client_secrets_file(
            'client_secret.json', SCOPES)
        creds = flow.run_local_server(port=0)
    with open('token.json', 'w') as token:
        token.write(creds.to_json())



drive_service = build('drive', 'v3', credentials=creds)

app.add_middleware(DBSessionMiddleware, db_url=os.environ['DATABASE_URL'])
app.add_middleware(
  CORSMiddleware,
  allow_origins = ["*"],
  allow_credentials=True,
  allow_methods = ["*"],
  allow_headers = ["*"]
)
 
 
def get_pdf_text(pdf_docs):
    text = ""
    for pdf in pdf_docs:
        pdf_reader = PdfReader(pdf)
        for page in pdf_reader.pages:
            text += page.extract_text()
    return text

def get_text_chunks(text):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=10000, chunk_overlap=1000)
    chunks = text_splitter.split_text(text)
    return chunks

def get_vector_store(text_chunks):
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    vector_store = FAISS.from_texts(text_chunks, embeddings)
    vector_store.save_local("faiss_index")

def get_conversation_chain():
    prompt_template = """
    Answer the question as detailed as possible from the provided context, make sure to provide all the details, if the answer is not in
    provided context just say, "answer is not available in the context", don't provide the wrong answer\n\n
    Context:\n {context}?\n
    Question: \n{question}\n

    Answer:
    """

    model = ChatGoogleGenerativeAI(model="gemini-pro", temperature=0.3)
    prompt = PromptTemplate(template=prompt_template, input_variables=["context", "question"])
    chain = load_qa_chain(model, chain_type="stuff", prompt=prompt)
    return chain

from typing import List  # Import the List class from the typing module

@app.get("/")
def read_root():
    return {"message": "Welcome to the PDF processing API"}

@app.post("/upload_pdf/")
async def upload_pdf(files: List[UploadFile] = File(...), db=Depends(get_db)):
    pdf_docs = []
    for file in files:
        # Store metadata in the database
        filename = file.filename
        file_size = len(file.file.read())
        pdf_metadata = PDFMetadata(filename=filename, file_size=file_size)
        db.add(pdf_metadata)
        db.commit()
        db.refresh(pdf_metadata)  # Refresh the instance to get the generated ID

        # Reset the file pointer
        file.file.seek(0)
        pdf_docs.append(file.file)

        # Create the file metadata and upload the file to Google Drive
        file_metadata = {'name': file.filename}
        mimetype = mimetypes.guess_type(filename)[0] or 'application/octet-stream'
        media = MediaIoBaseUpload(pdf_docs[-1], mimetype, resumable=True)
        uploaded_file = drive_service.files().create(body=file_metadata, media_body=media, fields='id').execute()
        print(f'File ID: {uploaded_file.get("id")}')

        # Append the file object to the pdf_docs list
       

    raw_text = get_pdf_text(pdf_docs)
    text_chunks = get_text_chunks(raw_text)
    get_vector_store(text_chunks)

    return {"message": "PDFs processed successfully"}

class QuestionRequest(BaseModel):
    question: str    

@app.post("/ask_question/" )
async def ask_question(request : Request):
    data = await request.json()
    question_request = QuestionRequest(**data)
    question = question_request.question
    
    
    
    
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    new_db = FAISS.load_local("faiss_index", embeddings,allow_dangerous_deserialization=True)
    docs = new_db.similarity_search(question)
    chain = get_conversation_chain()
    response = chain({"input_documents": docs, "question": question}, return_only_outputs=True)
    
    return {"response": response["output_text"]}

# To run locally
if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8000, debug = True)
