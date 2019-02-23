#!/usr/bin/env bash 
# chkconfig: - 98 02
# description: Kibana daemon launch
#************************************************************************************************************
# Name: generic_process_manage.sh Synopsis: This script automates management of an APP_NAME Output: Return 
# code of the APP_NAME. Input: Operation (start|stop|forcestop|status|restart)
#
# CAVEATS:
#		1. Tested only on RHEL 7.2
# ASSUMPTIONS:
#		1. Users have permissions.
# Developed by: Bruno F Valli (B021386), BNSF Railway Inc.
#
# Audience: BNSF Internal usage ONLY. 
#************************************************************************************************************
APP_BIN=<%= node['bnsfKibana']['binDirectory']%>
APP_NAME=kibana
APP_PARAMETERS="> <%= node['bnsfKibana']['logsDirectory']%>/kibanaconsole 2> <%= node['bnsfKibana']['logsDirectory']%>/kibanaconsole.error &"
APP_LAUNCH="nohup ${APP_BIN}/${APP_NAME} ${APP_PARAMETERS}"
APP_PORTNUMBER="<%= node['bnsfKibana']['port']%>"
APP_FULLNAME="<%= node['bnsfKibana']['applicationFullName']%>"
APP_USERNAME=mwelk
APP_LOGFILE="/elk/logs/kibana/kibana.log"

# Source the default env file
start() {
  if status || status_port; then
    echo "${APP_NAME} is running on port ${APP_PORTNUMBER}"
  else
    swapoff -a
    echo "setting vm.max_map_count"
    /usr/sbin/sysctl -w vm.max_map_count=262144
    rm ${APP_LOGFILE}
    echo "starting ${APP_NAME}..."
    APP_COMMAND="runuser -l ${APP_USERNAME} -c '${APP_LAUNCH}'"
    eval $APP_COMMAND
    echo $APP_COMMAND
    for i in 1 2 3 4 5 6 7 8 9; do
      echo "START: Waiting $APP_NAME to start..."
      status && status_port && break
      sleep 5
    done
  fi
}
stop() {
  # Try a few times to kill TERM the program
  if status || status_port; then
    # need to stop by org.elasticsearch.bootstrap.Elasticsearch 
    mypid=`ps -ef|grep ${APP_FULLNAME}|grep -v grep|awk -F ' ' '{print $2}'`
    echo 'Killing all...'
    ps -ef|grep ${APP_FULLNAME}|grep -v grep|awk -F ' ' '{print $2}'|xargs kill

    for i in 1 2 3 4 5 6 7 8 9 10; do
      echo "STOP: Waiting $APP_NAME to die..."
      status || break
      sleep 5
    done
 fi
}
status_port(){
  # check if application has taken port
  if [[ $(netstat -lnput|grep ${APP_PORTNUMBER}) ]]; then
    echo "======== LOG FILE BEGIN ========"
    tail -n 10 ${APP_LOGFILE}
    echo "======== LOG FILE END ========"
    echo "${APP_NAME} is running on port ${APP_PORTNUMBER}"
    return 0
  else
    echo "======== LOG FILE BEGIN ========"
    tail -n 10 ${APP_LOGFILE}
    echo "======== LOG FILE END ========"
    echo "${APP_NAME} has not taken port ${APP_PORTNUMBER}"
    return 1
  fi
}
status() {
  mypidfulllist=`ps -ef|grep ${APP_FULLNAME}|grep -v grep`
  echo $mypidfulllist
  mypidcount=`ps -ef|grep ${APP_FULLNAME}|grep -v grep|awk -F ' ' '{print $2}'|wc -l`
  echo "($mypidcount)"
  if [[ $mypidcount -eq 0 ]]; then
    echo "======== LOG FILE BEGIN ========"
    tail -n 10 ${APP_LOGFILE}
    echo "======== LOG FILE END ========"
    echo "${APP_NAME} is not running"
    return 1
  else 
    echo "======== LOG FILE BEGIN ========"
    tail -n 10 ${APP_LOGFILE}
    echo "======== LOG FILE END ========"
    echo "${APP_NAME} is running for ${APP_FULLNAME}"
    return 0
  fi
}
forcestop() {
  stop
  if status || status_port; then
     echo 'Could not be stopped with SYSTERM force kill.'
     ps -ef|grep ${APP_FULLNAME}|grep -v grep|awk -F ' ' '{print $2}'|xargs kill -9
  fi
	
  if status || status_port ; then
	  echo "Could not kill"
  fi
}
case "$1" in
  start)
    start
    ;;
  stop)
    stop
    ;;
  forcestop)
    forcestop
    ;;
  status)
    status && status_port
    ;;
  restart)
    stop && start
    ;;
  *)
    echo "Usage: $SCRIPTNAME {start|stop|forcestop|status|restart}" >&2
    exit 3
    ;; 
esac 
exit $?
