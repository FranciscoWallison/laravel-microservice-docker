<?php

namespace App\Http\Controllers\api;

use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Whoops\Run;

class VideoController extends BasicCrudController
{
    private $rules;

    public function __construct()
    {
        $this->rules = [
            'title'         => 'required|max:255',
            'description'   => 'required',
            'year_launched' => 'required|date_format:Y',
            'opened'        => 'boolean',
            'rating'        => 'required|in:'.implode(',', Video::RATING_LIST),
            'duration'      => 'required|integer',
            'categories_id' => 'required|array|exists:categories,id',
            'genres_id' => 'required|array|exists:genres,id'
        ];
    }

    public function store(Request $request)
    {
        $validateData = $this->validate($request, $this->rulesStore());
        $self = $this;
        /** @var Video $obj */
        $obj = DB::transaction(function() use ($request, $validateData, $self){
            $obj = $this->model()::create($validateData);
            $self->handleRelation($obj, $request);
            return $obj;
        });
        $obj->refresh();
        return $obj;
    }

    public function update(Request $request, $id)
    {
        $obj = $this->findOrFail($id);
        $validateData = $this->validate($request, $this->rulesUpdate());
        $self = $this;
         /** @var Video $obj */
        $obj = DB::transaction(function() use ($request, $validateData, $obj, $self){
            $obj->update($validateData);
            $self->handleRelation($obj, $request);
            return $obj;
        });
        return $obj;
    }

    protected function handleRelation($video, Request $request)
    {
        $video->categories()->sync($request->get('categories_id'));
        $video->genres()->sync($request->get('genres_id'));
    }

    protected function model()
    {
        return Video::class;
    }

    protected function rulesStore()
    {
        return $this->rules;
    }

    protected function rulesUpdate()
    {
        return $this->rules;
    }
}
