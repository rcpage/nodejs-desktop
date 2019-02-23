actions :create
default_action :nothing
property :kibana_monitor_enabled, [true, false], default: true

action :create do
  kibana_password = getPassword_Kibana(kibana_password)

  directory node['bnsfKibana']['binDirectory'] do
    action :create
    recursive true
    ignore_failure true
  end

  directory node['bnsfKibana']['configDirectory'] do
    action :create
    recursive true
    ignore_failure true
  end

  configFile = "#{node['bnsfKibana']['configDirectory']}/#{node['bnsfKibana']['configFile']}"
  if node.tags.include? 'ELASTICSEARCH_CONF_MARVEL'
    template configFile do
      action :create
      source 'kibana.marvel.yml'
      owner node['bnsfELK']['userName']
      group node['bnsfELK']['groupName']
      mode '770'
      variables(:kibana_password => kibana_password)
    end
  else
    Chef::Log.info("kibana_monitor_enable value #{kibana_monitor_enabled} inside kibana_conf.rb")

    template configFile do
      action :create
      source 'kibana.yml'
      owner node['bnsfELK']['userName']
      group node['bnsfELK']['groupName']
      mode '770'
      variables(
        :kibana_password => kibana_password,
        :kibana_monitor_enabled => kibana_monitor_enabled)
    end
  end

  # send the file up to artifactory for safe keeping
  bnsfELK_curl_artifactory 'Send config file' do
    action :push
    file_name configFile
    ignore_failure true
  end

  bnsfELK_kibana_service 'Stop Kibana service' do
    ignore_failure true
    action :stop
  end

  bnsfELK_kibana_service 'Start Kibana service' do
    action :start
  end
end
