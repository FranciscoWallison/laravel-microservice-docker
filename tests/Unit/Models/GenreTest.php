<?php

namespace Tests\Unit\Models;

use PHPUnit\Framework\TestCase;
use App\Models\Genre;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Traits\Uuid;

class GenreTest extends TestCase
{
    private $genre;

    public function testIfUseTraits()
    {
        $traits = [
            SoftDeletes::class, Uuid::class
        ];
        $genreTraits = array_keys(class_uses(Genre::class));
        $this->assertEquals($traits, $genreTraits);
    }

    public function testFillableAttribute()
    {
        $fillable = ['name', 'is_active'];
        $genre = new Genre();
        $this->assertEquals($fillable,$genre->getFillable());
    }

    public function testDatesAttribute()
    {
        $dates = ['deleted_at', 'created_at', 'updated_at'];
        $genre = new Genre();
        foreach ($dates as $date){
            $this->assertContains($date,$genre->getDates());
        }
 
        $this->assertCount(count($dates), $genre->getDates());
    }

    public function testCastsAttribute()
    {
        $casts = ['id'=> 'string', 'is_active'=> 'boolean'];
        $genre = new Genre();
        $this->assertEquals($casts,$genre->getCasts());
    }

    public function testIncrementingAttribute()
    {
        $genre = new Genre();
        $this->assertFalse($genre->incrementing);
    }
}
