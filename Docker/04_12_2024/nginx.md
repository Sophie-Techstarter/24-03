
# **Zero to Hero: Nginx als Reverse Proxy mit Docker und Node.js auf Windows**

## **Zielsetzung**
- **Lernziele**:
  - Du wirst lernen, wie du eine **Node.js-Anwendung in einem Docker-Container** erstellst.
  - Du wirst verstehen, wie **Nginx** als **Reverse Proxy** verwendet wird.
  - Du wirst den **Zusammenhang von Lastverteilung** und **Docker Compose** verstehen und wie du diese Technologien zusammen einsetzt, um die Skalierbarkeit zu erhöhen.
  
---

## **Teil 1: Nginx lokal einrichten, einzelne Node.js-Container erstellen und Lastverteilung**

### **1. Was ist Containerisierung und warum nutzen wir Docker?**
**Containerisierung** ermöglicht es uns, Anwendungen und ihre Abhängigkeiten in isolierten Umgebungen (Containern) auszuführen, wodurch die Portabilität und Skalierbarkeit der Anwendung verbessert wird. **Docker** ist ein Tool, das diese Container vereinfacht, indem es die Anwendungen in eine standardisierte Form verpackt.


## Was ist Nginx?

Nginx ist eine Software, die auf Computern (Servern) läuft und hauptsächlich für drei Dinge verwendet wird:

1. **Webserver:** Nginx kann Webseiten an Benutzer ausliefern, wenn diese sie in ihrem Browser aufrufen.

2. **Reverse Proxy:** Nginx kann als "Vermittler" zwischen den Benutzern und anderen Servern fungieren. Es nimmt Anfragen von Benutzern entgegen und leitet sie an die richtigen Server weiter.

3. **Lastverteiler:** Wenn viele Benutzer gleichzeitig auf eine Webseite zugreifen, kann Nginx die Anfragen auf mehrere Server verteilen, damit kein einzelner Server überlastet wird.

## Grundlegende Funktionsweise

1. Ein Benutzer gibt eine Webadresse in seinen Browser ein, z.B. www.example.com.

2. Diese Anfrage erreicht zuerst den Nginx-Server.

3. Nginx entscheidet dann, was mit dieser Anfrage geschehen soll:
   - Es kann die Webseite direkt ausliefern, wenn es als Webserver konfiguriert ist.
   - Es kann die Anfrage an einen anderen Server weiterleiten, wenn es als Reverse Proxy eingerichtet ist.
   - Es kann die Anfrage an einen von mehreren Servern weiterleiten, wenn es als Lastverteiler fungiert.

4. Nachdem der richtige Server die Anfrage bearbeitet hat, sendet Nginx die Antwort zurück an den Benutzer.

## Warum ist Nginx nützlich?

1. **Effizienz:** Nginx kann sehr viele Anfragen gleichzeitig bearbeiten, was es ideal für stark besuchte Webseiten macht.

2. **Sicherheit:** Als Reverse Proxy kann Nginx die eigentlichen Anwendungsserver vor direktem Zugriff aus dem Internet schützen.

3. **Flexibilität:** Nginx kann für verschiedene Zwecke konfiguriert werden, von einfachen statischen Webseiten bis hin zu komplexen Anwendungsarchitekturen.

4. **Lastverteilung:** Bei hohem Datenverkehr kann Nginx Anfragen gleichmäßig auf mehrere Server verteilen, um Überlastungen zu vermeiden.

In den nächsten Schritten würden wir lernen, wie man Nginx installiert, konfiguriert und für verschiedene Zwecke einsetzt. Dabei würden wir Schritt für Schritt vorgehen und jedes Konzept ausführlich erklären[1].

Verstanden, ich werde die Erklärung fortsetzen und dabei noch detaillierter auf die einzelnen Aspekte eingehen:

## Nginx als Lastverteiler (Load Balancer)

Wenn viele Benutzer gleichzeitig auf eine Webseite zugreifen, kann ein einzelner Server überlastet werden. Hier kommt Nginx als Lastverteiler ins Spiel:

1. Nginx empfängt alle eingehenden Anfragen von Benutzern.
2. Es verteilt diese Anfragen auf mehrere Server (auch "Backend-Server" genannt).
3. Dies geschieht nach bestimmten Regeln, zum Beispiel:
   - Round Robin: Anfragen werden der Reihe nach an jeden Server weitergeleitet.
   - Least Connections: Die Anfrage geht an den Server mit den wenigsten aktiven Verbindungen.

Dadurch wird verhindert, dass ein einzelner Server überlastet wird, und die Webseite bleibt auch bei hohem Datenverkehr schnell und zuverlässig.

## Nginx als Caching-Server

Caching ist eine Technik, um häufig angeforderte Inhalte zwischenzuspeichern:

1. Wenn ein Benutzer eine Seite zum ersten Mal anfordert, holt Nginx den Inhalt vom Backend-Server.
2. Nginx speichert eine Kopie dieses Inhalts.
3. Wenn andere Benutzer die gleiche Seite anfordern, sendet Nginx die gespeicherte Kopie, ohne den Backend-Server erneut zu kontaktieren.

Dies hat mehrere Vorteile:
- Schnellere Antwortzeiten für Benutzer
- Geringere Belastung der Backend-Server
- Reduzierung des Datenverkehrs zwischen Nginx und den Backend-Servern

## Nginx als Sicherheits-Schild

Nginx kann als Schutzschild für Ihre Backend-Server fungieren:

1. Nur Nginx ist direkt aus dem Internet erreichbar.
2. Die Backend-Server sind im internen Netzwerk versteckt.
3. Nginx kann verschiedene Sicherheitsmaßnahmen implementieren:
   - Filtern von bösartigen Anfragen
   - Begrenzen der Anzahl von Anfragen pro Benutzer (Rate Limiting)
   - Blockieren von verdächtigen IP-Adressen

Dies macht es für Angreifer viel schwieriger, Schwachstellen in Ihren Backend-Servern auszunutzen.

## Nginx und HTTPS-Verschlüsselung

Nginx kann auch die sichere Kommunikation über HTTPS verwalten:

1. Nginx wird mit einem SSL/TLS-Zertifikat konfiguriert.
2. Benutzer verbinden sich über HTTPS mit Nginx.
3. Nginx kann dann:
   - Die verschlüsselte Verbindung selbst entschlüsseln und unverschlüsselt mit den Backend-Servern kommunizieren.
   - Oder die verschlüsselte Verbindung an die Backend-Server weiterleiten (SSL Passthrough).

Dies stellt sicher, dass die Daten der Benutzer während der Übertragung geschützt sind.

In den nächsten Schritten würden wir uns ansehen, wie man Nginx installiert und für diese verschiedenen Aufgaben konfiguriert. Dabei würden wir jede Konfigurationsoption im Detail besprechen und erklären, was sie bewirkt.

---
#### **Schritt 1: Node.js-Anwendung erstellen und dockerisieren**

**Lernziel**: Wir werden nun eine **Node.js-Anwendung** erstellen und in einem **Docker-Container** ausführen, um die Vorteile der Containerisierung zu verstehen.

1. **Node.js-Anwendung erstellen**:
   - Erstelle die Dateien `index.html`, `server.js` und `package.json` im `app/`-Verzeichnis.

**`index.html`**:

```html
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Schöne Beispielseite</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f9;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
        }
        h1 {
            color: #333;
            font-size: 3rem;
            margin-bottom: 20px;
        }
        p {
            color: #555;
            font-size: 1.2rem;
            margin-bottom: 40px;
            text-align: center;
        }
        .image-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 20px;
        }
        .image-container img {
            width: 300px;
            height: 200px;
            object-fit: cover;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
    </style>
</head>
<body>
    <h1>Willkommen auf der Beispielseite!</h1>
    <p>Dies ist eine einfach gestaltete Seite mit zufälligen Stock-Fotos.</p>
    <div class="image-container">
        <img src="https://picsum.photos/300?random=1" alt="Naturbild 1">
        <img src="https://picsum.photos/300?random=2" alt="Stadtbild 1">
        <img src="https://picsum.photos/300?random=3" alt="Technologiebild 1">
    </div>
</body>
</html>

```


Erstelle eine einfache Node.js-Anwendung, die eine HTML-Datei ausliefert und dabei den Namen des Containers in den Logs anzeigt. So können wir später nachvollziehen, welcher Container die Anfrage bearbeitet.

**Node.js Code (`app.js`):**

```javascript
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const appName = process.env.APP_NAME; // Umgebungsvariable für App-Name

app.use('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
    console.log(`[${appName}] Request served by ${appName}`);
});

app.listen(port, () => {
    console.log(`[${appName}] ${appName} is listening on port ${port}`);
});
```

- **Erklärung:** Die Anwendung gibt die Datei `index.html` aus und loggt, welcher Container die Anfrage bearbeitet.

#### **1.2 Dockerfile für Node.js-Container erstellen**

Erstelle ein `Dockerfile` für deine Node.js-Anwendung:

**Dockerfile:**

```dockerfile
# Verwende das offizielle Node.js-Image als Basis
FROM node:20-alpine

# Arbeitsverzeichnis setzen
WORKDIR /usr/src/app

# Kopiere die package.json und installiere Abhängigkeiten
COPY package*.json ./
RUN npm install

# Kopiere die Anwendung
COPY . .

# Container startet auf Port 3000
EXPOSE 3000

# Befehl, um die App zu starten
CMD ["node", "app.js"]
```

#### **1.3 Docker-Container erstellen und starten**

Um ein benutzerdefiniertes Netzwerk für deine Container zu erstellen, kannst du den folgenden Befehl verwenden:

```
docker network create mein_netzwerk
```

Baue und starte die Node.js-Container. Achte darauf, für jeden Container eine unterschiedliche Umgebungsvariable `APP_NAME` zu setzen, damit wir in den Logs den Container-Namen sehen können.

```bash
docker build -t nodejs-app .

docker run -d -p 3001:3000 --name nodejs1 --network mein_netzwerk -e APP_NAME=nodejs1 nodejs-app
docker run -d -p 3002:3000 --name nodejs2 --network mein_netzwerk -e APP_NAME=nodejs2 nodejs-app
docker run -d -p 3003:3000 --name nodejs3 --network mein_netzwerk -e APP_NAME=nodejs3 nodejs-app
```

### **2. Einrichtung von Nginx als Load Balancer**

#### **2.1 Nginx-Konfiguration**

Erstelle eine `nginx.conf` für den Reverse Proxy und Load Balancer, um den Traffic auf die Node.js-Container zu verteilen.

**nginx.conf:**

```nginx
worker_processes 1;

events {
    worker_connections 1024;
}

http {
    log_format main '[$time_local] "$request" '
                      'upstream: $upstream_addr';  # Loggt den Upstream (den Container)

    access_log /var/log/nginx/access.log main;

    upstream meine_app {
        least_conn;
        server nodejs1:3000;
        server nodejs2:3000;
        server nodejs3:3000;
    }

    server {
        listen 80;

        location / {
            proxy_pass http://meine_app;
        }
    }
}
```

---
## **Erklärung:**

### **1. `worker_processes 1;`**

```nginx
worker_processes 1;
```

- **`worker_processes`**: Diese Direktive bestimmt, wie viele Nginx-Arbeitsprozesse (Worker) gleichzeitig ausgeführt werden.
- **Wert `1`**: In diesem Fall wird nur ein Arbeitsprozess verwendet. Für den Produktionsbetrieb empfiehlt es sich, die Anzahl an die Anzahl der CPU-Kerne anzupassen (z.B. `worker_processes auto;`), um eine bessere Leistung zu erzielen.

### **2. `events` Block**

```nginx
events {
    worker_connections 1024;
}
```

- **`events` Block**: Dieser Block enthält Konfigurationen für die Verarbeitung von Verbindungen und die Verwaltung der Arbeitsprozesse.
- **`worker_connections 1024;`**: Diese Direktive definiert, wie viele gleichzeitige Verbindungen jeder Worker-Prozess maximal akzeptieren kann. In diesem Fall kann jeder Nginx-Worker bis zu 1024 Verbindungen gleichzeitig verwalten. Diese Zahl kann je nach den Anforderungen und der Serverhardware angepasst werden.

### **3. `http` Block**

```nginx
http {
    log_format main ' [$time_local] "$request" '
                      'upstream: $upstream_addr';  # Loggt den Upstream (den Container)
```

- **`http` Block**: Hier werden alle HTTP-spezifischen Konfigurationen definiert, wie z.B. Logging, Caching, Load Balancing und Header.
  
- **`log_format main`**: Diese Direktive legt das Format der Nginx-Logs fest. In deinem Fall wird ein benutzerdefiniertes Format namens `main` definiert, das folgende Felder enthält:
  - **`$remote_addr`**: Die IP-Adresse des Clients, der die Anfrage sendet.
  - **`$remote_user`**: Der Name des Benutzers (falls Basic Authentication verwendet wird).
  - **`$time_local`**: Das Datum und die Uhrzeit, zu der die Anfrage empfangen wurde.
  - **`$request`**: Die angeforderte HTTP-Methode und URL (z.B. `GET /`).
  - **`$status`**: Der HTTP-Statuscode der Antwort (z.B. `200` für erfolgreich).
  - **`$body_bytes_sent`**: Die Anzahl der Bytes, die im Antwort-Body gesendet wurden (nicht einschließlich Header).
  - **`$http_referer`**: Die URL der Seite, von der die Anfrage stammt (falls verfügbar).
  - **`$http_user_agent`**: Der User-Agent des Clients (z.B. Browserinformationen).
  - **`$http_x_forwarded_for`**: Diese Variable gibt die ursprüngliche IP-Adresse des Clients weiter, wenn Nginx hinter einem Proxy oder Load Balancer sitzt.
  - **`upstream: $upstream_addr`**: Diese Direktive gibt die Adresse des Upstreams an, also des Node.js-Containers, der die Anfrage bearbeitet hat. `$upstream_addr` ist eine eingebaute Nginx-Variable, die den Namen des Servers im `upstream`-Block anzeigt, der die Anfrage bearbeitet hat.

- **`access_log /var/log/nginx/access.log main;`**: Diese Direktive legt fest, dass die Logs im `main`-Format in die Datei `/var/log/nginx/access.log` geschrieben werden. Hier wird jede eingehende Anfrage protokolliert.

---

### **4. `upstream` Block**

```nginx
upstream meine_app {
    least_conn;
    server nodejs1:3000;
    server nodejs2:3000;
    server nodejs3:3000;
}
```

- **`upstream` Block**: In diesem Block werden die Server definiert, die als Backend (Upstreams) für Nginx dienen. Dies ist die Load Balancing-Konfiguration.
- **`meine_app`**: Dies ist der Name des Upstream-Blocks. Du kannst diesen Namen verwenden, um auf die Gruppe von Servern zu verweisen.
- **`least_conn;`**: Dies ist die Load Balancing-Methode, die du verwendest. Mit `least_conn` wird die Anfrage an den Server mit den wenigsten Verbindungen weitergeleitet, um eine gleichmäßige Verteilung der Last zu gewährleisten.
- **`server nodejs1:3000;`**: Diese Zeile definiert den ersten Node.js-Container als Backend-Server. Nginx wird den Traffic an `nodejs1` auf Port 3000 weiterleiten.
- **`server nodejs2:3000;`** und **`server nodejs3:3000;`**: Diese beiden Zeilen definieren die weiteren Node.js-Container als Backend-Server. Nginx verteilt den Verkehr abwechselnd oder nach der `least_conn`-Methode an diese Server.

Die `server`-Direktiven sind die Upstream-Server, auf die Nginx Anfragen weiterleitet.

---

### **5. `server` Block**

```nginx
server {
    listen 80;

    location / {
        proxy_pass http://meine_app;
    }
}
```

- **`server` Block**: Dieser Block definiert, wie Nginx auf eingehende Anfragen reagiert und diese verarbeitet.
  
- **`listen 80;`**: Dieser Server hört auf Port 80, der Standardport für HTTP-Verkehr. Alle eingehenden HTTP-Anfragen werden an diesen Server weitergeleitet.

- **`location / { ... }`**: Der `location`-Block definiert, wie Anfragen zu einer bestimmten URL verarbeitet werden. In diesem Fall bedeutet der Slash (`/`), dass alle Anfragen an den Root-Pfad weitergeleitet werden.
  
- **`proxy_pass http://meine_app;`**: Diese Direktive sagt Nginx, dass alle Anfragen, die an den Root-Pfad (`/`) gesendet werden, an den Upstream-Block `meine_app` weitergeleitet werden sollen. Der Upstream-Block enthält die Node.js-Container, die die Anfragen verarbeiten.

---

### **Zusammenfassung der Funktionsweise**

1. **Load Balancing:** Nginx fungiert hier als Reverse Proxy und Load Balancer. Er leitet eingehende HTTP-Anfragen an die Node.js-Container (`nodejs1`, `nodejs2`, `nodejs3`) weiter, die im `upstream`-Block definiert sind.
2. **Loggen von Anfragen:** In den Nginx-Logs wird nicht nur die Client-IP, der HTTP-Statuscode und andere Standarddaten protokolliert, sondern auch die Information, welcher Node.js-Container (Upstream-Server) die Anfrage bearbeitet hat. Dies wird durch die Variable `$upstream_addr` erreicht.
3. **Verteilung der Last:** Die Lastverteilung erfolgt gemäß der `least_conn`-Methode. Die Anfrage wird an den Node.js-Container weitergeleitet, der die wenigsten gleichzeitigen Verbindungen hat.

---

Mit dieser Konfiguration hast du einen Nginx-Load-Balancer eingerichtet, der den Traffic auf mehrere Node.js-Container verteilt und gleichzeitig die Verteilung und das Verhalten in den Logs nachverfolgt.

#### **2.2 Dockerfile für Nginx**

Erstelle ein `Dockerfile` für den Nginx-Container, der die `nginx.conf`-Konfiguration übernimmt.

**Dockerfile für Nginx:**

```dockerfile
FROM nginx:latest

# Kopiere die angepasste nginx.conf
COPY nginx.conf /etc/nginx/nginx.conf
```

#### **2.3 Nginx-Container bauen und starten**

Baue und starte den Nginx-Container im gleichen Netzwerk wie die Node.js-Container:

```bash
docker build -t nginx-loadbalancer .

docker run -d -p 80:80 --name nginx --network mein_netzwerk nginx-loadbalancer
```

### **3. Überwachung und Logs**

#### **3.1 Logs der Node.js-Container**

Um zu sehen, welcher Node.js-Container die Anfragen bearbeitet, kannst du die Logs der einzelnen Node.js-Container überwachen:

```bash
docker logs -f nodejs1  # Logs von nodejs1
docker logs -f nodejs2  # Logs von nodejs2
docker logs -f nodejs3  # Logs von nodejs3
```

**Achtung**: Dies funktioniert nur wenn du dafür 3 verschiedene Terminals offen hast und die Seite unter `localhost:80`mehrmals aktualisierst

In den Logs wirst du die folgenden Zeilen sehen, wenn eine Anfrage bearbeitet wird:

```
[nodejs1] Request served by nodejs1
[nodejs2] Request served by nodejs2
[nodejs3] Request served by nodejs3
```

#### **3.2 Nginx-Logs**

Du kannst auch die Nginx-Logs überwachen, um zu sehen, welcher Container (Upstream) gerade die Anfrage bearbeitet hat:

```bash
docker log <CONTAINER ID>
```

### 4. Lasttest mit K6 

Falls du Lasttests durchführen möchtest, kannst du K6 verwenden. Hier ist ein einfaches Beispiel für ein **K6-Skript**:

**k6-test.js:**

```javascript
const http = require('k6/http');
const { check, sleep } = require('k6');

// Definiere die Testoptionen
module.exports.options = {
    stages: [
        { duration: '10s', target: 50 }, 
    ],
};

// Definiere den Testablauf
module.exports.default = function () {
    // Sende eine GET-Anfrage an den Server (Nginx Reverse Proxy)
    let response = http.get('http://localhost/'); // Die URL, die du testen möchtest (hier localhost für Nginx)
    
    // Überprüfe, ob die Antwort einen Statuscode von 200 hat
    check(response, {
        'is status 200': (r) => r.status === 200,
    });
    
    // Füge eine kleine Pause zwischen den Anfragen hinzu, um die Last zu simulieren
    sleep(1);
};

```

Um den Test auszuführen, installiere **K6** und führe den Test wie folgt aus:

```bash
k6 run k6-test.js
```

K6 simuliert nun mehrere Benutzeranfragen und sendet diese an den Nginx-Load-Balancer. Du wirst in den Logs sehen, wie die Last auf die verschiedenen Node.js-Container verteilt wird.

---

### **Zusammenfassung**

- Wir haben eine Node.js-Anwendung erstellt und diese in Docker-Containern ausgeführt.
- Nginx wurde als Reverse Proxy und Load Balancer konfiguriert, um den Traffic gleichmäßig auf die Node.js-Container zu verteilen.
- Durch Log-Ausgaben sowohl im Node.js-Container als auch im Nginx-Container können wir nachvollziehen, welcher Container wann Anfragen bearbeitet.
- Optional kannst du K6 verwenden, um Lasttests lokal durchzuführen.

