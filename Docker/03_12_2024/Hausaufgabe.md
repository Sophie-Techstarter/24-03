# Hausaufgabe

## Aufgabe 1: Erstelle eine einfache Webanwendung mit Docker 

#### Schritt 1: Erstelle das Projektverzeichnis und die Dateien

1. Erstelle ein Verzeichnis für dein Projekt:

2. Erstelle eine einfache HTML-Datei (index.html) im Verzeichnis:

3. Erstelle ein `Dockerfile` im gleichen Verzeichnis:
   ```Dockerfile
   # Verwende das Nginx-Image als Basis
   FROM 

   # Kopiere die HTML-Datei in das Verzeichnis, das von Nginx verwendet wird
   COPY 
   ```

#### Schritt 2: Baue das Docker-Image

1. Baue das Docker-Image:


#### Schritt 3: Erstelle ein benutzerdefiniertes Docker-Netzwerk

1. Erstelle ein benutzerdefiniertes Docker-Netzwerk:


#### Schritt 4: Starte den Docker-Container im Netzwerk

1. Starte den Container und verbinde ihn mit dem benutzerdefinierten Netzwerk:

2. Öffne deinen Browser und gehe zu `http://localhost:8080`, um die einfache Webanwendung zu sehen.

#### Schritt 5: Überprüfe das Netzwerk

1. Überprüfe, ob der Container im benutzerdefinierten Netzwerk läuft:

   Du solltest sehen, dass der `webapp`-Container mit diesem Netzwerk verbunden ist.

### Was du gelernt hast:
- Wie man ein Docker-Image erstellt und verwendet.
- Wie man ein benutzerdefiniertes Docker-Netzwerk erstellt und Container darin verbindet.
  

## Aufgabe 2: Containerisiert eure Praxisprojekte


### 1. **Projekt vorbereiten**.
   - Erstellt ein **Dockerfile**, um das Projekt in einem Docker-Image zu containerisieren.

### 2. **Dockerfile erstellen**
   - Wählt ein Basisimage aus .
   - Kopiert die Projektdateien ins Image.
   - Installiert Abhängigkeiten mit Paketmanagern wie oder `npm`.
   - Definiert den Startbefehl mit `CMD`.
   
### 3. **Docker-Image bauen**

### 4. **Container starten**
   

