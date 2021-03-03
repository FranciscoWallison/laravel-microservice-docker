<?php

namespace Tests\Feature\Http\Controllers\Api\VideoController;

use App\Models\Video;
use Tests\Traits\TestValidations;
use Tests\Traits\TestSaves;
use App\Models\Category;
use App\Models\Genre;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\Feature\Http\Controllers\Api\VideoController\BaseVideoControllerTestCase;
use Tests\Traits\TestResource;
use App\Http\Resources\VideoResource;

class VideoControllerCrudTest extends BaseVideoControllerTestCase
{
    
    use TestValidations, TestSaves, TestResource;
    private $serializedFields = [
        'title',
        'description',
        'year_launched',
        'opened',
        'rating',
        'duration',
        'thumb_file_url',
        'banner_file_url',
        'trailer_file_url', 
        'video_file_url',
        'created_at',
        'updated_at',
        'deleted_at',
        'categories' =>[
            '*' => [
                'id',
                'name',
                'description',
                'is_active',
                'created_at',
                'updated_at',
                'deleted_at'
            ]           
        ],
        'genres' =>[
            '*' => [
                'id',
                'name',
                'is_active',
                'created_at',
                'updated_at',
                'deleted_at',
            ]           
        ],
    ];
    public function testIndex()
    {
        $response = $this->get(route('videos.index'));
        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'data'  => [
                    '*'=> $this->serializedFields
                ],
                "links" => [],
                "meta"  => [],
            ]);
           
        $resourceVideoResource = VideoResource::collection(collect([$this->video]));
        $this->assertResource($response, $resourceVideoResource);
        $this->assertIfFilesUrlExists($this->video, $response);
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
    
    public function testSaveWithoutFiles()
    {
        
        $testData = \Arr::except($this->sendData, ['categories_id', 'genres_id']);
       
        $data = [
            [ 
                'send_data' => $this->sendData,
                'test_data' => $testData + ['opened' => false] 
            ],
            [ 
                'send_data' => $this->sendData + ['opened' => true],
                'test_data' => $testData + ['opened' => true] 
            ],
            [ 
                'send_data' => $this->sendData + [
                    'rating' => Video::RATING_LIST[1],
                ],
                'test_data' => $testData + ['rating' => Video::RATING_LIST[1]] 
            ],
        ];
        
        foreach ($data as $key => $value)
        {
            $value['test_data']['deleted_at'] = null;
           
            $response = $this->assertStore(
                $value['send_data'], 
                $value['test_data'] + ['deleted_at' => null]
            );

            $response->assertJsonStructure([
                'data' => $this->serializedFields
            ]);
           
            $this->assertResource(
                $response, 
                new VideoResource(Video::find($response->json('data.id')))
            );
            $this->assertIfFilesUrlExists($this->video, $response);

            $response = $this->assertUpdate(
                $value['send_data'], 
                $value['test_data'] + ['deleted_at' => null]);

            $response->assertJsonStructure([
                'data' => $this->serializedFields
            ]);

            $this->assertResource(
                $response, 
                new VideoResource(Video::find($response->json('data.id')))
            );
            $this->assertIfFilesUrlExists($this->video, $response);
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

    public function testStoreWithFiles()
    {
        Storage::fake();
        $files = $this->getFiles();

        $category = factory(Category::class)->create();
        $genre = factory(Genre::class)->create();
        $genre->categories()->sync($category->id);

        $response = $this->json(
                'POST',
                $this->routeStore(),
                $this->sendData + 
                [
                    'categories_id' => [$category->id],
                    'genres_id'     => [$genre->id]
                ] + 
                $files
            );
        
        $response->assertStatus(201);
        $id = $response->json('data.id');
        foreach ($files as $file) {
            Storage::assertExists("$id/{$file->hashName()}");
        }

    }

    public function testUploadWithFiles()
    {
        Storage::fake();
        $files = $this->getFiles();

        $category = factory(Category::class)->create();
        $genre = factory(Genre::class)->create();
        $genre->categories()->sync($category->id);
        
        $response = $this->json(
                'PUT',
                $this->routeUpdate(),
                $this->sendData + 
                [
                    'categories_id' => [$category->id],
                    'genres_id'     => [$genre->id]
                ] + 
                $files
            );
        $response->assertStatus(200);
        
        $id = $response->json('data.id');
        foreach ($files as $file) {
            Storage::assertExists("$id/{$file->hashName()}");
        }

    }

    protected function getFiles()
    {
        return [
            'video_file' => UploadedFile::fake()->create("video_file.mp4")
        ];
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
            'video_id'      => $response->json('data.id')
        ]);
        $this->sendData['genres_id'] = [$genreId];
        $this->sendData['categories_id'] = [$categoriesId[1], $categoriesId[2]];

        $response = $this->json(
            'PUT', 
            route('videos.update', ['video' => $response->json('data.id')]),
            $this->sendData
        );
        $this->assertDatabaseMissing('category_video',[
            'category_id'   => $categoriesId[0],
            'video_id'      => $response->json('data.id')
        ]);
        $this->assertDatabaseHas('category_video',[
            'category_id'   => $categoriesId[1],
            'video_id'      => $response->json('data.id')
        ]);
        $this->assertDatabaseHas('category_video',[
            'category_id'   => $categoriesId[2],
            'video_id'      => $response->json('data.id')
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
            'video_id'      => $response->json('data.id')
        ]);

        $this->sendData['categories_id'] = [$categoryId];
        $this->sendData['genres_id'] = [$genresId[1], $genresId[2]];

        $response = $this->json(
            'PUT', 
            route('videos.update', ['video' => $response->json('data.id')] ),
            $this->sendData
        );

        $this->assertDatabaseMissing('genre_video',[
            'genre_id'     => $genresId[0],
            'video_id'      => $response->json('data.id')
        ]);

  
        $this->assertDatabaseHas('genre_video',[
            'genre_id'      => $genresId[1],
            'video_id'      => $response->json('data.id')
        ]);
        $this->assertDatabaseHas('genre_video',[
            'genre_id'     => $genresId[2],
            'video_id'      => $response->json('data.id')
        ]);
    }
    
    public function testShow()
    {
        $response = $this->json('GET', route('videos.show', ['video' => $this->video->id]));
        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'data' => $this->serializedFields
            ]);
    
            $id = $response->json('data.id');
            $VideoResource = new VideoResource(Video::find($id));
            $this->assertResource($response, $VideoResource);
            $this->assertIfFilesUrlExists($this->video, $response);
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
