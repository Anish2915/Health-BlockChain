import fitz
import spacy
import re
from fastapi import HTTPException

nlp = spacy.load("en_core_web_sm")


def extract_text_from_pdf(file: bytes) -> str:
    document = fitz.open(stream=file, filetype="pdf")
    text = ""
    for page_num in range(document.page_count):
        page = document[page_num]
        text += page.get_text()
    return text


def extract_information(text: str):
    doc = nlp(text)
    doctor_name = None
    institute = None
    location = None
    bmi_index = None

    # Regex patterns for extracting specific information
    bmi_pattern = re.compile(r"BMI\s*:\s*(\d+\.\d+|\d+)")
    
    # Extracting doctor's name (assuming it's a proper noun with Dr. prefix)
    for ent in doc.ents:
        if ent.label_ == "PERSON" and "Dr." in ent.text:
            doctor_name = ent.text
            break

    # Extracting BMI index
    bmi_match = bmi_pattern.search(text)
    if bmi_match:
        bmi_index = bmi_match.group(1)

    # Finding institute name and location (assumed to be in one of the recognized entity labels)
    for ent in doc.ents:
        if ent.label_ in ("ORG", "GPE"):
            if not institute:
                institute = ent.text
            elif not location and ent.label_ == "GPE":
                location = ent.text
    
    return {
        "doctor_name": doctor_name,
        "institute": institute,
        "location": location,
        "bmi_index": bmi_index
    }


async def perform_bmidoc_analysis(user_bmidoc: bytes):
    try:
        text = extract_text_from_pdf(user_bmidoc)
        info = extract_information(text)
        return info
    except Exception as e:
        raise HTTPException(status_code = 400, detail = str(e))