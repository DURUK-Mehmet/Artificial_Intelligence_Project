import cv2
import numpy as np
import matplotlib.pyplot as plt
import random as rnd
import statistics


def image(path):
    img = cv2.imread(path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    return img

img = image("foto.jpg")

renk = []

#resim yüzde 8 i kadar random piksel seçiyoruz

for i in range(int((img.shape[0]*img.shape[1])*0.08)):
    x=rnd.randint(0, img.shape[0]-1)
    y=rnd.randint(0, img.shape[1]-1)
    renk.append(img[x][y])

#Seçili random piksellerin r g b renk kodlarını başka diziye aktarıyoruz
r = []
g = []
b = []

#Ortalama bir renk kodu elde etmek için ayrıştıracağımız [r,g,b] kodlarının ortalamasını alarak renk elde ediyoruz
for a in range(len(renk)):
   r.append(renk[a][0])
   g.append(renk[a][1])
   b.append(renk[a][2])

#Elde edilen listenin ortalaması alınıyor
ortalama=(int(statistics.mean(r)),int(statistics.mean(g)),int(statistics.mean(b)))

print("Örneğimizin rgb kodu : ",ortalama)


print(img.shape[0])
print(img.shape[0])

sayac=0
ayar=80


"""if (ortalama[0]-ayar)<=0:
    ortalama[0]=0
if (ortalama[1] + ayar) >= 255:
    ortalama[1] = 255
if (ortalama[2]-ayar)<=0:
    ortalama[2]=0
"""
say=0
for i in range(0,img.shape[0]):
    for j in range (0,img.shape[1]):

        if all([(ortalama[0] - ayar) <img[i][j][0]< (ortalama[0] + ayar), (ortalama[1] - ayar) < img[i][j][1] < (ortalama[1] + ayar),
                (ortalama[2] - ayar) < img[i][j][2] < (ortalama[2] + ayar)]):

            sayac+=1




print(sayac)
print("piksel",say)
pixel=img.shape[0]*img.shape[1]

print(pixel)
yuzde=(100*sayac)/pixel
print("%{} homojen yapıya sahip bir örnek".format(int(yuzde)))

plt.imshow(img)
plt.show()




