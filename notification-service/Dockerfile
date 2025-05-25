FROM php:8.4-fpm

RUN apt update && apt install -y \
    git unzip curl libpng-dev libonig-dev libxml2-dev zip librabbitmq-dev \
    && pecl install amqp \
    && docker-php-ext-enable amqp \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath

RUN curl -sS https://getcomposer.org/installer | php && mv composer.phar /usr/local/bin/composer

WORKDIR /var/www

COPY . .

RUN composer install

EXPOSE 8000

CMD php artisan migrate --force && php artisan queue:work
