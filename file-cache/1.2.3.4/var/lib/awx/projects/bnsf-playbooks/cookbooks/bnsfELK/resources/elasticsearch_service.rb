actions :start, :stop, :forcestop
default_action :nothing

action :start do
  Chef::Log.info("#{node['bnsfElasticSearch']['binDirectory']}/elasticsearch.sh start")
  execute 'start-ElasticSearch' do
    command "#{node['bnsfElasticSearch']['binDirectory']}/elasticsearch.sh start"
    only_if { ::File.exist?("#{node['bnsfElasticSearch']['binDirectory']}/elasticsearch.sh") }
  end
end

action :stop do
  execute 'stop-ElasticSearch' do
    command "#{node['bnsfElasticSearch']['binDirectory']}/elasticsearch.sh stop"
    only_if { ::File.exist?("#{node['bnsfElasticSearch']['binDirectory']}/elasticsearch.sh") }
    ignore_failure true
  end
end

action :forcestop do
  execute 'force_Stop-ElasticSearch' do
    command "#{node['bnsfElasticSearch']['binDirectory']}/elasticsearch.sh forcestop"
    only_if { ::File.exist?("#{node['bnsfElasticSearch']['binDirectory']}/elasticsearch.sh") }
    ignore_failure true
  end
end