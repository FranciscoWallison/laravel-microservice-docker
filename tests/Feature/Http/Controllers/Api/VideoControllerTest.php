<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Models\Video;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\Traits\TestValidations;
use Tests\Traits\TestSaves;
use Tests\TestCase;

class VideoControllerTest extends TestCase
{
    use DatabaseMigrations, TestValidations, TestSaves;

    private $video;

    protected function setUp(): void
    {
        parent::setUp();
        $this->video = factory(Video::class)->create();
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
            'duration'      => ''
        ];
        $this->assertInvalidationInStoreAction($data, 'required');
        $this->assertInvalidationInUpdateAction($data, 'required');
    }

    public function testInvalidationMax()
    {
        $data = [
            'title'         => str_repeat('a', 256),
        ];
        $this->assertInvalidationInStoreAction($data, 'max.string', ['max' => 255]);
        $this->assertInvalidationInUpdateAction($data, 'max.string', ['max' => 255]);
    }

    public function testInvalidationInteger()
    {
        $data = [
            'duration'         => 's',
        ];
        $this->assertInvalidationInStoreAction($data, 'integer');
        $this->assertInvalidationInUpdateAction($data, 'integer');
    }

    public function testInvalidationYearLaunchedField()
    {
        $data = [
            'year_launched'         => 'a',
        ];
        $this->assertInvalidationInStoreAction($data, 'date_format', ['format' => 'Y']);
        $this->assertInvalidationInUpdateAction($data, 'date_format', ['format' => 'Y']);
    }

    public function testInvalidationOpenedField()
    {
        $data = [
            'opened'         => 's',
        ];
        $this->assertInvalidationInStoreAction($data, 'boolean');
        $this->assertInvalidationInUpdateAction($data, 'boolean');
    }


    public function testInvalidationRatingField()
    {
        $data = [
            'rating' = 0
        ];

        $this->assertInvalidationInStoreAction($data, 'in');
        $this->assertInvalidationInUpdateAction($data, 'in');
    }

    // public function testStore()
    // {

    //     $data = [
    //         [
    //             'name' => 'test_name1',
    //             'type' => Video::
    //         ],
    //         [
    //             'name' => 'test_name2',
    //             'type' => Video::TYPE_ACTOR
    //         ]
    //     ];

    //     foreach ($data as $key => $value)
    //     {
    //         $response = $this->assertStore($value, ['deleted_at' => null]);
    //         $response->assertJsonStructure([
    //             'created_at', 'updated_at'
    //         ]);
    //     }
    // }

    // public function testStore()
    // {

    //     $data = [
    //         [
    //             'name' => 'test_name1',
    //             'type' => Video::
    //         ],
    //         [
    //             'name' => 'test_name2',
    //             'type' => Video::TYPE_ACTOR
    //         ]
    //     ];

    //     foreach ($data as $key => $value)
    //     {
    //         $response = $this->assertStore($value, $value + ['deleted_at' => null]);
    //         $response->assertJsonStructure([
    //             'created_at', 'updated_at'
    //         ]);
    //     }
    // }

    // public function testUpdate()
    // {
    //     $data = [
    //         'name' => 'test',
    //         'type' => Video::TY
    //     ];

    //     $response = $this->assertUpdate($data, $data + ['deleted_at' => null]);
    //     $response->assertJsonStructure([
    //         'created_at', 'updated_at'
    //     ]);
    // }


    // public function testShow()
    // {
    //     $response = $this->json('GET', route('videos.show', ['video' => $this->video->id]));
    //     $response
    //         ->assertStatus(200)
    //         ->assertJson($this->video->toArray());
    // }

    // public function testDestroy()
    // {
    //     $response = $this->json('DELETE', route('videos.destroy', ['video' => $this->video->id]));
    //     $response->assertStatus(204);
    //     $this->assertNull(Video::find($this->video->id));
    //     $this->assertNotNull(Video::withTrashed()->find($this->video->id));
    // }

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
