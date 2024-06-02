from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Imports necessary modules for route and function
from fastapi.responses import JSONResponse
from fastapi import status, HTTPException, File, UploadFile, Form
from typing import List, Optional
from pydantic import BaseModel

# Importing the model files
from models import Img_Insights, Bmi_Insights

app = FastAPI()

origins = [
    'http://localhost:3000',
]

app.add_middleware(
    CORSMiddleware,
    allow_orgins = origins,
    allow_credentials = True,
    allow_methods = ['*'],
    allow_headers = ['*']
)

# Defining the Schema
class UserBase(BaseModel):
    userImage: UploadFile = File(...)
    userBMIdoc: UploadFile = File(...)
    actualHeight: float = Form(...)

# Defining the Route
@app.post('/user/upload')
async def fetch_user_data(user_data: UserBase):
    user_image = await user_data.userImage.read()
    user_bmidoc = await user_data.userBMIdoc.read()
    user_height = user_data.actualHeight

    try:
        buldge_measurement, back_curvature = await Img_Insights.perform_image_analysis(user_image, user_height)
        info = await Bmi_Insights.perform_bmidoc_analysis(user_bmidoc)
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code = status.HTTP_400_BAD_REQUEST)
    
    return JSONResponse({
        "buldge_measurement": buldge_measurement,
        "back_curvature": back_curvature,
        "doctor": info.doctor_name,
        "institute": info.institute,
        "location": info.location,
        "bmi": info.bmi_index
    }, status_code = status.HTTP_200_OK)