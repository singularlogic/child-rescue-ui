
#!/bin/bash

# Kill existing containers first
bash -x ./stop_production_server.sh

# Then bring them up
docker-compose pull && docker-compose --file=docker-compose.yml up --build -d --remove-orphans --force-recreate



