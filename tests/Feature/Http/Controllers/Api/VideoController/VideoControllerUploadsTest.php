<?php

namespace Tests\Feature\Http\Controllers\Api\VideoController;

use App\Models\Video;
use Illuminate\Foundation\Testing\TestResponse;
use Tests\Traits\TestValidations;
use Tests\Traits\TestUploads;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\Feature\Http\Controllers\Api\VideoController\BaseVideoControllerTestCase;

class VideoControllerUploadsTest extends BaseVideoControllerTestCase
{
    use TestValidations, TestUploads;
   
    public function testInvalidationThumbFiel()
    {
        $this->assertInvalidationFile(
            'thumb_file',
            'jpg',
            Video::THUMB_FILE_MAX_SIZE,
            'image'
        );
    }


    public function testInvalidationBannerFiel()
    {
        $this->assertInvalidationFile(
            'banner_file',
            'jpg',
            Video::BANNER_FILE_MAX_SIZE,
            'image'
        );
    }

    public function testInvalidationTrailerField()
    {
        $this->assertInvalidationFile(
            'trailer_file',
            'mp4',
            Video::TRAILER_FILE_MAX_SIZE,
            'mimetypes', 
            ['values' => 'video/mp4']
        );
    }

    public function testInvalidationVideoField()
    {
        $this->assertInvalidationFile(
            'video_file',
            'mp4',
            Video::VIDEO_FILE_MAX_SIZE,
            'mimetypes', 
            ['values' => 'video/mp4']
        );
    }

    public function testStoreWithFiles()
    {
        Storage::fake();
        $files = $this->getFiles();

        $response = $this->json(
                'POST',
                $this->routeStore(),
                $this->sendData + 
                $files
            );
 
        $response->assertStatus(201);
        $this->assertFilesOnPersist($response, $files);
    }

    public function testUpdateWithFiles()
    {
        Storage::fake();
        $files = $this->getFiles();
        
        $response = $this->json(
                'PUT',
                $this->routeUpdate(),
                $this->sendData + 
                $files
            );
        $response->assertStatus(200);
        $this->assertFilesOnPersist($response, $files);

        $newFiles = [
            'trailer_file'  => UploadedFile::fake()->create("trailer_file.mp4"), 
            'video_file'    => UploadedFile::fake()->create("video_file.mp4")
        ];
        
        $response = $this->json(
            'PUT', $this->routeUpdate(), $this->sendData + $newFiles
        );
        $response->assertStatus(200);
        //var_dump($response,\Arr::except($files, ['thumb_files', 'video_file']) + $newFiles);
        /*$this->assertFilesOnPersist(
            $response,
            \Arr::except($files, ['thumb_files', 'video_file']) + $newFiles
        );
        */
        $id = $response->json('id');
        $video = Video::find($id);
       
        //\Storage::assertMissing( $video->relativeFilePath($files['thumb_file']->hashName()) );
        //\Storage::assertMissing( $video->relativeFilePath($files['video_file']->hashName()) );

    }

    protected function assertFilesOnPersist(TestResponse $response, $files)
    {
        $id = $response->json('id');
        $video = Video::find($id);
        $this->assertFilesExistesInStorage($video, $files);
    }

    protected function getFiles()
    {
        return [
            'thumb_file'    => UploadedFile::fake()->create("thumb_file.jpg"),
            'banner_file'   => UploadedFile::fake()->create("banner_file.jpg"),
            'trailer_file'  => UploadedFile::fake()->create("trailer_file.mp4"), 
            'video_file'    => UploadedFile::fake()->create("video_file.mp4")
        ];
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
