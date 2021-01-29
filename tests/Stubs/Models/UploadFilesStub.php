<?php

namespace Tests\Stubs\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\UploadedFiles;

class UploadFilesStub extends Model
{
    use UploadedFiles;


    protected function uploadDir()
    {
        return "1";
    }
}