# SpeedieReadie

SpeedieReadie is a speed reading web application built with **ReactJS** (using TypeScript) for the frontend, **Django** as the backend, and **Firebase Firestore** for the database. This app allows users to upload and read texts at their own customized speed, helping them improve their reading pace. 

### ⚠️ **Important Note**
I am no longer actively working on this project. The only branch that is known to be fully functional is the **`NoAuthSpeedieReadie`** branch. Please note that there is **no official license** associated with this project.

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Visuals](#visuals)
- [Dependencies](#dependencies)
- [Contributing](#contributing)
- [License](#license)

---

## Features
- Upload and view texts in the speed reading format.
- Customize the speed and reading settings to suit individual preferences.
- **No Authentication** required in the **`NoAuthSpeedieReadie`** branch (for quick testing and use).

---

## **Tech Stack**

- **Frontend**: ReactJS, TypeScript
- **Backend**: Django, Django Rest Framework
- **Database**: Firebase Firestore

---

## **Installation**

To set up and run SpeedieReadie on your local machine:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/SpeedieReadie.git
2. **Set up Backend**
   - Navigate to the Django backend Directory:
    ```bash
    cd backend/
  - Install the required Python Dependencies:
    ```bash
    pip install -r requirements.txt
  - Run the Server:
    ```bash
    python manage.py runserver
3. **Set up the Frontend**
   - Navigate to the React project directory:
    ```bash
   cd frontend/
  - Install the required Node.js denpendencies:
    ```bash
    npm install
  - Run the development server:
    ```bash
    npm run dev
    ```
    ---

    ## **Visuals**

    Here are some screenshots and a link to the full 3 minute demo on Youtube!
    ### **SpeedieReadie HomePage**
      ![SpeedieReadie ScreenShot](https://github.com/Juno-whut/SpeedieReadie-Webapp/blob/NoAuthSpeedieReadie/READMEimages/speediereadieHOME.png?raw=true)
    ### **SpeedieReadie Library**
      ![SpeedieReadie ScreenShot](https://github.com/Juno-whut/SpeedieReadie-Webapp/blob/NoAuthSpeedieReadie/READMEimages/speediereadieLIBRARY.png?raw=true)
    ### **SpeedieReadie EditPage**
      ![SpeedieReadie ScreenShot](https://github.com/Juno-whut/SpeedieReadie-Webapp/blob/NoAuthSpeedieReadie/READMEimages/speediereadieEDITTEXT.png?raw=true)
    ### **SpeedieReadie Speed Reading Page**
       ![SpeedieReadie ScreenShot](https://github.com/Juno-whut/SpeedieReadie-Webapp/blob/NoAuthSpeedieReadie/READMEimages/speediereadieSPEEDREADING.png?raw=true)
    ### **Watch the Full Demo on YT**
    [![Watch on Youtube]((https://github.com/Juno-whut/SpeedieReadie-Webapp/blob/NoAuthSpeedieReadie/READMEimages/speediereadieHOME.png?raw=true)](https://www.youtube.com/watch?v=h5C-h2_8SuQ)
    
    ---

    ## **Dependencies**
    
    ### **Python Dependencies** (Backend):
    - Django
    - Firebase
    - requests
    - re
    - charder
    - eboolib
    - tempfile
    - PyPDF2
    - BeautifulSoup4
    - django_rest_framework
    - firebase_admin

    ### **ReactJS Dependencies** (Frontend):
    - ReactJS
    - Firebase
    - Bootstrap
    - Vite

    ---

    ## **Contributing**
    This projecet is currently **not** accepting contributions, as development is no longer active. Feel free to fork the repository if you'd like to use or modify it for your own purposes.

    ---

    ## **License**
    This project has **no license**. Feel free to use it, but please be aware that there is no formal license governing the code.
    
