from fastapi import File, UploadFile
from typing import List, Optional
from pydantic import BaseModel

class UserBase(BaseModel):
    userImage: UploadFile = File(...)
    userBMI: UploadFile = File(...)