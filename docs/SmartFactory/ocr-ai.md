---
layout: default
title: 제조 현장용 OCR학습 제조AI
parent: SmartFactory
nav_order: 1
---

# 제조 현장용 OCR학습 제조AI

Written by: Kyungmin Jo

Directed by: Prof. SangSan Lee

Program: python/tensorflow

IDE: google colab

reference: [https://www.kamp-ai.kr/front/dataset/AiData.jsp](https://www.kamp-ai.kr/front/dataset/AiData.jsp)

## 데이터셋 요약

* **분석 배경**
  
  * 설비 개요
    * 제관 카운터웨이트의 충진과정에 대한 내용
    * 저울에 표기된 무게를 OCR로 파악
  * 분석배경 소개
    * 카운터 웨이트의 품질문제를 보장을 위하여, 자동화된 무게 입력 과정을 구현

* **분석 목표**
  
  * 분석 목표
    * 충진과정에서 계측되는 무게를 저울의 LED 숫자표기를 OCR하여 디지털로 변환하는 과정
    * 디지털로 변환한 data를 DB에 자동기

* **분석실습**
  
  * 데이터소개
    * 원본이미지로 부터 추출된 JPG이미지 데이터
    * train data: 21789 / validation data : 5448

* **모델소개**
  
  * 이미지처리에 적합한 CNN을 사용
  * ResNet 구조 사용

* **학습방법**
  
  * 확률적 경사 하강법
  * 아담 옵티마이저

![(a) Original Image                                          (b)cropped Imag](<./assets/image (14).png>)

### Code

#### Load Library

```python
import numpy as np
from tensorflow.keras.preprocessing import image
import os
from PIL import Image
import matplotlib.pyplot as plt

## resnet in tensorflow
#from tensorflow.keras.applications.resnet50 import ResNet50
from tensorflow.keras.applications.resnet50 import preprocess_input
#from tensorflow.keras.applications.resnet50 import decode_predictions



## version pytorch
# import torch
# import torchvision
# import torch.nn as nn
# import torch.optim as optim
# from torchvision import transforms
# from torch.utils.data.dataloader import DataLoader
```

#### Showing Image

```python
coden_size=64
img_path="img_path.jpg"
img= image.load_img(img_path,target_size=(n_size,n_size))
img_array = image.img_to_array(img)
img_array3d = np.expand_dims(img_array,axis=0)
preprocess_img = preprocess_input(img_array3d)
```

![img\_path.jpg](<./assets/image (19).png>)

```python
print("img_array : ",img_array.shape)
print("img_array3d : ",img_array3d.shape)
print("preprocessing : ",preprocess_img.shape )
print("example array ",img_array[0][0]) # Origin

print("example array3d ",img_array3d[0][0][0]) #expand dimention 

print("example pre_array ",preprocess_img[0][0][0]) # change channel

                                                                                                                                                                                                                                                                                       plt.figure(figsize=(12,12))
plt.subplot(1,8,1)
plt.imshow(img)
plt.title("orgin")

plt.subplot(1,8,4)
plt.imshow(img_array3d[0])
plt.title("img_to_array")

plt.subplot(1,8,7)
plt.imshow(preprocess_img[0])
plt.title("preprocessing for Resnet")
```

![Preprocessing for Resnet model](<./assets/image (18).png>)

#### Preprocessing Data&#x20;

```python
class DigitData:
    def __init__(self, path, size=64, split='train'):
        self.path = path
        self.size = (size, size)

        # training set과 validation set 구분
        if split == 'train':
            self.image_files = open(os.path.join(path, 'train_data.txt'), 'r').read().splitlines()
        else:
            self.image_files = open(os.path.join(path, 'valid_data.txt'), 'r').read().splitlines()


    def __len__(self):
        return len(self.image_files)
```

#### dataset split

##### Train Data

```
# path = r'/gdrive/MyDrive/SmartFactory/01. Dataset_OCR/OCR데이터셋/dataset/digit_data' # digit_data가 있는 디렉토리
path = r'path/digit_data' # digit_data가 있는 디렉토리

size = 64 # 이미지의 조정된 크기
batch_size = 128 # 한 번의 iteration에 사용할 instance의 수

train_data = DigitData(path, size, 'train')
valid_data = DigitData(path, size, 'valid')

##pytorch version
# train_loader = DataLoader(train_data, batch_size=batch_size, shuffle=True)
# valid_loader = DataLoader(valid_data, batch_size=batch_size, shuffle=True)
```

```python
#train data_X
train_x=[]
for i in range(len(train_data)):


  path = os.path.join(train_data.path, train_data.image_files[i])
  img = image.load_img(path,target_size=(64,64))

  img = np.array(img)
  # img = tf.keras.preprocessing.image.img_to_array(img)

  # img = tf.keras.applications.resnet.preprocess_input(img)

  train_x.append(img)

train_x=np.array(train_x)
print("train_x shape: ", train_x.shape)

## train data_Y
label = []
for i in range(len(train_data)):
  target = int(train_data.image_files[i].split('/')[0])
  label.append(target)

train_y=np.array(label)
print("train_y shape: ", train_y.shape)
```

train data\_x shape: (21789, 64, 64, 3)

train data\_y shape: (21789,)

##### Validation data&#x20;

```python
#validation data_X
val_x=[]
for i in range(len(valid_data)):


  path = os.path.join(valid_data.path, valid_data.image_files[i])
  img = image.load_img(path,target_size=(64,64))

  img = np.array(img)
  # img = tf.keras.preprocessing.image.img_to_array(img)

  # img = tf.keras.applications.resnet.preprocess_input(img)

  val_x.append(img)

val_x=np.array(val_x)
print("val_x shape: ", val_x.shape)

# val data_Y
val_y = []
for i in range(len(valid_data)):
  target = int(valid_data.image_files[i].split('/')[0])
  val_y.append(target)

val_y = np.array(val_y )
print("val_y shape: ", val_y.shape)
```

validation data\_x shape : (5448, 64, 64, 3)

validation data\_y shape : (5448)

#### Model Learning

```
import numpy as np
from tensorflow import keras
from tensorflow.keras import layers

model2 = keras.Sequential(
    [
        layers.experimental.preprocessing.Rescaling(1./255, input_shape=(64, 64, 3)),
        # keras.Input(shape=(64,64,3)),
        layers.Conv2D(32, kernel_size=(3, 3), activation="relu"),
        layers.MaxPooling2D(pool_size=(2, 2)),
        layers.Conv2D(64, kernel_size=(3, 3), activation="relu"),
        layers.MaxPooling2D(pool_size=(2, 2)),
        layers.Flatten(),
        layers.Dropout(0.5),
        layers.Dense(10, activation="softmax"),
    ]
)
```

![model summary](<./assets/image (7).png>)

#### Model fitting

```
// model fitting
batch_size = 128
epochs = 15

model2.compile(loss='sparse_categorical_crossentropy', optimizer="adam", metrics=["accuracy"])

model2.fit(train_x, train_y, batch_size=batch_size, epochs=epochs,validation_data=(val_x,val_y))
```

![model fitting](<./assets/image (16).png>)

# Reference

KAMP 제조 AI 데이터셋 수정

[https://www.kamp-ai.kr/](https://www.kamp-ai.kr/)
