# YAML-Syntax verstehen**  

#### **Ziel des Tages:**  
YAML (Yet Another Markup Language) ist eine wichtige Grundlage für viele DevOps-Tools wie GitHub Actions, Ansible, Docker Compose, und Kubernetes. Heute lernst du die YAML-Syntax, die dir hilft, komplexere Konfigurationen zu schreiben.

---

####  YAML in der Praxis: GitHub Actions
1. Erstelle eine komplexere GitHub Actions-Pipeline mit mehreren Jobs:  
   ```yaml
   name: CI/CD Pipeline

   on:
     push:
       branches:
         - main

   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - name: Build project
           run: echo "Building the project..."

     test:
       runs-on: ubuntu-latest
       needs: build
       steps:
         - uses: actions/checkout@v3
         - name: Run tests
           run: echo "Running tests..."

     deploy:
       runs-on: ubuntu-latest
       needs: test
       steps:
         - name: Deploy to production
           run: echo "Deploying application!"
   ```  


---

#### YAML für Docker Compose 
Erstelle eine `docker-compose.yaml` für eine einfache Webanwendung:  
```yaml
version: '3.8'

services:
  app:
    image: nginx
    ports:
      - "8080:80"

  database:
    image: postgres
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: geheim
      POSTGRES_DB: myapp
```

---

### Grundstruktur von YAML (Schlüssel-Wert-Paare)

In YAML besteht die einfachste Struktur aus **Schlüssel-Wert-Paaren**. Hier ein Beispiel, das als Tabelle dargestellt wird:

### **Tabelle: Beispiel für Schlüssel-Wert-Paare**

|Schlüssel|Wert|
|---|---|
|`name`|`John Doe`|
|`age`|`30`|

In YAML sieht das so aus:

```yaml
name: John Doe
age: 30

```

---

### Arrays (Listen) in YAML

Arrays können auf verschiedene Arten in YAML dargestellt werden.

### a) **Mit Bindestrichen (Standard-Liste)**

Jedes Element in einer Liste beginnt mit einem Bindestrich (`-`).

### **Tabelle: Beispiel für ein Array von Früchten**

|Index|Wert|
|---|---|
|1|Apfel|
|2|Banane|
|3|Orange|

In YAML:

```yaml
fruits:
  - Apfel
  - Banane
  - Orange

```

### b) **Inline-Notation für Arrays**

Für kurze Listen kannst du eine kompakte Darstellung verwenden.

### **Tabelle: Inline-Notation für ein Array**

Früchte

---

[Apfel, Banane, Orange]

---

In YAML:

```yaml
fruits: [Apfel, Banane, Orange]

```

---

### Verschachtelte Arrays und Objekte

Arrays können auch **Objekte** oder andere **Arrays** enthalten. Das bedeutet, du kannst komplexere Strukturen darstellen.

### **Tabelle: Array mit verschachtelten Objekten**

|Index|Name|Position|
|---|---|---|
|1|John|Manager|
|2|Anna|Developer|
|3|Max|Designer|

In YAML:

```yaml
employees:
  - name: John
    position: Manager
  - name: Anna
    position: Developer
  - name: Max
    position: Designer

```

### **Tabelle: Array von Objekten innerhalb einer Firma**

|Schlüssel|Wert|
|---|---|
|`company`|`TechCorp`|
|`employees`|`[ {name: John, position: Manager}, {name: Anna, position: Developer}, {name: Max, position: Designer} ]`|

In YAML:

```yaml
company:
  name: TechCorp
  employees:
    - name: John
      position: Manager
    - name: Anna
      position: Developer
    - name: Max
      position: Designer

```

---
