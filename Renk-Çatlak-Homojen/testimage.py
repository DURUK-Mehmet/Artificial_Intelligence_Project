import numpy as np
import cv2
import tensorflow as tf
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from keras.models import load_model
from PIL import Image

#read the image


#show image


#image load with numpy
img_path ="deneme/fisne2.jpg"
img = load_img(img_path, target_size = (224, 224,3))
img = img_to_array(img)
img = np.expand_dims(img, axis = 0)
"""
#image load with opencv
img = cv2.imread("deneme/visne.png")
img = cv2.resize(img, (224,224))
img = np.array(img, dtype="float32")
img = np.reshape(img, (1,224,224,3))
"""


interpreter = tf.lite.Interpreter(model_path="model.tflite")
interpreter.allocate_tensors()
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

input_shape = input_details[0]['shape']
interpreter.set_tensor(input_details[0]['index'],img)
interpreter.invoke()

output_data = interpreter.get_tensor(output_details[0]['index'])
output_probs = tf.math.softmax(output_data)
pred_label = tf.math.argmax(output_probs)

predictions = output_probs
label = pred_label
print(predictions)

max_index = np.argmax(predictions)
classes = ["AageanRose", "AfyonBal", "AfyonBeyaz", "AfyonBlack", "AfyonGrey", "AfyonSeker", "Bejmermer", "Blue", "Capuchino", "Diyabaz", "DolceVita", "EkvatorPijama", "ElazigVisne", "GoldGalaxy", "GulKurusu", "KaplanPostu", "Karacabeysiyah", "Konglomera", "KristalEmprador", "Leylakmermer", "MediBlack", "OliviaMarble", "Oniks", "RainGrey", "Traverten"]
print(max_index)
print(classes[max_index])








