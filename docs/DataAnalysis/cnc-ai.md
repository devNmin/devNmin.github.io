---
layout: default
title: CNC 머신 AI
parent: DataAnalysis
nav_order: 3

---

# CNC 머신 AI

Written by: KyungMin Jo

Directed by: Prof. SangSan Lee

Program: python/tensorflow

IDE: google colab

reference: [https://www.kamp-ai.kr/front/dataset/AiData.jsp](https://www.kamp-ai.kr/front/dataset/AiData.jsp)

### 데이터셋 요약

* 분석배경
  * CNC가공 공정의 데이터 분석을 통한 품질 문제 해결을 하기 위하여
* 분석목표
  * CNC 설비와 네트워크 연결을 통한 생산 데이터를 통해 가공불량 예측과정 학습
* 분석실습
  * 데이터소개
    * 독립변수 (48가지의 변수 )
      * 샘플 관련변수 6개, 기계의 X축 관련 변수 11개, 기계의 Y축 관련 변수 11개, 기계의 Z축 관련 변수 11개, 기계의 스핀들 관련 변수 12개, 기타 변수 4개
      *
    * 종속변수 (양품 불량품)
      * 공정완료 유뮤, 육안검사 통과유무
  * 모델소개
    * 딥뉴럴네트워크(Deep Neural Network)

### Code

*   라이브러리 및 데이터 불러오기

    ```
    from __future__ import print_function
    import pandas as pd
    import numpy as np
    import glob
    from sklearn.preprocessing import MinMaxScaler, StandardScaler
    
    # import function libraries
    import numpy as np
    import keras
    import os, sys ,math, copy
    import scipy.io as sio
    import tensorflow as tf
    from keras.models import Model, Sequential
    from keras.engine import Layer, InputSpec
    from keras.optimizers import RMSprop, SGD, Adam
    from keras import initializers, regularizers, constraints
    from keras.callbacks import ModelCheckpoint, LearningRateScheduler, History
    from keras.layers import Dense, Dropout, Activation, Flatten, Input
    from keras import backend as K
    from keras.utils import np_utils
    
    sys.setrecursionlimit(10000)
    
    import matplotlib.pyplot as plt
    ```

    ```
    train_sample = pd.read_csv("train.csv", header=0, encoding='utf-8')
    path = r'./CNC Virtual Data set _v2'
    all_files = glob.glob(path + "\*.csv")
    
    # load csv file
    li_df = []
    # 파일들 모두 한번에 저장
    for filename in all_files:
        df = pd.read_csv(filename, index_col=None, header=0)    
        li_df.append(df)
    ```
*   데이터 종류 및 개수 확인

    ```
    # count the number of pass/fail items
    nb_pass = 0
    nb_pass_half = 0
    nb_defective = 0
    for i in range(len(train_sample_np)):
        if train_sample_np[i,5] == 'no':
            nb_defective += 1
        if train_sample_np[i,5] == 'yes' and train_sample_np[i,6] =='yes':
            nb_pass += 1
        if train_sample_np[i,5] == 'yes' and train_sample_np[i,6] == 'no':
            nb_pass_half += 1
            
    print('양품 샘플 개수 : ', nb_pass)
    print('공정 마쳤으나 육안검사 통과 못한 샘플 개수 : ', nb_pass_half)
    print('공정 중지된 샘플 개수 : ', nb_defective)
    print('전체 샘플 개수 : ', nb_pass + nb_pass_half + nb_defective)
    ```
*   데이터 정제(전처리)

    ```
    # 사용자 정의함수
    
    # tool condition 변수를 0,1로 변환
    def tool_condition(input):
        for i in range(len(input)):
            if input[i,4] == 'unworn':
                input[i,4] = 0
            else:
                input[i,4] = 1
        return input
    
    # item_inspection 변수를 0,1,2로 변환
    def item_inspection(input):
        for i in range(len(input)):
            if input[i,5] == 'no':
                input[i,6] = 2
            elif input[i,5] == 'yes' and input[i,6] == 'no':
                input[i,6] = 1
            elif input[i,5] == 'yes' and input[i,6] == 'yes':
                input[i,6] = 0
        return input
    
    # machining_process 변수를 0~9로 변환
    def machining_process(input):
        for i in range(len(input)):
            if input[i,47] == 'Prep':
                input[i,47] = 0
            elif input[i,47] == 'Layer 1 Up':
                input[i,47] = 1
            elif input[i,47] == 'Layer 1 Down':
                input[i,47] = 2
            elif input[i,47] == 'Layer 2 Up':
                input[i,47] = 3
            elif input[i,47] == 'Layer 2 Down':
                input[i,47] = 4
            elif input[i,47] == 'Layer 3 Up':
                input[i,47] = 5
            elif input[i,47] == 'Layer 3 Down':
                input[i,47] = 6
            elif input[i,47] == 'Repositioning':
                input[i,47] = 7
            elif input[i,47] == 'End' or 'end':
                input[i,47] = 8        
            elif input[i,47] == 'Starting':
                input[i,47] = 9
        return input
    ```

    ```
    #사용자 정의 함수를 통한 데이터 분류
    train_sample_info = np.array(train_sample_np.copy())
    train_sample_info = tool_condition(train_sample_info)
    train_sample_info = item_inspection(train_sample_info)
    
    train_sample_info = np.delete(train_sample_info,5,1)
    train_sample_info = np.delete(train_sample_info,0,1)
    train_sample_info = np.delete(train_sample_info,0,1)
    
    k  = 0
    li_pass = []
    li_pass_half = []
    li_fail = []
    
    for filename in all_files:
        df = pd.read_csv(filename, index_col=None, header=0)      
        
        if train_sample_info[k,3] == 0:
            li_pass.append(df)        
        elif train_sample_info[k,3] == 1:
            li_pass_half.append(df)        
        else :
            li_fail.append(df)
            
        k += 1
        
    frame01 = pd.concat(li_pass, axis=0, ignore_index=True)
    frame02 = pd.concat(li_pass_half, axis=0, ignore_index=True)
    frame03 = pd.concat(li_fail, axis=0, ignore_index=True)
    
    data_pass = np.array(frame01.copy())
    data_pass_half = np.array(frame02.copy())
    data_fail = np.array(frame03.copy())
    
    data_pass = machining_process(data_pass)
    data_pass_half = machining_process(data_pass_half)
    data_fail = machining_process(data_fail)
    ```

    ```
    # 데이터셋 구성
    # label 0/1 --> data01 / data02+data03
    
    data01 = data_pass[0:3228+6175,:]
    data02 = data_pass_half[0:6175,:]
    data03 = data_fail[0:3228,:]
    
    data = np.concatenate((data01,data02),axis=0);
    data = np.concatenate((data,data03),axis=0);
    
    data_all= data_pass[3228+6175:22645,:]
    ```

    ```
    # 2차 전처리 진행, MinMaxScaler 사용
    sc = MinMaxScaler()
    X_train = sc.fit_transform(data)
    X_train = np.array(X_train)
    X_test = sc.fit_transform(data_all)
    X_test = np.array(X_test)
    
    # 라벨 데이터 생성
    
    Y_train = np.zeros((len(X_train),1),dtype='int')
    Y_test = np.zeros((len(X_test),1),dtype='int')
    l = int(Y_train.shape[0]/2)
    
    Y_train[0:l,:] = 0
    Y_train[l:l*2,:] = 1
    
    print(Y_train)
    ```
*   AI모델 구축 및 훈련

    ```
    nb_classes = 2
    #데이터 셋
    X_train = X_train.astype('float32')
    X_test = X_test.astype('float32')
    
    Y_train = np_utils.to_categorical(Y_train, nb_classes)
    Y_test = np_utils.to_categorical(Y_test, nb_classes)
    
    print(X_train.shape)
    print(X_test.shape)
    print(Y_train.shape)
    print(Y_test.shape)
    ```

    ```
    # AI 모델 파라미터 설정
    batch_size = 1024
    epochs = 300
    lr = 1e-4
    
    #모델 디자인
    model = Sequential()
    model.add(Dense(128, activation='relu', input_dim=48))
    model.add(Dropout(0.3))
    model.add(Dense(256, activation='relu'))
    model.add(Dropout(0.3))
    model.add(Dense(512, activation='relu'))
    model.add(Dropout(0.3))
    model.add(Dense(512, activation='relu'))
    model.add(Dropout(0.3))
    model.add(Dense(256, activation='relu'))
    model.add(Dropout(0.3))
    model.add(Dense(128, activation='relu'))
    model.add(Dropout(0.3))
    model.add(Dense(nb_classes, activation='sigmoid'))
    
    model_checkpoint = ModelCheckpoint('weight_CNC_binary.mat', monitor='val_acc',save_best_only=True)
    opt=Adam(lr)
    model.summary()
    model.compile(optimizer=opt,loss='binary_crossentropy',
                  metrics=['accuracy'])
    history = History()
    ```

    ```
    # 모델 훈련
    model.fit(X_train, Y_train, verbose=2, batch_size=batch_size, epochs=epochs, validation_split=0.1, shuffle=True, callbacks=[history])
    model.save_weights('weight_CNC_binary.mat')
    ```
*   결과 분석 및 해석

    ```
    # train 평가
    loss_and_metrics = model.evaluate(X_train,Y_train,batch_size=32)
    print(loss_and_metrics)
    # test 평가
    loss_and_metrics2 = model.evaluate(X_test,Y_test,batch_size=32)
    print(loss_and_metrics2)
    ```

    ```
    # Accuracy graph
    plt.title('Accuracy During Training')
    plt.plot(history.history['val_acc'])
    plt.plot(history.history['acc'])
    plt.xlabel('Epoch')
    plt.ylabel('Accuracy')
    plt.legend(['Validation Accuracy','Training Accuracy'])
    plt.show()
    ```

    ```
    # Loss graph
    plt.plot(history.history['val_loss'])
    plt.plot(history.history['loss'])
    plt.title('Loss During Training')
    plt.xlabel('Epoch')
    plt.ylabel('Loss')
    plt.legend(['Validation Loss','Training Loss'])
    plt.show()
    ```

\
