# Playbook Tasks

```json
{
  "name": "ELK Playbook",
  "hosts": "all",
  "vars": "vars.json",
  "gather_facts": "yes",
  "tasks": "tasks.json"
}
```
| Tasks | Tags |
| ----- | ---- |
|[Set playbook facts](tasks/assign-playbook-facts.json)|assign, playbook, facts|
|[Delete curator directories](tasks/delete-curator-dirs.json)|delete, curator, dirs|
|[Delete elastic search directories](tasks/delete-elasticsearch-dirs.json)|delete, elasticsearch, dirs|
|[Delete kibana directories](tasks/delete-kibana-dirs.json)|delete, kibana, dirs|
|[Delete winlog beat directories](tasks/delete-winlog-beat-dirs.json)|delete, winlog-beat, dirs|
|[Delete Xpack Client Plugin directories](tasks/delete-xpack-client-plugin-dirs.json)|delete, xpack-client-plugin, dirs|
|[Create logstash directories](tasks/create-logstash-dirs.json)|create, logstash, dirs|
|[Delete LMA service directories](tasks/delete-lma-service-dirs.json)|delete, lma-service, dirs|
|[Delete LMA REST log ingestion directories](tasks/delete-lma-rest-log-ingestion-dirs.json)|delete, lma-rest-log-ingestion, dirs|
|[Delete all directories](tasks/delete-all-dirs.json)|delete, all, dirs|
|[Create curator directories](tasks/create-curator-dirs.json)|create, curator, dirs|
|[Create ELK directories](tasks/create-elk-dirs.json)|create, elk, dirs|
|[Create elastic search directories](tasks/create-elasticsearch-dirs.json)|create, elasticsearch, dirs|
|[Create kibana directories](tasks/create-kibana-dirs.json)|create, kibana, dirs|
|[Create logstash directories](tasks/create-logstash-dirs.json)|create, logstash, dirs|
|[Create LMA REST log ingestion directories](tasks/create-lma-rest-log-ingestion-dirs.json)|create, lma-rest-log-ingestion, dirs|
|[Create winlog beat directories](tasks/create-winlog-beat-dirs.json)|create, winlog-beat, dirs|
|[Create LMA service directories](tasks/create-lma-service-dirs.json)|create, lma-service, dirs|
|[Create Xpack Client Plugin directories](tasks/create-xpack-client-plugin-dirs.json)|create, xpack-client-plugin, dirs|
|[Delete all downloaded packages](tasks/delete-all-downloads.json)|delete, all, downloads|
|[Install Fedora package libselinux-python](tasks/install-fedora-libselinux-python.json)|install, fedora, libselinux-python|
|[Download all packages](tasks/download-all-packages.json)|download, all, packages|
|[Extract elasticsearch tar archive](tasks/extract-elasticsearch-tar.json)|extract, elasticsearch, tar|
|[Extract kibana tar archive](tasks/extract-kibana-tar.json)|extract, kibana, tar|
|[Extract logstash tar package](tasks/extract-logstash-tar.json)|extract, logstash, tar|
|[Build curator templates](tasks/build-curator-templates.json)|build, curator, templates|
|[Build kibana templates](tasks/build-kibana-templates.json)|build, kibana, templates|
|[Build elasticsearch templates](tasks/build-elasticsearch-templates.json)|build, elasticsearch, templates|
|[Build lma service templates](tasks/build-lma-service-templates.json)|build, lma-service, templates|
|[Build lma rest log ingestion templates](tasks/build-lma-rest-log-ingestion-templates.json)|build, lma-rest-log-ingestion, templates|
|[Build logstash templates](tasks/build-logstash-templates.json)|build, logstash, templates|
|[Build winlog beat templates](tasks/build-winlog-beat-templates.json)|build, winlog-beat, templates|
|[Remove-ElasticSearch-XPack-package](tasks/remove-elasticsearch-xpack.json)|remove, elasticsearch, xpack|
|[Remove-Logstash-XPack-package](tasks/remove-logstash-xpack.json)|remove, logstash, xpack|
|[Remove Kibana XPack plugin](tasks/remove-kibana-xpack.json)|remove, kibana, xpack|
|[Uninstall RHEL packages](tasks/uninstall-rhel-packages.json)|uninstall, rhel, packages|
|[Uninstall Fedora packages](tasks/uninstall-fedora-packages.json)|uninstall, fedora, packages|
|[Install RHEL packages](tasks/install-rhel-packages.json)|install, rhel, packages|
|[Install Fedora packages](tasks/install-fedora-packages.json)|install, fedora, packages|
|[Install elasticsearch plugin](tasks/install-elasticsearch-plugin.json)|install, elasticsearch, plugin|
|[Install logstash XPack plugin](tasks/install-logstash-xpack.json)|install, logstash, xpack|
|[Install Kibana XPack plugin](tasks/install-kibana-xpack.json)|install, kibana, xpack|
|[Copy ELK files](tasks/copy-elk-files.json)|copy, elk, files|
|[Link directories](tasks/link-all-dirs.json)|link, all, dirs|
|[Change ownership](tasks/change-permission-dirs.json)|change, permission, dirs|
|[Check if elasticsearch.sh exists](tasks/check-file-exists-elasticsearch.sh.json)|check, file-exists, elasticsearch.sh|
|[Stop elasticsearch service](tasks/stop-elasticsearch-service.json)|stop, elasticsearch, service|
|[Stop kibana service](tasks/stop-kibana-service.json)|stop, kibana, service|
|[Stop logstash.default service](tasks/stop-logstash.default-service.json)|stop, logstash.default, service|
|[Stop logstash.bluemix service](tasks/stop-logstash.bluemix-service.json)|stop, logstash.bluemix, service|
|[Stop logstash.deadletter service](tasks/stop-logstash.deadletter-service.json)|stop, logstash.deadletter, service|
|[Forcestop kibana service](tasks/forcestop-kibana-service.json)|forcestop, kibana, service|
|[Forcestop logstash.default service](tasks/forcestop-logstash.default-service.json)|forcestop, logstash.default, service|
|[Forcestop logstash.bluemix service](tasks/forcestop-logstash.bluemix-service.json)|forcestop, logstash.bluemix, service|
|[Forcestop elasticsearch service](tasks/forcestop-elasticsearch-service.json)|forcestop, elasticsearch, service|
|[Forcestop logstash.deadletter service](tasks/forcestop-logstash.deadletter-service.json)|forcestop, logstash.deadletter, service|
|[Start logstash.deadletter service](tasks/start-logstash.deadletter-service.json)|start, logstash.deadletter, service|
|[Start elasticsearch service](tasks/start-elasticsearch-service.json)|start, elasticsearch, service|
|[Start kibana service](tasks/start-kibana-service.json)|start, kibana, service|
|[Start logstash.default service](tasks/start-logstash.default-service.json)|start, logstash.default, service|
|[Start logstash.bluemix service](tasks/start-logstash.bluemix-service.json)|start, logstash.bluemix, service|
|[Restart logstash.default service](tasks/restart-logstash.default-service.json)|restart, logstash.default, service|
|[Restart logstash.bluemix service](tasks/restart-logstash.bluemix-service.json)|restart, logstash.bluemix, service|
|[Restart logstash.deadletter service](tasks/restart-logstash.deadletter-service.json)|restart, logstash.deadletter, service|
|[List elasticsearch log files](tasks/list-elasticsearch-logs.json)|list, elasticsearch, logs|
|[List elasticsearch config files](tasks/list-elasticsearch-configs.json)|list, elasticsearch, configs|
|[List kibana log files](tasks/list-kibana-logs.json)|list, kibana, logs|
|[List kibana config files](tasks/list-kibana-configs.json)|list, kibana, configs|
|[List logstash config files](tasks/list-logstash-configs.json)|list, logstash, configs|
|[List logstash log files](tasks/list-logstash-logs.json)|list, logstash, logs|
|[Archive all elasticsearch logs in directory](tasks/archive-elasticsearch-logs.json)|archive, elasticsearch, logs|
|[Archive all elasticsearch configs in directory](tasks/archive-elasticsearch-configs.json)|archive, elasticsearch, configs|
|[Archive all kibana logs in directory](tasks/archive-kibana-logs.json)|archive, kibana, logs|
|[Archive all kibana configs in directory](tasks/archive-kibana-configs.json)|archive, kibana, configs|
|[Archive all logstash configs in directory](tasks/archive-logstash-configs.json)|archive, logstash, configs|
|[Archive all logstash logs in directory](tasks/archive-logstash-logs.json)|archive, logstash, logs|
|[Create all elasticsearch email body summaries](tasks/create-elasticsearch-logs-email.json)|create, elasticsearch-logs, email|
|[Create all elasticsearch config summary emails](tasks/create-elasticsearch-configs-email.json)|create, elasticsearch-configs, email|
|[Create all logstash config summary emails](tasks/create-logstash-config-email.json)|create, logstash-config, email|
|[Create all logstash email body summaries](tasks/create-logstash-logs-email.json)|create, logstash-logs, email|
|[Create all kibana email logs summary](tasks/create-kibana-logs-email.json)|create, kibana-logs, email|
|[Create all kibana config summary emails](tasks/create-kibana-config-email.json)|create, kibana-config, email|
|[Email all elasticsearch config files](tasks/send-elasticsearch-config-email.json)|send, elasticsearch-config, email|
|[Email all elasticsearch log files](tasks/send-elasticsearch-logs-email.json)|send, elasticsearch-logs, email|
|[Email all logstash config files](tasks/send-logstash-config-email.json)|send, logstash-config, email|
|[Email all logstash log files](tasks/send-logstash-logs-email.json)|send, logstash-logs, email|
|[Email all kibana log files](tasks/send-kibana-logs-email.json)|send, kibana-logs, email|
|[Email all kibana config files](tasks/send-kibana-config-email.json)|send, kibana-config, email|
|[Delete all elasticsearch log archives](tasks/delete-elasticsearch-logs.json)|delete, elasticsearch, logs|
|[Delete all logstash config archives](tasks/delete-logstash-configs.json)|delete, logstash, configs|
|[Delete all kibana log archives](tasks/delete-kibana-log-archives.json)|delete, kibana-log, archives|
|[Delete all elasticsearch config archives](tasks/delete-elasticsearch-configs.json)|delete, elasticsearch, configs|
|[Delete all logstash log archives](tasks/delete-logstash-logs.json)|delete, logstash, logs|
|[Delete all kibana config archives](tasks/delete-kibana-configs.json)|delete, kibana, configs|
|[Copy mwelkCreds directory to logstash config](tasks/copy-mwelkCreds-logstash-config.json)|copy, mwelkCreds, logstash-config|
|[Copy mwelkCreds directory to elasticsearch xpack config](tasks/copy-mwelkCreds-elasticsearch-config.json)|copy, mwelkCreds, elasticsearch-config|
|[Copy BnsfPem to logstash](tasks/copy-BnsfPem-logstash.json)|copy, BnsfPem, logstash|
|[Copy ElasticCrt to logstash](tasks/copy-ElasticCrt-logstash.json)|copy, ElasticCrt, logstash|
|[Copy ElasticCrt to kibana](tasks/copy-BnsfCrt-kibana.json)|copy, BnsfCrt, kibana|
|[Copy ElasticKey to logstash](tasks/copy-ElasticKey-logstash.json)|copy, ElasticKey, logstash|
|[Copy KeystoreFull to logstash](tasks/copy-KeystoreFull-logstash.json)|copy, KeystoreFull, logstash|
|[Copy ElasticKey to kibana](tasks/copy-BnsfKey-kibana.json)|copy, BnsfKey, kibana|
|[Copy BnsfPem to kibana](tasks/copy-BnsfPem-kibana.json)|copy, BnsfPem, kibana|
