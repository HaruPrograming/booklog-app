<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Book extends Model
{
    protected $fillable = [
        'user_id',
        'google_books_id',
        'title',
        'author',
        'isbn',
        'thumbnail_url',
        'description',
        'status',
        'memo',
        'series_name',
        'volume_number',
    ];

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'book_tags');
    }
}
