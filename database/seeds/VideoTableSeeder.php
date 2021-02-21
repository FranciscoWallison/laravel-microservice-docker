<?php

use Illuminate\Database\Seeder;
use App\Models\Genre;
use App\Models\Video;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;

class VideoTableSeeder extends Seeder
{
    private $allGenres;
    private $relations = [
        'genres_id' => [],
        'categories_id' => []
    ];
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $dir = \Storage::getDriver()->getAdapter()->getPathPrefix();
        \File::deleteDirectory($dir, true);

        $self = $this;
        $this->allGenres =  Genre::all();
        Model::reguard(); // mass assignment
        factory(\App\Models\Video::class, 100)
            ->make()
            ->each(function (Video $video) use ($self) {
                $self->fetchRelations();
                \App\Models\Video::create(
                    array_merge(
                        $video->toArray(),
                        [
                            'thumb_file'  => $self->getImageFile(),
                            'banner_file' => $self->getImageFile(),
                            'trailer_file'=> $self->getVideoFile(),
                            'video_file'  => $self->getVideoFile(),
                        ],
                        $this->relations
                    )
                );
            });
        Model::unguard();
    }

    public function fetchRelations()
    {
        $subGenres = $this->allGenres->random(5)->load('categories');
        $categories = [];
        foreach ($subGenres as $genre){
            array_push($categories, ...$genre->categories->pluck('id')->toArray());
        }
        $categoriesId = array_unique($categories);
        $genreId = $subGenres->pluck('id')->toArray();
        $this->relations['categories_id'] = $categoriesId;
        $this->relations['genres_id'] = $genreId;
    }

    public function getImageFile()
    {
        return new UploadedFile(
            storage_path('faker/thumbs/LaravelFramework.png'),
            'LaravelFramework.png'
        );
    }

    public function getVideoFile()
    {
        return new UploadedFile(
            storage_path('faker/videos/testeVideo.mp4'),
            'testeVideo.mp4'
        );
    }
}
