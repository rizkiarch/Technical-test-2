# MiniERP

Test project Fullstack Web Developer.

### Setup Project

#### Docker Compose
1. Buka file `docker-compose.yml`
2. Sesuaikan environment variable:
    - `MYSQL_DATABASE`
    - `MYSQL_ROOT_PASSWORD`
    - `MYSQL_PASSWORD`
    - `MYSQL_USER`

#### Backend

1. Masuk ke directory backend
2. Copy file `.env.example` menjadi `.env`
3. Sesuaikan variable:
    - `DB_CONNECTION=mysql` // biarkan mysql
    - `DB_HOST=mysql` // isi dengan 'mysql' untuk refer ke container mysql
    - `DB_PORT=3306` // isi dengan '3306' untuk refer ke container mysql
    - `DB_DATABASE=` // sesuaikan dengan settingan di `docker-compose.yml`
    - `DB_USERNAME=` // sesuaikan dengan settingan di `docker-compose.yml`
    - `DB_PASSWORD=` // sesuaikan dengan settingan di `docker-compose.yml`

#### Frontend

1. Masuk ke directory frontend
2. Copy file `.env.example` menjadi `.env`
3. Biarkan isi file secara default

Untuk menjalankan aplikasi, jalankan perintah `docker compose up --build -d` pada root project.

Aplikasi akan berjalan pada port:

- Frontend: `3000`
- Backend: `8000`
- MySQL: `3306`

#### Setup Project Laravel

1. Masuk ke container backend
    ```
    docker exec -it {backend_container_id} /bin/sh
    ```
2. Masuk ke directory project
    ```
    cd /var/www/backend
    ```
3. Install paket composer
    ```
    composer install
    ```
4. Buat app key baru:
    ```
    php artisan key:generate
    ```
5. Migrate database
    ```
    php artisan migrate
    ```
6. Seed database
    ```
    php artisan db:seed
    ```

#### Selesai

## Login

```
username: usertest
password: password
```