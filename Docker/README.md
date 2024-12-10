# Links und Material

## Cheatsheet

Ein super Cheatsheet findet ihr [hier](https://dockerlabs.collabnix.com/docker/cheatsheet/)

## Material

- https://docker-handbook.farhan.dev/
- https://softchris.github.io/pages/docker-one.html#resources
- https://training.play-with-docker.com/
- https://learn.microsoft.com/de-de/training/modules/intro-to-docker-containers/
- https://learn.microsoft.com/de-de/visualstudio/docker/tutorials/docker-tutorial

---
## Aufräum Befehle

### 1. **Alle laufenden Container stoppen**
Um alle laufenden Container zu stoppen, verwende den folgenden Befehl in PowerShell:

```powershell
docker stop $(docker ps -q)
```

- `docker ps -q`: Listet die IDs aller laufenden Container.
- `docker stop`: Stoppt diese Container.

### 2. **Alle Container löschen**
Um alle Container zu löschen (einschließlich gestoppter Container), verwende diesen Befehl:

```powershell
docker rm $(docker ps -a -q)
```

- `docker ps -a -q`: Listet die IDs aller Container (auch gestoppte).
- `docker rm`: Löscht die Container.

### 3. **Alle Docker-Images löschen**
Um alle Docker-Images zu löschen, kannst du diesen Befehl verwenden:

```powershell
docker rmi $(docker images -q) -f
```

- `docker images -q`: Listet die IDs aller Docker-Images.
- `docker rmi`: Löscht die Images.
- `-f`: Erzwingt das Löschen, auch wenn das Image in Verwendung ist.
### 4. **Alle Volumes löschen**

`docker volume rm $(docker volume ls -q)`

Das löscht **alle Volumes**, nicht nur die Container, die mit diesen Volumes verbunden sind.

### Hinweise:
- Achte darauf, dass du möglicherweise keine Container oder Images löschen kannst, wenn sie gerade in Verwendung sind, außer du erzwingst das Löschen mit `-f` (wie oben beim `docker rmi`-Befehl).
- Bei großen Datenmengen oder vielen Containern und Images kann es eine Weile dauern, bis alle gelöscht sind.

