<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Models\Category;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\Traits\TestValidations;
use Tests\Traits\TestSaves;
use Tests\TestCase;

class CategoryControllerTest extends TestCase
{
    use DatabaseMigrations, TestValidations, TestSaves;

    private $category;

    protected function setUp(): void
    {
        parent::setUp();
        $this->category = factory(Category::class)->create(); 
    }

    public function testIndexList()
    {
        $response = $this->get(route('categories.index'));

        $response
        ->assertStatus(200)
        ->assertJson([$this->category->toArray()]);
    }


    public function testShow()
    {
        $response = $this->get(route('categories.show', ['category' => $this->category->id]));

        $response
        ->assertStatus(200)
        ->assertJson($this->category->toArray());
    }

    //Falhas
    public function testInvalidationData()
    {

        $data = [
            'name' => ''
        ];
        $this->assertInvalidationInStoreAction($data, 'required');
        $this->assertInvalidationInUpdateAction($data, 'required');
        $data = [
            'name'=> str_repeat('a', 256)
        ];
        $this->assertInvalidationInStoreAction($data, 'max.string', ['max' => 255]);
        $this->assertInvalidationInUpdateAction($data, 'max.string', ['max' => 255]);
        $data = [
            'is_active' => 'a'
        ];
        $this->assertInvalidationInStoreAction($data, 'boolean');
        $this->assertInvalidationInUpdateAction($data, 'boolean');



        $response = $this->json('POST', route('categories.store'), []);

        $response
            ->assertStatus(422);
    }


    public function testInvalidationDataIsActive()
    {

        $response = $this->json('POST', route('categories.store'), [
            'name' => 'teste_name'
            ]);
        $response
            ->assertJsonMissingValidationErrors(['is_active']);
    }

    public function testStore()
    {

        $data = [
            'name' => 'test_name'
        ];
        $response = $this->assertStore(
            $data, 
            $data + ['description' => null, 'is_active' => true , 'deleted_at' => null]
        );
        $response->assertJsonStructure([
            'created_at', 'updated_at'
        ]);
        $data = [
            'name' => 'test_name',
            'description' => 'test_description',
            'is_active' => false
        ];
        $this->assertStore(
            $data, 
            $data + ['description' => 'description', 'is_active' => false]
        );
    }


    public function testUpdate()
    {
        $this->category = factory(Category::class)->create([
            'description' => 'test_description',
            'is_active' => false
        ]);
        $data = [
            'name' => 'test_update_name',
            'description' => 'test_update_description',
            'is_active' => true            
        ];
        $response = $this->assertUpdate(
            $data, 
            $data + ['deleted_at' => null]
        );
        $response->assertJsonStructure([
            'created_at', 'updated_at'
        ]);
        $data = [
            'name' => 'test_update_name',
            'description' => '',
            'is_active' => true            
        ];
        $this->assertUpdate(
            $data, 
            array_merge( $data , [ 'description' => null])
        );
        $data = [
            'name' => 'test_update_name',
            'description' => 'test_update_description',
            'is_active' => true
            
        ];
        $this->assertUpdate(
            $data, 
            array_merge( $data , [ 'description' => 'test_update_description'])
        );
    }

    public function testDestroy()
    {
        $response = $this->json('DELETE', route('categories.destroy', ['category' => $this->category->id]));
        $response->assertStatus(204);
        $this->assertNull(Category::find($this->category->id));
        $this->assertNotNull(Category::withTrashed()->find($this->category->id));
    }


    protected function routeStore()
    {
        return route('categories.store');
    }

    protected function routeUpdate()
    {
        return route('categories.update', ['category'=> $this->category->id]);
    }

    protected function model()
    {
        return Category::class;
    }
}
