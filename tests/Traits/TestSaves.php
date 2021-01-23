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
        array $sendData,
        $testDatabase,
        $testJsonData = null
    ) : TestResponse
    {
        
        $response = $this->json('POST', $this->routeStore(), $sendData);
        if($response->status() !== 201){
            throw new \Exception("Response status must be 201, give {$response->status()}: \n {$response->constant()}");
        }
        $model = $this->model();
        $table = (new $model)->getTable();
        $idResponseJson = ['id' => $response->json('id')];
        $this->assertDatabaseHas($table, $testDatabase + $idResponseJson);

        $testResponse = $testJsonData ?? $testDatabase;
        $response->assertJsonFragment($testResponse + $idResponseJson);
        return $response;
    }

}
