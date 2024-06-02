import cv2
import numpy as np
import mediapipe as mp
from typing import Tuple
from io import BytesIO
from fastapi import HTTPException

def detect_keypoints(image: np.ndarray) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
    mp_pose = mp.solutions.pose
    pose = mp_pose.Pose(static_image_mode=True, min_detection_confidence=0.5)
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = pose.process(image_rgb)
    
    if not results.pose_landmarks:
        raise ValueError("No pose landmarks detected")

    landmarks = results.pose_landmarks.landmark
    height, width, _ = image.shape

    # Extracting key points
    head = np.array([landmarks[mp_pose.PoseLandmark.NOSE].x * width,
                     landmarks[mp_pose.PoseLandmark.NOSE].y * height])
    left_foot = np.array([landmarks[mp_pose.PoseLandmark.LEFT_ANKLE].x * width,
                          landmarks[mp_pose.PoseLandmark.LEFT_ANKLE].y * height])
    right_foot = np.array([landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE].x * width,
                           landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE].y * height])
    chest = np.array([landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER].x * width,
                      landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER].y * height])
    stomach = np.array([landmarks[mp_pose.PoseLandmark.LEFT_HIP].x * width,
                        landmarks[mp_pose.PoseLandmark.LEFT_HIP].y * height])
    back = np.array([landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER].x * width,
                     landmarks[mp_pose.PoseLandmark.LEFT_HIP].y * height])

    return head, left_foot, right_foot, chest, stomach, back


def calculate_bulge(chest: np.ndarray, stomach: np.ndarray) -> float:
    return np.linalg.norm(stomach - chest)


def calculate_back_curvature(chest: np.ndarray, back: np.ndarray) -> float:
    return np.linalg.norm(chest - back)


def convert_pixels_to_cm(pixel_distance: float, pixel_height: float, actual_height_cm: float) -> float:
    return (pixel_distance / pixel_height) * actual_height_cm


async def perform_image_analysis(user_image: bytes, actual_height):
    image_np = np.frombuffer(user_image, np.uint8)
    image = cv2.imdecode(image_np, cv2.IMREAD_COLOR)

    try:
        head, left_foot, right_foot, chest, stomach, back = detect_keypoints(image)
        foot = (left_foot + right_foot)/2
        pixel_height = np.linalg.norm(head - foot)
        buldge_measurement_px = calculate_bulge(chest, stomach)
        back_curvature_px = calculate_back_curvature(chest, back)
        buldge_measurement = convert_pixels_to_cm(buldge_measurement_px, pixel_height, actual_height)
        back_curvature = convert_pixels_to_cm(back_curvature_px, pixel_height, actual_height)
    except Exception as e:
        raise HTTPException(status_code = 400, detail = str(e))
    
    return buldge_measurement, back_curvature