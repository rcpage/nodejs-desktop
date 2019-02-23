actions :install, :uninstall
default_action :nothing

action :install do
  remote_file "#{Chef::Config[:file_cache_path]}/#{node['bnsfXPackClientPlugin']['packageName']}" do
    action :create
    source node['bnsfXPackClientPlugin']['payloadName']
    mode '770'
  end

  # second installs
  execute 'install-ElasticSearch-XPack-package' do
    action :run
    command "sudo #{node['bnsfElasticSearch']['binDirectory']}/elasticsearch-plugin install -b file://#{Chef::Config[:file_cache_path]}/#{node['bnsfXPackClientPlugin']['packageName']}"
  end

  # pki
  template "#{node['bnsfElasticSearch']['xpackConfigDirectory']}/role_mapping_pki.yml" do
    action :create
    # subscribes :create, 'execute[install-ElasticSearch-XPack-package]', :immediately
    source "role_mapping_pki.#{node.chef_environment}.yml"
    owner node['bnsfELK']['userName']
    group node['bnsfELK']['groupName']
    mode '660'
  end

  # security
  bnsfELK_elasticsearch_xpack_role 'Add role mapping file' do
    action :nothing
    subscribes :refresh_file, 'execute[install-ElasticSearch-XPack-package]', :immediately
  end

  Dir.open("#{node['bnsfELK']['mwelkCreds']}").each do |file_name|
    if( file_name != '.' ) && ( file_name != '..' )
      source = "#{node['bnsfELK']['mwelkCreds']}/#{file_name}"
      destination = "#{node['bnsfElasticSearch']['xpackConfigDirectory']}/#{file_name}"
      Chef::Log.info("Copying file #{source} to #{destination}")
      bash "Copy from #{source} to #{destination}" do
        action :run
        cwd '/'
        code "cp #{source} #{destination} "
      end
    end
  end
end

action :uninstall do
  execute 'remove-ElasticSearch-XPack-package' do
    command "sudo #{node['bnsfElasticSearch']['binDirectory']}/elasticsearch-plugin remove x-pack"
    ignore_failure true
  end
end
