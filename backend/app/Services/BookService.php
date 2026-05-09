<?php

namespace App\Services;

use App\Models\Book;
use Illuminate\Database\Eloquent\Collection;

class BookService
{
    public function getAll(): Collection
    {
        return Book::latest()->get();
    }

    public function create(array $data): Book
    {
        return Book::create($data);
    }
}
