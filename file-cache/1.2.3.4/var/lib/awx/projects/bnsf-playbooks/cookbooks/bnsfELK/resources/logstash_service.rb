actions :start, :stop, :forcestop, :restart
default_action :nothing

property :config_type, String, required: true

action :start do
  Chef::Log.info("Starting ${config_type} - #{node['bnsfLogstash']['binDirectory']}/logstash.#{config_type}.sh start")
  execute 'start-Logstash' do
    command "#{node['bnsfLogstash']['binDirectory']}/logstash.#{config_type}.sh start"
    only_if { ::File.exist?("#{node['bnsfLogstash']['binDirectory']}/logstash.#{config_type}.sh") }
  end
end

action :stop do
  Chef::Log.info("Stopping ${config_type} - #{node['bnsfLogstash']['binDirectory']}/logstash.#{config_type}.sh stop")
  execute 'stop-Logstash' do
    command "#{node['bnsfLogstash']['binDirectory']}/logstash.#{config_type}.sh stop"
    only_if { ::File.exist?("#{node['bnsfLogstash']['binDirectory']}/logstash.#{config_type}.sh") }
    ignore_failure true
  end
end

action :forcestop do
  Chef::Log.info("Force Stopping ${config_type} - #{node['bnsfLogstash']['binDirectory']}/logstash.#{config_type}.sh forcestop")
  execute 'stop-Logstash' do
    command "#{node['bnsfLogstash']['binDirectory']}/logstash.#{config_type}.sh forcestop"
    only_if { ::File.exist?("#{node['bnsfLogstash']['binDirectory']}/logstash.#{config_type}.sh") }
    ignore_failure true
  end
end

action :restart do
  bnsfELK_logstash_service 'Stop logstash service' do
    action :stop
  end

  bnsfELK_logstash_service 'Force stop logstash service' do
    action :nothing
    subscribes :forcestop, 'bnsfELK_logstash_service[Stop logstash service]', :delayed
  end

  bnsfELK_logstash_service 'Start logstash service' do
    action :nothing
    subscribes :start, 'bnsfELK_logstash_service[Force stop logstash service]', :delayed
  end
end
