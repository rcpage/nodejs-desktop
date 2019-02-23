actions :install, :uninstall, :nuke
default_action :nothing

action :install do
  # setup environment #################
  bnsfELK_elk_conf 'Setting up environment for ELK' do
    action :nothing
    subscribes :run, "remote_file[#{Chef::Config[:file_cache_path]}/#{node['bnsfElasticSearch']['packageName']}]", :before
  end

  # delete #############################
  bnsfELK_elasticsearch_dir 'Delete Elastic Application directories' do
    action :nothing
    subscribes :delete, "remote_file[#{Chef::Config[:file_cache_path]}/#{node['bnsfElasticSearch']['packageName']}]", :before
  end

  # create #############################
  bnsfELK_elasticsearch_dir 'Create elasticsearch director' do
    action :create
    subscribes :create, 'execute[extract_elasticsearch_package]', :before
  end

  # starting point
  remote_file "#{Chef::Config[:file_cache_path]}/#{node['bnsfElasticSearch']['packageName']}" do
    action :create
    source node['bnsfElasticSearch']['payloadName']
    mode '777'
  end

  # post actions #################################
  execute 'extract_elasticsearch_package' do
    action :nothing
    subscribes :run, "remote_file[#{Chef::Config[:file_cache_path]}/#{node['bnsfElasticSearch']['packageName']}]", :immediately
    user node['bnsfElasticSearch']['userName']
    group node['bnsfElasticSearch']['groupName']
    cwd node['bnsfElasticSearch']['directory']
    command "tar -xf #{Chef::Config[:file_cache_path]}/#{node['bnsfElasticSearch']['packageName']} -C #{node['bnsfElasticSearch']['directory']} --strip=1"
  end

  bnsfELK_elasticsearch_conf 'Configuration of elastic search' do
    action :nothing
    subscribes :create, 'execute[extract_elasticsearch_package]', :delayed
  end

  template "#{node['bnsfElasticSearch']['binDirectory']}/elasticsearch.sh" do
    action :nothing
    subscribes :create, "remote_file[#{Chef::Config[:file_cache_path]}/#{node['bnsfElasticSearch']['packageName']}]", :delayed
    source 'elasticsearch/elasticsearch.sh'
    owner node['bnsfELK']['userName']
    group node['bnsfELK']['groupName']
    mode '770'
  end

  bnsfELK_shell_autostartkill 'CreateLinksToAutoStart' do
    action :nothing
    subscribes :create, "template[#{node['bnsfElasticSearch']['binDirectory']}/elasticsearch.sh]", :immediately
    file_path "#{node['bnsfElasticSearch']['binDirectory']}/elasticsearch.sh"
    file_name 'elasticsearch'
  end

  # bash 'Create autostart link' do
  #  action :nothing
  #  subscribes :run, "template[#{node['bnsfElasticSearch']['binDirectory']}/elasticsearch.sh]", :immediately
  #  code "ln -s #{node['bnsfElasticSearch']['binDirectory']}/elasticsearch.sh /etc/init.d/elasticsearch.sh"
  # end

  bnsfELK_elk_security 'Apply Elk Security' do
    action :nothing
    subscribes :run, "template[#{node['bnsfElasticSearch']['binDirectory']}/elasticsearch.sh]", :immediately
  end

  bnsfELK_elasticsearch_xpack 'Install_ElasticSearch_XPack' do
    action :nothing
    subscribes :install, "template[#{node['bnsfElasticSearch']['binDirectory']}/elasticsearch.sh]", :delayed
  end

  if node.tags.include? 'ELASTICSEARCH_CONF_MARVEL'
    Chef::Log.info('This is a Marvel node no root certificate needed.')
  else
    template "#{node['bnsfElasticSearch']['rootCertificate']}" do
      action :nothing
      subscribes :create, "bnsfELK_elasticsearch_xpack[Install_ElasticSearch_XPack]", :immediately
      source 'bnsfRoot.pem'
      owner node['bnsfELK']['userName']
      group node['bnsfELK']['groupName']
      mode '555'
    end
  end

  bnsfELK_elasticsearch_service 'Stop ElasticSearch service 2' do
    action :nothing
    ignore_failure true
    subscribes :stop, "template[#{node['bnsfElasticSearch']['binDirectory']}/elasticsearch.sh]", :delayed
  end

  bnsfELK_elasticsearch_service 'Force stop Elasticsearch service after install' do
    action :nothing
    subscribes :forcestop, 'bnsfELK_elasticsearch_service[Stop ElasticSearch service 2]', :delayed
  end

  bnsfELK_elk_security 'Apply Elk Security' do
    action :nothing
    subscribes :run, "template[#{node['bnsfElasticSearch']['binDirectory']}/elasticsearch.sh]", :delayed
  end

  bnsfELK_elasticsearch_service 'StartElasticSearchServiceAfterXPACK' do
    action :nothing
    subscribes :start, 'bnsfELK_elasticsearch_service[Force stop Elasticsearch service after install]', :delayed
  end

  bnsfELK_elasticsearch_xpack_security 'ApplySecurityToXPack' do
    action :nothing
    subscribes :run, 'bnsfELK_elasticsearch_service[StartElasticSearchServiceAfterXPACK]', :delayed
  end
end

action :uninstall do
  bnsfELK_elasticsearch_service 'Stop running service before uninstall' do
    action :stop
    ignore_failure true
  end

  bnsfELK_elasticsearch_service 'Force stop Elasticsearch service before nuke' do
    action :nothing
    subscribes :forcestop, 'bnsfELK_elasticsearch_service[Stop running service before uninstall]', :delayed
  end

  bnsfELK_shell_autostartkill 'CreateLinksToAutoStart' do
    action :delete
    file_path "#{node['bnsfElasticSearch']['binDirectory']}/elasticsearch.sh"
    file_name 'elasticsearch'
    ignore_failure true
  end

  # bash 'Remove the auto start link' do
  #   action :run
  #   code 'rm /etc/init.d/elasticsearch.sh'
  #   ignore_failure true
  # end

  bnsfELK_elasticsearch_dir 'Remove elastic search' do
    action :delete
  end
end

action :nuke do
  # stop service first
  bnsfELK_elasticsearch_service 'Stop ElasticSearch Service' do
    action :stop
    ignore_failure true
  end

  bnsfELK_elasticsearch_service 'Force stop Elasticsearch service before nuke' do
    action :nothing
    subscribes :forcestop, 'bnsfELK_elasticsearch_service[Force stop Elasticsearch service before nuke]', :delayed
  end

  bnsfELK_shell_autostartkill 'CreateLinksToAutoStart' do
    action :delete
    file_path "#{node['bnsfElasticSearch']['binDirectory']}/elasticsearch.sh"
    file_name 'elasticsearch'
    ignore_failure true
  end

  # bash 'Remove the auto start link' do
  #   action :run
  #   code 'rm /etc/init.d/elasticsearch.sh'
  #  ignore_failure true
  # end

  # delete all ElasticSearch
  bnsfELK_elasticsearch_dir 'Remove elastic search' do
    action :nuke
  end
end
