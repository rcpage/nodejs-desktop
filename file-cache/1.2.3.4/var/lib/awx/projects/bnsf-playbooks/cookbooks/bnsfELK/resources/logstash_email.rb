# sudo /bin/mail -s "Beats e-mail ftwlxelkt001" -a /var/log/filebeat/filebeat.bnsf.chef.log -r noreply@ftwlxelkt001 bruno.valli@bnsf.com

actions :send_log, :send_config
default_action :nothing

action :send_log do
  Dir.glob("#{node['bnsfLogstash']['logsDirectory']}/**/*/").each do |directory_name|
    Dir.open(directory_name).each do |file_name|
      if (file_name.end_with? ".log") && (file_name != '.') && (file_name != '..')
        bash "Sends e-mail using Linux commands - log" do
          action :run
          ignore_failure true
          code <<-EOH
              tar -czvf /tmp/#{file_name}.gz #{directory_name}/#{file_name}
              tail -n 100 #{directory_name}/#{file_name} > /tmp/emailBody
              /bin/mail -s "Logstash log e-mail #{node['hostname']} - #{file_name}" -a /tmp/#{file_name}.gz -r noreply@#{node['hostname']} #{node['bnsfELK']['EmailLog']} < /tmp/emailBody
              rm /tmp/#{file_name}.gz
            EOH
        end
      end
    end
  end
end

action :send_config do
  Dir.open(node['bnsfLogstash']['configDirectory']).each do |file_name|
    if (file_name.end_with? ".yml") && (file_name != '.') && (file_name != '..')
      bash "Sends e-mail using Linux commands - config" do
        action :run
        ignore_failure true
        code <<-EOH
            tar -czvf /tmp/#{file_name}.gz #{node['bnsfLogstash']['configDirectory']}/#{file_name}
            tail -n 100 #{node['bnsfLogstash']['configDirectory']}/#{file_name} > /tmp/emailBody
            /bin/mail -s "Logstash config e-mail #{node['hostname']} - #{file_name}" -a /tmp/#{file_name}.gz -r noreply@#{node['hostname']} #{node['bnsfELK']['EmailLog']} < /tmp/emailBody
            rm /tmp/#{file_name}.gz
          EOH
      end
    end
  end
end
