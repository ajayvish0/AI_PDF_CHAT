from sqlalchemy import Column, DateTime, String, Integer, ForeignKey, Float, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy import TIMESTAMP, text
from database import Base

class PDFMetadata(Base):
    __tablename__ = 'pdf_metadata'

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String)
    file_size = Column(Integer)
    created_at = Column(TIMESTAMP(timezone=True), server_default=text('now()'))
      

class QuestionandAnswer(Base):
    __tablename__ = 'questions'
    id = Column(Integer, primary_key=True,index=  True)
    pdf_id = Column(Integer, ForeignKey('pdf_metadata.id'))
    pdf_metadata = relationship('PDFMetadata')
    question = Column(Text)
    answer = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())