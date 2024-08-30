   #!/bin/bash

   cd /root/autopark
   git pull origin main
   npm install
   pm2 restart autopark || pm2 start server.js --name autopark

