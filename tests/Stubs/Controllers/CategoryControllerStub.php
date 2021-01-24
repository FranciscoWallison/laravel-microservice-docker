<?php

namespace Tests\Stubs\Controllers;

use App\Http\Controllers\Api\BasicCrudController;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;

class CategoryControllerStub extends BasicCrudController
{
    protected function model()
    {
        return Category::class;
    }
}
