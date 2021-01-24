<?php

namespace Tests\Feature\Models;

use App\Models\CastMember;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class CastMemberTest extends TestCase
{
    use DatabaseMigrations;
    
    public function testCreate(){
        $cast_member = CastMember::create([
            'name' => 'teste1',
            'type' => CastMember::TYPE_ACTOR
        ]);
        $cast_member->refresh();

        $this->assertIsString($cast_member->id);
        $this->assertEquals(36,strlen($cast_member->id));
        $this->assertRegExp('/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i', $cast_member->id);        
        $this->assertEquals(CastMember::TYPE_ACTOR, $cast_member->type);
    }

    public function testCreateList()
    {
        $atributes = [
            "id",
            "name",
            "type",
            "deleted_at",
            "created_at",
            "updated_at"
        ];
        factory(CastMember::class, 1)->create();
        $categories = CastMember::all();
        $this->assertCount(1, $categories);
    }

    public function testCreateListAtributes()
    {
        $atributes = [
            "id",
            "name",
            "type",
            "deleted_at",
            "created_at",
            "updated_at"
        ];
        factory(CastMember::class, 1)->create();
        $categories = CastMember::all();
        $categoryKey = array_keys($categories->first()->getAttributes());
        $this->assertEqualsCanonicalizing($atributes, $categoryKey);
    }

    // INIT UPDATE update
    public function testUpdate(){
        $cast_member = factory(CastMember::class, 1)->create()->first();

        $data = [
            'name' => 'test_name_update',
            'type' => CastMember::TYPE_DIRECTOR
        ];
            
        $cast_member->update($data);

        foreach($data as $key => $value){
            $this->assertEquals($value, $cast_member->{$key});
        }
    }

    // INIT DELETE delete

    public function testDelete(){

        $cast_member = factory(CastMember::class)->create();
        $cast_member->delete();
        $this->assertNull(CastMember::find($cast_member->id));
        $cast_member->refresh();
        $categories = CastMember::withTrashed()->get();
        $this->assertCount(1, $categories);

        $cast_member->restore();
        $this->assertNotNull(CastMember::find($cast_member->id));
    }
}
