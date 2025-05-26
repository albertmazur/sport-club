FROM php:8.4-cli

RUN apt update && apt install -y \
    unzip git curl \
    libzip-dev libxml2-dev libssl-dev pkg-config build-essential \
    libbrotli-dev libonig-dev \
    && pecl install swoole \
    && docker-php-ext-enable swoole \
    && docker-php-ext-install pdo_mysql mbstring bcmath pcntl

RUN curl -sS https://getcomposer.org/installer | php && mv composer.phar /usr/local/bin/composer

WORKDIR /var/www

COPY . .

RUN composer install
RUN php artisan octane:install --server=swoole

EXPOSE 80

CMD php artisan octane:start --server=swoole --host=0.0.0.0 --port=80
