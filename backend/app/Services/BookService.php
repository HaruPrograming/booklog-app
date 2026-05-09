<?php

namespace App\Services;

use App\Models\Book;
use Illuminate\Database\Eloquent\Collection;

class BookService
{
    public function getAll(): Collection
    {
        return Book::with('tags')->latest()->get();
    }

    public function create(array $data): Book
    {
        $tagIds = $data['tag_ids'] ?? [];
        unset($data['tag_ids']);

        $book = Book::create($data);

        if (!empty($tagIds)) {
            $book->tags()->sync($tagIds);
        }

        return $book->load('tags');
    }
}
