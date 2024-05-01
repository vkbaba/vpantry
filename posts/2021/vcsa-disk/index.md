---
title: "vCenter Server Appliance のディスクサイズまとめ"
date: "2021-10-12"
categories: 
  - "tips"
tags: 
  - "vsphere"
coverImage: "Screenshot_1.png"
---

vCenter にはアプライアンスのサイズとストレージのサイズという2 種類のサイズがあり、アプライアンスは**Tiny、Small、Medium、Large、XLarge**、ストレージは**Default、Large、XLarge** と計15 種類のサイズに分かれる（以降、Tiny - Default のように、アプライアンスサイズ - ストレージサイズ、と記載する）。アプライアンスのサイズによってvCenter Server アプライアンスのCPU とメモリの容量は異なるが、ストレージ容量も異なる（Tiny - Default とXLarge - Default ではストレージ容量は異なる）。逆にストレージのサイズが異なったとしてもCPU やメモリ容量は同じである。

また、vCenter は16-17 のvmdk 仮想ディスクを保持していてそれぞれ役割や容量が異なり、vCenter のストレージを拡張する際は個別のvmdk 仮想ディスクサイズを拡張することになる。

ところが、ドキュメントに個別のディスク容量のサイズが記載されていなかったため、本記事では備忘録としてまとめた。単位はすべてGB。なお、各ディスクの用途については[コチラ](https://kb.vmware.com/s/article/78515)を参照。

これはvCenter 7.0U3 (Build 18700403) の情報であり、バージョンによって異なる場合があることに注意。特定のバージョンについて自分で調べる場合、都度デプロイする必要はなく、vCenter のiso に含まれるova ファイルを7zip 等で展開し、取り出したovf ファイルを見ればよい（単なるtar アーカイブなので）。

\[table id=3 responsive = "scroll"/\]

※1  
root パーティションはovf ファイルに情報がなかったため、Tiny - Default とXLarge - XLarge を実際にデプロイし、いずれも48.56GB であったことからサイズによって違いはないと想定し48.56 と記載した。

※2  
none (tmp) パーティションはovf ファイルに情報がなかったうえ、 Tiny - Default とXLarge - XLarge で微妙に差があった。Tiny - Default で4.98GB、XLarge - XLarge で6.31GB のため、この範囲で収まると想定し4.98 - 6.31 と記載した。

※3  
ディスク17 はlvm\_snapshot という名前が付いており、ovf ファイルにはサイズごとの容量が記載されているものの、 Tiny - Default ではvmdk が存在せず、 XLarge - XLarge では存在していた。詳細は不明。なお、デプロイ時にインストーラーで確認できるストレージ容量はlvm\_snapshot を含めた合計容量を出力している。

※4  
VAMI（5480 ポートで接続できるvCenter の管理UI）で見たディスク容量の値は表の値よりも若干低い。値からGiB とGB の単位の差ではないように見えるが、詳細は不明。
