import cv2
import numpy as np
import matplotlib.pyplot as plt
import random as rnd
import statistics

def image(path):
    img = cv2.imread(path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    return img

img = image("cracked3.jpg")




for i in range(0,img.shape[0]):
    for j in range (0,img.shape[1]):

        if (j%27==0):
            cv2.drawMarker(img, (i, j), (0, 0, 255), markerType=cv2.MARKER_CROSS, markerSize=1, thickness=2,
                           line_type=cv2.FILLED)



        else:
            pass
plt.imshow(img)
plt.show()

