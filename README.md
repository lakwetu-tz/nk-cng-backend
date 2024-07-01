# NK_CNG-backend


# Create a service file at

    touch /etc/systemd/system/gas-api.service

Enter

    [Unit]
    Description=NK CNG Backend
   
    
    [Service]
    Type=simple
    WorkingDirectory=/my/node/app/directory
    ExecStart=/usr/lib/node run index.js 
    
    [Install]
    WantedBy=multi-user.target
  
Then enable and start the service

    systemctl enable gas-api
    systemctl start gas-api
    systemctl status gas-api
  
systemd has a separate journaling system that will let you tail logs for easy trouble-shooting.