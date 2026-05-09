<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Book extends Model
{
    protected $fillable = [
        'title',
        'author',
        'isbn',
        'thumbnail_url',
        'description',
        'status',
    ];

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'book_tags');
    }
}
