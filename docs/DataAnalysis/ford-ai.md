---
layout: default
title: Ford 엔진 진동 AI
parent: DataAnalysis
nav_order: 2
---

# Ford 엔진 진동 AI

Written by: Kyungmin Jo

Directed by: Prof. SangSan Lee

Program: python/tensorflow

IDE: google colab

reference: [https://www.kamp-ai.kr/front/dataset/AiData.jsp](https://www.kamp-ai.kr/front/dataset/AiData.jsp)

## 데이터셋 요약

* **분석목적**
  * 미국 포드(Ford)사에서 제공한 오픈데이터셋을 사용하여 개발한 AI모델
  * 시스템/설비 예지 보전을 위해, 분류 알고리즘을 적용하여 불량 제품을 분류
  * 시계열 데이터를 사용하여 계측 Sensor 값의 주기적인 특성 및 계측 Sensor 간의 관계 학습을 통한 분류 및 예측 문제를 해결
* **분석실습**
  * **데이터소개**
    * binary class problem
    * 독립변수 500개 , 종속변수 1 (정상/비정상)
  * **모델소개**
    * 로지스틱 회귀
    * RNN
    * CNN

## Code

* **Load Library**

```python
import itertools
from time import time
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from scipy.io.arff import loadarff
from sklearn.preprocessing import StandardScaler, RobustScaler
import tensorflow as tf

```



* **Load Data**

```python
file_path = './data/'  # 사용자 Local 환경 내의 다운로드 받은 데이터 파일이 위치한 경로
train_fn="FordA_TRAIN.arff"  # Train 데이터 파일명
test_fn="FordA_TEST.arff"  # Test 데이터 파일명

def read_ariff(path):
    """
    .ariff 확장자를 Load하기 위한 함수
    """
    raw_data, meta = loadarff(path)
    cols = [x for x in meta]
    data2d = np.zeros([raw_data.shape[0],len(cols)])
    for i,col in zip(range(len(cols)),cols):
        data2d[:,i]=raw_data[col]
    return data2d

train = read_ariff(file_path + train_fn)
test = read_ariff(file_path + test_fn)

print("train_set.shape:", train.shape)
print("test_set.shape:", test.shape)
```



* **Split Data**

```python
normal_x = x_train_temp[y_train_temp==1]  # Train_x 데이터 중 정상 데이터
abnormal_x = x_train_temp[y_train_temp==-1]  # Train_x 데이터 중 비정상 데이터
normal_y = y_train_temp[y_train_temp==1]  # Train_y 데이터 중 정상 데이터
abnormal_y = y_train_temp[y_train_temp==-1]  # Train_y 데이터 중 비정상 데이터

ind_x_normal = int(normal_x.shape[0]*0.8)  # train_x 데이터를 8:2로 나누기 위한 기준 인덱스 설정
ind_y_normal = int(normal_y.shape[0]*0.8)  # train_y 데이터를 8:2로 나누기 위한 기준 인덱스 설정
ind_x_abnormal = int(abnormal_x.shape[0]*0.8)  # train_x 데이터를 8:2로 나누기 위한 기준 인덱스 설정
ind_y_abnormal = int(abnormal_y.shape[0]*0.8)  # train_y 데이터를 8:2로 나누기 위한 기준 인덱스 설정

x_train = np.concatenate((normal_x[:ind_x_normal], abnormal_x[:ind_x_abnormal]), axis=0)
x_valid = np.concatenate((normal_x[ind_x_normal:], abnormal_x[ind_x_abnormal:]), axis=0)
y_train = np.concatenate((normal_y[:ind_y_normal], abnormal_y[:ind_y_abnormal]), axis=0)
y_valid = np.concatenate((normal_y[ind_y_normal:], abnormal_y[ind_y_abnormal:]), axis=0)
```



* **Visualize**

특정 시간에서의 시계열 샘플&#x20;

```python
def get_scatter_plot(c):
    time_t = random.randint(0, c_x_train.shape[0])  # 0~1404 사이의 랜덤한 정수가 특정 time t가 됨
    plt.scatter(range(0, c_x_train.shape[1]), c_x_train[time_t], 
                marker='o', s=5, c="r" if c == -1  else "b")
    plt.title("at time: t_{}".format(time_t), fontsize=20)
    plt.xlabel("Sensor", fontsize=14)
    plt.ylabel("Sensor Value", fontsize=14)
    plt.savefig(save_path + '{state}.png'.format(state="abnormal" if c == -1 else "normal"), 
                dpi=100, bbox_inches='tight')
    plt.show()
    plt.close()

labels = np.unique(np.concatenate((y_train, y_test), axis=0))

for c in labels:
    c_x_train = x_train[y_train == c]
    if c == -1:
        print("비정상 Label 데이터 수: ", len(c_x_train))
        get_scatter_plot(c)
    else:
        print("정상 Label 데이터 수: ", len(c_x_train))
        get_scatter_plot(c)
```

1개의 임의의 센서 값의 시계열

```
sensor_number = random.randint(0, 500)  # 0~500 사이의 랜덤한 정수가 Sensor 번호가 됨

plt.figure(figsize = (13, 4))
plt.title("sensor_number: {}".format(sensor_number), fontsize=20)
plt.plot(x_train[:, sensor_number])
plt.xlabel("Time", fontsize=15)
plt.ylabel("Sensor Value", fontsize=15)
plt.savefig(save_path + 'ford_a_sensor.png', dpi=100, bbox_inches='tight')
plt.show()
plt.close()
```



* **data preprocessing(normalize)**

```python
from sklearn.preprocessing import StandardScaler
from sklearn.preprocessing import RobustScaler

#Standarscaler 
stder = StandardScaler()
stder.fit(x_train)
x_train = stder.transform(x_train)
x_valid = stder.transform(x_valid)

# RNN,CNN (3D input)
x_train_exp = x_train.reshape((x_train.shape[0], x_train.shape[1], 1))
x_valid_exp = x_train.reshape((x_valid.shape[0], x_valid.shape[1], 1))
x_test_exp = x_test.reshape((x_test.shape[0], x_test.shape[1], 1))

# change label
y_train[y_train == -1] = 0
y_valid[y_valid == -1] = 0
y_test[y_test == -1] = 0
```



* **Model**

**model 1 (LogisticRegression)**

```python
from sklearn.linear_model import LogisticRegression

clf_lr_1 = LogisticRegression(penalty='l2',
                         tol=0.0001, 
                         C=1, 
                         fit_intercept=True, 
                         intercept_scaling=1, 
                         random_state=2, 
                         solver='lbfgs', 
                         max_iter=1000,
                         multi_class='auto',
                         verbose=0)
#######################################
x_train_lr = np.concatenate((x_train, x_valid), axis=0)  # 로지스틱 회귀 학습용 데이터
y_train_lr = np.concatenate((y_train, y_valid), axis=0)  # 로지스틱 회귀 테스트용 데이터
#######################################
clf_lr_1.fit(x_train_lr, y_train_lr)
0)
```

**model 2 (RNN)**

```python
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Flatten, Dense

def make_rnn_model():
    model = Sequential()
    model.add(LSTM(units=256, return_sequences=True))
    model.add(Flatten())
    model.add(Dense(100, activation='relu'))
    model.add(Dense(2, activation='softmax'))
    return model

rnn_model = make_rnn_model()

#######################################
from tensorflow.keras.callbacks import Callback, EarlyStopping, ModelCheckpoint, ReduceLROnPlateau

epochs= 100
batch_size = 64

rnn_model.compile(loss="sparse_categorical_crossentropy", 
                  optimizer='adam', 
                  metrics=["sparse_categorical_accuracy"]
                 )

callbacks = [ModelCheckpoint(save_path + 'rnn_best_model.h5', 
                             monitor='val_loss',
                             save_best_only=True),
             ReduceLROnPlateau(
                 monitor="val_loss", factor=0.5, patience=20, min_lr=0.0001
                 ),
             EarlyStopping(monitor="val_loss", patience=10, verbose=1)
             ]

history_rnn = rnn_model.fit(
    x_train_exp,
    y_train,
    batch_size=batch_size,
    epochs=epochs,
    callbacks=callbacks,
    validation_data=(x_valid_exp, y_valid),
    verbose=1
)
#######################################
```



**model 3 (CNN)**

```python
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import BatchNormalization, Conv1D, ReLU, GlobalAveragePooling1D, Dense

def make_cnn_model():
    model = Sequential()
    model.add(Conv1D(filters=64, kernel_size=3, padding="same"))
    model.add(BatchNormalization())
    model.add(ReLU())
    model.add(Conv1D(filters=64, kernel_size=3, padding="same"))
    model.add(BatchNormalization())
    model.add(ReLU())
    model.add(Conv1D(filters=64, kernel_size=3,padding="same"))
    model.add(BatchNormalization())
    model.add(ReLU())
    model.add(GlobalAveragePooling1D())
    model.add(Dense(2, activation="softmax"))
    return model

cnn_model = make_cnn_model()

#########################
from tensorflow.keras.callbacks import Callback, EarlyStopping, ModelCheckpoint, ReduceLROnPlateau

epochs = 300
batch_size = 64

callbacks = [
    ModelCheckpoint(
        save_path + "cnn_best_model.h5", save_best_only=True, monitor="val_loss"
    ),
    ReduceLROnPlateau(
        monitor="val_loss", factor=0.5, patience=20, min_lr=0.0001
    ),
    EarlyStopping(monitor="val_loss", patience=50, verbose=1),
]

cnn_model.compile(
    optimizer="adam",
    loss="sparse_categorical_crossentropy",
    metrics=["sparse_categorical_accuracy"],
)

history_cnn = cnn_model.fit(
    x_train_exp,
    y_train,
    batch_size=batch_size,
    epochs=epochs,
    callbacks=callbacks,
    validation_data=(x_valid_exp, y_valid),
    verbose=1,
)
```



* **Evaluate**

```python
###LogisticRegression######
y_pred = clf_lr_1.predict(x_test)
y_pred_proba = clf_lr_1.predict_proba(x_test)
score = clf_lr_1.score(x_test, y_test)
print("%s: %.2f%%" % ("Logistic Regression Prediction Rate", score*100))
############################

##########RNN###############
from tensorflow.keras.models import load_model

rnn_model = tf.keras.models.load_model(save_path + "rnn_best_model.h5")
scores = rnn_model.evaluate(x_test_exp, y_test)

print("\n""Test accuracy", scores[1])
print("\n""Test loss", scores[0])
print("%s: %.2f%%" % (rnn_model.metrics_names[1], scores[1]*100))
###########################

########CNN################
cnn_model = tf.keras.models.load_model(save_path + "cnn_best_model.h5")
scores = cnn_model.evaluate(x_test_exp, y_test)

print("\n""Test accuracy", scores[1])
print("\n""Test loss", scores[0])
print("%s: %.2f%%" % (cnn_model.metrics_names[1], scores[1]*100))
##########################

```



* **Confusion matrix**

```python
from sklearn.metrics import classification_report, confusion_matrix

def draw_confusion_matrix(model, xt, yt, model_name):
    Y_pred = model.predict(xt)
    if model_name in ["cnn", "rnn"]:
        y_pred = np.argmax(Y_pred, axis=1)
    else: y_pred = Y_pred
    plt.figure(figsize=(3,3))
    cm = confusion_matrix(yt, y_pred)
    plt.imshow(cm, interpolation='nearest', cmap=plt.cm.Blues)
    plt.title("Confusion Matrix")
    plt.colorbar()
    tick_marks = np.arange(2)
    plt.xticks(tick_marks, ['False', 'True'], rotation=45)
    plt.yticks(tick_marks, ['False', 'True'])
    thresh = cm.max()/1.2
    normalize = False
    fmt = '.2f' if normalize else 'd'
    for i,j in itertools.product(range(cm.shape[0]), range(cm.shape[1])):
        plt.text(j,i, format(cm[i,j], fmt), 
                 horizontalalignment="center", 
                 color="white" if cm[i,j] > thresh else "black", 
                 fontsize=12)
    plt.ylabel("Actual Label")
    plt.xlabel("Predicted Label")
    plt.tight_layout()
    plt.savefig(save_path + '{}_cm.png'.format(model_name), dpi=100, bbox_inches='tight')  # 그림 저장
    plt.show()
    print(classification_report(yt, y_pred))
    
##########
draw_confusion_matrix(clf_lr_1, x_test, y_test, "Logistic")
draw_confusion_matrix(rnn_model, x_test_exp, y_test, "rnn")
draw_confusion_matrix(cnn_model, x_test_exp, y_test, "cnn")
```



## reference

[https://www.kamp-ai.kr/front/dataset/AiData.jsp](https://www.kamp-ai.kr/front/dataset/AiData.jsp)
