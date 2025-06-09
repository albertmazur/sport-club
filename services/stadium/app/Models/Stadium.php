<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Stadium extends Model
{
    // jeśli nie używasz timestampów w tabeli, wyłącz:
    // public $timestamps = false;

    // dopasuj, jeśli Twoja tabela nazywa się inaczej:
    protected $table = 'stadiums';

    // które pola można masowo wypełniać:
    protected $fillable = [
        'name',
        'city',
        'capacity',
        'street',
        'numberBuilding'
    ];
}
