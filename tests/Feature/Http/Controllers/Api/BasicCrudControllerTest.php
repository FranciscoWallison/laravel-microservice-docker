<?php

namespace Tests\Feature\Http\Controllers\Api;

use Illuminate\Http\Request;
use Mockery;
use Tests\Stubs\Controllers\CategoryControllerStub;
use Tests\Stubs\Models\CategoryStub;
use Tests\TestCase;
use Illuminate\Validation\ValidationException;

class BasicCrudControllerTest extends TestCase
{
    private $controller;
    protected function setUp(): void
    {
        parent::setUp();
        CategoryStub::dropTable();
        CategoryStub::createTable();
        $this->controller = new CategoryControllerStub();
    }

    protected function tearDown(): void
    {
        CategoryStub::dropTable();
        parent::tearDown();
    }

    public function testIndex()
    {
        $category =  CategoryStub::create(['name' => 'test_name', 'description' => 'test_description']);
        $category->refresh();
       
     
        $result = $this->controller->index()->toArray();
        $this->assertEquals([$category->toArray()], $result);

    }

    public function testInvalidationDataInStore()
    {
        $this->expectException(\Illuminate\Validation\ValidationException::class);
        $request = Mockery::mock(Request::class);
        $request
            ->shouldReceive('all')
            ->once()
            ->andReturn(['name'=>'']);
        
        $this->controller->store($request);
    }
}
