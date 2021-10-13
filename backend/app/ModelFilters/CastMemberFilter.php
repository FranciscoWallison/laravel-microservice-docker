<?php

namespace App\ModelFilters;

use App\Models\CastMember;
use Illuminate\Database\Eloquent\Builder;

class CastMemberFilter extends DefaultModelFilter
{

    protected $sortable = ['name', 'type', 'create_at'] ;

    public function search($search){
        $this->where('name', 'LIKE', "%$search%");
    }

    public function type($type){
        $type_ = (int)$type;
        if(in_array($type_, CastMember::$types)){
            $this->where('type', (int)$type_);
        }
    }
}