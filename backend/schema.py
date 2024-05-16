from pydantic import BaseModel
from datetime import datetime

class Pdf(BaseModel):
   
    filename: str
    file_size: int
    
   
    class Config:
        orm_mode = True

class QuestionandAnswer(BaseModel):
    
    pdf_id: int
    question: str
    answer: str
    

    class Config:
        orm_mode = True        
