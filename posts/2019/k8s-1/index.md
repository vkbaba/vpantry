---
title: "はじめに - VMware ユーザーがKubernetes を勉強する1"
date: "2019-12-11"
categories: 
  - "basic"
tags: 
  - "kubernetes"
coverImage: "prJPJ45328619-F-1.png"
---

- [](https://blog.vpantry.net/posts/k8s-1)[はじめに - VMware ユーザーが Kubernetes を勉強する 1](https://blog.vpantry.net/posts/k8s-1)
- [](https://blog.vpantry.net/posts/k8s-2)[コンテナの基礎 - VMware ユーザーが Kubernetes を勉強する 2](https://blog.vpantry.net/posts/k8s-2)
- [](https://blog.vpantry.net/posts/k8s-3)[Docker の学習を効率化するTips – VMware ユーザーがKubernetes を勉強する 3](https://blog.vpantry.net/posts/2020/01/k8s-3/)
- [](https://blog.vpantry.net/posts/k8s-4)[Kubernetes の概要 – VMware ユーザーがKubernetes を勉強する 4](https://blog.vpantry.net/posts/2020/03/k8s-4/)
- [](https://blog.vpantry.net/posts/k8s-5)[Kubernetes アーキテクチャの基本– VMware ユーザーがKubernetes を勉強する 5](https://blog.vpantry.net/posts/2020/05/k8s-5/)
- [](https://blog.vpantry.net/posts/k8s-6)[Kubernetes のネットワーク 前編 – VMware ユーザーがKubernetes を勉強する 6](https://blog.vpantry.net/posts/2020/05/k8s-6-1)
- [](https://blog.vpantry.net/posts/k8s-7)[Kubernetes のネットワーク 後編 – VMware ユーザーがKubernetes を勉強する 7](https://blog.vpantry.net/posts/2020/07/k8s-7/)

Kubernetes はコンテナオーケストレーションツールとして確固たる地位を築いたが、**そもそも使いこなせるのか？移り変わりの早いこの世界でOpenstack みたいにアレな感じにならないのか？コンテナですらまだ先の世界ではないのか？**と様々な疑念が頭をよぎり、正直なところ自分自身そこに力を本気で入れようとは思ってこなかった。しかしながら、VMware 自身大きな投資をしていること、そして何と言っても**シンプルに面白い**！ハードウェアに密接に結びつくカーネルも面白いが、ユーザランドで動かすインフラも案外楽しいし、Kubernetes に関しては芸術的とさえ思える。

という個人的な考えで本気で取り組もうと決意したが、同じようにKubernetes の勉強を始めるであろうVMware vSphere ユーザーが増えてくるだろうから、少しでもそういった方々に役立つよう、VMware ユーザーの視点からまとめてみる。

### Kubernetes （k8s）とは

コンテナをよしなに管理してくれるありがたいツールのこと。コンテナと言えばDocker が有名だが、そもそもdocker とはコンテナを簡単に使うためのものであり、実際に本番環境として使用するのであれば、docker だけでは不十分である。例えば、可用性、ネットワーク、負荷分散……そこでk8s のような、コンテナを管理するためのツールが登場した。それがk8s である。VMware 的に言えば、ESXi とvCenter Server の関係に近いだろうか。

とはいえ、Docker 社自体もそういったオーケストレーションツールの必要性は認識しており、自前で[Docker Swarm](http://docs.docker.jp/swarm/overview.html) なるものを出してはいるものの、k8s がこの世界では事実上のデファクトとなった。

### 日本でそもそもコンテナは流行るのか？

コンテナの技術的な説明は本ブログの第2 回で書くとして、ここでは実際にVMware ユーザーである私がコンテナを使って感じたメリット/デメリットをまとめてみる。

私が感じたコンテナのメリットは下記の3 つである。

- 起動が圧倒的に速い  
    一番のメリットはこれか。仮想マシンと異なり、 OS が既に立ち上がっているため、 仮想BIOS やブートローダーという概念がなく、あたかもアプリを1 つ起動するかのようにコンテナを作ることができる。
- クリーンな環境を簡単に用意できる  
    テスト用に汚れていないクリーンな環境をコマンド1 つで用意できるのは嬉しい。
- 既に準備されたイメージを利用することで環境作成が簡単になる  
    インフラ担当者的には是非このメリットを享受していただきたい。特に検証環境を作成する時は、1 つ自前でLinux OS を持っていると、そのうえで多種多様な機能をイメージとしてコマンド1 つで持ってこれる。いちいちOS をクローンしてyum なりapt-get なりする必要はない。例えばRADIUS サーバーが必要になった時でも、Docker の使い方が分かっていれば、docker hub から取ってこれる。

もちろんデメリットもある。

- スキルセットを揃える必要がある  
    コンテナもk8s も新しい概念で勉強が大変だし仮想マシンで十分な場面も多い。
- セキュリティ的に結構不安になってくる  
    よくコンテナはセキュリティが云々言われるが、実際これは強く感じる。コンテナ自身のカーネルを共有するという特徴もあるが、とりわけ自分はイメージのダウンロード時に、これホントに使って大丈夫なの？と結構不安になる。実際ダメなものも多い。
- 取ってきたイメージは何も入っていないのでトラシュに時間がかかる  
    **ping できねー！vi ができねー！**…あるあるだと思う。コンテナの中でインストールしてもいいし、docker cp でbusybox の中をコピーしてもいいが、そもそもコンテナはステートレスであるべきだし、そのような使い方がメインなのであれば、それは仮想マシンであるべき。
- インフラ担当的にはテンプレートからのクローンやスナップショットで済むことが多い  
    テンプレートやスナップショット、便利！

いくつかのメリットはあるものの、実際仮想マシンで済む場面が多く、今年の時点で日本で本番環境で使用している割合は僅か9%だ。

<figure>

![](https://www.idc.com/getfile.dyn?containerId=prJPJ45328619&attachmentId=47352751)

<figcaption>

[https://www.idc.com/getdoc.jsp?containerId=prJPJ45328619](https://www.idc.com/getdoc.jsp?containerId=prJPJ45328619) より引用

</figcaption>

</figure>

……とはいうものの、情報収集や検証段階にあるユーザーは着々と増えており、ブートせずにコマンド1 つでLinux 環境を作成できるというのは、とりわけ開発者にとっては大きなメリットであろう。まだまだ、日本で確実に流行るか？と言われると、コンテナですらこのような状況なので、k8s を本番環境で使い始めるユーザーが増えるのは当分先であろう。

### グローバルでは？

例えばこんな記事がある。

> 2022年までにグローバルで新しく開発されるアプリの90％はマイクロサービスアーキテクチャを採用し、本番稼働しているアプリの35％はクラウドネイティブになる見込みだという。
> 
> [https://www.itmedia.co.jp/news/articles/1912/05/news047.html](https://www.itmedia.co.jp/news/articles/1912/05/news047.html)

クラウドネイティブというとバズワードみたいな感じではあるが、要するに従来通り、仮想マシンを作成してOS をインストールしてそのうえでアプリケーションを稼働させ……といった感じで設計するのではなく、コンテナやAWS といった技術の利用を前提にアプリケーションを作るということである。

とはいえ、ではグローバルだとKubernetes みんな使えるぜ！というわけでもないようだ。例えばカナダのオタワの事例は面白い。k8s を導入するにあたり、社内政治的にも色々苦労したようだ。

<figure>

https://www.youtube.com/watch?v=oBuOf-IvHWQ

<figcaption>

[https://www.youtube.com/watch?v=oBuOf-IvHWQ](https://www.youtube.com/watch?v=oBuOf-IvHWQ)

</figcaption>



</figure>

日本だと、最近ははてなの撤退事例が印象に残る。

> Kubernetesに関するドキュメントやプラクティスがあるため、Kubernetesクラスタの構築には壁を感じないが、正しく運用するという点では高い壁があると感じている。システムに関するドキュメントを充実させるのは必須で、クラスタ運用が軌道に乗るまでは、ベストプラクティスや最新情報をキャッチアップできるKubernetes専任エンジニアが2人以上は欲しい
> 
> [https://www.atmarkit.co.jp/ait/articles/1911/08/news009.html](https://www.atmarkit.co.jp/ait/articles/1911/08/news009.html)

IT エンジニアの不足が深刻な中、わざわざk8s に移行したとしても、バラ色の未来は必ずしも待っていない、ということだ。

### まとめ

正直なところ、 私はk8s に関して言えば、しばらくの間日本で流行るとは思っていない。とはいえ、廃れるとも思っていない。徐々に徐々に浸透してくると思う。 それに加え、**k8s は面白い**。SE 的には技術的に面白いので、それでいいのである。 誰かが**k8s はLinux みたいなものだ**、と言っていたが、そうであれば面白いはずなのだ。

というわけで、次回はk8s の前に、コンテナという概念を改めて技術的に整理する。
