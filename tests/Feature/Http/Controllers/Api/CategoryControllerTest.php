<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Models\Category;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Lang;
use Tests\TestCase;

class CategoryControllerTest extends TestCase
{
    use DatabaseMigrations;

    public function testIndexList()
    {
        $category = factory(Category::class)->create(); 
        $response = $this->get(route('categories.index'));

        $response
        ->assertStatus(200)
        ->assertJson([$category->toArray()]);
    }


    public function testShow()
    {
        $category = factory(Category::class)->create(); 
        $response = $this->get(route('categories.show', ['category' => $category->id]));

        $response
        ->assertStatus(200)
        ->assertJson($category->toArray());
    }

    //Falhas
    public function testInvalidationData()
    {
        $response = $this->json('POST', route('categories.store'), []);

        $response
            ->assertStatus(422);
    }


    public function testInvalidationDataNameMax()
    {
        $response = $this->json('POST', route('categories.store'), [
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

        $response = $this->json('POST', route('categories.store'), [
            'name' => 'teste_name'
            ]);

        $response
            ->assertJsonMissingValidationErrors(['is_active']);
    }

    public function testInvalidationDataIsActiveBoolean()
            {
        $response = $this->json('POST', route('categories.store'), [
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
        $category = factory(Category::class)->create(); 
        $response = $this->json(
            'PUT', 
            route('categories.update',['category' => $category->id]), 
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
        $response = $this->json('POST', route('categories.store'), [
            'name' => 'test'
        ]);

        $id = $response->json('id');
        $category = Category::find($id);

        $response
            ->assertStatus(201)
            ->assertJson($category->toArray());
        
        $this->assertTrue($response->json('is_active'));
        $this->assertNull($response->json('description'));


        $response = $this->json('POST', route('categories.store'), [
            'name' => 'test_name',
            'description' => 'test_description',
            'is_active' => false
        ]);

        $response
            ->assertJsonFragment([
                'is_active' => false,
                'description' => 'test_description'
            ]);
    }


    public function testUpdate()
    {
        $category = factory(Category::class)->create([
            'is_active' => false,
            'description' => 'test_description'
        ]); 
        $response = $this->json(
            'PUT', 
            route('categories.update', 
            ['category' => $category->id]), 
            [
            'name' => 'test_update_name',
            'description' => 'test_update_description',
            'is_active' => true
            
            ]
        );

        $id = $response->json('id');
        $category = Category::find($id);

        $response
            ->assertStatus(200)
            ->assertJson($category->toArray());
        
            $response
            ->assertJsonFragment([
                'description' => 'test_update_description',
                'is_active' => true                
            ]);

        
        $response = $this->json(
            'PUT', 
            route('categories.update', 
            ['category' => $category->id]), 
            [
            'name' => 'test_update_name',
            'description' => ''            
            ]
        );
        
        $response
            ->assertJsonFragment([
                'description' => null,
            ]);


    }
}
