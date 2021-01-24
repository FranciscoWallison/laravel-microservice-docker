<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Models\CastMember;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\Traits\TestValidations;
use Tests\Traits\TestSaves;
use Tests\TestCase;

class CastMemberControllerTest extends TestCase
{
    use DatabaseMigrations, TestValidations, TestSaves;

    private $castMember;

    protected function setUp(): void
    {
        parent::setUp();
        $this->castMember = factory(CastMember::class)->create([
            'type' => CastMember::TYPE_DIRECTOR
        ]); 
    }

    public function testIndex()
    {
        $response = $this->get(route('cast_members.index'));

        $response
        ->assertStatus(200)
        ->assertJson([$this->castMember->toArray()]);
    }


    public function testShow()
    {
        $response = $this->get(route('cast_members.show', ['cast_member' => $this->castMember->id]));

        $response
        ->assertStatus(200)
        ->assertJson($this->castMember->toArray());
    }

    //Falhas
    public function testInvalidationData()
    {

        $data = [
            'name' => ''
        ];
        $this->assertInvalidationInStoreAction($data, 'required');
        $this->assertInvalidationInUpdateAction($data, 'required');
        $data = [
            'name'=> str_repeat('a', 256)
        ];
        $this->assertInvalidationInStoreAction($data, 'max.string', ['max' => 255]);
        $this->assertInvalidationInUpdateAction($data, 'max.string', ['max' => 255]);
        $data = [
            'type' => 's'
        ];
        $this->assertInvalidationInStoreAction($data, 'in');
        $this->assertInvalidationInUpdateAction($data, 'in');



        $response = $this->json('POST', route('cast_members.store'), []);

        $response
            ->assertStatus(422);
    }

    public function testStore()
    {

        $data = [
            [
                'name' => 'test_name1',
                'type' => CastMember::TYPE_DIRECTOR
            ],
            [
                'name' => 'test_name2',
                'type' => CastMember::TYPE_ACTOR
            ]
        ];

        foreach ($data as $key => $value)
        {
            $response = $this->assertStore($value, ['deleted_at' => null]);
            $response->assertJsonStructure([
                'created_at', 'updated_at'
            ]);
        }
    }


    public function testUpdate()
    {
        $this->castMember = factory(CastMember::class)->create([
            'type' => CastMember::TYPE_DIRECTOR
        ]);
        $data = [
            'name' => 'test_update_name',
            'type' => CastMember::TYPE_DIRECTOR
        ];
        $response = $this->assertUpdate(
            $data, 
            $data + ['deleted_at' => null]
        );
        $response->assertJsonStructure([
            'created_at', 'updated_at'
        ]);
    }

    public function testDestroy()
    {
        $response = $this->json('DELETE', route('cast_members.destroy', ['cast_member' => $this->castMember->id]));
        $response->assertStatus(204);
        $this->assertNull(CastMember::find($this->castMember->id));
        $this->assertNotNull(CastMember::withTrashed()->find($this->castMember->id));
    }


    protected function routeStore()
    {
        return route('cast_members.store');
    }

    protected function routeUpdate()
    {
        return route('cast_members.update', ['cast_member'=> $this->castMember->id]);
    }

    protected function model()
    {
        return CastMember::class;
    }
}
