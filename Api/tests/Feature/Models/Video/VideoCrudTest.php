<?php

namespace Tests\Feature\Models\Video;

use App\Models\Video;
use App\Models\Genre;
use App\Models\Category;
use Illuminate\Database\QueryException;
use Tests\Feature\Models\Video\BaseVideoTestCase;

class VideoCrudTest extends BaseVideoTestCase
{

    private $fileFieldsData = [];

    protected function setUp(): void
    {
        parent::setUp();
        foreach(Video::$fileFields as $field){
            $fileFieldsData[$field] = "$field.test";
        }
    }
        
    public function testList()
    {
        factory(Video::class)->create();
        $video = Video::all();
        $this->assertCount(1, $video);
        $videoKeys = array_keys($video->first()->getAttributes());
        $this->assertEqualsCanonicalizing(
            [
                'id',
                'title',
                'description',
                'year_launched',
                'opened',
                'rating',
                'duration',
                'banner_file',
                'trailer_file',
                'video_file',
                'thumb_file',
                'created_at',
                'updated_at',
                'deleted_at'
            ],
            $videoKeys
        );
    }

    public function testCreateWithBasicFields()
    {
        $video = Video::create($this->data + $this->fileFieldsData);
        $video->refresh();

        $this->assertEquals(36, strlen($video->id));
        $this->assertFalse($video->opened);
        $this->data['opened'] = false;
        $this->assertDatabaseHas('videos', $this->data + $this->fileFieldsData);

        $this->data['opened'] = true;
        $video = Video::create($this->data);
        $this->assertTrue($video->opened);
        $this->assertDatabaseHas('videos', [
            'opened' => true
        ]);
    }

    public function testCreateWithRelations()
    {
        $category = factory(Category::class)->create();
        $genre = factory(Genre::class)->create();

        $this->data['categories_id'] = [$category->id];
        $this->data['genres_id'] = [$genre->id];
        $video = Video::create($this->data);

        $this->assertHasCategory($video->id, $category->id);
        $this->assertHasGenre($video->id, $genre->id);
    }

    public function testRollbackCreate()
    {
        $hasError = false;
        try {
           Video::create( $this->data + [
                'categories_id' => [0,1,2,3]
            ]); 
        } catch ( QueryException $exception ){
            $this->assertCount(0, Video::all());
            $hasError = true;
        }

        $this->assertTrue($hasError);
    }

    public function testUpdateWithBasicFields()
    {
        $video = factory(Video::class)->create(
            ['opened' => false]  
        );
        
        $video->update($this->data + $this->fileFieldsData );
        $this->assertFalse($video->opened);
        $this->data['opened'] = false;
        $this->assertDatabaseHas('videos', $this->data + $this->fileFieldsData);

        $video = factory(Video::class)->create(
            ['opened' => false]  
        );
        $this->data['opened'] = true;
        $video->update($this->data + $this->fileFieldsData);
        $this->assertTrue($video->opened);
        $this->data['opened'] = true;
        $this->assertDatabaseHas('videos', $this->data);
    }

    public function testUpdateWithRelations()
    {
        $category = factory(Category::class)->create();
        $genre = factory(Genre::class)->create();
        $video = factory(Video::class)->create();

        $this->data['categories_id'] = [$category->id];
        $this->data['genres_id'] = [$genre->id];
        $video->update($this->data);

        $this->assertHasCategory($video->id, $category->id);
        $this->assertHasGenre($video->id, $genre->id);
        
    }

    public function testRollbackUpdate()
    {
        $hasError = false;
        $video = factory(Video::class)->create();
        $oldTitle = $video->title;
        try {
           
            $video->update([
                "title" => "Velit quasi autem dicta.",
                "description" => "Fugit iste rerum eos et molestias voluptatibus occaecati ad at velit deserunt distinctio sint.",
                "year_launched" => 2007,
                "opened" => true,
                "rating" => Video::RATING_LIST[0],
                "duration" => 25,
                'categories_id' => [0,1,2,3]
            ]); 
        } catch ( QueryException $exception ){
            $this->assertDatabaseHas('videos', [
                'title' =>  $oldTitle
            ]);
            $hasError = true;
        }

        $this->assertTrue($hasError);
    }

    public function testHandleRelations()
    {
        $video = factory(Video::class)->create();
       
        Video::handleRelations($video, []);
        $this->assertCount(0, $video->categories);
        $this->assertCount(0, $video->genres);
       

        $category = factory(Category::class)->create();
      
        Video::handleRelations($video, [
            'categories_id' => [$category->id]
        ]);
        $video->refresh();
    
        $this->assertCount(1, $video->categories);

        $genre = factory(Genre::class)->create();
        Video::handleRelations($video, [
            'genres_id' => [$genre->id]
        ]);
        $video->refresh();
        $this->assertCount(1, $video->genres);

        $video->categories()->delete();
        $video->genres()->delete();
        Video::handleRelations($video, [
            'categories_id' => [$category->id],
            'genres_id' => [$genre->id]
        ]);
        $video->refresh();

        $this->assertCount(1, $video->categories);
        $this->assertCount(1, $video->genres);
    }


    public function testSyncCategories()
    {
        $categoriesId = factory(Category::class, 3)->create()->pluck('id')->toArray();
        $video = factory(Video::class)->create();
        Video::handleRelations($video, [
            'categories_id' => [$categoriesId[0]]
        ]);
        $this->assertDatabaseHas('category_video', [
            'category_id'   => $categoriesId[0],
            'video_id'      => $video->id
        ]);

        Video::handleRelations($video, [
            'categories_id' => [$categoriesId[1], $categoriesId[2]]
        ]);
        $this->assertDatabaseMissing('category_video',[
            'category_id'   => $categoriesId[0],
            'video_id'      => $video->id
        ]);
        $this->assertDatabaseHas('category_video',[
            'category_id'   => $categoriesId[1],
            'video_id'      => $video->id
        ]);
        $this->assertDatabaseHas('category_video',[
            'category_id'   => $categoriesId[2],
            'video_id'      => $video->id
        ]);
    }

    public function testSyncGenres()
    {
        $genresId = factory(Genre::class, 3)->create()->pluck('id')->toArray();
        $video = factory(Video::class)->create();
        Video::handleRelations($video, [
            'genres_id' => [$genresId[0]]
        ]);
        $this->assertDatabaseHas('genre_video', [
            'genre_id'   => $genresId[0],
            'video_id'      => $video->id
        ]);

        Video::handleRelations($video, [
            'genres_id' => [$genresId[1], $genresId[2]]
        ]);
        $this->assertDatabaseMissing('genre_video',[
            'genre_id'   => $genresId[0],
            'video_id'   => $video->id
        ]);
        $this->assertDatabaseHas('genre_video',[
            'genre_id'   => $genresId[1],
            'video_id'   => $video->id
        ]);
        $this->assertDatabaseHas('genre_video',[
            'genre_id'   => $genresId[2],
            'video_id'   => $video->id
        ]);
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

    public function testDelete()
    {
        $video = factory(Video::class)->create();
        $video->delete();
        $this->assertNull(Video::find($video->id));

        $video->restore();
        $this->assertNotNull(Video::find($video->id));
    }
}
