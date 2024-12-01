```
   docker run --name mysql-basic -e MYSQL_ROOT_PASSWORD=secret -d mysql:latest
```

```
   docker exec -it mysql-basic mysql -u root -p
```

```
CREATE TABLE kunden (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100)
);
```

```
INSERT INTO kunden (name, email) VALUES ('Max Mustermann', 'max@example.com');
INSERT INTO kunden (name, email) VALUES ('Erika Mustermann', 'erika@example.com');
```

