# Teil 1
### Schritt 1: SSH-Verbindung zur EC2-Instanz herstellen

1. **Stelle sicher, dass du die richtige SSH-Konfiguration hast:**
   - Du benötigst das private SSH-Schlüsselzertifikat (z. B. `my-key.pem`), das bei der Erstellung der EC2-Instanz mit Terraform verwendet wurde.
   - Der öffentliche DNS-Name deiner EC2-Instanz, z. B. `ec2-xx-xxx-xxx-xxx.compute-1.amazonaws.com`.

2. **SSH-Verbindung zur EC2-Instanz herstellen:**
   Öffne ein Terminal und führe den folgenden Befehl aus:

   ```bash
   ssh -i /path/to/my-key.pem ec2-user@ec2-xx-xxx-xxx-xxx.compute-1.amazonaws.com
   ```

   Ersetze `/path/to/my-key.pem` mit dem Pfad zu deinem Schlüssel und `ec2-user` durch den richtigen Benutzernamen (je nach AMI kann es auch `ubuntu` oder `centos` sein).

### Schritt 2: `cowsay` ausprobieren (es wird nicht funktionieren)

1. **Versuche, `cowsay` direkt auszuführen:**

   Gib im Terminal folgendes ein:

   ```bash
   cowsay "Hello!"
   ```

   Da `cowsay` nicht installiert ist, erhältst du eine Fehlermeldung wie:
   ```bash
   bash: cowsay: command not found
   ```

### Schritt 3: Ansible-Playbook zum Pingen der Instanz erstellen

Jetzt werden wir das Ansible-Playbook so anpassen, dass es lediglich die Instanz pingt, um zu testen, ob alles korrekt eingerichtet ist.

1. **Erstelle das Playbook für das Pingen:**
   
   Erstelle eine Datei namens `ping_playbook.yml` mit folgendem Inhalt:

   ```yaml
   ---
   - name: Ping all servers
     hosts: all
     become: yes  # Um root-Rechte zu erhalten, falls erforderlich
     tasks:
       - name: Ping all servers
         ansible.builtin.ping:
   ```

2. **Führe das Playbook aus:**

   Führe im Terminal (auf deinem Steuerungscomputer, nicht auf der EC2-Instanz) folgenden Befehl aus, um sicherzustellen, dass die Verbindung funktioniert:

   ```bash
   ansible-playbook -i your_inventory_file ping_playbook.yml
   ```

   Ersetze `your_inventory_file` durch den Pfad zu deiner Ansible-Hosts-Datei, die die EC2-Instanz enthält.

   **Erklärung:**
   - `ansible.builtin.ping` stellt sicher, dass Ansible in der Lage ist, mit der Instanz zu kommunizieren.

### Schritt 4: `cowsay` installieren und testen

Nun erweitern wir das Playbook, um `cowsay` zu installieren und dann mit SSH zu testen, ob es funktioniert.

1. **Erstelle das Playbook zum Installieren von `cowsay`:**
   
   Erstelle oder bearbeite die Datei `install_cowsay.yml`:

   ```yaml
   ---
   - name: Install and verify cowsay on all servers
     hosts: all
     become: yes  # Um root-Rechte zu erhalten, falls erforderlich
     tasks:
       - name: Install cowsay
         package:
           name: cowsay
           state: present
   ```

2. **Führe das Playbook aus, um `cowsay` zu installieren:**

   ```bash
   ansible-playbook -i your_inventory_file install_cowsay.yml
   ```

   **Erklärung:**
   - Der `package`-Modul in Ansible stellt sicher, dass `cowsay` auf allen angegebenen Hosts installiert wird.

3. **Teste die Installation per SSH:**
   - Logge dich wieder per SSH in die EC2-Instanz ein.
   - Gib erneut den Befehl ein:

     ```bash
     cowsay "Hello from EC2!"
     ```

   - Du solltest nun die erwartete Ausgabe sehen, ähnlich wie:

     ```bash
      ________
     < Hello from EC2! >
      --------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
     ```


### Zusammenfassung

- **Schritt 1**: Verbinde dich per SSH mit der EC2-Instanz und teste, dass `cowsay` nicht installiert ist.
- **Schritt 2**: Erstelle und führe ein einfaches Ansible-Playbook zum Pingen der Instanz aus.
- **Schritt 3**: Installiere `cowsay` mit einem erweiterten Playbook und teste es per SSH.

---

# Teil 2


### 1. **Webserver mit Nginx konfigurieren**

#### Terraform-Konfiguration für EC2-Instanzen:
```hcl
provider "aws" {
  region = "eu-central-1"
}

resource "aws_security_group" "allow_http" {
  name        = "allow_http"
  description = "Allow HTTP inbound traffic"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "webserver" {
  ami           = "ami-0e54671bdf3c8ed8d"  # Amazon Linux 2
  instance_type = "t2.micro"
  key_name      = "my-ec2-key"
  security_groups = [aws_security_group.allow_http.name]

  tags = {
    Name = "NginxWebServer"
  }

  associate_public_ip_address = true
}
```

#### Ansible Playbook für die Installation und Konfiguration von Nginx:
```yaml
---
- name: Set up Nginx web server
  hosts: all
  become: yes
  tasks:
    - name: Install Nginx
      package:
        name: nginx
        state: present

    - name: Start and enable Nginx
      service:
        name: nginx
        state: started
        enabled: yes

    - name: Deploy a sample HTML file
      copy:
        src: /path/to/local/index.html
        dest: /usr/share/nginx/html/index.html

```

In diesem Playbook wird:
1. Nginx installiert.
2. Nginx gestartet und aktiviert, sodass es beim Neustart der Instanz automatisch läuft.
3. Eine Beispiel-HTML-Datei in den Nginx-Webroot `/usr/share/nginx/html/` kopiert.

