actions :install, :uninstall
default_action :nothing

action :install do
  remote_file "#{Chef::Config[:file_cache_path]}/#{node['bnsfXPackClientPlugin']['packageName']}" do
    action :create
    source node['bnsfXPackClientPlugin']['payloadName']
    mode '770'
  end

  bash "Copy from #{node['bnsfELK']['ElasticKey']} to #{node['bnsfLogstash']['ElasticKey']}" do
    action :nothing
    subscribes :run, 'execute[install-logstash-XPack-package]', :before
    cwd '/'
    code "cp #{node['bnsfELK']['ElasticKey']} #{node['bnsfLogstash']['ElasticKey']}"
  end

  bash "Copy from #{node['bnsfELK']['ElasticCrt']} to #{node['bnsfLogstash']['ElasticCrt']}" do
    action :nothing
    subscribes :run, 'execute[install-logstash-XPack-package]', :before
    cwd '/'
    code "cp #{node['bnsfELK']['ElasticCrt']} #{node['bnsfLogstash']['ElasticCrt']}"
  end

  bash "Copy from #{node['bnsfELK']['BnsfPem']} to #{node['bnsfLogstash']['BnsfPem']}" do
    action :nothing
    subscribes :run, 'execute[install-logstash-XPack-package]', :before
    cwd '/'
    code "cp #{node['bnsfELK']['BnsfPem']} #{node['bnsfLogstash']['BnsfPem']}"
  end

  bash "Copy from #{node['bnsfELK']['KeystoreFull']} to #{node['bnsfLogstash']['KeystoreFull']}" do
    action :nothing
    subscribes :run, 'execute[install-logstash-XPack-package]', :before
    cwd '/'
    code "cp #{node['bnsfELK']['KeystoreFull']} #{node['bnsfLogstash']['KeystoreFull']}"
  end

  execute 'install-logstash-XPack-package' do
    action :run
    command "sudo #{node['bnsfLogstash']['binDirectory']}/logstash-plugin install file://#{Chef::Config[:file_cache_path]}/#{node['bnsfXPackClientPlugin']['packageName']}"
  end

  bnsfELK_elk_security 'Apply-security-for-XPACK-install' do
    action :nothing
    subscribes :run, 'execute[install-logstash-XPack-package]', :delayed
  end

  bash "Copy from certificates #{node['bnsfELK']['mwelkCreds']} to #{node['bnsfLogstash']['configDirectory']}" do
    action :run
    cwd "#{node['bnsfELK']['mwelkCreds']}"
    code "cp ./ #{node['bnsfLogstash']['configDirectory']} -R"
  end

  # bash "Install Offline Plugin" do
  #   action :run
  #   cwd "#{node['bnsfLogstash']['binDirectory']}"
  #   code "#{node['bnsfLogstash']['binDirectory']}/logstash-plugin install file:///#{node['bnsfELK']['ELKCacheFileDefault']}/logstash-plugin/logstash-offline-plugins-5.6.3.zip"
  # end
end

action :uninstall do
  execute 'remove-Logstash-XPack-package' do
    command "sudo #{node['bnsfLogstash']['binDirectory']}/logstash-plugin remove x-pack"
    ignore_failure true
  end
end
