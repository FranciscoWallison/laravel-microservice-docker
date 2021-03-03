<?php

namespace Tests\Unit\Models\Traits;

use Illuminate\Http\UploadedFile;
use PHPUnit\Framework\TestCase;
use Tests\Stubs\Models\UploadFilesStub;
//use Illuminate\Support\Facades\Storage;

class UploadFilesUnitTest extends TestCase
{
    private $obj;

    protected function setUp(): void
    {
        parent::setUp();
        $this->obj = new UploadFilesStub();
    }
    /*
    public function testRelativeFilePath()
    {
        $this->assertEquals("1/video.mp4", $this->obj->testRelativeFilePath('video.mp4'));
    }
    */
    public function testUploadFile()
    {
        $this->expectException( \Illuminate\Contracts\Container\BindingResolutionException::class);
       
        \Storage::fake();
        $file = UploadedFile::fake()->create('video.mp4');
        $this->obj->uploadFile($file);
        \Storage::assertExists("1/{$file->hashName()}");
    }


    public function testUploadFiles()
    {
        $this->expectException( \Illuminate\Contracts\Container\BindingResolutionException::class);
        \Storage::fake();
        $file1 = UploadedFile::fake()->create('video.mp4');
        $file2 = UploadedFile::fake()->create('video.mp4');
        $this->obj->uploadFiles([$file1,$file2 ]);
        \Storage::assertExists("1/{$file1->hashName()}");
        \Storage::assertExists("1/{$file2->hashName()}");
    }

    public function testDeleteOldFiles()
    {
        $this->expectException( \Illuminate\Contracts\Container\BindingResolutionException::class);
        \Storage::fake();
        $file1 = UploadedFile::fake()->create('video1.mp4')->size(1);
        $file2 = UploadedFile::fake()->create('video2.mp4')->size(1);
        $this->obj->uploadFiles([$file1, $file2]);
        $this->obj->deleteOldFiles();
        $this->assertCount(2, \Storage::allFiles());

        $this->obj->oldFiles = [$file1->hashName()];
        $this->obj->deleteOldFiles();
        \Storage::assertMissing("1/{$file1->hashName()}");
        \Storage::assertExists("1/{$file2->hashName()}");

    }

    public function testDeleteFile()
    {
        $this->expectException( \Illuminate\Contracts\Container\BindingResolutionException::class);
        \Storage::fake();
        $file = UploadedFile::fake()->create('video.mp4');
        $this->obj->uploadFile($file);
        $filename = $file->hashName();
        $this->obj->deleteFile($filename);
        \Storage::assertMissing("1/{$filename}");


        $file = UploadedFile::fake()->create('video.mp4');
        $this->obj->uploadFile($file);
        $this->obj->deleteFile($file);
        \Storage::assertMissing("1/{$file->hashName()}");
    }

    public function testDeletesFiles()
    {
        $this->expectException( \Illuminate\Contracts\Container\BindingResolutionException::class);
        \Storage::fake();
        $file1 = UploadedFile::fake()->create('video.mp4');
        $file2 = UploadedFile::fake()->create('video.mp4');
        $this->obj->uploadFiles([$file1,$file2 ]);
        $this->obj->deleteFiles([$file1->hashName(),$file2 ]);
        
        \Storage::assertMissing("1/{$file1->hashName()}");
        \Storage::assertMissing("1/{$file2->hashName()}");
    }

    public function testExtractFiles()
    {
        //$this->expectException( \Illuminate\Contracts\Container\BindingResolutionException::class);
        $attributes = [];
        $files = UploadFilesStub::extractFiles($attributes);
        $this->assertCount(0, $attributes);
        $this->assertCount(0, $files);

        $attributes = ['file1' => 'test'];
        $files = UploadFilesStub::extractFiles($attributes);
        $this->assertEquals(['file1' => 'test'],$attributes);
        $this->assertCount(1, $attributes);
        $this->assertCount(0, $files);

        $attributes = ['file1' => 'test', 'file2' => 'test2'];
        $files = UploadFilesStub::extractFiles($attributes);
        $this->assertEquals(['file1' => 'test', 'file2' => 'test2'],$attributes);
        $this->assertCount(2, $attributes);
        $this->assertCount(0, $files);

        $file1 = UploadedFile::fake()->create('video.mp4');
        $attributes = ['file1' => $file1, 'other' => 'test2'];
        $files = UploadFilesStub::extractFiles($attributes);
        $this->assertEquals(['file1' => $file1->hashName(), 'other' => 'test2'],$attributes);
        $this->assertCount(2, $attributes);
        $this->assertEquals([$file1], $files);

        $file2 = UploadedFile::fake()->create('video.mp4');
        $attributes = ['file1' => $file1, 'file2' => $file2, 'other' => 'test2'];
        $files = UploadFilesStub::extractFiles($attributes);
        $this->assertEquals( ['file1' => $file1->hashName(), 'file2' => $file2->hashName(), 'other' => 'test2'],$attributes);
        $this->assertCount(3, $attributes);
        $this->assertEquals([$file1, $file2], $files);
    }
}
