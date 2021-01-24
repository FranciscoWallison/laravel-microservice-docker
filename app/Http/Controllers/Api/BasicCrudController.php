<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;

abstract class BasicCrudController extends Controller
{
    protected abstract function model();

    private $rules = [
        'name' => 'required|max:255',
        'is_active' => 'boolean'
    ];

    public function index()
    {
        return Category::all();
    }

    // public function store(Request $request)
    // {
    //     //Iniciando validador
    //     $this->validate($request, $this->rules);
    //     $category = Category::create($request->all());
    //     $category->refresh();
    //     return $category;
    // }

    // public function show(Category $category)
    // {
    //     //
    //     return $category;
    // }

    // public function update(Request $request, Category $category)
    // {
    //     //Iniciando validador
    //     $this->validate($request, $this->rules);
    //     $category->update($request->all());
    //     return $category;
    // }

    // public function destroy(Category $category)
    // {
    //     //
    //     $category->delete();
    //     //204 - No content
    //     return response()->noContent();
    // }
}
