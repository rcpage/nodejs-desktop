actions :install, :uninstall
default_action :nothing

action :install do
  #
  # Recipe will only be trigered by the remote_file "#{Chef::Config[:file_cache_path]}/#{node['bnsfKibana']['packageName']}"
  # if triggered the follwing will happen in order
  #  - all kibana relate directories will be delete (app and logs)
  #  - diretories will be recreated (app, data, logs)
  #  - file is downloaded from repository
  #  - file is untared in the kibana application folder
  #  - directory chmod and chown is changed to the correct ones.
  #  - moved the svc file to the bin directory
  #  - get the configuration file also there

  # setup environment #################
  bnsfELK_elk_conf 'Setting up environment for ELK' do
    action :nothing
    subscribes :run, "remote_file[#{Chef::Config[:file_cache_path]}/#{node['bnsfKibana']['packageName']}]", :before
  end

  # delete #############################
  bnsfELK_kibana_dir 'remove kibana directory' do
    action :delete
    subscribes :delete, "remote_file[#{Chef::Config[:file_cache_path]}/#{node['bnsfKibana']['packageName']}]", :before
  end

  # create #################################
  bnsfELK_kibana_dir 'remove kibana directory' do
    subscribes :create, 'execute[extract_kibana_package]', :before
  end

  # starting point ################################
  remote_file "#{Chef::Config[:file_cache_path]}/#{node['bnsfKibana']['packageName']}" do
    action :create
    source node['bnsfKibana']['payloadName']
    mode '777'
  end

  # post actions #################################
  execute 'extract_kibana_package' do
    action :nothing
    user node['bnsfELK']['userName']
    group node['bnsfELK']['groupName']
    cwd node['bnsfKibana']['directory']
    command "tar -xf #{Chef::Config[:file_cache_path]}/#{node['bnsfKibana']['packageName']} -C #{node['bnsfKibana']['directory']} --strip=1"
    subscribes :run, "remote_file[#{Chef::Config[:file_cache_path]}/#{node['bnsfKibana']['packageName']}]", :immediately
  end

  bnsfELK_elk_security 'Set all directory security' do
    subscribes :run, "remote_file[#{Chef::Config[:file_cache_path]}/#{node['bnsfKibana']['packageName']}]", :immediately
  end

  template "#{node['bnsfKibana']['binDirectory']}/kibana.sh" do
    action :nothing
    subscribes :create, 'execute[extract_kibana_package]', :delayed
    source 'kibana.sh'
    owner node['bnsfELK']['userName']
    group node['bnsfELK']['groupName']
    mode '770'
  end

  bnsfELK_shell_autostartkill 'CreateLinksToAutoStart' do
    action :nothing
    subscribes :create, "template[#{node['bnsfKibana']['binDirectory']}/kibana.sh]", :immediately
    file_path "#{node['bnsfKibana']['binDirectory']}/kibana.sh"
    file_name 'kibana'
  end

  # bash 'Create autostart link' do
  #  action :nothing
  #  subscribes :run, "template[#{node['bnsfKibana']['binDirectory']}/kibana.sh]", :immediately
  #  code "ln -s #{node['bnsfKibana']['binDirectory']}/kibana.sh /etc/init.d/kibana.sh"
  # end

  # install x-package
  bnsfELK_kibana_xpack 'Install_Kibana_XPack' do
    action :nothing
    subscribes :install, "template[#{node['bnsfKibana']['binDirectory']}/kibana.sh]", :delayed
  end
end

action :uninstall do
  # stop the service if running first
  bnsfELK_kibana_service 'stop kibana service before uninstall' do
    action :stop
    ignore_failure true
  end

  bnsfELK_kibana_service 'Force stop Kibana service' do
    action :nothing
    subscribes :forcestop, 'bnsfELK_kibana_service[stop kibana service before uninstall]', :delayed
  end

  bnsfELK_shell_autostartkill 'CreateLinksToAutoStart' do
    action :delete
    file_path "#{node['bnsfKibana']['binDirectory']}/kibana.sh"
    file_name 'kibana'
    ignore_failure true
  end

  # bash 'Remove the auto start link' do
  #   action :run
  #   code 'rm /etc/init.d/kibana.sh'
  #   ignore_failure true
  # end

  # delete #############################
  directory node['bnsfKibana']['directory'] do
    action :delete
    recursive true
    ignore_failure true
  end

  directory node['bnsfKibana']['logsDirectory'] do
    action :delete
    recursive true
    ignore_failure true
  end

  directory node['bnsfKibana']['dataDirectory'] do
    action :delete
    recursive true
    ignore_failure true
  end

end
