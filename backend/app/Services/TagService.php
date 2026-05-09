<?php

namespace App\Services;

use App\Models\Tag;
use Illuminate\Database\Eloquent\Collection;

class TagService
{
    public function getAll(): Collection
    {
        return Tag::orderBy('name')->get();
    }

    public function create(array $data): Tag
    {
        return Tag::create($data);
    }

    public function delete(Tag $tag): void
    {
        $tag->delete();
    }
}
