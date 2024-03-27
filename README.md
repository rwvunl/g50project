# Project for Software Containerization 2024

---

## Pre-requisites

- ### Load Balancer

  ```
  kubectl apply -f frontend-deployment.yaml
  ```

- ### Storage Class

  ```
  gcloud compute disks create my-disk --size=10GB --zone=us-central1-c
  kubectl apply -f mysql-deployment.yaml
  ```

- ### image Registry

  ```
  
  ```

- ### certificates

  ```
  kubectl apply -f tls-secret.yaml
  kubectl apply -f ingress.yaml
  ```

- ### roles

  ```
  kubectl apply -f admin-role-binding.yaml
  kubectl apply -f admin-role.yaml
  kubectl apply -f developer-role-binding.yaml
  kubectl apply -f developer-role.yaml
  kubectl apply -f observer-role-binding.yaml
  kubectl apply -f observer-role.yaml
  ```

- ### network policies

  ```
  kubectl apply -f network-policy-allow-backend-to-mysql.yaml
  kubectl apply -f network-policy-allow-external-to-frontend-whitelist.yaml
  kubectl apply -f network-policy-allow-external-to-frontend.yaml
  kubectl apply -f network-policy-allow-frontend-to-backend-only.yaml
  kubectl apply -f network-policy-default-deny-all-ingress.yamlz
  kubectl apply -f network-policy-deny-specific-ips-to-frontend.yaml
  ```



---

## Commands for Helm

- ### Generating the Chart: 

  Create a helm chart for the user management platform:

  ```
  helm create umpchart
  ```

  Then modify the yaml files in /templates

  

- ### Installing with the Chart:

  Firstly, check chart files with:

  ```
  helm template .
  ```

  If the format is good, then install the chart:

  ```
  helm install umpchart .
  ```

  To check helm status, use:

  ```
  helm list
  ```

  

- ### Horizontal scaling

  Set `hpa.enabled` to true first. Then scale up frontend or backend (here they're both scaled to 3 replicas):

  ```
  helm upgrade umpchart . --set hpa.enabled=true --set frontend.hpa_minReplicas=3 --set frontend.hpa_maxReplicas=3 --set backend.hpa_minReplicas=3 --set backend.hpa_maxReplicas=3
  ```

  

- ### Upgrading an image with the Chart:

  - Rolling upgrade: use helm upgrade and set `imagetag` since rolling upgrade is the default upgrading strategy

    ```
    helm upgrade umpchart . --set frontend.imagetag=frontend0317a
    ```

  - Canary upgrade: Set `frontend.canary.imagetag` to the new value. Then set `canary.enabled` to true and set the replica numbers for the canary version and old version; increase the number of canary replicas and decrease the number of original replicas, finally set the original replica number to 0.

    ```
    helm upgrade umpchart . --set canary.enabled=true --set frontend.canary.replicas=1 --set frontend.replicas=5
    helm upgrade umpchart . --set canary.enabled=true --set frontend.canary.replicas=3 --set frontend.replicas=3
    helm upgrade umpchart . --set canary.enabled=true --set frontend.canary.replicas=6 --set frontend.replicas=0
    ```

    

- ### Uninstalling with the Chart:

  ```
  helm uninstall umpchart
  ```
