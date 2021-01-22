<?php

namespace Tests\Feature\Models;

use App\Models\Genre;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class GenreTest extends TestCase
{
    use DatabaseMigrations;
    
    public function testCreate(){
        $genre = Genre::create([
            'name' => 'teste1'
        ]);
        $genre->refresh();
        $this->assertEquals('teste1', $genre->name);
        $this->assertTrue($genre->is_active);
    }

    public function testCreateList()
    {
        $atributes = [
            "id",
            "name",
            "is_active",
            "deleted_at",
            "created_at",
            "updated_at"
        ];
        factory(Genre::class, 1)->create();
        $categories = Genre::all();
        $this->assertCount(1, $categories);
    }

    public function testCreateListAtributes()
    {
        $atributes = [
            "id",
            "name",
            "is_active",
            "deleted_at",
            "created_at",
            "updated_at"
        ];
        factory(Genre::class, 1)->create();
        $categories = Genre::all();
        $genreKey = array_keys($categories->first()->getAttributes());
        $this->assertEqualsCanonicalizing($atributes, $genreKey);
    }


    public function testCreateIsActiveTrue(){
        $genre = Genre::create([
            'name' => 'teste1'
        ]);
        $genre->refresh();
        $this->assertTrue($genre->is_active);
    }

    public function testCreateIsActiveFalse(){
        $genre = Genre::create([
            'name' => 'teste1',
            'is_active' => false
        ]);
        $genre->refresh();
        $this->assertFalse($genre->is_active);
    }

    // INIT UPDATE Update

    public function testUpdate(){
        $genre = factory(Genre::class, 1)->create([
            'name' => 'test_name'
        ])->first();

        $data = [
            'name' => 'test_name_update',
        ];
            
        $genre->update($data);

        foreach($data as $key => $value){
            $this->assertEquals($value, $genre->{$key});
        }
    }
}
