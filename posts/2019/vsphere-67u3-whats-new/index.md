---
title: "vSphere 6.7 U3 What's New"
date: "2019-08-19"
categories: 
  - "whats-new"
tags: 
  - "vsphere"
coverImage: "Screenshot_1.png"
---

[まだGA されていないがブログでアナウンスされていたので](https://blogs.vmware.com/vsphere/2019/08/announcing-vsphere-6-7-update-3.html)、情報の共有。vSAN 6.7 U3 も今週中にまとめる。

### マルチvGPU のサポート

1 仮想マシンあたり最大4 のvGPU をサポートするとのこと。ちなみに2 つ以上のvGPU を仮想マシンに接続しboot するとドライバがロードされず警告文も出るとか。

> Using the current VMware vCenter user interface, it is possible to configure a VM with more than one vGPU device. When booted, the VM boots in VMware SVGA mode and doesn’t load the NVIDIA driver. The additional vGPU devices are present in Windows Device Manager but display a warning sign, and the following device status:  
> Windows has stopped this device because it has reported problems. (Code 43)
> 
> [https://docs.nvidia.com/grid/latest/grid-vgpu-release-notes-vmware-vsphere/index.html#bug-no-id-vm-multiple-vgpus-fail-to-initialize-vgpu](https://docs.nvidia.com/grid/latest/grid-vgpu-release-notes-vmware-vsphere/index.html#bug-no-id-vm-multiple-vgpus-fail-to-initialize-vgpu)

### AMD EPYC™ Generation 2 のサポート

EPYC 2nd Gen については[コチラ](https://www.amd.com/en/press-releases/2019-08-07-2nd-gen-amd-epyc-processors-set-new-standard-for-the-modern-datacenter)。

### vCenter Server のPNID 変更のサポート

地味ながらも嬉しい（？）新機能。VAMI（vCenter のURL:5480 でアクセス）からvCenter Server インストール時に設定したシステム名（通常FQDN）を変更できる。どんな時に使うの？と言われそうだが、例えばvcsa67u1.mycompany.local といったようなFQDN をvCenter Server につけてしまった場合に、vSphere 6.7 U3 にアップデートする場合FQDN が引き継がれてしまい、バージョンアップ後もvcsa67u1.mycompany.local を使い続けなければならないのでカッコ悪い。これを後からvcsa67u3.mycompany.local に変更できるというわけだ（尤も、バージョン名をFQDN につけるなと言われればそれまだだが）。ただし、こちらの機能を使用するにはいくつか要件があるので注意。

- PSC は組み込みであること
- FQDN 変更前のvCenter Server のFQDN で接続されている各製品群は全て変更前にvCenter Server の登録を解除しておくこと  
    _これNSX とかどうなるんだろう？vCenter Server 障害扱いになる感じかな…？_
- 拡張リンクモードの場合、対象のvCenter Server ノードはSSO ドメインから[CMSSO -UTIL](https://kb.vmware.com/s/article/2106736) を使用して一時的に外し、FQDN 変更後再び追加
- vCenter HA 構成は事前に解除しておくこと
- カスタム証明書を再生成
- ハイブリッドリンクモード（VMC on AWS との接続）の再設定
- FQDN 変更後のvCenter Server をAD に再追加
- 新しいFQDN を正しくDNS サーバーに登録しておくこと
- なんかおかしかったらリストア！（事前にバックアップをとっておくこと）

### Dynamic DNS のサポート

DHCP サーバーを利用してvCenter Server をデプロイした場合に、IP アドレスの変更に追随し、DNS サーバーに自動的にその新しいIP が登録される。DHCP でデプロイするケース自体は少ないと思われるが、多くのvCenter Server をデプロイするクラウドプロバイダーにとっては良い機能かも。

### ドライバの機能拡張

VMXNET3 において、チェックサムの計算をVMXNET 側にオフロードできる機能と、UDP/ESP（ESP はおそらくIP Encapsulating Security Payload） のRSS（Receive-Side Scaling）のサポートがされたとのこと。

## まとめ

正直、あまり機能追加としては目ぼしいものがない。今年のvmworld でのアナウンスに期待する。
