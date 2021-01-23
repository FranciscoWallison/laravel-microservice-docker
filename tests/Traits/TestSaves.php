<?php
declare(strict_types=1);

namespace Tests\Traits;

use Illuminate\Foundation\Testing\TestResponse;
use Illuminate\Support\Facades\Lang;
/**
 * 
 */
trait TestSaves
{
    protected function assertStore(
        $sendData,
        $testData
    )
    {
        $response = $this->json('POST', $this->routeStore(), $sendData);
        if($response->status() !== 201){
            throw new \Exception("Response status must be 201, give {$response->status()}: \n {$response->constant()}");
        }
        $model = $this->model();
        $table = (new $model)->getTable();
        $this->assertDatabaseHas($table, $testData + ['id' => $response->json('id')]);
    }

}
