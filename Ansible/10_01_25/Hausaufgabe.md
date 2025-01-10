# Hausaufgabe

Wiederhole die Aufgabe von heute noch einmal selbstständig und von Grund auf.

[24-03/Ansible/10_01_25/ansible_mit_aws+terrform.md at main · Sophie-Techstarter/24-03 · GitHub](https://github.com/Sophie-Techstarter/24-03/blob/main/Ansible/10_01_25/ansible_mit_aws+terrform.md)

Abgabe: Screenshot des gesamten Bildschirms, damit die Uhrzeit erkennbar ist. Mit folgender Ausgabe:

```bash
sophie@DESKTOP-NK5NNOJ:~/24-03/ansible/10_01_25/ansible$ ansible -i inventory.ini all -m ping
web2 | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
web1 | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
```
