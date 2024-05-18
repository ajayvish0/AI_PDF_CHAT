
## Backend

### Setup and Installation

1. Create a virtual environment and activate it:

```bash
  python -m venv env
  source venv/bin/activate  # On Windows, use ` .\env\Scripts\activate.bat`
```
2. Install dependencies:
```bash
   pip install -r requirements.txt
```
3. Set up Google Drive API credentials:

- Follow the steps in the [Google Drive API Quickstart page](https://developers.google.com/drive/api/v3/quickstart/python) to obtain your credentials.json file.
- Place the credentials.json file in the backend/ directory.

4. Run the backend server:

```bash
   uvicorn main:app --reload
```

## Key Files
- **main.py** : Contains the FastAPI application setup and endpoints.
- **models.py** : Defines the SQLAlchemy models for database tables.
- **database.py** : Configures the PostgreSQL database connection.


## Environment Variables
Create a .env file in the backend/ directory with the following environment variables:

```bash 
   export DATABASE_URL=your_postgresql_database_url
   export GOOGLE_DRIVE_FOLDER_ID=your_google_drive_folder_id

```

### Database
- **PostgreSQL**: Used for storing metadata of uploaded documents.
- **Configuration**: The database connection is configured in `database.py` in the backend.
    
