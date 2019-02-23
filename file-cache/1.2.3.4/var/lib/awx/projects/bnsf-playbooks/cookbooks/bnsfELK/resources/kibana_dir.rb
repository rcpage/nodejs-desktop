actions :create, :delete
default_action :nothing

action :create do
  directory node['bnsfKibana']['directory'] do
    action :create
    owner node['bnsfELK']['userName']
    group node['bnsfELK']['groupName']
    mode '770'
    recursive true
  end

  directory node['bnsfKibana']['logsDirectory'] do
    action :create
    owner node['bnsfELK']['userName']
    group node['bnsfELK']['groupName']
    mode '770'
    recursive true
  end

  directory node['bnsfKibana']['dataDirectory'] do
    action :create
    owner node['bnsfELK']['userName']
    group node['bnsfELK']['groupName']
    mode '770'
    recursive true
  end
end

action :delete do
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
end
