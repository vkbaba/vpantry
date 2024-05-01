---
title: "devbox で構築する開発環境"
date: "2022-12-24"
categories: 
  - "basic"
tags: 
  - "others"
coverImage: "Screenshot_27-1.png"
---

itmedia で以下のような記事を見つけ、面白そうだったので色々調べてみました。

> **ローカル環境を汚さず、Dockerコンテナのオーバーヘッドもなし　開発環境を自在に構築できる「Devbox 0.2.0」登場**
> 
> [https://www.itmedia.co.jp/news/articles/2212/23/news095.html](https://www.itmedia.co.jp/news/articles/2212/23/news095.html)

devbox はコンテナとは全く異なり、Nix というパッケージ管理システムをベースに作られています。パッケージ管理システムと言えばapt やyum などが代表的ですが、Nix は少し特殊で、それらが抱える依存性にまつわる問題（自分の環境では動いたのに他の環境では動かない）などを解消するために開発されました（このパッケージ管理システムNix をベースに作成されたOS がNixOS です）。

百聞は一見に如かず、まずはNix を試してみましょう。

Nix のインストールは下記の通りです。Multi-user installation を選択します。

[https://nixos.org/download.html](https://nixos.org/download.html)

インストールが完了したら、下記の通りhello world を試します。

[https://nixos.org/guides/ad-hoc-developer-environments.html](https://nixos.org/guides/ad-hoc-developer-environments.html)

```
[root@localhost ~]# hello
bash: hello: command not found...
[root@localhost ~]# nix-shell -p hello

[nix-shell:~]# hello
Hello, world!

[nix-shell:~]# exit
exit
[root@localhost ~]# 
```

hello コマンドは通常実行できませんが、nix-shell -p hello コマンドでhello コマンドが実行できるコンテナのような感じの環境ができあがっています。もう少し色々調べてみます。

```
[root@localhost nix-test]# hostname
localhost.localdomain
[root@localhost ~]# mkdir nix-test
[root@localhost ~]# touch nix-test/somefile
[root@localhost ~]# cd nix-test/
[root@localhost nix-test]# nix-shell -p hello
[nix-shell:~/nix-test]# hostname
localhost.localdomain
[nix-shell:~/nix-test]# ls
somefile
```

つまり、Nix ではコンテナとは異なりファイルシステムや名前空間の分離は行われていません。したがって、例えばコンテナのようにIP アドレスがホストと異なったり、 ホストだとcurl できるのにコンテナの中ではcurl ができなかったり……といったようなことはありません。nix-shell を立ち上げた時、あくまでもホストのシェル上で種々のコマンドが実行されます。異なるのはアプリケーションパッケージです。アプリケーションパッケージを-p オプション（ここではhello）で追加しましたが、ここで追加したパッケージは/nix/store/ 以下に配置され、nix-shell では/nix/store/ 以下のバイナリが呼び出されます。

```
[nix-shell:~/nix-test]# which hello
/nix/store/33l4p0pn0mybmqzaxfkpppyh7vx1c74p-hello-2.12.1/bin/hello
```

ホストOS で既にインストールされているアプリケーションの場合も同様です。

```
[root@localhost nix-test]# which git
/bin/git
[root@localhost nix-test]# git version
git version 2.27.0
[root@localhost nix-test]# nix-shell -p gitMinimal
[nix-shell:~/nix-test]# which git
/nix/store/qv2hdqrdkj943ry7399qyc0dbi8irnnj-git-minimal-2.38.1/bin/git
[nix-shell:~/nix-test]# git version
git version 2.38.1
```

nix-shell 上では特定のアプリケーションの呼び出しの際に、/nix/store/ 以下のバイナリを使うよう自動的にフックされる、というわけです。

Nix で使うパッケージは先の/nix/store/ 以下に保存されますが、それらはバージョンごとに厳密に異なります。つまり、/nix/store/ 以下では複数のバージョン（例えばgit 2.38.1 とgit 2.38.2）が共存でき、それらは全く異なる一意の識別値を名前に含むディレクトリに保存されます（例えばqv2hdqrdkj943ry7399qyc0dbi8irnnj-git-minimal-2.38.1）。nix-shell ではそれらの違いが意識され使い分けることができるため、異なるバージョンが共存したとしても問題が発生しません。

Nix について詳しく知りたい方は下記の動画がとても参考になります（Deep Dive と言いながら基本的な内容が分かりやすくまとめられています）。

https://www.youtube.com/watch?v=TsZte\_9GfPE

Nix の話はここまでにして、本題であるdevbox に話を戻しましょう。devbox はNix をベースとしていますが、コンテナのようにより開発者にとって使いやすい様々な機能を追加しています（繰り返しではありますがコンテナとは全く異なります）。

これも百聞は一見に如かず、触ってみましょう。

インストール方法は下記の通りです。

[https://www.jetpack.io/devbox/docs/installing\_devbox/](https://www.jetpack.io/devbox/docs/installing_devbox/)

チュートリアルとしてpython の実行環境を作成します。

[https://www.jetpack.io/devbox/docs/quickstart/](https://www.jetpack.io/devbox/docs/quickstart/)

```
[root@localhost ~]# mkdir devbox-test
[root@localhost ~]# cd devbox-test/
[root@localhost devbox-test]# devbox init
[root@localhost devbox-test]# cat devbox.json 
{
  "packages": [],
  "shell": {
    "init_hook": null
  },
  "nixpkgs": {
    "commit": "52e3e80afff4b16ccb7c52e9f0f5220552f03d04"
  }
}
[root@localhost devbox-test]# devbox add python310
Installing nix packages. This may take a while... done.

python NOTES:
python on devbox works best when used with a virtual environment (vent, virtualenv, etc). For example with python3:

> python -m venv .venv
> source .venv/bin/activate

Package managers like poetry (https://python-poetry.org/) automatically create virtual environments for you.

To show this information, run `devbox info python310`

python310 (python3-3.10.8) is now installed.
[root@localhost devbox-test]# cat devbox.json 
{
  "packages": [
    "python310"
  ],
  "shell": {
    "init_hook": null
  },
  "nixpkgs": {
    "commit": "52e3e80afff4b16ccb7c52e9f0f5220552f03d04"
  }
}
[root@localhost devbox-test]# devbox shell
Installing nix packages. This may take a while... done.
Starting a devbox shell...
(devbox) [root@localhost devbox-test]# python --version
Python 3.10.8
```

コマンドは違えど、Nix とやっていることはほぼ同じです。ただ、devbox ではdevbox.json というdevbox shell で利用するパッケージが記載されたファイルをdevbox init で作成し、また、.devbox 以下に/nix/store/ へのシンボリックリンクが張られます。

```
[root@localhost devbox-test]# tree -a
.
├── .devbox
│   ├── gen
│   │   ├── development.nix
│   │   └── shell.nix
│   ├── .gitignore
│   ├── nix
│   │   └── profile
│   │       ├── default -> default-1-link
│   │       └── default-1-link -> /nix/store/f2q730h2abywg8qln5fdndrd76xydl1p-user-environment
│   ├── shell_history
│   └── virtenv
│       └── python310
│           └── env
└── devbox.json

8 directories, 6 files
```

環境の可搬性という意味では、devbox が使える環境であれば、devbox.json を渡せば同じ環境を立ち上げることができます（Nix のおかげでバージョンの互換性が厳密に保たれた状態で）。

ただし、コンテナのように名前空間を分離するわけではないので（分離するのはあくまでもアプリケーションバイナリ）、例えばNginx などでWeb サーバーを建てた時には、ポートフォワードもいらず、そのままlocalhost:80 ポートでアクセスします。

```
[root@localhost ~]# mkdir devbox-nginx
[root@localhost ~]# cd devbox-nginx/
[root@localhost devbox-nginx]# devbox add nginx

Error: No devbox.json found in this directory, or any parent directories. Did you run `devbox init` yet?

[root@localhost devbox-nginx]# devbox init
[root@localhost devbox-nginx]# devbox add nginx
Installing nix packages. This may take a while... done.

nginx NOTES:
nginx can be configured with env variables

To customize:
* Use $NGINX_CONFDIR to change the configuration directory
* Use $NGINX_LOGDIR to change the log directory
* Use $NGINX_PIDDIR to change the pid directory
* Use $NGINX_RUNDIR to change the run directory
* Use $NGINX_SITESDIR to change the sites directory
* Use $NGINX_TMPDIR to change the tmp directory. Use $NGINX_USER to change the user
* Use $NGINX_GROUP to customize.

Services:
* nginx

Use `devbox services start|stop [service]` to interact with services

This plugin creates the following helper files:
* /root/devbox-nginx/devbox.d/nginx/nginx.conf
* /root/devbox-nginx/devbox.d/nginx/fastcgi.conf
* /root/devbox-nginx/devbox.d/web/index.html

This plugin sets the following environment variables:
* NGINX_PATH_PREFIX=/root/devbox-nginx/.devbox/virtenv/nginx
* NGINX_TMPDIR=/root/devbox-nginx/.devbox/virtenv/nginx/temp
* NGINX_CONFDIR=/root/devbox-nginx/devbox.d/nginx/nginx.conf

To show this information, run `devbox info nginx`

nginx (nginx-1.22.1) is now installed.
[root@localhost devbox-nginx]# vim /root/devbox-nginx/devbox.d/nginx/nginx.conf # add "user root;" to the first line if you are root.
[root@localhost devbox-nginx]# devbox services start nginx
Installing nix packages. This may take a while... done.
Starting a devbox shell...
Service "nginx" started
[root@localhost devbox-nginx]# curl localhost:8080
curl: (7) Failed to connect to localhost port 8080: Connection refused
[root@localhost devbox-nginx]# curl localhost:80
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Hello World!</title>
  </head>
  <body>
    Hello World!
  </body>
</html>
```

root ユーザーの場合はdevbox.d/nginx/nginx.conf の一行目に"user root;" を追加し、それ以外の場合はlisten ポートを80 から8080 に変更してください。

devbox 0.2.0 ではdevbox generate コマンドによるDockerfile の作成にも対応しています。生成されたDockerfile の中身を見ると、alpine にdevbox がインストールされた後、devbox コマンドでdevbox.json 記載のパッケージがインストールされていくようです。

```dockerfile
FROM alpine:3

# Setting up devbox user
ENV DEVBOX_USER=devbox
RUN adduser -h /home/$DEVBOX_USER -D -s /bin/bash $DEVBOX_USER
RUN addgroup sudo
RUN addgroup $DEVBOX_USER sudo
RUN echo " $DEVBOX_USER      ALL=(ALL:ALL) NOPASSWD: ALL" >> /etc/sudoers

# installing dependencies
RUN apk add --no-cache bash binutils git libstdc++ xz sudo

USER $DEVBOX_USER

# installing devbox
RUN wget --quiet --output-document=/dev/stdout https://get.jetpack.io/devbox | bash -s -- -f
RUN chown -R "${DEVBOX_USER}:${DEVBOX_USER}" /usr/local/bin/devbox

# nix installer script
RUN wget --quiet --output-document=/dev/stdout https://nixos.org/nix/install | sh -s -- --no-daemon
RUN . ~/.nix-profile/etc/profile.d/nix.sh
# updating PATH
ENV PATH="/home/${DEVBOX_USER}/.nix-profile/bin:/home/${DEVBOX_USER}/.devbox/nix/profile/default/bin:${PATH}"

WORKDIR /code
COPY devbox.json devbox.json
RUN devbox shell -- echo "Installing packages"
ENTRYPOINT ["devbox"]
CMD ['shell']

```

ちなみに、インストールするパッケージは下記から取得できます。単純なものであればいいのですが、バージョンごとに名前が異なるので、特定のパッケージを探すのに結構苦労します。

[https://search.nixos.org/packages](https://search.nixos.org/packages)
