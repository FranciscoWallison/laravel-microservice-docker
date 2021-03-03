<?php

namespace Tests\Prod\Models\Traits;

use Illuminate\Http\UploadedFile;
use PHPUnit\Framework\TestCase;
use Tests\Stubs\Models\UploadFilesStub;
use Illuminate\Support\Facades\Storage;
use Tests\Traits\TestStorages;

class UploadedFilesProdTest extends TestCase
{
    use TestStorages;
    private $obj;

    protected function setUp(): void
    {
        parent::setUp();
        $this->markTestSkipped();
        $this->obj = new UploadFilesStub();
        \Config::set('filesystems.default' , 'gcs');
        $this->deleteAllFiles();
       
    }

    public function testUploadFile()
    {
        //$this->expectException( \Illuminate\Contracts\Container\BindingResolutionException::class);
       
        // Storage::fake();
        $file = UploadedFile::fake()->create('video.mp4');
        $this->obj->uploadFile($file);
        Storage::assertExists("1/{$file->hashName()}");
    }


    public function testUploadFiles()
    {
        //$this->expectException( \Illuminate\Contracts\Container\BindingResolutionException::class);
        // Storage::fake();
        $file1 = UploadedFile::fake()->create('video.mp4');
        $file2 = UploadedFile::fake()->create('video.mp4');
        $this->obj->uploadFiles([$file1,$file2 ]);
        Storage::assertExists("1/{$file1->hashName()}");
        Storage::assertExists("1/{$file2->hashName()}");
    }

    public function testDeleteOldFiles()
    {
        
        // Storage::fake();
        $file1 = UploadedFile::fake()->create('video1.mp4')->size(1);
        $file2 = UploadedFile::fake()->create('video2.mp4')->size(1);
        $this->obj->uploadFiles([$file1, $file2]);
        $this->obj->deleteOldFiles();
        $this->assertCount(2, Storage::allFiles());

        $this->obj->oldFiles = [$file1->hashName()];
        $this->obj->deleteOldFiles();
        Storage::assertMissing("1/{$file1->hashName()}");
        Storage::assertExists("1/{$file2->hashName()}");

    }

    public function testDeleteFile()
    {
        //$this->expectException( \Illuminate\Contracts\Container\BindingResolutionException::class);
        // Storage::fake();
        $file = UploadedFile::fake()->create('video.mp4');
        $this->obj->uploadFile($file);
        $filename = $file->hashName();
        $this->obj->deleteFile($filename);
        Storage::assertMissing("1/{$filename}");


        $file = UploadedFile::fake()->create('video.mp4');
        $this->obj->uploadFile($file);
        $this->obj->deleteFile($file);
        Storage::assertMissing("1/{$file->hashName()}");
    }

    public function testDeletesFiles()
    {
        //$this->expectException( \Illuminate\Contracts\Container\BindingResolutionException::class);
        // Storage::fake();
        $file1 = UploadedFile::fake()->create('video.mp4');
        $file2 = UploadedFile::fake()->create('video.mp4');
        $this->obj->uploadFiles([$file1,$file2 ]);
        $this->obj->deleteFiles([$file1->hashName(),$file2 ]);
        
        Storage::assertMissing("1/{$file1->hashName()}");
        Storage::assertMissing("1/{$file2->hashName()}");
    }
}
