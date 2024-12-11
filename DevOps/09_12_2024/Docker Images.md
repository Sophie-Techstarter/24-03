
### 1. **Woher stammen die Bilder?**

Wenn du einen Befehl wie `docker run hello-world` ausführst, sucht Docker automatisch nach dem Bild im Docker Hub. Wenn es lokal nicht gefunden wird, wird es von dort heruntergeladen.

```bash
$ docker run hello-world
Hello from Docker!
This message shows that your installation appears to be working correctly.
```

Dies bedeutet, dass Docker das `hello-world`-Image vom Docker Hub heruntergeladen hat und es ausgeführt wurde.

### 2. **Bilder durchsuchen**

Mit dem Befehl `docker search` kannst du nach Docker-Images auf Docker Hub suchen. Zum Beispiel:

```bash
$ docker search hello-world
NAME                         DESCRIPTION    STARS   OFFICIAL   AUTOMATED
hello-world                  Hello World!…  1988     [OK]
kitematic/hello-world-nginx  A light-weig…  153
tutum/hello-world            Image to tes…  90                 [OK]
```

Die Ausgabe zeigt dir verschiedene `hello-world`-Images. Die Spalte **OFFICIAL** zeigt an, ob es sich um ein offizielles Image handelt, und **STARS** gibt an, wie populär das Image ist. 

- Das erste Ergebnis (`hello-world`) ist ein offizielles Image, da es in der Spalte **OFFICIAL** mit "[OK]" gekennzeichnet ist.
- Das zweite Ergebnis (`kitematic/hello-world-nginx`) ist kein offizielles Image.
- Das dritte Ergebnis (`tutum/hello-world`) ist ein automatisiertes Image, was bedeutet, dass es automatisch aus einem Repository erstellt wird.

### 3. **Bilder aus verschiedenen Registries**

Docker sucht standardmäßig nach Bildern im Docker Hub. Du kannst jedoch auch Bilder aus anderen Registries abrufen, wie z.B. Quay.io. Beispiel:

```bash
$ docker pull quay.io/nordstrom/hello-world
```

Falls das Image keinen Tag hat, z.B. `latest`, kannst du auch einen bestimmten Tag angeben:

```bash
$ docker pull quay.io/nordstrom/hello-world:2.0
```

### 4. **Das Ubuntu-Image**

Wenn du das Ubuntu-Image abruft, ohne einen Tag anzugeben, wird das Image mit dem Tag `latest` heruntergeladen (dies verweist in der Regel auf die neueste Version, aber bei Ubuntu bezieht es sich auf die neueste LTS-Version):

```bash
$ docker pull ubuntu
Using default tag: latest
latest: Pulling from library/ubuntu
```

Um eine spezifische Version, wie z.B. Ubuntu 22.04, herunterzuladen, gib den entsprechenden Tag an:

```bash
$ docker pull ubuntu:22.04
22.04: Pulling from library/ubuntu
c2ca09a1934b: Downloading [============================================>      ]  34.25MB/38.64MB
d6c3619d2153: Download complete
0efe07335a04: Download complete
6b1bb01b3a3b: Download complete
43a98c187399: Download complete
```

Die Ausgabe zeigt dir, wie Docker das Image in mehreren Schritten herunterlädt, da Docker-Images aus verschiedenen Schichten (Ebenen) bestehen.

### 5. **Tagging von Images**

Du kannst Images auch lokal taggen, um sie unter einem neuen Namen zu speichern. Zum Beispiel, um das Ubuntu 22.04-Image mit einem benutzerdefinierten Tag zu versehen:

```bash
$ docker tag ubuntu:22.04 fav_distro:jammy_jellyfish
```

Dies erstellt ein neues Tag `fav_distro:jammy_jellyfish`, das auf dasselbe Image wie `ubuntu:22.04` verweist. Um zu sehen, welche Images auf deinem System vorhanden sind, kannst du:

```bash
$ docker image ls
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
fav_distro          jammy_jellyfish     c2ca09a1934b        2 minutes ago       38.64MB
ubuntu              22.04               c2ca09a1934b        2 minutes ago       38.64MB
```

Hier siehst du, dass das `fav_distro:jammy_jellyfish`-Tag dasselbe Image wie `ubuntu:22.04` referenziert.

### 6. **Zusammenfassung**

Ein Docker-Image-Name besteht aus folgenden Teilen:
- **Registry**: Die Quelle des Images (z.B. Docker Hub, quay.io).
- **Organisation**: Ein Benutzer oder eine Organisation, z.B. `library` (für offizielle Images).
- **Image-Name**: Der Name des Images (z.B. `ubuntu`).
- **Tag**: Eine Version des Images, z.B. `22.04` oder `latest`.

Der vollständige Name sieht folgendermaßen aus:

```bash
registry/organisation/image:tag
```

Beispiel für ein offizielles Image:

```bash
library/ubuntu:latest
```

Falls der Registry-Name weggelassen wird, wird standardmäßig **Docker Hub** verwendet, und das Tag `latest` wird angenommen, wenn kein Tag angegeben wird.

---
