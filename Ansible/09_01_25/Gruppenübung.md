# Sophie Beispiel 

| Hostname    | IP Address   | Group       | Port | User   |
|-------------|--------------|-------------|------|--------|
| server1     | 192.168.1.1  | web         | 22   | ubuntu |
| server2     | 192.168.1.2  | db          | 3306 | admin  |
| server3     | 192.168.1.3  | web         | 22   | root   |


überprüfen mit `ansible-inventory --list -i inventory.ini`

----

## Gruppe

### Übung 1

| Hostname    | IP Address   | Group       | Port | User    |
|-------------|--------------|-------------|------|---------|
| server1     | 192.168.1.1  | web         | 22   | ubuntu  |
| server2     | 192.168.1.2  | db          | 3306 | admin   |
| server3     | 192.168.1.3  | web         | 22   | ubuntu  |
| server4     | 192.168.1.4  | cache       | 6379 | memcache|
| server5     | 192.168.1.5  | cache       | 6379 | memcache|

----

### Übung 2

### **Neue Gruppen:**

Füge zwei neue Gruppen hinzu:

- `backup` für Backups
- `monitoring` für Überwachung.

### **Neue Server:**

1. **Server 6**:
    - **Hostname**: `server6`
    - **IP**: `192.168.1.6`
    - **Group**: `backup`
    - **Port**: `9000`
    - **User**: `backupuser`
2. **Server 7**:
    - **Hostname**: `server7`
    - **IP**: `192.168.1.7`
    - **Group**: `monitoring`
    - **Port**: `8080`
    - **User**: `monitor`

----

### Übung 3 

Finde den Fehler

```
[web]
server1 ansible_host=192.168.1.1 ansible_user=ubuntu
server3 ansible_host=192.168.1.3 ansible_port=22  # bla blub

[db]
server2 ansible_host=192.168.1.2 ansible_port=3306 ansible_user=admin

[cache]
server4 ansible_host=192.168.1.4 ansible_port=6379 ansible_user=memcache
server5 ansible_host=192.168.1.5 ansible_port=6379 ansible_user=memcache

[db]  # Doppelte Definition
server6 ansible_host=192.168.1.6 ansible_port=3306 ansible_user=backupuser

[monitoring]
server7 ansible_host=192.168.1.7 ansible_port=8080 ansible_user
```


Ergänze die korrigierte Datei um folgende Anforderungen:

1. Füge eine neue Gruppe `backup` hinzu mit einem Server:
    - Hostname: `server8`
    - IP-Adresse: `192.168.1.8`
    - Port: `9000`
    - Benutzer: `backupuser`
2. Ergänze bei allen Servern die Variable `ansible_become=true`.
