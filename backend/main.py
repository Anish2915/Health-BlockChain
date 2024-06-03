from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Imports necessary modules for route and function
from fastapi.responses import JSONResponse
from fastapi import status, HTTPException, File, UploadFile, Form
from typing import List, Optional
from pydantic import BaseModel
import os
import shutil

# Importing the model files
from models import Img_Insights
from models import Bmi_Insights

app = FastAPI()

# origins = [
#     'http://127.0.0.1:3000',
# ]

app.add_middleware(
    CORSMiddleware,
    allow_origins = ['*'],
    allow_credentials = True,
    allow_methods = ['*'],
    allow_headers = ['*']
)

# # Defining the Schema
# class UserBase(BaseModel):
#     userImage: UploadFile = File(...)
#     userBMIdoc: UploadFile = File(...)
#     actualHeight: float = Form(...)

# Defining the Route
# @app.get('/download')
# async def download_model():
#     await shutil.check_all("python", "-m", "spacy", "download", "en_core_web_sm")
#     return JSONResponse({"output": "Model downloaded successfully"}, status_code = status.HTTP_200_OK)

@app.post('/user/upload')
async def fetch_user_data(image: UploadFile = File(...), doc: UploadFile = File(...), height: float = Form(...)):
    user_image = await image.read()
    user_bmidoc = await doc.read()

    try:
        buldge_measurement, back_curvature = await Img_Insights.perform_image_analysis(user_image, height)
        info = await Bmi_Insights.perform_bmidoc_analysis(user_bmidoc)
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code = status.HTTP_400_BAD_REQUEST)
    
    print("-----------------------------------------------------------")
    print(buldge_measurement, back_curvature)
    print(info)
    # return JSONResponse({"output": "fine"})
    
    return JSONResponse({
        "buldge_measurement": str(buldge_measurement),
        "back_curvature": str(back_curvature),
        "doctor": str(info['doctor_name']),
        "institute": str(info['institute']),
        "location": str(info['location']),
        "bmi": str(info['bmi_index'])
    }, status_code = status.HTTP_200_OK)