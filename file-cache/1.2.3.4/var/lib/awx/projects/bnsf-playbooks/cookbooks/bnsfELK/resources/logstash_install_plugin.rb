actions :install, :download
default_action :nothing

update_file = Chef::Config[:file_cache_path] + '/' + node['bnsfLogstash']['packageNamePluginUpdate']
logstash_plugin_update_directory = Chef::Config[:file_cache_path] + '/' + 'logstashUpdate'

action :download do
  Chef::Log.info("Get #{update_file} from #{node['bnsfLogstash']['payloadNamePluginUpdate']}")
  file update_file do
    action :delete
  end

  directory logstash_plugin_update_directory do
    recursive true
    action :delete
    ignore_failure true
  end

  directory logstash_plugin_update_directory do
    recursive true
    action :create
  end

  remote_file update_file do
    action :create
    source node['bnsfLogstash']['payloadNamePluginUpdate']
    mode '777'
  end

  execute 'extract zip logstash update file' do
    action :run
    cwd node['bnsfLogstash']['directory']
    command "sudo unzip #{update_file} -d #{logstash_plugin_update_directory}"
  end
end

action :install do
  # there is a problem on update on dependencies, so all entries must be deleted before
  # it will accept the update
  bash 'RemoveOldLogstashPlugins' do
    action :run
    cwd "#{node['bnsfLogstash']['directory']}"
    code <<-EOH
      sudo #{node['bnsfLogstash']['directory']}/bin/logstash-plugin remove logstash-input-beats
      sudo #{node['bnsfLogstash']['directory']}/bin/logstash-plugin remove logstash-input-file
      sudo #{node['bnsfLogstash']['directory']}/bin/logstash-plugin remove logstash-input-lumberjack
      sudo #{node['bnsfLogstash']['directory']}/bin/logstash-plugin remove logstash-input-s3
      sudo #{node['bnsfLogstash']['directory']}/bin/logstash-plugin remove logstash-codec-multiline
      sudo #{node['bnsfLogstash']['directory']}/bin/logstash-plugin remove logstash-output-stdout
      sudo #{node['bnsfLogstash']['directory']}/bin/logstash-plugin remove logstash-codec-rubydebug
      sudo #{node['bnsfLogstash']['directory']}/bin/logstash-plugin remove logstash-output-csv
      sudo #{node['bnsfLogstash']['directory']}/bin/logstash-plugin remove logstash-output-file
      EOH
  end

  Dir.open(logstash_plugin_update_directory).each do |file_name|
    if (file_name != '.') && (file_name != '..')
      # install logstash plugin update if found
      execute 'install_logstash_pluginupdate' do
        action :run
        cwd node['bnsfLogstash']['directory']
        command "sudo #{node['bnsfLogstash']['directory']}/bin/logstash-plugin install file://#{logstash_plugin_update_directory}/#{file_name}"
      end
    end
  end

  execute 'check_logstash_plugin' do
    action :nothing
    subscribes :run, 'execute[install_logstash_pluginupdate]', :immediately
    cwd node['bnsfLogstash']['directory']
    command "sudo #{node['bnsfLogstash']['directory']}/bin/logstash-plugin list --verbose"
  end
end