actions :start, :stop, :forcestop
default_action :nothing

action :start do
  execute 'start-Kibana' do
    command "#{node['bnsfKibana']['binDirectory']}/kibana.sh start"
    only_if { ::File.exist?("#{node['bnsfKibana']['binDirectory']}/kibana.sh") }
    ignore_failure true
  end
end

action :stop do
  execute 'stop-Kibana' do
    command "#{node['bnsfKibana']['binDirectory']}/kibana.sh stop"
    only_if { ::File.exist?("#{node['bnsfKibana']['binDirectory']}/kibana.sh") }
    ignore_failure true
  end
end

action :forcestop do
  execute 'force-stop-Kibana' do
    command "#{node['bnsfKibana']['binDirectory']}/kibana.sh forcestop"
    only_if { ::File.exist?("#{node['bnsfKibana']['binDirectory']}/kibana.sh") }
    ignore_failure true
  end
end