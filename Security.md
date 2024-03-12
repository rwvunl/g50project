# Security - Network policies

要求：
Configure Network Policies for the application. (2 points for each correct and useful network policy, with a maximum of 3 policies)

**==目前计划采用，默认拒绝所有入站流量，ingress 前端，前端到后端，三个policy==**

## 1. 默认拒绝所有入站流量（Default Deny All Ingress Traffic）

这个策略的目的是默认拒绝向所有 Pod 的所有入站流量，除非显式允许。这是一个起点策略，确保只有定义了明确访问规则的流量可以到达 Pod。

web-deny-all.yaml

````yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all-ingress
  namespace: your-namespace
spec:
  podSelector: {}
  policyTypes:
  - Ingress

````



## 2. 默认拒绝所有出站流量（Default Deny All Egress Traffic）

与入站策略相似，这个策略默认拒绝所有 Pod 的所有出站流量。这可以防止应用组件与未经授权的外部服务或其他 Pod 通信，减少潜在的数据泄露或恶意活动。

foo-deny-egress.yaml

````yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all-egress
  namespace: your-namespace
spec:
  podSelector: {}
  policyTypes:
  - Egress
````

## 3.允许特定应用间的通信

在设置了默认的拒绝规则后，你需要为特定的服务之间允许必要的通信。例如，如果你的前端服务需要访问后端 API，你可以定义一个网络策略来仅允许这种特定的流量。

front-back-end.yaml

```
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-frontend-to-backend
  namespace: your-namespace
spec:
  podSelector:
    matchLabels:
      app: backend
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend
    ports:
    - protocol: TCP
      port: 80
```

## 4. network policy 三合一

````yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all-ingress
  namespace: your-namespace
spec:
  podSelector: {}
  policyTypes:
  - Ingress
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all-egress
  namespace: your-namespace
spec:
  podSelector: {}
  policyTypes:
  - Egress
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-specific-communication
  namespace: your-namespace
spec:
  podSelector:
    matchLabels:
      app: backend
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend
    ports:
    - protocol: TCP
      port: 80
  policyTypes:
  - Ingress
````



## 5. ingress 前端

````yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-external-to-frontend
  namespace: your-namespace
spec:
  podSelector:
    matchLabels:
      app: frontend
  policyTypes:
  - Ingress
  ingress:
  - ports:
    - protocol: TCP
      port: 80
````

## 6. 前端到后端

````yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-external-to-backend
  namespace: your-namespace
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
  - Ingress
  ingress:
  - ports:
    - protocol: TCP
      port: 8080
````

## 7. 后端输出

````yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-backend-egress-to-external-api
  namespace: your-namespace
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
  - Egress
  egress:
  - to:
    - ipBlock:
        cidr: 0.0.0.0/0
    ports:
    - protocol: TCP
      port: 443
````







# RBAC

要求:
Configure Role Based Access Control for the application. (2 points for each correct and useful role, with a maximum of 3 roles)

==此部分采用GKE，建立observer，developer，admin三个role，相关流程参考视频。==

## 1. 创建新user

### 1. 查本集群API 地址

````bash
sudo microk8s kubectl config view --minify | grep server
````

### 2. 创建新用户

~~~powershell
# 1) Creating custom Service Account创建新账号
microk8s kubectl apply -f - <<EOF
apiVersion: v1
kind: ServiceAccount
metadata:
 name: my-service-account
EOF

#查看账号信息
microk8s kubectl describe sa my-service-account

microk8s kubectl describe secret my-service-account-token-gcrz5
~~~

### 开启rbac

````bash
sudo microk8s enable rbac
````

# GKE方法 

## 新建用户

教程：
[RBAC in Google Kubernetes Engine (youtube.com)](https://www.youtube.com/watch?v=OYoDzjXbvlA&list=PLBRBRV08tHh21k417YR04lZQdlTiqiaOJ&index=10)

## 配置clusterRole

### pod-reader-role.yaml

````yaml
kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1
metadata:
 name: pod-reader
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "list"]
````

`get`操作意味着可以查询单个Pod的具体信息，而`list`操作则允许查询所有Pods的列表信息，这可以用于监控和查看Pods的状态或进行其他读取操作。这种角色通常用于给予用户或系统组件查看Pod信息的权限，但不允许修改或执行其他更高权限的操作。

### pod-reader-binding

这一部分需要修改的就是name，service账号是什么，就修改什么

````yaml
kind: ClusterRoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
 name: pod-reader-binding
subjects:
- kind: User
  name: dev1-597@firm-solution-410709.iam.gserviceaccount.com
  namespace: default
roleRef:
  kind: ClusterRole
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io
````

### 登录账号

```bash
gcloud auth activate-service-account SERVICE_ACCOUNT@DOMAIN.COM --key-file=/path/key.json --project=PROJECT_ID
```

````bash
gcloud auth activate-service-account dev1-597@firm-solution-410709.iam.gserviceaccount.com --key-file=E:\download\edgeDownload\firm-solution-410709-4cd82d0fb9b4.json --project=firm-solution-410709
````

### 查看当前账户

````bash
gcloud auth list
gcloud config set account `ACCOUNT`
gcloud config get-value account
````

### observer-role.yaml

观察者角色允许用户查看基本的Kubernetes资源，适用于需要监控和了解应用状态但不进行更改的用户。

````yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: your-namespace
  name: observer
rules:
- apiGroups: [""]
  resources: ["pods", "services", "configmaps", "secrets", "persistentvolumeclaims"]
  verbs: ["get", "list", "watch"]
````

### observer-role-binding.yaml

````yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: observer-role-binding
  namespace: your-namespace
subjects:
- kind: User
  name: "your-username"
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: observer
  apiGroup: rbac.authorization.k8s.io
````

### developer-role.yaml

开发者角色允许用户对核心资源进行创建、更新和删除操作，适用于需要部署和管理应用组件的开发者。

````yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: your-namespace
  name: developer
rules:
- apiGroups: [""]
  resources: ["pods", "services", "configmaps", "persistentvolumeclaims"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
````

### developer-role-binding.yaml

````yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: developer-role-binding
  namespace: your-namespace
subjects:
- kind: User
  name: "your-username"
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: developer
  apiGroup: rbac.authorization.k8s.io
````



### admin-role.yaml

管理员角色提供了对命名空间内几乎所有资源的完全访问权限，适用于需要全面控制应用和环境的用户。

````yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: your-namespace
  name: admin
rules:
- apiGroups: [""]
  resources: ["*"]
  verbs: ["*"]
````

### admin-role-binding.yaml

````yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: admin-role-binding
  namespace: your-namespace
subjects:
- kind: User
  name: "your-username"
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: admin
  apiGroup: rbac.authorization.k8s.io
````

