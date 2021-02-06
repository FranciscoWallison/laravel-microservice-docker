<?php

namespace Tests\Feature\Http\Controllers\Api\VideoController;

use App\Models\Video;
use App\Models\Category;
use App\Models\Genre;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

abstract class BaseVideoControllerTestCase extends TestCase
{
    use DatabaseMigrations;

    protected $video;
    protected $sendData;


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
        $genres->categories()->sync($categories->id);

        $this->sendData = [
            "title" => "Velit quasi autem dicta.",
            "description" => "Fugit iste rerum eos et molestias voluptatibus occaecati ad at velit deserunt distinctio sint.",
            "year_launched" => 2007,
            "rating" => Video::RATING_LIST[0],
            "duration" => 25,
            'categories_id' => [$categories->id],
            'genres_id' => [$genres->id]
        ];
    }
}
