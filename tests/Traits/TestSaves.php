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
    protected abstract function model();
    protected abstract function routeStore();
    protected abstract function routeUpdate();

    protected function assertStore(
        array $sendData,
        $testDatabase,
        $testJsonData = null
    ) : TestResponse
    {
        /** @var TestResponse $response */
        $response = $this->json('POST', $this->routeStore(), $sendData);       
        if($response->status() !== 201){
            throw new \Exception("Response status must be 201, give {$response->status()}: \n {$response->content()}");
        }
     
        $this->assertInDatabase($response, $testDatabase);
        $this->assertJsonResponseContent($response, $testDatabase, $testJsonData);
        return $response;
    }


    protected function assertUpdate(
        array $sendData,
        $testDatabase,
        $testJsonData = null
    ) : TestResponse
    {
        $response = $this->json('PUT', $this->routeUpdate(), $sendData);
        if($response->status() !== 200){
            throw new \Exception("Response status must be 200, give {$response->status()}: \n {$response->content()}");
        }
       
        $this->assertInDatabase($response, $testDatabase);
        $this->assertJsonResponseContent($response, $testDatabase, $testJsonData);
        return $response;
    }

    private function assertInDatabase(TestResponse $response, $testDatabase)
    {
        $model = $this->model();
        $table = (new $model)->getTable();
        $this->assertDatabaseHas($table, $testDatabase + ['id' => $this->getIdFromResponse($response)]);
    }


    private function assertJsonResponseContent(TestResponse $response, $testDatabase, $testJsonData = null)
    {
        $testResponse = $testJsonData ?? $testDatabase;
        $response->assertJsonFragment($testResponse + ['id' => $this->getIdFromResponse($response)]);
    }

    private function getIdFromResponse(TestResponse $response)
    {
        return $response->json('id') ?? $response->json('data.id');
    }
}
