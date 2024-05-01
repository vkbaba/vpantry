---
title: "vSphere 6.7 でISO ファイルのアップロードが失敗する"
date: "2019-07-06"
categories: 
  - "tips"
tags: 
  - "vsphere"
coverImage: "image-10.png"
---

vSphere 6.5 以降の環境でISO ファイルをデータストアにアップロードしようとすると、下記のようなエラーが発生する。

> _不明な理由で操作が失敗しました。通常この問題は、ブラウザが証明書を信頼できない場合に発生します。自己署名証明書またはカスタム証明書を使用している場合は、下記のURL を新しいブラウザタブで開いて証明書を受け入れてから、操作を再試行してください。_

[![](images/certerror.png)](images/certerror.png)

正攻法で行くと下記kb に従い証明書関連の手続きが必要になるが面倒。[https://kb.vmware.com/s/article/2108294](https://kb.vmware.com/s/article/2108294)

## 解決策

コンテンツライブラリを使う。

https://docs.vmware.com/jp/VMware-vSphere/6.7/com.vmware.vsphere.vm\_admin.doc/GUID-254B2CE8-20A8-43F0-90E8-3F6776C2C896.html

コンテンツライブラリを使うことで、vCenter Server 間での各種ファイルの共有が簡単になる。 単純なISO ファイルのアップロードであれば、わざわざコンテンツライブラリを使うメリットはないように思えるが、なぜかこの方法でアップロードした場合、上記のようなエラーを回避できる。理由は分かりません。
