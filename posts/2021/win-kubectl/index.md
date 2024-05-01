---
title: "Windows でkubectl のエイリアスを設定する"
date: "2021-11-02"
categories: 
  - "tips"
tags: 
  - "kubernetes"
coverImage: "kubectl-logo-medium.png"
---

備忘録として残しておく。Windows のPowershell でk get pod みたいなことをしたい時に使える。

```powershell
Import-Module PSKubectlCompletion  
Set-Alias k -Value kubectl  
Register-KubectlCompletion  
```

## 参考

[https://github.com/mziyabo/PSKubectlCompletion](https://github.com/mziyabo/PSKubectlCompletion)
