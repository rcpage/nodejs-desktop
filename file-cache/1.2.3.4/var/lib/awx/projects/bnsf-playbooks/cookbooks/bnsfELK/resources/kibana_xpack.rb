actions :install, :uninstall
default_action :nothing

action :install do
  remote_file "#{Chef::Config[:file_cache_path]}/#{node['bnsfXPackClientPlugin']['packageName']}" do
    action :create
    source node['bnsfXPackClientPlugin']['payloadName']
    mode '770'
  end

  bash "Copy from #{node['bnsfELK']['ElasticKey']} to #{node['bnsfKibana']['ElasticKey']}" do
    action :nothing
    subscribes :run, 'execute[install-Kibana-XPack-package]', :before
    cwd '/'
    code "cp #{node['bnsfELK']['ElasticKey']} #{node['bnsfKibana']['ElasticKey']}"
  end

  bash "Copy from #{node['bnsfELK']['ElasticCrt']} to #{node['bnsfKibana']['ElasticCrt']}" do
    action :nothing
    subscribes :run, 'execute[install-Kibana-XPack-package]', :before
    cwd '/'
    code "cp #{node['bnsfELK']['ElasticCrt']} #{node['bnsfKibana']['ElasticCrt']}"
  end

  bash "Copy from #{node['bnsfELK']['BnsfPem']} to #{node['bnsfKibana']['BnsfPem']}" do
    action :nothing
    subscribes :run, 'execute[install-Kibana-XPack-package]', :before
    cwd '/'
    code "cp #{node['bnsfELK']['BnsfPem']} #{node['bnsfKibana']['BnsfPem']}"
  end

  command = "sudo #{node['bnsfKibana']['binDirectory']}/kibana-plugin install file://#{Chef::Config[:file_cache_path]}/#{node['bnsfXPackClientPlugin']['packageName']}"

  Chef::Log.info(command)
  execute 'install-Kibana-XPack-package' do
    action :run
    command "#{command}"
  end

  bnsfELK_elk_security 'Apply-security-for-XPACK-install' do
    action :nothing
    subscribes :run, 'execute[install-Kibana-XPack-package]', :delayed
  end
end

action :uninstall do
  execute 'remove-Kibanah-XPack-package' do
    command "sudo #{node['bnsfKibana']['binDirectory']}/kibana-plugin remove x-pack"
    ignore_failure true
  end
end
