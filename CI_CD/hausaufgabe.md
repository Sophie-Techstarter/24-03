**Aufgabe:**

1. **Repo forken und klonen:**
   - Forke das Repository [docker-react-to-do](https://github.com/Sophie-Techstarter/docker-react-to-do) auf GitHub und klone es anschließend auf deinen lokalen Rechner.

2. **Dockerfiles erstellen:**
   - Erstelle für das Frontend und das Backend jeweils ein Dockerfile.
   - Für das Frontend erstelle ein **Multistage Dockerfile** mit Nginx (wie gestern besprochen), um das React-Frontend zu bauen und es dann mit Nginx zu hosten.
   - Erstelle ein Dockerfile für das Backend, das den Node.js-Server containerisiert.

3. **Docker Images erstellen:**
   - Erstelle die Docker Images für sowohl das Frontend als auch das Backend.
   - Teste beide Images lokal, um sicherzustellen, dass sie ordnungsgemäß laufen.

4. **Docker Images in Docker Hub hochladen:**
   - Lade die erstellten Docker Images in dein Docker Hub Repository hoch, um sie später auf einer EC2 Instanz zu verwenden.

5. **EC2 Instanz per Terraform erstellen:**
   - Nutze **Terraform**, um eine EC2 Instanz in AWS zu erstellen, auf der später die Docker Container laufen.

6. **Automatisierung mit Ansible:**
   - Erstelle ein Ansible Playbook, um folgende Schritte automatisch durchzuführen:
     - Installiere Docker auf der EC2 Instanz.
     - Lade die Docker Images von Docker Hub herunter.
     - Baue und starte die Docker Container für das Frontend und Backend.
     - Stelle sicher, dass beide Container laufen und die Anwendung über den Browser erreichbar ist.

7. **Verfügbarkeit testen:**
   - Teste nach der Ausführung von Ansible, ob die Anwendung auf der EC2 Instanz zugänglich ist und korrekt funktioniert (Frontend und Backend sollten miteinander kommunizieren).
