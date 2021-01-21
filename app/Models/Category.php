<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    // Quais os campos são permitidos
    protected $fillable = ['name', 'description', 'is_active'];
}
