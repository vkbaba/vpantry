---
title: "Kubernetes の試験まとめ"
date: "2021-05-06"
categories: 
  - "others"
tags: 
  - "kubernetes"
coverImage: "Screenshot_1.png"
---

ここ最近、オフの時間をKubernetes の資格勉強やその他色々な作業（主に名探偵コナンを見る作業）に当てておりブログの更新が止まっていた。ちょうど昨日CKS を受験し合格したので、これにてKubernetes 系の資格をコンプリートし、コナンも見終わったため、せっかくなのでKubernetes 系資格のまとめをしておこう。とはいえ試験範囲や受講前の準備などは他の情報源を見ていただくとして、本記事ではまだ情報の少ないCKS を中心に、こういうことを試験前に知っておいたら便利だろうなというTips を紹介する。

### どのように勉強するか？

自分の場合はCKA/CKAD/CKS いずれも[Killer Shell](https://blog.vpantry.net/posts/killer-shell/) で突破できた。CKS に関しては[Udemy](https://www.udemy.com/course/certified-kubernetes-security-specialist/) [のコース](https://www.udemy.com/course/certified-kubernetes-security-specialist/)を購入するとKiller Shell のコードが付いてくるので（そっちの方が値段的に大分お得）、初めに時間をかけて一通りKiller Shell の問題に取り組み、分からない部分を中心にUdemy でインプットする、という流れがよいと思う。なお、基礎が不安な場合は参考書などでインプットを先にておくべきだが、とにかくターミナルと格闘するアウトプットの試験なので、Kubernetes に触れる時間を増やした方がよい。

### 試験申し込みのタイミングは？

バウチャーを購入し、その後日程を調整するという流れになる。試験日程調整は直前でもかなり融通が利くので受けたいと思ったときに申し込めばよいが、早めに申し込むことで勉強のモチベーションを高めることができるだろう。

なお、1つのバウチャーに2回の受験資格が付与されるため、1回落ちても大丈夫。むしろ1回落ちて問題の感覚をつかむ気持ちで受けると楽だろう。

### vim で覚えておくべきコマンドは？

デジタルネイティブな我々若者にとってvim は正直苦痛でしかないのだが（冗談です）、ファイルを編集する最低限のコマンドに加えて（保存や終了の:q!、:wq!、挿入モードのi、undo のu、一行削除のdd など）、マニフェスト編集用の矩形選択+インデント（ctrl+v→>）は覚えておくとよい。

### 試験開始直後にすべきことは？

3つ実施する。最初に、.vimrc の設定を行う。vim を使いやすくしないとyaml の編集で手間取ることになる。人それぞれだが、自分は**set smarttab、set expandtab、set shiftwidth=2、set tabstop=2、set autoindent** の5つの設定を行っていた。暗記が面倒な場合は、ドキュメントでvimrc と検索すると、いくつか検索候補に上記設定が載っているので参考にしてほしい。

[https://kubernetes.io/search/?q=vimrc](https://kubernetes.io/search/?q=vimrc)

次に実施すべきはkubectl の設定で、エイリアスの設定とBash の自動補完の設定をすることで、キー入力の手間を削減する。こちらもkubectl インストールのドキュメントに方法が載っているので暗記する必要はない。

[https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/#enable-kubectl-autocompletion](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/#enable-kubectl-autocompletion)

最後にexec bash を叩いて、上記設定の有効化を忘れないこと。

### どこまでを暗記するか？

まず、マニフェストは暗記する必要はない。すべてドキュメントに載っているし、--dry-run=client -o yaml > manifest.yaml でマニフェストを出力できるためである（このあたりのテクニックは他の情報ソースに載っているのでそちらを参考にしてほしい）。また、VMware のドキュメントと異なり、 Search が大変イケているので、とりあえずリソース名で検索すれば何かしらのマニフェストは引っ掛かる。

そのうえで、Killer Shell などの問題を解きながら、Kuberentes のドキュメント検索を実際にすることで、「このマニフェストはここにあったなあ」という経験を積んでおくだけでよい。

また、試験で使う各種コマンドも基本的にはドキュメント、man コマンド、--help オプションなどで大体わかるので、いずれの試験でも本気で何かを暗記する必要はないが、PSP(PodSecurityPolicy) の問題だったら、ドキュメントで検索して、PSP のマニフェストを作って、PSP を使う(Cluster)Role 作って、(Cluster)RoleBinding でServiceAccount と紐づけて、Pod を作成、といったような典型的な問題の流れをある程度覚えておくと回答時に焦らなくてよい。

### 時間配分は？

自分は失敗ばかりなのであてにならないが、全部の問題には取り組むようにした方がよいだろう。なお、基本的に時間は足りないと思った方がよい。試験のターミナルから時間を正確に把握できないので（残り何分、という表示はされず、バーが動くだけで大雑把な時間しか分からず、また、CKS を受けた時はそのバーすら表示されず、いちいち試験監督に確認していた）調整が難しい。

### 巻き戻しできない問題について

CKAとCKS でやらかしたのだが、Pod の削除など、一部問題ではミスするとやり直しできない問題がある。削除系やクラスタ操作の問題は慎重に。また、削除系の問題なら、kubectl get xx -o yaml などで事前にバックアップを取っておくとよいかもしれない（再度apply してそれが採点的にOK なのかはわからないが）。

### どの試験から受ければよいの？

個人差があると思うが、CKAD<CKA<CKS  の順で難しかった。特にCKS は、問題数こそ少ないものの、それぞれの問題にかかる時間が長く難しかった。また、CKA/CKS はクラスタ操作系の巻き戻しできない問題もあり、慎重になる。そういった意味でも、初めてKubernetes の試験を受ける場合はCKAD から始めるとよいと思う。ついでに言うとCKS はCKA を持っていないと有効化されないので、CKAD→CKA→CKS の順番で受けるとよいだろう。

### CKS 勉強のコツは？

繰り返しになるがKiller Shell のみでよい。CKS 特有のApparmor やFalco、Trivy、OPA などもKiller Shell で触れる。NetworkPolicy など、CKA と被るような問題も範囲に含まれているため、下記ツールなどで作成の練習はしておくこと。

[https://editor.cilium.io/](https://editor.cilium.io/)

### まとめ

結論としては一言だけ。**Killer Shell を買おう！**

(2021/7/3 追記) Kubernetes の試験が値上げされ、その代わり？にKiller Shell がバウチャーに含まれるようになった。個別に買う必要はないだろう。

[https://training.linuxfoundation.org/announcements/linux-foundation-kubernetes-certifications-now-include-exam-simulator/](https://training.linuxfoundation.org/announcements/linux-foundation-kubernetes-certifications-now-include-exam-simulator/)
