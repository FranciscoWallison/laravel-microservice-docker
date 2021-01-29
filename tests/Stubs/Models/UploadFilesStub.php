<?php

namespace Tests\Stubs\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\UploadFiles;

class UploadFilesStub extends Model
{
    use UploadFiles;


    protected function uploadDir()
    {
        return "1";
    }
}