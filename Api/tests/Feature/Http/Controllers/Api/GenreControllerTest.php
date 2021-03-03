<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Http\Controllers\Api\GenreController;
use App\Models\Category;
use App\Models\Genre;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Http\Request;
use Mockery;
use Tests\Exceptions\TestException;
use Tests\Traits\TestValidations;
use Tests\Traits\TestSaves;
use Tests\Traits\TestResource;
use Tests\TestCase;
use App\Http\Resources\GenreResource;

class GenreControllerTest extends TestCase
{
    use DatabaseMigrations, TestValidations, TestSaves, TestResource;

    private $genre;
    private $serializedFields = [
        'id',
        'name',
        'is_active',
        'created_at',
        'updated_at',
        'deleted_at',
        'categories' => [
            '*' => [
                'id',
                'name',
                'description',
                'is_active',
                'created_at',
                'updated_at',
                'deleted_at'
            ]
        ]
    ];

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
        ->assertJsonStructure([
            'data'  => [
                '*'=> $this->serializedFields
            ],
            "links" => [],
            "meta"  => [],
        ]);
       
        $resource = GenreResource::collection(collect( [$this->genre] ));
        $this->assertResource($response, $resource);
    }


    public function testShow()
    {
         
        $response = $this->get(route('genres.show', ['genre' => $this->genre->id]));

        $response
        ->assertStatus(200)
        ->assertJsonStructure([
            'data' => $this->serializedFields
        ])
        ->assertJsonFragment($this->genre->toArray());

        $resource = new  GenreResource($this->genre);
        $this->assertResource($response, $resource);
    }

    //Falhas
    public function testInvalidationData()
    {
        $data = [
            'name' => '',
            'categories_id' => ''
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


        $data = [
            'categories_id' => 'a'
        ];

        $this->assertInvalidationInStoreAction($data, 'array');
        $this->assertInvalidationInUpdateAction($data, 'array');

        $data = [
            'categories_id' => [100]
        ];

        $this->assertInvalidationInStoreAction($data, 'exists');
        $this->assertInvalidationInUpdateAction($data, 'exists');

        $category = factory(Category::class)->create(); 
        $category->delete();
        $data = [
            'categories_id' => [$category->id]
        ];

        $this->assertInvalidationInStoreAction($data, 'exists');
        $this->assertInvalidationInUpdateAction($data, 'exists');

        $response = $this->json('POST', route('genres.store'), []);
        $response
            ->assertStatus(422);
    }

    public function testSave(){
        $categoryId = factory(Category::class)->create()->id;

        $data = [
            [
                'send_data' => [
                    'name' => 'test_name',
                    'categories_id' => [$categoryId]
                ],                
                'test_data' => [
                    'name' => 'test_name',
                    'is_active'=> true
                ]
                
            ],
            [
                'send_data' => [
                    'name' => 'test_name',
                    'is_active' => false,
                    'categories_id' => [$categoryId]
                ],                
                'test_data' => [
                    'name' => 'test_name',
                    'is_active'=> false
                ]
                
            ]
        ];

        foreach($data as $test){
            $response = $this->assertStore($test['send_data'], $test['test_data']);
            $response->assertJsonStructure([
                'data' => $this->serializedFields
            ]);
            $this->assertResource($response, new GenreResource(
                Genre::find($response->json('data.id'))
            ));
            $response = $this->assertUpdate($test['send_data'], $test['test_data']);
            $response->assertJsonStructure([
                'data' => $this->serializedFields
            ]);
            $resource = new GenreResource(Genre::find($response->json('data.id')));
            $this->assertResource($response, $resource);
        } 

    }

    public function testInvalidationDataIsActive()
    {

        $response = $this->json('POST', route('genres.store'), [
            'name' => 'teste_name'
            ]);

        $response
            ->assertJsonMissingValidationErrors(['is_active']);
    }

    public function testDestroy()
    {
        $response = $this->json('DELETE', route('genres.destroy', ['genre' => $this->genre->id]));
        $response->assertStatus(204);
        $this->assertNull(Genre::find($this->genre->id));
        $this->assertNotNull(Genre::withTrashed()->find($this->genre->id));
    }

    protected function assertHasCategory($genreId, $categoryId)
    {
        $this->assertDatabaseHas(
            'category_genre', [
                'genre_id' => $genreId,
                'category' => $categoryId
            ]);
    }

    public function testSyncCategories()
    {
        $categoriesId = factory(Category::class, 3)->create()->pluck('id')->toArray();

        $sendData = [
            'name' => 'test',
            'categories_id' => [$categoriesId[0]]
        ];
        $response = $this->json('POST', $this->routeStore(), $sendData);
      
        $this->assertDatabaseHas('category_genre',[
            'category_id'   => $categoriesId[0],
            'genre_id'      => $response->json('data.id')
        ]);

        $sendData = [
            'name' => 'test',
            'categories_id' => [$categoriesId[1], $categoriesId[2]]
        ];
        $response = $this->json(
            'PUT', 
            route( 'genres.update', ['genre' => $response->json('data.id')]),
            $sendData
        );
        $this->assertDatabaseMissing('category_genre',[
            'category_id'   => $categoriesId[0],
            'genre_id'      => $response->json('data.id')
        ]);
        $this->assertDatabaseHas('category_genre',[
            'category_id'   => $categoriesId[1],
            'genre_id'      => $response->json('data.id')
        ]);
        $this->assertDatabaseHas('category_genre',[
            'category_id'   => $categoriesId[2],
            'genre_id'      => $response->json('data.id')
        ]);
    }

    public function testRollbackStore()
    {
        $controller = Mockery::mock(GenreController::class)
            ->makePartial()
            ->shouldAllowMockingProtectedMethods();

        $controller
            ->shouldReceive('validate')
            ->withAnyArgs()
            ->andReturn([
                'name' => 'test'
            ]);

        $controller
            ->shouldReceive('rulesStore')
            ->withAnyArgs()
            ->andReturn([]);
        
        $controller
            ->shouldReceive('handleRelations')
            ->once()
            ->andThrow(new TestException());

        $response = Mockery::mock(Request::class);

        $hasError = false;
        try {
            $controller->store($response);
        } catch (TestException $exception)
        {
            $this->assertCount(1, Genre::all());
            $hasError = true;
        }

        $this->assertTrue($hasError);
    }

    public function testRollbackUpdate()
    {
        $controller = Mockery::mock(GenreController::class)
            ->makePartial()
            ->shouldAllowMockingProtectedMethods();

        $controller
            ->shouldReceive('findoOrFail')
            ->withAnyArgs()
            ->andReturn($this->genre);
        
        $controller
            ->shouldReceive('validate')
            ->withAnyArgs()
            ->andReturn([
                'name' => 'test'
            ]);

        $controller
            ->shouldReceive('rulesUpdate')
            ->withAnyArgs()
            ->andReturn([]);
        
        $controller
            ->shouldReceive('handleRelations')
            ->once()
            ->andThrow(new TestException());

        $response = Mockery::mock(Request::class);

        $hasError = false;
        try {
            $controller->update($response, $this->genre->id);
        } catch (TestException $exception)
        {
            $this->assertCount(1, Genre::all());
            $hasError = true;
        }

        $this->assertTrue($hasError);
        
    }

    protected function routeStore()
    {
        return route('genres.store');
    }

    protected function routeUpdate()
    {
        return route('genres.update', ['genre'=> $this->genre->id]);
    }

    protected function model()
    {
        return Genre::class;
    }
}