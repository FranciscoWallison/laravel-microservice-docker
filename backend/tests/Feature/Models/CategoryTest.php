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
    
    public function testCreate(){
        $category = Category::create([
            'name' => 'teste1'
        ]);
        $category->refresh();

        $this->assertIsString($category->id);
        $this->assertEquals(36,strlen($category->id));
        $this->assertRegExp('/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i', $category->id);        
        $this->assertEquals('teste1', $category->name);
        $this->assertIsString ($category->name);
        $this->assertNull($category->description);
        $this->assertTrue($category->is_active);
    }

    public function testCreateList()
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

    public function testCreateListAtributes()
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

    public function testCreateDescriptionNull(){
        $category = Category::create([
            'name' => 'teste1',
            'description' => null
        ]);       
        $this->assertNull($category->description);
    }

    public function testCreateDescriptionEquals(){
        $category = Category::create([
            'name' => 'teste1',
            'description' => 'teste1_description'
        ]);       
        $this->assertEquals('teste1_description',$category->description);
    }

    public function testCreateIsActiveTrue(){
        $category = Category::create([
            'name' => 'teste1'
        ]);
        $category->refresh();
        $this->assertTrue($category->is_active);
    }

    public function testCreateIsActiveFalse(){
        $category = Category::create([
            'name' => 'teste1',
            'is_active' => false
        ]);
        $category->refresh();
        $this->assertFalse($category->is_active);
    }

    // INIT UPDATE update

    public function testUpdate(){
        $category = factory(Category::class, 1)->create([
            'description' => 'test_description'
        ])->first();

        $data = [
            'name' => 'test_name_update',
            'description' => 'test_description_update'
        ];
            
        $category->update($data);

        foreach($data as $key => $value){
            $this->assertEquals($value, $category->{$key});
        }
    }

    // INIT DELETE delete

    public function testDelete(){

        $category = factory(Category::class)->create();
        $category->delete();
        $this->assertNull(Category::find($category->id));
        $category->refresh();
        $categories = Category::withTrashed()->get();
        $this->assertCount(1, $categories);

        $category->restore();
        $this->assertNotNull(Category::find($category->id));
    }
}
