```
  docker network ls          # Verfügbare Netzwerke anzeigen
  docker network inspect     # Details zu einem Netzwerk anzeigen
  docker network create      # Neues Netzwerk erstellen
  docker network rm          # Netzwerk löschen
```

```
docker network create my_custom_network
```

```
docker network ls
```

```
docker run --name app1 --network my_custom_network -d alpine sh -c "sleep 1000"
```

```
docker exec app1 ping -c 3 app2
```

```
FROM nginx
RUN apt-get update && apt-get install -y iputils-ping
```
```
docker run -it --rm --name container1 --network demo-network busybox:latest
```
