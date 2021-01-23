<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Models\Genre;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Lang;
use Tests\TestCase;

class GenreControllerTest extends TestCase
{
    use DatabaseMigrations;

    private $genre;

    protected function setUp(): void
    {
        parent::setUp();
        $this->genre = factory(Genre::class)->create(); 
    }

    public function testIndexList()
    {
         
        $response = $this->get(route('genres.index'));

        $response
        ->assertStatus(200)
        ->assertJson([$this->genre->toArray()]);
    }


    public function testShow()
    {
         
        $response = $this->get(route('genres.show', ['genre' => $this->genre->id]));

        $response
        ->assertStatus(200)
        ->assertJson($this->genre->toArray());
    }

    //Falhas
    public function testInvalidationData()
    {
        $response = $this->json('POST', route('genres.store'), []);

        $response
            ->assertStatus(422);
    }


    public function testInvalidationDataNameMax()
    {
        $response = $this->json('POST', route('genres.store'), [
            'name' => str_repeat('a', 256)
            ]);

        $response
            ->assertJsonValidationErrors(['name'])
            ->assertJsonFragment([
                Lang::get('validation.max.string', ['attribute'=> 'name', 'max' => 255])
            ]);
    }

    public function testInvalidationDataIsActive()
    {

        $response = $this->json('POST', route('genres.store'), [
            'name' => 'teste_name'
            ]);

        $response
            ->assertJsonMissingValidationErrors(['is_active']);
    }

    public function testInvalidationDataIsActiveBoolean()
            {
        $response = $this->json('POST', route('genres.store'), [
            'name' => 'teste_is_active',
            'is_active' => 'a'
            ]);

        $response
            ->assertJsonFragment([
                Lang::get('validation.boolean', ['attribute'=> 'is active'])
            ]);
    }


    public function testInvalidationDataIsActiveUpdate()
    {
         
        $response = $this->json(
            'PUT', 
            route('genres.update',['genre' => $this->genre->id]), 
            [
                'name' => str_repeat('a', 256),
                'is_active' => 'a'
            ]
        );

        $response
            ->assertJsonValidationErrors(['name', 'is_active'])
            ->assertJsonFragment([
                Lang::get('validation.max.string', ['attribute'=> 'name', 'max' => 255])
            ])
            ->assertJsonFragment([
                Lang::get('validation.boolean', ['attribute'=> 'is active'])
            ]);

    }

    public function testStore()
    {
        $response = $this->json('POST', route('genres.store'), [
            'name' => 'test'
        ]);

        $id = $response->json('id');
        $this->genre = Genre::find($id);

        $response
            ->assertStatus(201)
            ->assertJson($this->genre->toArray());
        
        $this->assertTrue($response->json('is_active'));


        $response = $this->json('POST', route('genres.store'), [
            'name' => 'test_name',
            'is_active' => false
        ]);

        $response
            ->assertJsonFragment([
                'is_active' => false               
            ]);
    }


    public function testUpdate()
    {
        $this->genre = factory(Genre::class)->create([
            'is_active' => false
        ]); 
        $response = $this->json(
            'PUT', 
            route('genres.update', 
            ['genre' => $this->genre->id]), 
            [
            'name' => 'test_update_name',
            'is_active' => true
            
            ]
        );

        $id = $response->json('id');
        $this->genre = Genre::find($id);

        $response
            ->assertStatus(200)
            ->assertJson($this->genre->toArray());
        
            $response
            ->assertJsonFragment([
                'is_active' => true                
            ]);
    }

    public function testDestroy()
    {
        $this->genre = 
        $response = $this->json('DELETE', route('genres.destroy', ['genre' => $this->genre->id]));
        $response->assertStatus(204);
        $this->assertNull(Genre::find($this->genre->id));
        $this->assertNotNull(Genre::withTrashed()->find($this->genre->id));
    }
}
