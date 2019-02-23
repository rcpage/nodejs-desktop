actions :get, :post, :delete, :post_dir, :put
default_action :nothing

elastic_password = getPassword_Elastic(elastic_password)

property :url, String, required: true
property :file_name, String, required: false
property :send_message, String, required: false
property :user_name, String, default: "#{node['bnsfElasticSearch']['user']['elastic']}", required: false
property :password, String, default: "#{elastic_password}", required: false
property :directory, String, default: '/'
property :enable_certificate, [true, false], default: true

action :get do
  Chef::Log.info("restful get url:#{url} #{user_name}")

  command = 'curl'

  # timeout for the whole operation
  command += ' --max-time 30'
  command += " --user #{user_name}:#{password}"

  if enable_certificate == true
    command += " --cacert #{node['bnsfELK']['BnsfPem']} --cert #{node['bnsfELK']['ElasticCrt']} --key #{node['bnsfELK']['ElasticKey']}"
  end

  command += " #{url}"
  # command += " #{url} > #{output_file}"

  Chef::Log.info(command)
  bash 'curl get call #{url}' do
    action :run
    cwd ::File.dirname("#{node['bnsfElasticSearch']['templateDirectory']}")
    code command
  end
end

action :post do
  Chef::Log.info("restful post - url:#{url}")

  command = 'curl -X POST'
  command += ' --max-time 30'
  command += " --user #{user_name}:#{password}"
  if enable_certificate == true
    command += " --cacert #{node['bnsfELK']['BnsfPem']} --cert #{node['bnsfELK']['ElasticCrt']} --key #{node['bnsfELK']['ElasticKey']}"
  end

  if !file_name.nil?
    command += " -d '#{::File.read("#{file_name}")}'"
  elsif !send_message.nil?
    command += " -d '#{send_message}'"
  end

  command += " #{url}"

  Chef::Log.info(command)
  bash 'curl post call #{url}' do
    action :run
    cwd ::File.dirname("#{node['bnsfElasticSearch']['templateDirectory']}")
    code command
  end
end

action :put do
  Chef::Log.info("restful put url:#{url}")

  command = 'curl -X PUT'
  command += ' --max-time 30'
  Chef::Log.info(command)
  command += " --user #{user_name}:#{password}"
  Chef::Log.info(command)
  if enable_certificate == true
    command += " --cacert #{node['bnsfELK']['BnsfPem']} --cert #{node['bnsfELK']['ElasticCrt']} --key #{node['bnsfELK']['ElasticKey']}"
    Chef::Log.info(command)
  end

  Chef::Log.info(command)

  if !file_name.nil?
    command += " -d '#{::File.read("#{file_name}")}'"
    Chef::Log.info(command)
  elsif send_message != ''
    command += " -d '#{send_message}'"
    Chef::Log.info(command)
  end

  command += " #{url}"

  Chef::Log.info(command)
  bash 'curl post call #{url}' do
    action :run
    cwd ::File.dirname("#{node['bnsfElasticSearch']['templateDirectory']}")
    code command
  end
end

action :post_dir do
  Dir.open(directory).each do |file_name_internal|
    if file_name_internal.end_with?('.json')
      Chef::Log.info(file_name[/^[a-zA-Z_]+/])

      command = 'curl -X POST'
      command += ' --max-time 30'
      command += " --user #{user_name}:#{password}"
      if enable_certificate == true
        command += " --cacert #{node['bnsfELK']['BnsfPem']} --cert #{node['bnsfELK']['ElasticCrt']} --key #{node['bnsfELK']['ElasticKey']}"
      end

      if !file_name.nil?
        command += " -d '#{::File.read("#{file_name_internal}")}'"
      elsif !send_message.nil?
        command += " -d '#{send_message}'"
      end

      command += " #{url}"

      Chef::Log.info(command)
      bash 'curl post call #{url}' do
        action :run
        cwd "#{file_name_internal}"
        code command
      end
    end
  end
end

action :delete do
  Chef::Log.info("restful delete url:#{url}")

  command = 'curl -X DELETE'
  command += ' --max-time 30'
  command += " --user #{user_name}:#{password}"
  if enable_certificate == true
    command += " --cacert #{node['bnsfELK']['BnsfPem']} --cert #{node['bnsfELK']['ElasticCrt']} --key #{node['bnsfELK']['ElasticKey']}"
  end
  command += " #{url}"

  Chef::Log.info(command)
  bash "curl delete call #{url}" do
    action :run
    cwd ::File.dirname("#{node['bnsfElasticSearch']['templateDirectory']}")
    code command
  end
end
