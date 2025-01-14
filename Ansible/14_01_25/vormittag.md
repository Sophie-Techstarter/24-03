
---

### **Gesamtüberblick**

Ziel:

1. Docker-Image für die React-App erstellen und auf Docker Hub hochladen.
2. Terraform verwenden, um eine EC2-Instanz in AWS bereitzustellen.
3. Das Docker-Image auf der EC2-Instanz pullen und die App über **Nginx** bereitstellen.

---

https://github.com/Sophie-Techstarter/counter

## **Teil 1: Docker-Image auf Docker Hub hochladen**

```yaml
# 1. Node.js Basis-Image verwenden
FROM node:23-alpine AS build

# 2. Arbeitsverzeichnis setzen
WORKDIR /app

# 3. Abhängigkeiten installieren
COPY package*.json ./
RUN npm install

# 4. App-Build erstellen
COPY . .
RUN npm run build

# 5. Nginx verwenden, um die App bereitzustellen
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# 6. Port 80 öffnen
EXPOSE 80

# 7. Container starten
CMD ["nginx", "-g", "daemon off;"]
```

**1.1 Docker Hub Account erstellen (falls nicht vorhanden)**

1. Erstelle einen Account unter [https://hub.docker.com/](https://hub.docker.com/).
2. Melde dich an und erstelle ein neues Repository:
    - **Name des Repositories:** `react-counter-app`
    - **Sichtbarkeit:** Wähle "Public" oder "Private" (je nach Bedarf).

```
docker buildx build -t counter-app .
```

```
docker run -d -p 80:80 counter-app

```
---

**1.2 Docker-Login ausführen**  
Melde dich in der Kommandozeile bei Docker Hub an:

```bash
docker login
```

---

**1.3 Docker-Image taggen und pushen**

1. Tagge das Docker-Image mit deinem Docker-Hub-Benutzernamen und Repository-Namen:
    
    ```bash
    docker tag [image-name]:[tag] [username]/[repository-name]:[tag]
    ```
    
2. Pushe das Docker-Image zu Docker Hub:
    
    ```bash
    docker push <dein-dockerhub-username>/react-counter-app:1.0
    ```
    
    Beispiel:
    
    ```bash
    docker push sophie/react-counter-app:latest
    ```
    
3. Überprüfe auf Docker Hub, ob das Image hochgeladen wurde.
    

---

## EC2 Instanz mit Terraform erstellen

---

# Einsatz Ansible

```yaml
- name: Deploy React App with Docker
  hosts: webserver
  become: yes
  tasks:
    - name: Update the system
      yum:
        name: "*"
        state: latest

    - name: Install Docker
      yum:
        name: docker
        state: present

    - name: Start and enable Docker
      systemd:
        name: docker
        state: started
        enabled: yes

    - name: Pull Docker image from Docker Hub
      community.docker.docker_image:
        name: "sophieischenkots/react-counter-app"
        tag: "1.0"
        source: pull

    - name: Run Docker container
      community.docker.docker_container:
        name: react-counter-container
        image: "sophieischenkots/react-counter-app:1.0"
        state: started
        restart_policy: always
        published_ports:
          - "80:80"

```


```bash
ansible-playbook -i inventory.ini deploy-react-app.yaml --syntax-check
```

```
ansible-playbook -i inventory.ini deploy-react-app.yml
```

ACHTUNG:

ggf. muss du dein lokales Ubuntu voher akutalisieren über 

```
sudo apt update
sudo apt upgrade
```

---

## Validierung

In Ansible gibt es zwei wichtige Modi, die für das Testen und Validieren von Playbooks und Konfigurationen verwendet werden: der **Check-Modus** (`--check`) und der **Syntax-Check** (`--syntax-check`). Beide haben unterschiedliche Zwecke:

---

### 1. **Ansible Check-Modus** (`--check`)

- Der Check-Modus simuliert die Ausführung eines Playbooks, ohne tatsächlich Änderungen an den Zielsystemen vorzunehmen. Er zeigt an, **was passieren würde**, wenn das Playbook ausgeführt wird.
- Das Ziel ist es, die Auswirkungen eines Playbooks vorab zu überprüfen, um sicherzustellen, dass keine unerwarteten Änderungen durchgeführt werden.
- Ansible führt keine tatsächlichen Änderungen durch, aber es versucht, so viel wie möglich zu validieren.

#### Beispiel:

```bash
ansible-playbook inventory.ini playbook.yml --check
```

#### Verhalten:

- Gibt aus, welche Änderungen vorgenommen würden ("changed"), ohne sie tatsächlich umzusetzen.
- Kann Probleme bei Tasks aufzeigen, z. B. fehlende Variablen oder Syntaxprobleme.
- Nicht alle Module unterstützen den Check-Modus vollständig, daher kann es sein, dass manche Tasks ungenau simuliert werden.
- Dieser Modus ist auch als **Dry-Run** bekannt.

#### Verwendung:

- Ideal für Tests, um sicherzustellen, dass ein Playbook fehlerfrei ist und wie gewünscht funktioniert, bevor es tatsächlich ausgeführt wird.

---

### 2. **Ansible Syntax-Check** (`--syntax-check`)

- Der Syntax-Check überprüft ausschließlich die Syntax des Playbooks, ohne es auszuführen oder Simulationen durchzuführen.
- Es handelt sich um einen reinen Validierungsprozess, der prüft, ob das Playbook **korrekt geschrieben** ist und keine Syntaxfehler enthält.

#### Beispiel:

```bash
ansible-playbook inventory.ini playbook.yml --syntax-check
```

#### Verhalten:

- Gibt Fehler aus, wenn die YAML-Syntax falsch ist, z. B. falsche Einrückungen, ungeschlossene Anführungszeichen oder ungültige Module.
- Führt keine Logik aus, keine Variablenüberprüfung und keine Simulation.
- Sehr schnell, da es nur die Syntax analysiert.

#### Verwendung:

- Nützlich, um sicherzustellen, dass ein Playbook überhaupt "gültig" ist, bevor weitere Tests oder die Ausführung erfolgen.
