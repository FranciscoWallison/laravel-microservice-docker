<?php

namespace Tests\Feature\Models;

use App\Models\Video;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseMigrations;

class VideoTest extends TestCase
{
    use DatabaseMigrations;
    
    public function testRollbackCreate()
    {
        $hasError = false;
        try {
           Video::create([
            "title" => "Velit quasi autem dicta.",
            "description" => "Fugit iste rerum eos et molestias voluptatibus occaecati ad at velit deserunt distinctio sint.",
            "year_launched" => 2007,
            "opened" => true,
            "rating" => Video::RATING_LIST[0],
            "duration" => 25,
            'categories_id' => [0,1,2,3]
           ]); 

        } catch ( QueryException $exception ){
            $this->assertCount(0, Video::all());
            $hasError = true;
        }

        $this->assertTrue($hasError);
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
}
