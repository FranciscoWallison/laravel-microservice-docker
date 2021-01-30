<?php

namespace Tests\Stubs\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\UploadFiles;

class UploadFilesStub extends Model
{
    use UploadFiles;
    public static $fileFields = ['file1', 'file2'];

    protected function uploadDir()
    {
        return "1";
    }
}