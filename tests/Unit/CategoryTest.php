<?php

namespace Tests\Unit;

use App\Models\Category;
use PHPUnit\Framework\TestCase;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Traits\Uuid;
use Illuminate\Foundation\Testing\DatabaseMigrations;

class CategoryTest extends TestCase
{

    use DatabaseMigrations;

    public function testIfUseTraits()
    {
        $traits = [
            SoftDeletes::class, Uuid::class
        ];
        $categoryTraits = array_keys(class_uses(Category::class));
        $this->assertEquals($traits, $categoryTraits);
    }

    public function testFillableAttribute()
    {
        $fillable = ['name', 'description', 'is_active'];
        $category = new Category();
        $this->assertEquals($fillable,$category->getFillable());
    }

    public function testDatesAttribute()
    {
        $dates = ['deleted_at', 'created_at', 'updated_at'];
        $category = new Category();
        foreach ($dates as $date){
            $this->assertContains($date,$category->getDates());
        }
 
        $this->assertCount(count($dates), $category->getDates());
    }

    public function testCastsAttribute()
    {
        $casts = ['id'=> 'string'];
        $category = new Category();
        $this->assertEquals($casts,$category->getCasts());
    }

    public function testIncrementingAttribute()
    {
        $category = new Category();
        $this->assertFalse($category->incrementing);
    }
}
