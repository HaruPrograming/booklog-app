<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Services\BookService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookController extends Controller
{
    public function __construct(private BookService $bookService) {}

    public function index(): JsonResponse
    {
        return response()->json($this->bookService->getAll());
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title'          => 'required|string|max:255',
            'author'         => 'nullable|string|max:255',
            'thumbnail_url'  => 'nullable|url',
            'status'         => 'required|in:interested,reading,completed',
            'memo'           => 'nullable|string',
            'google_books_id'=> 'nullable|string|max:255',
            'isbn'           => 'nullable|string|max:20',
            'description'    => 'nullable|string',
            'tag_ids'        => 'nullable|array',
            'tag_ids.*'      => 'integer|exists:tags,id',
        ]);

        $book = $this->bookService->create($validated);

        return response()->json($book, 201);
    }

    public function update(Request $request, Book $book): JsonResponse
    {
        $validated = $request->validate([
            'title'          => 'sometimes|required|string|max:255',
            'author'         => 'nullable|string|max:255',
            'thumbnail_url'  => 'nullable|url',
            'status'         => 'sometimes|required|in:interested,reading,completed',
            'memo'           => 'nullable|string',
            'google_books_id'=> 'nullable|string|max:255',
            'isbn'           => 'nullable|string|max:20',
            'description'    => 'nullable|string',
            'tag_ids'        => 'nullable|array',
            'tag_ids.*'      => 'integer|exists:tags,id',
        ]);

        $book = $this->bookService->update($book, $validated);

        return response()->json($book);
    }

    public function destroy(Book $book): JsonResponse
    {
        $this->bookService->delete($book);

        return response()->json(null, 204);
    }
}
