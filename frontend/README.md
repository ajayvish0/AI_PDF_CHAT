## Setup and Installation
Navigate to the frontend directory:

```bash
 
cd ../frontend
```
Install dependencies:

```bash
 
npm install
```
Run the frontend development server:

```bash
 
npm run dev 
```
### Key Files
- `src/App.js`: Main React component that sets up the application routes.
- `src/components/`: Contains reusable React components.
- `src/pages/`: Contains React components for different pages (e.g., upload page, QA page).

### Database
- **PostgreSQL**: Used for storing metadata of uploaded documents.
- **Configuration**: The database connection is configured in `database.py` in the backend.

### File Storage
- **Google Drive**: Used for securely storing the uploaded PDF documents.

### Usage
- Upload PDF Documents: Use the frontend interface to upload PDF documents.
- Ask Questions: Once a document is uploaded, users can ask questions regarding its content through the frontend interface.
- Receive Answers: The backend processes the document using NLP and returns answers to the user's questions.
 
