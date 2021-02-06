<?php
declare(strict_types=1);

namespace Tests\Traits;

use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
/**
 * 
 */
trait TestUploads
{
    protected function assertInvalidationFile($field, $extension, $maxSize, $rule, $ruleParams = [])
    {
        $routes = [
                [
                    'method' => 'POST',
                    'route'  => $this->routeStore()
                ],
                [
                    'method' => 'PUT',
                    'route'  => $this->routeUpdate()
                ]
            ];

            foreach ($routes as $route) {
                $file = UploadedFile::fake()->create("$field.1$extension");
                $response = $this->json(
                    $route['method'], 
                    $route['route'], 
                    [$field => $file]
                );

                $this->assertInvalidationsFields($response, [$field], $rule, $ruleParams);

                $file = UploadedFile::fake()->create("$field.$extension")->size($maxSize + 1);
                $response = $this->json(
                    $route['method'], 
                    $route['route'], 
                    [$field => $file]
                );

                $this->assertInvalidationsFields($response, [$field], 'max.file', ['max' => $maxSize]);
            }
    }

    public function assertFilesExistesInStorage($model, array $files)
    {
        /** @var UploadFiles $model */
        foreach ($files as $file)
        {
            Storage::assertExists($model->relativeFilePath($file->hashName()));
        }
    }
}
