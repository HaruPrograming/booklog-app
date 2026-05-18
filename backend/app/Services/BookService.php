<?php

namespace App\Services;

use App\Models\Book;
use Illuminate\Database\Eloquent\Collection;

class BookService
{
    public function getAll(int $userId): Collection
    {
        return Book::with('tags')->where('user_id', $userId)->latest()->get();
    }

    public function create(array $data, int $userId): Book
    {
        $tagIds = $data['tag_ids'] ?? [];
        unset($data['tag_ids']);
        $data['user_id'] = $userId;

        $book = Book::create($data);

        if (!empty($tagIds)) {
            $book->tags()->sync($tagIds);
        }

        return $book->load('tags');
    }

    public function update(Book $book, array $data): Book
    {
        $tagIds = $data['tag_ids'] ?? null;
        unset($data['tag_ids']);

        $book->update($data);

        if (!is_null($tagIds)) {
            $book->tags()->sync($tagIds);
        }

        return $book->load('tags');
    }

    public function delete(Book $book): void
    {
        $book->delete();
    }
}
