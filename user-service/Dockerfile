FROM php:8.4-fpm

RUN apt update && apt install -y \
    git unzip curl libpng-dev libonig-dev libxml2-dev zip \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

RUN curl -sS https://getcomposer.org/installer | php && mv composer.phar /usr/local/bin/composer

WORKDIR /var/www

COPY . .

RUN composer install

EXPOSE 8000

CMD php artisan serve --host=0.0.0.0 --port=8000

