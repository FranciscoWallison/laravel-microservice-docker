<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Http\Controllers\Api\BasicCrudController;
use Illuminate\Http\Request;
use Mockery;
use Tests\Stubs\Controllers\CategoryControllerStub;
use Tests\Stubs\Models\CategoryStub;
use Tests\TestCase;


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
        /** @var CategorySub $category */
        $category =  CategoryStub::create(['name' => 'test_name', 'description' => 'test_description']);
        $category->refresh();
        $result = $this->controller->index();
        $serialize  = $result->response()->getData(true);
        $this->assertEquals(
            [$category->toArray()],
            $serialize['data']
        );
        $this->assertArrayHasKey('meta',$serialize);
        $this->assertArrayHasKey('links',$serialize);

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

    public function testStore()
    {
        $request = Mockery::mock(Request::class);
        $request
            ->shouldReceive('all')
            ->once()
            ->andReturn(['name'=>'test_name', 'description' => 'test_description']);

        $result = $this->controller->store($request);
        $serialize  = $result->response()->getData(true);
        $this->assertEquals(
            CategoryStub::first()->toArray(),
            $serialize['data']
        );
    }

    public function testIfFindOrFailFetchModel()
    {
        /** @var CategoryStub $category */
        $category = CategoryStub::create(['name' => 'test_name', 'description' => 'test_description']);
        $category->refresh();

        $reflectionClass = new \ReflectionClass(BasicCrudController::class);
        $reflectionMethod = $reflectionClass->getMethod('findOrFail');
        $reflectionMethod->setAccessible(true);

        $result = $reflectionMethod->invokeArgs($this->controller, [$category->id]);
        $this->assertInstanceOf(CategoryStub::class, $result);
    }

    public function testIfFindOrFailThrowExceptionWhenIdInvalid()
    {
        $this->expectException(\Illuminate\Database\Eloquent\ModelNotFoundException::class);

        $reflectionClass = new \ReflectionClass(BasicCrudController::class);
        $reflectionMethod = $reflectionClass->getMethod('findOrFail');
        $reflectionMethod->setAccessible(true);

        $reflectionMethod->invokeArgs($this->controller, [0]);
    }

    public function testShow()
    {
        $category = CategoryStub::create(['name' => 'test_name', 'description' => 'test_description' ]);
        $category->refresh();
        $result = $this->controller->show($category->id);
        $resource = $result->resource;

        $this->assertEquals($resource->toArray(), CategoryStub::find(1)->toArray());
    }

    public function testUpdate()
    {
        $category = CategoryStub::create(['name' => 'test_name', 'description' => 'test_description' ]);
        $category->refresh();

        $request = Mockery::mock(Request::class);
        $request
            ->shouldReceive('all')
            ->once()
            ->andReturn(['name'=>'test_name_changed', 'description' => 'test_description_changed']);

        $result = $this->controller->update($request, $category->id);
        $result = $this->controller->show($category->id);
        $resource = $result->resource;
        $this->assertEquals($resource->toArray(), CategoryStub::find(1)->toArray());
    }

    public function testDestroy()
    {
        $category = CategoryStub::create(['name' => 'test_name', 'description' => 'test_description' ]);
        $category->refresh();

        $response = $this->controller->destroy($category->id);
        $this
            ->createTestResponse($response)
            ->assertStatus(204);
        $this->assertCount(0,CategoryStub::all());
    }
}
