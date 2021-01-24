<?php

namespace Tests\Unit\Models;

use App\Models\CastMember;
use PHPUnit\Framework\TestCase;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Traits\Uuid;

class CastMemberTest extends TestCase
{
    private $cast_member;

    public function testIfUseTraits()
    {
        $traits = [
            SoftDeletes::class, Uuid::class
        ];
        $castMemberTraits = array_keys(class_uses(CastMember::class));
        $this->assertEquals($traits, $castMemberTraits);
    }

    public function testFillableAttribute()
    {
        $fillable = ['name', 'type'];
        $cast_member = new CastMember();
        $this->assertEquals($fillable,$cast_member->getFillable());
    }

    public function testDatesAttribute()
    {
        $dates = ['deleted_at', 'created_at', 'updated_at'];
        $cast_member = new CastMember();
        foreach ($dates as $date){
            $this->assertContains($date,$cast_member->getDates());
        }
 
        $this->assertCount(count($dates), $cast_member->getDates());
    }

    public function testCastsAttribute()
    {
        $casts = ['id'=> 'string'];
        $cast_member = new CastMember();
        $this->assertEquals($casts,$cast_member->getCasts());
    }

    public function testIncrementingAttribute()
    {
        $cast_member = new CastMember();
        $this->assertFalse($cast_member->incrementing);
    }
}
