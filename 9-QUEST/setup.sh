#!/usr/bin/env bash

# add repo
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# start stack with custom values
helm upgrade --install monitoring prometheus-community/kube-prometheus-stack -f monitoring-values.yaml --namespace monitoring --create-namespace

# Port forwarding
#kubectl port-forward -n monitoring svc/monitoring-grafana 3000:80
