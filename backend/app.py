from flask import Flask, request, jsonify

from flask_cors import CORS
import cv2
from PIL import Image
import base64
import io
import numpy as np

import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import models
import logging
logging.basicConfig(level=logging.DEBUG)
import matplotlib.pyplot as plt


ml_model = models.load_model('./inception_sgd_classweights.h5')
face_haar_cascade = cv2.CascadeClassifier('./haarcascade_frontalface_default.xml')

app = Flask(__name__)
CORS(app)
cors = CORS(app, resources={
    r"/*": {
        "origins": "*"
    }
})

@app.route('/api/face_predict', methods=['POST'])
def face_predict():
    content = request.get_json()
    app.logger.info('Processing default request')
    base64image = content['image']
    base64_decoded = base64.b64decode(base64image)
    image = Image.open(io.BytesIO(base64_decoded))
    image_np = np.array(image)
    gray = cv2.cvtColor(image_np, cv2.COLOR_BGR2GRAY)
    faces = face_haar_cascade.detectMultiScale(gray)
    result = []
    for (x, y, w, h) in faces:
        roi_gray = gray[y:y + w, x:x + h]
        roi_gray = cv2.resize(roi_gray,(75,75))
        roi_gray = np.true_divide(roi_gray,255)
        roi_gray_3dim = np.stack((roi_gray,)*3, axis=-1)
        roi_gray_3dim = roi_gray_3dim.reshape(-1, 75,75,3)
        predictions = ml_model.predict(roi_gray_3dim)
        max_index = np.argmax(predictions[0])
        emotion_detection = ['angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral']
        emotion_prediction = emotion_detection[max_index]
        result.append(emotion_prediction)
    if len(result) == 0:
        response = jsonify(message="undetected")
    else:
        response = jsonify(message=result[0])
    return response

if __name__ == '__main__':
    app.run(debug=True)