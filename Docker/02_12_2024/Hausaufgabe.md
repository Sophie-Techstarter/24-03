## Aufgabe 1

1. **Container starten und interaktiv arbeiten:**  
    Starte einen neuen Docker-Container mit einem Ubuntu-Image und erläutere dabei, was bei der Ausführung des Befehls passiert. Gehe insbesondere auf folgende Punkte ein:
    
    - Was bedeutet die Option `-it`?
    - Warum wird das Image aus dem Docker-Repository heruntergeladen, und was passiert, wenn das Image lokal nicht vorhanden ist?
    
    **Screenshot:**  
    Mache einen Screenshot von der Kommandozeile **vor** und **nach** dem Ausführen des Befehls. Zeige den Download des Images und die Öffnung der Container-Shell.
    
2. **Arbeiten im Container:**
    
    - Erstelle eine Textdatei im Container und füge den Text "Daten im Container" hinzu.
    - Zeige die erstellte Datei an und erkläre, warum diese Datei im Container vorhanden ist.
    
    **Screenshot:**  
    Mach einen Screenshot der Container-Shell, nachdem du die Datei erstellt und angezeigt hast, um den Inhalt zu zeigen.
    
3. **Container beenden:**
    
    - Verlasse den Container mit dem Befehl `exit`.
    - Was passiert mit dem Container, nachdem der Befehl `exit` ausgeführt wurde?
    - Überprüfe den Status des Containers mit `docker ps -a`. Was zeigt der Befehl an, und warum wird der Container als „Exited“ angezeigt?
    
    **Screenshot:**  
    Mache einen Screenshot der Kommandozeile, nachdem du den Container verlassen hast, und zeige die Ausgabe des Befehls `docker ps -a`, um den Status des Containers zu überprüfen.
    
4. **Datenpersistenz in Docker:**
    
    - Starte einen neuen Container und wiederhole den Schritt der Datei-Erstellung. 
    - Erkläre, warum die erstellte Datei nicht mehr vorhanden ist.
    
    **Screenshot:**  
    Mach einen Screenshot, der zeigt, dass die Datei nicht mehr vorhanden ist.
    
5. **Verwendung von Volumes:**
    
    - Erstelle ein Docker-Volume und starte einen neuen Container, der mit diesem Volume verbunden ist. Speichere eine Datei darin.
    - Erkläre, wie Volumes in Docker funktionieren und warum die Datei nach dem Beenden des Containers und dem Neustarten des Containers weiterhin verfügbar ist.
    
    **Screenshot:**  
    Mache einen Screenshot der Container-Shell, nachdem du eine Datei im Volume gespeichert hast, um die Funktionsweise von Volumes zu dokumentieren.
    
6. **Überprüfen von Volumes:**
    
    - Überprüfe nach dem Neustart des Containers, der mit einem Volume verbunden ist, den Inhalt des Volumes und stelle sicher, dass die Datei noch vorhanden ist.
    - Überprüfe mit `docker volume ls`, ob das Volume tatsächlich existiert und welches Volumen der Container verwendet.
    
    **Screenshot:**  
    Mache einen Screenshot, der den Inhalt des Volumes zeigt und die Ausgabe des Befehls `docker volume ls`, um das Volume zu überprüfen.
    

**Hinweis:**  
In jedem Schritt solltest du dokumentieren, was genau passiert und welche Auswirkungen auf den Container sowie die Daten bestehen. Screenshots sind wichtig, um den Verlauf und die Ergebnisse der Schritte visuell nachzuvollziehen.

---
## Aufgabe 2

### Express-App mit Docker und Volumes für Logs

Als wir Winston kennengelernt haben, haben wir zu Beginn die folgende kleine Anwendung geschrieben.

#### **1. Express-Server erstellen (`app.js`)**

- Implementiere die unten gezeigte Anwendung:

```javascript
const express = require('express');
const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Erstelle den Express-Server
const app = express();
const port = 3000;

// Erstelle ein Winston-Logger-Objekt
const logDir = path.join(__dirname, 'logs');

// Stelle sicher, dass das Logs-Verzeichnis existiert (wenn nicht, erstelle es)
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Erstelle eine Logger-Konfiguration mit Winston
const logger = winston.createLogger({
  level: 'info',  // Log-Level
  format: winston.format.combine(
    // Zeitstempel für die Log-Nachricht
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    // Formatierte Ausgabe der Log-Nachricht
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    // Schreibe Logs in eine Datei
    new winston.transports.File({ filename: path.join(logDir, 'zugriffe.log') })
  ]
});

// Middleware für das Logging von Anfragen
app.use((req, res, next) => {
  logger.info(`Accessed ${req.url}`); // Logge den Zugriff
  next(); // Führe die nächste Middleware oder Route aus
});

// Route für die Startseite
app.get('/', (req, res) => {
  res.send('Hello, Docker Volumes!');
});

// Route für das Log
app.get('/log', (req, res) => {
  res.send('Log written successfully!');
});

// Starte den Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
```

- Die App loggt Anfragen mit Winston in `logs/zugriffe.log`.
- **Screenshot:** Mache einen Screenshot des vollständigen Codes in der Datei `app.js`.

---

#### **2. Dockerfile schreiben**

Erstelle eine `Dockerfile` mit folgenden Anforderungen:

- Basis: `node:20-alpine`.
    
- Kopiere App-Dateien, installiere Abhängigkeiten und starte den Server.
    
- **Screenshot:** Mache einen Screenshot des vollständigen `Dockerfile`.
    

---

#### **3. Docker-Image erstellen**

- Erstelle ein Docker-Image mit dem Befehl:
 
- **Screenshot:** Terminal mit dem erfolgreichen Build-Output.
    

---

#### **4. Container starten**

- Starte den Container im **detached Modus**:
 
- **Screenshot:** Terminalausgabe des Startbefehls und des Ergebnisses von `docker ps`.
    
---

#### **5. Die Seite aufrufen**

- Besuche `http://localhost:3000` und die Route `/log` im Browser.
- **Screenshot:** Seitenansicht im Browser für die Startseite und `/log`.

---

#### **6. Logs auslesen**

- Greife in den Container zu und prüfe die Logs:
    
    ```bash
    docker exec -it express-container /bin/sh
    cat logs/zugriffe.log
    ```
    
- **Screenshot:** Terminalausgabe des Log-Inhalts.
    

---

#### **7. Problem analysieren**

- Stoppe und lösche den Container:
   
- Starte einen neuen Container aus dem Image und greife **nicht** auf die Seite zu:

- Frage: **Warum gibt es keine Logs im Container?**

---

### **Volumes für persistente Logs**

#### **1. Volume erstellen**

- Erstelle ein Volume:
  
- **Screenshot:** Terminal mit dem erstellten Volume (`docker volume ls`).
    

---

#### **2. Container mit Volume starten**

- Starte einen Container mit dem Volume und binde es an das Verzeichnis `app/logs`:

- **Screenshot:** Terminal mit dem Startbefehl und `docker ps`.
    

---

#### **3. Logs füllen**

- Besuche die Seite mehrmals unter `http://localhost:3000` und `/log`.
- **Screenshot:** Seitenansicht im Browser bei den verschiedenen Aufrufen.

---

#### **4. Logs prüfen**

- Greife in den Container zu und prüfe die Logs:

- **Screenshot:** Terminalausgabe des Log-Inhalts.
    

---

#### **5. Container löschen und erneut starten**

- Stoppe und lösche den Container:

- Starte einen neuen Container mit dem gleichen Volume:

- Prüfe erneut die Logs.
    
- **Screenshot:** Terminalausgabe zeigt, dass die Logs weiterhin verfügbar sind.
    
- Was fällt dir auf?
