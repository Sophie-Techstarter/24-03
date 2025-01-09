# **Tag 1: Einführung in Ansible und Erstellung von Inventory Files**

### **Ziel des Tages:**

Am Ende des ersten Tages sollen die Teilnehmer verstehen, was Ansible ist, wie es funktioniert und wie man einfache Inventory Files erstellt und verwendet.

---

### **1.1 Was ist Ansible? (Theorie)**

- **Ansible als Automatisierungstool**
    
    Ansible ist ein Open-Source-Automatisierungstool, das IT-Administratoren hilft, Aufgaben wie Software-Deployment, Konfigurationen und Systemwartung zu automatisieren. Es arbeitet agentenlos und nutzt SSH für die Kommunikation mit den Zielsystemen.
    
- **Was macht Ansible besonders?**
    
    - Agentenlos (es muss keine Software auf den Zielsystemen installiert werden)
    - Einfach und deklarativ: Man beschreibt, was man will, nicht wie man es macht.
    - Sehr mächtig, aber gleichzeitig einfach zu verwenden.
- **Begriffe in Ansible:**
    
    - **Playbook**: Ein YAML-Dokument, das Ansible-Anweisungen enthält (was, wie und wo).
    - **Play**: Ein Abschnitt in einem Playbook, der Aufgaben für bestimmte Hosts definiert.
    - **Host**: Ein Zielsystem, auf dem Ansible Aufgaben ausführt.
    - **Inventory**: Eine Datei oder eine Datenquelle, die die Zielhosts definiert, mit denen Ansible kommunizieren soll.

---

### **1.2 Was ist ein Inventory File? (Theorie)**

Ein **Inventory File** ist eine Datei, die alle Hosts und ihre Gruppierungen enthält, mit denen Ansible interagieren soll. Es definiert, welche Maschinen für welche Aufgaben verwendet werden.

Es gibt zwei Hauptarten von Inventory-Dateien:

- **Statische Inventories**: Einfache, manuell gepflegte Textdateien (z.B. INI oder YAML).
- **Dynamische Inventories**: Automatisch generierte Inventories, die oft von Cloud-Anbietern oder speziellen APIs erstellt werden.

---

### **1.3 Erstellen eines einfachen Inventory Files (Praktisch)**

### **Erstellen eines INI-Inventories**

Ein einfaches statisches Inventory kann in einer INI-Datei erstellt werden. Diese Datei enthält Hosts und Gruppen von Hosts.

Beispiel:

```
# inventory.ini

[webservers]
web1.example.com
web2.example.com

[databases]
db1.example.com
db2.example.com

```

- **[webservers]** und **[databases]** sind Gruppen, die Hosts enthalten. Ansible verwendet diese Gruppen, um Aufgaben nur für bestimmte Hosts auszuführen.
- Jeder Hostname ist ein Zielsystem, mit dem Ansible über SSH kommuniziert.

---

### **1.4 Weitere Optionen und Variablen im Inventory (Theorie)**

Inventory-Dateien können viel mehr als nur Hosts und Gruppen enthalten. Du kannst zusätzliche Variablen für Hosts oder Gruppen definieren.

Beispiel:

```
# inventory.ini

[webservers]
web1.example.com ansible_ssh_user=ubuntu
web2.example.com ansible_ssh_user=ubuntu

[databases]
db1.example.com ansible_ssh_user=admin
db2.example.com ansible_ssh_user=admin

```

Hier definieren wir benutzerspezifische Variablen (`ansible_ssh_user`), die den SSH-Benutzernamen für die Verbindung zu jedem Host angeben. Das ermöglicht es, auf unterschiedliche Konfigurationen auf verschiedenen Hosts zu reagieren.

---

### **1. Markdown-Tabelle vorbereiten**

Erstelle eine Markdown-Tabelle, die die Serverinformationen enthält. Zum Beispiel:

```markdown
| Hostname    | IP Address   | Group       | Port | User   |
|-------------|--------------|-------------|------|--------|
| server1     | 192.168.1.1  | web         | 22   | ubuntu |
| server2     | 192.168.1.2  | db          | 3306 | admin  |
| server3     | 192.168.1.3  | web         | 22   | root   |

```

**Elemente der Tabelle:**

- **Hostname**: Der Name des Servers.
- **IP Address**: Die IP-Adresse, die der Server verwendet.
- **Group**: Die Gruppe, zu der der Server gehört.
- **Port**: Der Port, über den der Server erreichbar ist.
- **User**: Der Benutzername für die Verbindung.
