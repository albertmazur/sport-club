FROM php:8.4-fpm


RUN apt-get update && apt-get install -y \
    libpng-dev libonig-dev libzip-dev zip unzip \
  && docker-php-ext-install pdo_mysql mbstring zip \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www

COPY . .

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/bin --filename=composer


CMD ["php-fpm"]
