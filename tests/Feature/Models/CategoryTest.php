<?php

namespace Tests\Feature\Models;

use App\Models\Category;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class CategoryTest extends TestCase
{
    use DatabaseMigrations;
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function testListCrete()
    {
        $atributes = [
            "id",
            "name",
            "description",
            "is_active",
            "deleted_at",
            "created_at",
            "updated_at"
        ];
        factory(Category::class, 1)->create();
        $categories = Category::all();
        $this->assertCount(1, $categories);
    }


    public function testListAtributes()
    {
        $atributes = [
            "id",
            "name",
            "description",
            "is_active",
            "deleted_at",
            "created_at",
            "updated_at"
        ];
        factory(Category::class, 1)->create();
        $categories = Category::all();
        $categoryKey = array_keys($categories->first()->getAttributes());
        $this->assertEqualsCanonicalizing($atributes, $categoryKey);
    }
}
