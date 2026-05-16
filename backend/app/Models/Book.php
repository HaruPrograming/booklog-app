<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Book extends Model
{
    protected $fillable = [
        'google_books_id',
        'title',
        'author',
        'isbn',
        'thumbnail_url',
        'description',
        'status',
        'memo',
    ];

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'book_tags');
    }
}
