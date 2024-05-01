---
title: "VirtualCluster のご紹介（VMware DevOps Meetup #6 ）"
date: "2020-10-30"
categories: 
  - "basic"
tags: 
  - "kubernetes"
coverImage: "Screenshot_4.png"
---

VMware DevOps Meetup #6 で登壇したときのスライドを置いておく。

https://speakerdeck.com/vkbaba/k8s-virtualcluster

[https://vmware.connpass.com/event/191455/](https://vmware.connpass.com/event/191455/)

内容としては、個人的に注目していたVirtualCluster という単一のKubernetes クラスタを複数のクラスタに分割するテクノロジーの紹介。肝はMaster Node のコンポーネント（の一部）をテナント毎に区切ったNamespace 内にデプロイするという点であり、API Server もテナント毎に用意されるため、テナントにアクセスするユーザーは自身のテナントのAPI Server にアクセスし、他テナントのAPI Server には関与しない。マルチテナンシーを実装するその仕組みはシンプルだが、テナント毎のetcd と、分割されるおおもと（資料中のSuper Master）のetcd の同期が非常に問題になってくるところで、残念ながら時間の関係上今回はその詳細まで立ち入らなかったが、いずれはきちんとキャッチアップしてまとめたい。
