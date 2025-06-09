<?php

use App\Http\Controllers\StadiumController;
use Illuminate\Support\Facades\Route;

$router->group(['prefix' => 'api'], function (){
    Route::get('stadiums',          [StadiumController::class, 'index']);
    Route::get('stadiums/{id}',     [StadiumController::class,  'show']);
    Route::post('stadiums',         [StadiumController::class,  'store']);
    Route::put('stadiums/{id}',     [StadiumController::class,  'update']);
    Route::delete('stadiums/{id}',  [StadiumController::class,  'destroy']);
});
