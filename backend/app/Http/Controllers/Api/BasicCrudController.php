<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use EloquentFilter\Filterable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

abstract class BasicCrudController extends Controller
{
    protected $perPage = 15;
    protected abstract function model();
    protected abstract function rulesStore();
    protected abstract function rulesUpdate();
    protected abstract function resource();
    protected abstract function resourceCollection();
    
    public function index(Request $request)
    {
        $perPage = (int) $request->get('per_page', $this->perPage);
        $hasFilter = in_array(Filterable::class, class_uses($this->model()));

        $query = $this->queryBuilder();

        if($hasFilter){
            $query = $query->filter($request->all());
        }

        $data = $request->has('all') || !$this->perPage
            ? $query->get()
            : $query->paginate($perPage);

        //$data = !$this->perPage ? $this->model()::all(): $this->model()::paginate($this->perPage);
        $resourceCollectionClass = $this->resourceCollection();
        $refClass = new \ReflectionClass($resourceCollectionClass);
        return $refClass->isSubclassOf(AnonymousResourceCollection::class)
            ? new $resourceCollectionClass($data)
            : $resourceCollectionClass::collection($data);
    }

    public function store(Request $request)
    {
        $validateData = $this->validate($request, $this->rulesStore());
        $obj = $this->queryBuilder()->create($validateData);
        $obj->refresh();
        $resource = $this->resource();
        return new $resource($obj);
    }


    protected function findOrFail($id)
    {
        $model = $this->model();
        $keyName = (new $model)->getRouteKeyName();// where com  coluna dinâmica
        return $this->queryBuilder()->where($keyName, $id)->firstOrFail();
    }

    public function show($id)
    {
        $obj = $this->findOrFail($id);
        $resource = $this->resource();
        return new $resource($obj);
    }

    public function update(Request $request, $id)
    {
        $obj = $this->findOrFail($id);
        $validateData = $this->validate($request, $this->rulesUpdate());
        $obj->update($validateData);
        $resource = $this->resource();
        return new $resource($obj);
    }

    public function destroy($id)
    {
        $obj = $this->findOrFail($id);
        $obj->delete();
        return response()->noContent(); // status code 204
    }

    protected function queryBuilder(): Builder{
        return $this->model()::query();
    }
}
