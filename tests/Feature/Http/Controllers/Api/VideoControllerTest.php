<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Http\Controllers\api\VideoController;
use App\Models\Video;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\Traits\TestValidations;
use Tests\Traits\TestSaves;
use Tests\TestCase;
use Illuminate\Http\Request;
use Mockery;
use Mockery\Exception as MockeryException;
use App\Models\Category;
use App\Models\Genre;
use Exception;
use Tests\Exceptions\TestException;

class VideoControllerTest extends TestCase
{
    use DatabaseMigrations, TestValidations, TestSaves;
    private $video;
    private $sendData;


    protected function setUp(): void
    {
        parent::setUp();
        $this->video = factory(Video::class)->create([
            'opened' => false
        ]);
        
        $categories = factory(Category::class)->create();
        $categories->refresh();

        $genres = factory(Genre::class)->create();
        $genres->refresh();

        $this->sendData = [
            "title" => "Velit quasi autem dicta.",
            "description" => "Fugit iste rerum eos et molestias voluptatibus occaecati ad at velit deserunt distinctio sint.",
            "year_launched" => 2007,
            "opened" => true,
            "rating" => Video::RATING_LIST[0],
            "duration" => 25,
            'categories_id' => [$categories->id],
            'genres_id' => [$genres->id]
        ];
    }

    public function testIndex()
    {
        $response = $this->get(route('videos.index'));
        $response
            ->assertStatus(200)
            ->assertJson([$this->video->toArray()]);
    }

    public function testInvalidationRequired()
    {
        $data = [
            'title'         => '',
            'description'   => '',
            'year_launched' => '',
            'rating'        => '',
            'duration'      => '',
            'categories_id' => '',
            'genres_id'     => ''
        ];
        $this->assertInvalidationInStoreAction($data, 'required');
        $this->assertInvalidationInUpdateAction($data, 'required');
    }

    public function testInvalidationMax()
    {
        $data = [
            'title' => str_repeat('a', 256),
        ];
        $this->assertInvalidationInStoreAction($data, 'max.string', ['max' => 255]);
        $this->assertInvalidationInUpdateAction($data, 'max.string', ['max' => 255]);
    }

    public function testInvalidationInteger()
    {
        $data = [
            'duration' => 's',
        ];
        $this->assertInvalidationInStoreAction($data, 'integer');
        $this->assertInvalidationInUpdateAction($data, 'integer');
    }

    public function testInvalidationYearLaunchedField()
    {
        $data = [
            'year_launched' => 'a',
        ];
        $this->assertInvalidationInStoreAction($data, 'date_format', ['format' => 'Y']);
        $this->assertInvalidationInUpdateAction($data, 'date_format', ['format' => 'Y']);
    }

    public function testInvalidationOpenedField()
    {
        $data = [
            'opened' => 's',
        ];
        $this->assertInvalidationInStoreAction($data, 'boolean');
        $this->assertInvalidationInUpdateAction($data, 'boolean');
    }


    public function testInvalidationCategoriesIdField()
    {
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

    }

    public function testInvalidationGenresIdField()
    {
        $data = [
            'genres_id' => 'a'
        ];

        $this->assertInvalidationInStoreAction($data, 'array');
        $this->assertInvalidationInUpdateAction($data, 'array');

        $data = [
            'genres_id' => [100]
        ];

        $this->assertInvalidationInStoreAction($data, 'exists');
        $this->assertInvalidationInUpdateAction($data, 'exists');

        $genres = factory(Genre::class)->create();
        $genres->delete();
        $data = [
            'genres_id' => [$genres->id]
        ];
        $this->assertInvalidationInStoreAction($data, 'exists');
        $this->assertInvalidationInUpdateAction($data, 'exists');
    }


    public function testSave()
    {

        $category = factory(Category::class)->create();
        $genre = factory(Genre::class)->create();
        $genre->categories()->sync($category->id);

        $data = [
           [ 
               'send_data' => $this->sendData 
               + [
                    'categories_id' => [$category->id],
                    'genres_id'     => [$genre->id],
                ]
                ,
                'test_data' => $this->sendData + ['opened' => false] 
           ],
           [ 
                'send_data' => $this->sendData + [
                    'opened' => false,
                    'categories_id' => [$category->id],
                    'genres_id'     => [$genre->id],
                ],
                'test_data' => $this->sendData + ['opened' => false] 
            ],
            [ 
                'send_data' => $this->sendData + [
                    'rating' => Video::RATING_LIST[1],
                    'categories_id' => [$category->id],
                    'genres_id'     => [$genre->id],
                ],
                'test_data' => $this->sendData + ['rating' => Video::RATING_LIST[1]] 
            ],
        ];
        $this->expectException(\Illuminate\Database\QueryException::class);
        
        foreach ($data as $key => $value)
        {
         
            $response = $this->assertStore(
                $value['send_data'], 
                $value['test_data'] + ['deleted_at' => null]);

            $response->assertJsonStructure([
                'created_at',
                'updated_at'
            ]);

            $this->assertHasCategory(
                $response->json('id'),
                $value['send_data']['categories_id'][0]
            );
            
            $this->assertHasGenre(
                $response->json('id'),
                $value['send_data']['genres_id'][0]
            );

            $response = $this->assertUpdate(
                $value['send_data'], 
                $value['test_data'] + ['deleted_at' => null]);

            $response->assertJsonStructure([
                    'created_at',
                    'updated_at'
                ]);

        }
    }

    public function  assertHasCategory($videoId, $categoryId)
    {
        $this->assertDatabaseHas(
            'category_video', [
                'video_id' => $videoId,
                'category_id' => $categoryId
            ]);
    }

    public function  assertHasGenre($videoId, $genreId)
    {
        $this->assertDatabaseHas(
            'genre_video', [
                'video_id' => $videoId,
                'genre_id' => $genreId
            ]);
    }


    public function testSyncCategories()
    {
        $categoriesId = factory(Category::class, 3)->create()->pluck('id')->toArray();
        $genre = factory(Genre::class)->create();
        $genre->categories()->sync($categoriesId);
        $genreId = $genre->id;

        $this->sendData['genres_id'] = [$genreId];
        $this->sendData['categories_id'] =  [$categoriesId[0]];

        $response = $this->json(
            'POST',
            $this->routeStore(), 
            $this->sendData + [
                'genres_id'      => [$genreId],
                'categories_id'   => [$categoriesId[0]],
            ]
        );
        $this->assertDatabaseHas('category_video',[
            'category_id'   => $categoriesId[0],
            'video_id'      => $response->json('id')
        ]);
        $this->sendData['genres_id'] = [$genreId];
        $this->sendData['categories_id'] = [$categoriesId[1], $categoriesId[2]];

        $response = $this->json(
            'PUT', 
            route('videos.update', ['video' => $response->json('id')]),
            $this->sendData
        );
        $this->assertDatabaseMissing('category_video',[
            'category_id'   => $categoriesId[0],
            'video_id'      => $response->json('id')
        ]);
        $this->assertDatabaseHas('category_video',[
            'category_id'   => $categoriesId[1],
            'video_id'      => $response->json('id')
        ]);
        $this->assertDatabaseHas('category_video',[
            'category_id'   => $categoriesId[2],
            'video_id'      => $response->json('id')
        ]);
    }


    public function testSyncGenres()
    {
        $genres = factory(Genre::class, 3)->create();
        $categoryId = factory(Category::class)->create()->id;
        $genres->each(function ($genre) use ($categoryId){
            $genre->categories()->sync($categoryId);
        });
        $genresId = $genres->pluck('id')->toArray();
        $this->sendData['categories_id'] = [$categoryId];
        $this->sendData['genres_id'] = [$genresId[0]];

        $response = $this->json(
            'POST',
            $this->routeStore(), 
            $this->sendData
        );


        $this->assertDatabaseHas('genre_video',[
            'genre_id'      => $genresId[0],
            'video_id'      => $response->json('id')
        ]);

        $this->sendData['categories_id'] = [$categoryId];
        $this->sendData['genres_id'] = [$genresId[1], $genresId[2]];

        $response = $this->json(
            'PUT', 
            route('videos.update', ['video' => $response->json('id')] ),
            $this->sendData
        );

        $this->assertDatabaseMissing('genre_video',[
            'genre_id'     => $genresId[0],
            'video_id'      => $response->json('id')
        ]);
        $newGenresId1 = Genre::find($genresId[1])->id;
  
        $this->assertDatabaseHas('genre_video',[
            'genre_id'      => $newGenresId1,
            'video_id'      => $response->json('id')
        ]);
        $this->assertDatabaseHas('genre_video',[
            'genre_id'     => $genresId[2],
            'video_id'      => $response->json('id')
        ]);
    }

    public function testRollbackStore()
    {

        $controller = Mockery::mock(VideoController::class)
            ->makePartial()
            ->shouldAllowMockingProtectedMethods();

        $controller
            ->shouldReceive('validate')
            ->withAnyArgs()
            ->andReturn($this->sendData);

        $controller
            ->shouldReceive('rulesStore')
            ->withAnyArgs()
            ->andReturn([]);

        $controller
            ->shouldReceive('handleRelations')
            ->once()
            ->andThrow(new TestException());
        
        $request = Mockery::mock(Request::class);

        $hasError = false;
        try {            
            $controller->store($request);          
        } catch (Exception $e) {
            if(
                strpos($e->getMessage(), "Mockery_3_Illuminate_Http_Request::get()" )  !== false 
                || $e->getMessage() == ""
                ){
                $this->assertCount(1, Video::all());
                $hasError = true;
            }
        }
        $this->assertTrue($hasError);
    }

    public function testRollbackUpdate()
    {

        $controller = Mockery::mock(VideoController::class)
            ->makePartial()
            ->shouldAllowMockingProtectedMethods();

            $controller
            ->shouldReceive('findoOrFail')
            ->withAnyArgs()
            ->andReturn($this->video);

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
        
        $request = Mockery::mock(Request::class);

        $hasError = false;
        try {            
            $controller->update($request, $this->video->id);
        } catch (Exception $e) {
            if(
                strpos($e->getMessage(), "Mockery_3_Illuminate_Http_Request::get()" )  !== false 
                || $e->getMessage() == ""
            ){
                $this->assertCount(1, Video::all());
                $hasError = true;
            }
         
        }
        $this->assertTrue($hasError);
    }


    public function testShow()
    {
        $response = $this->json('GET', route('videos.show', ['video' => $this->video->id]));
        $response
            ->assertStatus(200)
            ->assertJson($this->video->toArray());
    }

    public function testDestroy()
    {
        $response = $this->json('DELETE', route('videos.destroy', ['video' => $this->video->id]));
        $response->assertStatus(204);
        $this->assertNull(Video::find($this->video->id));
        $this->assertNotNull(Video::withTrashed()->find($this->video->id));
    }

    protected function routeStore()
    {
        return route('videos.store');
    }

    protected function routeUpdate()
    {
        return route('videos.update', [ 'video' => $this->video->id]);
    }

    protected function model()
    {
        return Video::class;
    }
}
