### **Tag 2: Einführung in Ansible mit AWS und Terraform**

[Install Terraform | Terraform | HashiCorp Developer](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli)

### **Praktisches Beispiel: EC2-Instanzen mit Terraform und Ansible verwalten**

[https://sandboxes.techstarter.de/](https://sandboxes.techstarter.de/)

`aws configure sso`

### Neue Anleitung zur Installation von AWS CLI

1. **Herunterladen der AWS CLI Installationsdatei:**
   ```bash
   curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
   ```

2. **Installation von `unzip`, falls noch nicht vorhanden:**
   ```bash
   sudo apt install unzip
   ```

3. **Entpacken der heruntergeladenen ZIP-Datei:**
   ```bash
   unzip awscliv2.zip
   ```

4. **Installation der AWS CLI:**
   ```bash
   sudo ./aws/install
   ```

5. **Überprüfung der Installation:**
   ```bash
   aws --version
   ``` 

> Diese Anleitung gilt für Linux-Systeme mit apt-Paketmanager. 

**Key Pair in der AWS-Konsole erstellen**:

- Gehe zu der **AWS EC2 Konsole**.
- Wähle die Region aus, in der du die Instanz erstellen möchtest.
- Gehe zu **Network & Security > Key Pairs**.
- Klicke auf **Create key pair** und erstelle ein neues Key Pair. Gib ihm denselben Namen, den du in deiner Terraform-Konfiguration verwendet hast (in diesem Fall `my-key`), oder wähle einen anderen Namen.
- Lade den privaten Schlüssel herunter, der für den Zugriff auf die EC2-Instanz erforderlich ist. Dieser wird nur einmal beim Erstellen des Key Pairs zur Verfügung gestellt.

### **Schritt 1: Infrastruktur mit Terraform erstellen**

1. **Terraform-Konfigurationsdatei erstellen** Erstelle ein Verzeichnis `terraform-ansible-demo` und eine Datei `main.tf` mit folgendem Inhalt:
  
  ```hcl
  provider "aws" {
   region  = "eu-central-1"
   profile = "teacher-396913703234"
  }
  
  resource "aws_security_group" "allow_ssh" {
   name        = "allow_ssh"
   description = "Allow SSH inbound traffic"
  
   ingress {
     from_port   = 22
     to_port     = 22
     protocol    = "tcp"
     cidr_blocks = ["0.0.0.0/0"]  # Alle IPs zulassen, ggf. einschränken
   }
  
   egress {
     from_port   = 0
     to_port     = 0
     protocol    = "-1"
     cidr_blocks = ["0.0.0.0/0"]
   }
  }
  
  resource "aws_instance" "example" {
   count         = 2
   ami           = "ami-0e54671bdf3c8ed8d"  # Amazon Linux 2023 (x86_64)
   instance_type = "t2.micro"
   key_name      = "my-ec2-key"
   security_groups = [aws_security_group.allow_ssh.name]
  
   tags = {
     Name = "AnsibleInstance-${count.index + 1}"
   }
  
   associate_public_ip_address = true  # Stellt sicher, dass eine öffentliche IP zugewiesen wird
  }
  
  output "public_ips" {
   value = aws_instance.example.*.public_ip
  }
  ```
  
  > Hinweis: Ersetze my-key durch den Namen deines SSH-Schlüssels, der in AWS hinterlegt ist.
  
  ---
  
  ### Best Practices für die Strukturierung eines Terraform-Projekts
  
  1. **Provider-Konfiguration**:
    Die Konfiguration des Providers, z. B. AWS, sollte in einer eigenen Datei wie `provider.tf` abgelegt werden. Dadurch ist der Provider leicht zu finden und zu ändern.
  2. **Ressourcen**:
    Ressourcen wie EC2-Instanzen und Sicherheitsgruppen sollten in eigenen Dateien wie `instances.tf` oder `security_groups.tf` abgelegt werden, je nach Anzahl und Typ der Ressourcen. So wird die Logik der Ressourcen voneinander getrennt.
  3. **Variablen**:
    Falls du Variablen verwendest (z. B. für den AMI-ID, Region oder Instanztypen), ist es sinnvoll, diese in einer eigenen Datei wie `variables.tf` zu definieren. Es wird auch empfohlen, Standardwerte und Beschreibungen zu hinterlassen, wenn du sie verwenden möchtest.
  4. **Ausgaben**:
    Ausgaben (wie die öffentlichen IPs der Instanzen) sollten in einer Datei wie `outputs.tf` definiert werden.
  5. **State und Backend-Konfiguration**:
    Für größere Projekte oder Teams empfiehlt es sich, ein Remote-Backend zu verwenden (z. B. AWS S3). Die Konfiguration des Backends sollte ebenfalls in einer separaten Datei wie `backend.tf` abgelegt werden.
  
  ### `provider.tf`
  
  In dieser Datei definierst du den AWS-Provider und die Region sowie das Profil, ohne Variablen zu verwenden:
  
  ```hcl
  provider "aws" {
   region  = "eu-central-1"
   profile = "teacher-396913703234"
  }
  ```
  
  ### `security_groups.tf`
  
  Die Sicherheitsgruppe bleibt unverändert:
  
  ```hcl
  resource "aws_security_group" "allow_ssh" {
   name        = "allow_ssh"
   description = "Allow SSH inbound traffic"
  
   ingress {
     from_port   = 22
     to_port     = 22
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
  ```
  
  ### `instances.tf`
  
  In dieser Datei definierst du die EC2-Instanzen und gibst die Werte für AMI und Instanztyp direkt an:
  
  ```hcl
  resource "aws_instance" "example" {
   count         = 2
   ami           = "ami-0e54671bdf3c8ed8d"  # Direktes AMI angeben
   instance_type = "t2.micro"               # Direktes Instanztyp angeben
   key_name      = "my-ec2-key"
   security_groups = [aws_security_group.allow_ssh.name]
  
   tags = {
     Name = "AnsibleInstance-${count.index + 1}"
   }
  
   associate_public_ip_address = true
  }
  ```
  
  ### `outputs.tf`
  
  Die Datei `outputs.tf` bleibt ebenfalls unverändert, da du die Ausgaben der EC2-Instanzen definierst:
  
  ```hcl
  output "public_ips" {
   value = aws_instance.example.*.public_ip
  }
  ```
  
  ### Zusätzliche Hinweise:
  
  - **Provider**: In der `provider.tf`Datei wird der AWS-Provider mit den festen Werten für Region und Profil konfiguriert. Diese Werte kannst du nach Bedarf ändern.
  - **Ressourcen**: In der `instances.tf`Datei wird die EC2-Instanz mit festen Werten für das AMI und den Instanztyp definiert.
  - **Sicherheitsgruppen**: In der `security_groups.tf`Datei bleibt die Sicherheitsgruppe unverändert, da sie für die Instanzen zuständig ist.
  - **Ausgaben**: Die Ausgaben (wie die öffentlichen IPs der Instanzen) bleiben ebenfalls unverändert.
  
  ---
  
  ## Mit Variablen
  
  1. **`security_groups.tf`**:
  
  ```hcl
  resource "aws_security_group" "allow_ssh" {
   name        = "allow_ssh"
   description = "Allow SSH inbound traffic"
  
   ingress {
     from_port   = 22
     to_port     = 22
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
  ```
  
  1. **`outputs.tf`**:
  
  ```hcl
  output "public_ips" {
   value = aws_instance.example.*.public_ip
  }
  ```
  
  ### `variables.tf`:
  
  ```hcl
  variable "region" {
   description = "AWS region"
   default     = "eu-central-1"
  }
  
  variable "profile" {
     description = "Profile name"
     default = "teacher-396913703234"
  }
  variable "ami" {
   description = "AMI ID"
   default     = "ami-0e54671bdf3c8ed8d"
  }
  
  variable "instance_type" {
   description = "Instance type"
   default     = "t2.micro"
  }
  ```
  
  ### `provider.tf`:
  
  ```hcl
  provider "aws" {
   region  = var.region
   profile = var.profile
  }
  ```
  
  ### `instances.tf`:
  
  ```hcl
  resource "aws_instance" "example" {
   count         = 2
   ami           = var.ami
   instance_type = var.instance_type
   key_name      = "my-ec2-key"
   security_groups = [aws_security_group.allow_ssh.name]
  
   tags = {
     Name = "AnsibleInstance-${count.index + 1}"
   }
  
   associate_public_ip_address = true
  }
  ```
  
  Nun sind die Werte für `ami` und `instance_type` variabel und können in einer `terraform.tfvars`-Datei oder bei der Ausführung von `terraform apply` über die Kommandozeile geändert werden.
  
  So kannst du das Terraform-Projekt flexibler gestalten, indem du Variablen einführst, die du an zentraler Stelle definieren und bei Bedarf ändern kannst.
  
2. **Terraform-Befehle ausführen**
  
  ```bash
  terraform init
  terraform apply
  ```
  
  Bestätige die Änderungen mit `yes`. Terraform erstellt zwei EC2-Instanzen und gibt deren öffentliche IP-Adressen aus.
  

---

```jsx
ssh -i /home/sophie/.ssh/my-ec2-key.pem ec2-user@18.184.227.225
   ,     #_
   ~\\_  ####_        Amazon Linux 2023
  ~~  \\_#####\\
  ~~     \\###|
  ~~       \\#/ ___   <https://aws.amazon.com/linux/amazon-linux-2023>
   ~~       V~' '->
    ~~~         /
      ~~._.   _/
         _/ _/
       _/m/'
Last login: Thu Jan  9 17:13:19 2025 from 145.254.156.110
[ec2-user@ip-172-31-47-15 ~]$ 
```

### **Schritt 3: Ansible verwenden**

Erstellen ini Datei

```bash
[servers]
web1 ansible_host=63.176.91.206 ansible_user=ec2-user 
web2 ansible_host=18.194.45.182 ansible_user=ec2-user

[all:vars]
ansible_ssh_private_key_file=/home/sophie/.ssh/my-ec2-key.pem
ansible_python_interpreter=/usr/bin/python3
```

1. **Verbindung testen** Stelle sicher, dass Ansible auf die Instanzen zugreifen kann:
  
  ```bash
  ansible -i inventory.ini all -m ping
  ```
  
  bei Fehler
  
  `chmod 400` für den Schlüssel 
  

  - Überprüft, ob die Hosts erreichbar sind und Ansible korrekt mit ihnen kommunizieren kann.
2. Der Rest des Playbooks bleibt wie zuvor, stellt jedoch sicher, dass nur erreichbare Server bearbeitet werden.

Wenn ein Server nicht erreichbar ist, bricht das Playbook für diesen Host ab, und die nachfolgenden Schritte werden nicht ausgeführt.
